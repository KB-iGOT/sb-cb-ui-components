import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators'
import { FormCriterionValue, FormLookup, FormRule } from './form-config.model'
import { EMPTY_FORM_LOOKUP } from './form-lookup'

const API_END_POINTS = {
  FORM_LOOKUP_READ: (portal: string) => `/apis/proxies/v8/formsConfig/v1/readFormDetails/${portal}`,
  FORM_CONFIG_READ: (formId: number | string) => `/apis/proxies/v8/formsConfig/v1/readById/${formId}`,
}

const ANY = '*'

/** A form with its specific (non-'*') criteria pre-normalized for O(1) matching */
interface IndexedForm {
  form: FormRule
  score: number
  checks: FormCheck[]
}

interface FormCheck {
  criterion: string
  accepted: Set<string>
}

/** The forms of a bucket that a valuePriority criterion can choose between */
interface PriorityGroup {
  criterion: string
  forms: IndexedForm[]
}

/** A portal's lookup, indexed by subType|clientVersion */
interface PortalLookup {
  lookup: FormLookup
  index: Map<string, IndexedForm[]>
  // per bucket, only where its forms cover 2+ values of a valuePriority criterion
  priorityGroups: Map<string, PriorityGroup[]>
}

/**
 * Picks the form config for a user on the client, using the lookup rules from the readFormDetails API.
 * Contains no form or criterion specific logic, the rules are documented in form-lookup.ts.
 *
 * Each portal's lookup is indexed once by subType|clientVersion, each bucket sorted most
 * specific first, so a request goes straight to its 1-3 candidates and stops at the first match.
 */
@Injectable({
  providedIn: 'root',
})
export class FormConfigService {
  private readonly cache = new Map<string, Observable<any>>()
  // portal -> its lookup from the readFormDetails API; a portal not loaded yet has no forms
  private readonly lookups = new Map<string, PortalLookup>()
  private readonly lookupRequests = new Map<string, Observable<PortalLookup>>()

  constructor(private http: HttpClient) {}

  /** Loads the portal's lookup, finds the form for the user, reads it and returns the read API response (cached per form id) */
  getForm(user: any, portal: string, subType: string, clientVersion: number): Observable<any> {
    return this.loadLookup(portal).pipe(
      switchMap(() => {
        const form = this.findForm(user, portal, subType, clientVersion)
        if (!form) {
          // value form of throwError: the library builds against rxjs 6, the portal runs rxjs 7
          return throwError(
            new Error(`No form config found for portal "${portal}", subType "${subType}", clientVersion ${clientVersion}`))
        }
        return this.readForm(form.id)
      }),
    )
  }

  /** Reads a portal's lookup once and shares it with every getForm call; a failed read is retried on the next call */
  loadLookup(portal: string): Observable<FormLookup> {
    let request$ = this.lookupRequests.get(portal)
    if (!request$) {
      const lookup$: Observable<PortalLookup> = this.http.get<any>(API_END_POINTS.FORM_LOOKUP_READ(portal)).pipe(
        map(response => {
          const portalLookup = this.buildPortalLookup(response && response.result)
          this.lookups.set(portal, portalLookup)
          return portalLookup
        }),
        catchError(error => {
          if (this.lookupRequests.get(portal) === lookup$) {
            this.lookupRequests.delete(portal)
          }
          return throwError(error)
        }),
        shareReplay(1),
      )
      this.lookupRequests.set(portal, lookup$)
      request$ = lookup$
    }
    return request$.pipe(map(portalLookup => portalLookup.lookup))
  }

  /** The portal's lookup must be loaded (loadLookup) first, until then nothing is found */
  findForm(user: any, portal: string, subType: string, clientVersion: number): FormRule | null {
    const portalLookup = this.lookups.get(portal)
    if (!portalLookup) {
      return null
    }

    // subType and clientVersion are checked here, exactly, by the one index lookup:
    // a form is only in this bucket if both are equal, so the loops below never re-check them
    const key = this.indexKey(subType, clientVersion)
    const candidates = portalLookup.index.get(key)
    if (!candidates) {
      return null
    }
    const { lookup } = portalLookup
    // each user value is read at most once per call, and only if a candidate needs it
    const userValues: { [criterion: string]: string | null } = {}

    // candidates are sorted most specific first, so the first eligible one is the best
    let strict: IndexedForm | null = null
    for (const candidate of candidates) {
      if (this.matches(lookup, candidate.checks, user, userValues)) {
        strict = candidate
        break
      }
    }
    const groups = portalLookup.priorityGroups.get(key)
    const match = (groups && this.findByValuePriority(lookup, groups, strict, user, userValues)) || strict
    return match ? match.form : null
  }

  private matches(
    lookup: FormLookup,
    checks: FormCheck[],
    user: any,
    userValues: { [criterion: string]: string | null },
    skip?: FormCheck,
  ): boolean {
    for (const check of checks) {
      if (check === skip) {
        continue
      }
      let value = userValues[check.criterion]
      if (value === undefined) {
        const path = lookup.userFields[check.criterion]
        const raw = path ? this.readPath(user, path) : undefined
        value = raw === undefined || raw === null ? null : this.normalize(raw)
        userValues[check.criterion] = value
      }
      if (value === null || !check.accepted.has(value)) {
        return false
      }
    }
    return true
  }

