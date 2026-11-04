import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { APP_DB_STORES, ConfigurationsService, IndexedDbService } from '@sunbird-cb/utils-v2'
import { from, Observable, throwError } from 'rxjs'
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators'
import { FormCriterionValue, FormLookup, FormRule } from './form-config.model'
import { EMPTY_FORM_LOOKUP } from './form-lookup'

const API_END_POINTS = {
  FORM_LOOKUP_READ: (portal: string) => `/apis/proxies/v8/formsConfig/v1/readFormDetails/${portal}`,
  FORM_CONFIG_READ: (formId: number | string) => `/apis/proxies/v8/formsConfig/v1/readById/${formId}`,
}

const ANY = '*'

// APP_DB_STORES.FORMS (utils-v2 with APP_DB_VERSION 3). The fallback lets this build against an
// older utils-v2: there the store doesn't exist, every read and write fails, and that is a cache miss
const STORE_NAME: string = (APP_DB_STORES as { [store: string]: string }).FORMS || 'forms'

/** Lookup cache lifetime in seconds when globalConfig.apicache.formLookupTime is not set */
const DEFAULT_EXPIRY_SECONDS = 300

// The last apicache.formLookupTime seen: a session's first lookup runs before globalConfig is loaded
const EXPIRY_STORAGE_KEY = 'formLookupTime'

/** What IndexedDB keeps per portal: the readFormDetails result and when it was read */
interface StoredLookup {
  cachedAt: number
  data: any
}

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
  cachedAt: number
  lookup: FormLookup
  index: Map<string, IndexedForm[]>
  // per bucket, only where its forms cover 2+ values of a valuePriority criterion
  priorityGroups: Map<string, PriorityGroup[]>
  // criterion -> the values its forms and valuePriority use, to choose between a userFields list's paths
  knownValues: Map<string, Set<string>>
}

/**
 * Picks the form config for a user on the client, using the lookup rules from the readFormDetails API.
 * Contains no form or criterion specific logic, the rules are documented in form-lookup.ts.
 *
 * Each portal's lookup is indexed once by subType|clientVersion, each bucket sorted most
 * specific first, so a request goes straight to its 1-3 candidates and stops at the first match.
 *
 * The lookup is kept in memory and in IndexedDB (iGotAppDB/forms, keyed by portal) for
 * globalConfig.apicache.formLookupTime seconds; after that the next getForm reads it again.
 */
@Injectable({
  providedIn: 'root',
})
export class FormConfigService {
  private readonly cache = new Map<string, Observable<any>>()
  // portal -> its lookup from the readFormDetails API; a portal not loaded yet has no forms
  private readonly lookups = new Map<string, PortalLookup>()
  private readonly lookupRequests = new Map<string, Promise<PortalLookup>>()
  // the stored lookups being deleted by clearCache(), so a read right after it can't still see them
  private clearing: Promise<unknown> = Promise.resolve()

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    private appDb: IndexedDbService,
  ) {}

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

  /**
   * The portal's lookup, from memory or IndexedDB while it is younger than the cache time,
   * otherwise from the API. Calls that miss together share one request; a failed request is
   * retried by the next call, and falls back to an expired stored copy when there is one.
   */
  loadLookup(portal: string): Observable<FormLookup> {
    return from(this.loadPortalLookup(portal)).pipe(map(portalLookup => portalLookup.lookup))
  }

  private loadPortalLookup(portal: string): Promise<PortalLookup> {
    const current = this.lookups.get(portal)
    if (current && this.isFresh(current.cachedAt)) {
      return Promise.resolve(current)
    }
    let request = this.lookupRequests.get(portal)
    if (!request) {
      const pending = this.readPortalLookup(portal)
      const done = () => {
        if (this.lookupRequests.get(portal) === pending) {
          this.lookupRequests.delete(portal)
        }
      }
      pending.then(done, done)
      this.lookupRequests.set(portal, pending)
      request = pending
    }
    return request
  }

  private async readPortalLookup(portal: string): Promise<PortalLookup> {
    await this.clearing
    const stored = await this.appDb.withTimeout(this.appDb.get<StoredLookup>(STORE_NAME, portal), `${STORE_NAME} read`)
    if (stored && this.isFresh(stored.cachedAt)) {
      return this.setPortalLookup(portal, stored)
    }
    let response: any
    try {
      response = await this.http.get<any>(API_END_POINTS.FORM_LOOKUP_READ(portal)).toPromise()
    } catch (error) {
      // an expired lookup still picks the right forms far more often than every page's fallback
      if (stored) {
        return this.setPortalLookup(portal, stored)
      }
      throw error
    }
    const fresh: StoredLookup = { cachedAt: Date.now(), data: response && response.result }
    // a response without forms is not stored, so the next call asks the API again
    if (fresh.data && Array.isArray(fresh.data.forms)) {
      // not awaited: the page doesn't wait for the write
      this.appDb.withTimeout(this.appDb.put(STORE_NAME, portal, fresh), `${STORE_NAME} write`)
    }
    return this.setPortalLookup(portal, fresh)
  }

  private setPortalLookup(portal: string, stored: StoredLookup): PortalLookup {
    const portalLookup = this.buildPortalLookup(stored.data, stored.cachedAt)
    this.lookups.set(portal, portalLookup)
    return portalLookup
  }

  private isFresh(cachedAt: number): boolean {
    return !!cachedAt && (Date.now() - cachedAt) / 1000 < this.expirySeconds()
  }

  /** globalConfig.apicache.formLookupTime, else the value seen last time it was loaded, else the default */
  private expirySeconds(): number {
    const raw = this.configSvc.globalConfig?.apicache?.formLookupTime
    const configured = raw === undefined || raw === null || raw === '' ? NaN : Number(raw)
    try {
      if (configured >= 0) {
        if (localStorage.getItem(EXPIRY_STORAGE_KEY) !== String(configured)) {
          localStorage.setItem(EXPIRY_STORAGE_KEY, String(configured))
        }
        return configured
      }
      const remembered = Number(localStorage.getItem(EXPIRY_STORAGE_KEY) ?? NaN)
      if (remembered >= 0) {
        return remembered
      }
    } catch {
      // storage unavailable (private mode): the configured value still applies, otherwise the default
      if (configured >= 0) {
        return configured
      }
    }
    return DEFAULT_EXPIRY_SECONDS
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
    // each user value is read at most once per call, and only if a candidate needs it
    const userValues: { [criterion: string]: string | null } = {}

    // candidates are sorted most specific first, so the first eligible one is the best
    let strict: IndexedForm | null = null
    for (const candidate of candidates) {
      if (this.matches(portalLookup, candidate.checks, user, userValues)) {
        strict = candidate
        break
      }
    }
    const groups = portalLookup.priorityGroups.get(key)
    const match = (groups && this.findByValuePriority(portalLookup, groups, strict, user, userValues)) || strict
    return match ? match.form : null
  }

  private matches(
    portalLookup: PortalLookup,
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
        value = this.readUserValue(portalLookup, check.criterion, user)
        userValues[check.criterion] = value
      }
      if (value === null || !check.accepted.has(value)) {
        return false
      }
    }
    return true
  }

  /** The user's normalized value for a criterion: of a userFields list, the first path with a known value, else the first present */
  private readUserValue(portalLookup: PortalLookup, criterion: string, user: any): string | null {
    const paths = ([] as string[]).concat(portalLookup.lookup.userFields[criterion] || [])
    const known = portalLookup.knownValues.get(criterion)
    let first: string | null = null
    for (const path of paths) {
      const raw = this.readPath(user, path)
      if (raw === undefined || raw === null) {
        continue
      }
      const value = this.normalize(raw)
      if (paths.length === 1 || (known && known.has(value))) {
        return value
      }
      first = first === null ? value : first
    }
    return first
  }

  /**
   * For a criterion in the lookup's valuePriority that the strict match did not use: if the forms
   * matching every other criterion cover more than one of its values, the one whose value comes
   * first in the priority list wins, provided it is more specific than the strict match.
   */
  private findByValuePriority(
    portalLookup: PortalLookup,
    groups: PriorityGroup[],
    strict: IndexedForm | null,
    user: any,
    userValues: { [criterion: string]: string | null },
  ): IndexedForm | null {
    for (const { criterion, forms } of groups) {
      if (strict && strict.checks.some(check => check.criterion === criterion)) {
        continue
      }
      const ranked = (portalLookup.lookup.valuePriority || {})[criterion].map(value => this.normalize(value))
      const values = new Set<string>()
      let best: IndexedForm | null = null
      let bestRank = Infinity
      forms.forEach(entry => {
        const own = entry.checks.find(check => check.criterion === criterion) as FormCheck
        if (!this.matches(portalLookup, entry.checks, user, userValues, own)) {
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

  /** Clears cached read responses and lookups, in memory and IndexedDB, so the next getForm reads both again */
  clearCache(): void {
    this.cache.clear()
    this.lookups.clear()
    this.lookupRequests.clear()
    this.clearing = this.appDb.withTimeout(this.appDb.clear(STORE_NAME), `${STORE_NAME} clear`)
  }

  /** A response without a forms list is treated as an empty lookup, so every page uses its fallback */
  private buildPortalLookup(data: any, cachedAt: number): PortalLookup {
    const lookup = data && Array.isArray(data.forms) ? this.prepareLookup(data) : EMPTY_FORM_LOOKUP
    const index = new Map<string, IndexedForm[]>()
    const knownValues = new Map<string, Set<string>>()
    const addKnown = (criterion: string, values: string[]) => {
      const known = knownValues.get(criterion) || new Set<string>()
      values.forEach(value => known.add(this.normalize(value)))
      knownValues.set(criterion, known)
    }
    Object.keys(lookup.valuePriority || {}).forEach(criterion => addKnown(criterion, (lookup.valuePriority || {})[criterion]))
    lookup.forms.forEach(form => {
      Object.keys(form.criteria).forEach(criterion => addKnown(criterion, ([] as string[]).concat(form.criteria[criterion])))
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
    return { cachedAt, lookup, index, priorityGroups, knownValues }
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