  /**
   * For a criterion in the lookup's valuePriority that the strict match did not use: if the forms
   * matching every other criterion cover more than one of its values, the one whose value comes
   * first in the priority list wins, provided it is more specific than the strict match.
   */
  private findByValuePriority(
    lookup: FormLookup,
    groups: PriorityGroup[],
    strict: IndexedForm | null,
    user: any,
    userValues: { [criterion: string]: string | null },
  ): IndexedForm | null {
    for (const { criterion, forms } of groups) {
      if (strict && strict.checks.some(check => check.criterion === criterion)) {
        continue
      }
      const ranked = (lookup.valuePriority || {})[criterion].map(value => this.normalize(value))
      const values = new Set<string>()
      let best: IndexedForm | null = null
      let bestRank = Infinity
      forms.forEach(entry => {
        const own = entry.checks.find(check => check.criterion === criterion) as FormCheck
        if (!this.matches(lookup, entry.checks, user, userValues, own)) {
          return
        }
        let rank = Infinity
        own.accepted.forEach(value => {
          values.add(value)
          rank = Math.min(rank, ranked.indexOf(value) === -1 ? Infinity : ranked.indexOf(value))
        })
        // forms are already most specific first, so on an equal rank the earlier one stays
        if (!best || rank < bestRank) {
          best = entry
          bestRank = rank
        }
      })
      const pick = best as IndexedForm | null
      if (pick && values.size >= 2 && (!strict || pick.score > strict.score)) {
        return pick
      }
    }
    return null
  }

  /** Clears cached read responses and lookups, so the next getForm reads both again */
  clearCache(): void {
    this.cache.clear()
    this.lookups.clear()
    this.lookupRequests.clear()
  }

  /** A response without a forms list is treated as an empty lookup, so every page uses its fallback */
  private buildPortalLookup(data: any): PortalLookup {
    const lookup = data && Array.isArray(data.forms) ? this.prepareLookup(data) : EMPTY_FORM_LOOKUP
    const index = new Map<string, IndexedForm[]>()
    lookup.forms.forEach(form => {
      const key = this.indexKey(form.subType, form.clientVersion)
      const bucket = index.get(key) || []
      bucket.push(this.indexForm(lookup, form))
      index.set(key, bucket)
    })
    // stable sort: equally specific forms keep their lookup order
    index.forEach(bucket => bucket.sort((a, b) => b.score - a.score))
    const priorityGroups = new Map<string, PriorityGroup[]>()
    index.forEach((bucket, key) => {
      const groups = this.buildPriorityGroups(lookup, bucket)
      if (groups.length) {
        priorityGroups.set(key, groups)
      }
    })
    return { lookup, index, priorityGroups }
  }

  /** Fills in what the API leaves out, and spells criterion names as in rulePriority/userFields ("rootorg" -> rootOrg) */
  private prepareLookup(data: any): FormLookup {
    const lookup: FormLookup = { ...EMPTY_FORM_LOOKUP, ...data }
    const names = new Map<string, string>()
    lookup.rulePriority.concat(Object.keys(lookup.userFields)).forEach(name => names.set(this.normalize(name), name))
    lookup.forms = lookup.forms.map(form => {
      const criteria: FormRule['criteria'] = {}
      Object.keys(form.criteria || {}).forEach(name => criteria[names.get(this.normalize(name)) || name] = form.criteria[name])
      return { ...form, criteria }
    })
    return lookup
  }

  /** A valuePriority criterion only matters in a bucket whose forms cover 2+ of its values */
  private buildPriorityGroups(lookup: FormLookup, bucket: IndexedForm[]): PriorityGroup[] {
    return Object.keys(lookup.valuePriority || {})
      .map(criterion => {
        const values = new Set<string>()
        const forms = bucket.filter(entry => {
          const own = entry.checks.find(check => check.criterion === criterion)
          if (own) {
            own.accepted.forEach(value => values.add(value))
          }
          return !!own
        })
        return { criterion, forms, covers: values.size }
      })
      .filter(({ covers }) => covers >= 2)
      .map(({ criterion, forms }) => ({ criterion, forms }))
  }

  private indexKey(subType: string, clientVersion: number): string {
    return `${subType}|${Number(clientVersion)}`
  }

  private indexForm(lookup: FormLookup, form: FormRule): IndexedForm {
    const criteria = form.criteria || {}
    // '*' (any) criteria need no check, the rest become a Set of accepted values
    const checks = Object.keys(criteria)
      .map(criterion => ({ criterion, accepted: ([] as string[]).concat(criteria[criterion]) }))
      .filter(({ accepted }) => !accepted.includes(ANY))
      .map(({ criterion, accepted }) => ({ criterion, accepted: new Set(accepted.map(value => this.normalize(value))) }))
    return { form, score: this.specificity(lookup, form), checks }
  }

  private readForm(formId: number): Observable<any> {
    const key = String(formId)
    if (!this.cache.has(key)) {
      const request$ = this.http.get<any>(API_END_POINTS.FORM_CONFIG_READ(formId)).pipe(
        catchError(error => {
          // don't keep a failed response, so the next call retries
          this.cache.delete(key)
          return throwError(error)
        }),
        shareReplay(1),
      )
      this.cache.set(key, request$)
    }
    return this.cache.get(key) as Observable<any>
  }

  /** Higher priority criteria are worth more than any combination of lower ones */
  private specificity(lookup: FormLookup, form: FormRule): number {
    const criteria = form.criteria || {}
    const n = lookup.rulePriority.length
    return lookup.rulePriority.reduce((score, criterion, i) => {
      const value: FormCriterionValue | undefined = criteria[criterion]
      const isSpecific = value !== undefined && !(Array.isArray(value) ? value.includes(ANY) : value === ANY)
      return isSpecific ? score + Math.pow(2, n - 1 - i) : score
    }, 0)
  }

  /** Reads a dot path like "profileDetails.professionalDetails.0.designation" */
  private readPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => (current === undefined || current === null ? undefined : current[key]), obj)
  }

  private normalize(value: any): string {
    return String(value).trim().toLowerCase()
  }
}
