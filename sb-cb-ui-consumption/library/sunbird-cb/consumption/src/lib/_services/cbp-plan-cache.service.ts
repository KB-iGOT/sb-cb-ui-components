import { Injectable } from '@angular/core'
import { APP_DB_STORES, ConfigurationsService, IndexedDbService } from '@sunbird-cb/utils-v2'
import { from, merge, Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

/**
 * Year-scoped IndexedDB cache for CBP/CVP plan data.
 *
 * Its own store inside the shared application database (see IndexedDbService), not its own
 * database: the dictionary answers "what is content X?", this cache answers "what does this
 * user's plan look like for year Y?", but both are just stores and a browser has no reason
 * to carry two connections for them.
 *
 * Every read and write is bounded by IndexedDbService.withTimeout(): the cache is an
 * optimisation, so a database that is slow, blocked or unavailable must degrade to a miss
 * rather than stall the caller — `fetchCbpPlanListV3Async` awaits getEntry() before it
 * issues the API request.
 */

const STORE_NAME = APP_DB_STORES.CBP_PLANS

/** Default cache lifetime in seconds, matching ContentDictionaryService's fallback. */
const DEFAULT_EXPIRY_SECONDS = 300

export interface ICbpCacheEntry {
  planYear: string
  cachedAt: number
  data: any[]
}

@Injectable({
  providedIn: 'root',
})
export class CbpPlanCacheService {

  /** Emits whenever a plan year's cache is written, so subscribers refresh without polling. */
  private planMapUpdates = new Subject<{ planYear: string, map: Record<string, any> }>()

  constructor(
    private configSvc: ConfigurationsService,
    private appDb: IndexedDbService,
  ) {}

  // ── Financial year helpers ─────────────────────────────────────────────────

  /**
   * Financial year runs April -> March, formatted as YYYY-YY.
   * e.g. Aug 2026 -> '2026-27', Feb 2027 -> '2026-27'.
   */
  getCurrentFinancialYear(date: Date = new Date()): string {
    const month = date.getMonth() // 0 = January
    const year = date.getFullYear()
    const startYear = month >= 3 ? year : year - 1
    const endYear = (startYear + 1) % 100
    return `${startYear}-${`0${endYear}`.slice(-2)}`
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  get expirySeconds(): number {
    return this.configSvc.globalConfig?.apicache?.cbpTime ?? DEFAULT_EXPIRY_SECONDS
  }

  isEntryValid(entry: ICbpCacheEntry | undefined): boolean {
    if (!entry || !entry.cachedAt) {
      return false
    }
    return (Date.now() - entry.cachedAt) / 1000 < this.expirySeconds
  }

  /**
   * Returns the raw cache entry for a plan year, fresh or stale.
   * Callers use isEntryValid() to decide, so a stale entry can still serve as an
   * API-failure fallback rather than being silently discarded.
   */
  async getEntry(planYear: string): Promise<ICbpCacheEntry | undefined> {
    if (!planYear) {
      return undefined
    }
    return this.appDb.withTimeout(this.appDb.get<ICbpCacheEntry>(STORE_NAME, planYear), `cbp read for ${planYear}`)
  }

  async setEntry(planYear: string, data: any[]): Promise<void> {
    if (!planYear) {
      return
    }
    const entry: ICbpCacheEntry = { planYear, cachedAt: Date.now(), data: data || [] }
    await this.appDb.withTimeout(this.appDb.put(STORE_NAME, planYear, entry), `cbp write for ${planYear}`)
    this.planMapUpdates.next({ planYear, map: this.toPlanMap(entry.data) })
  }

  // ── Plan map (identifier -> CBP item) ──────────────────────────────────────
  //
  // Card/TOC components only need "is this content in my plan, and when is it due".
  // They used to poll localStorage['cbpData'] on a setInterval; they now read this
  // cache instead, and watchPlanMap() pushes updates so the polling can go away.

  private toPlanMap(data?: any[]): Record<string, any> {
    const planMap: Record<string, any> = {}
    ;(data || []).forEach((item: any) => {
      if (item && item.identifier) {
        planMap[item.identifier] = item
      }
    })
    return planMap
  }

  /** One-shot read of the cached plan map for a year. Resolves to {} on a miss. */
  async getPlanMap(planYear?: string): Promise<Record<string, any>> {
    const year = planYear || this.getCurrentFinancialYear()
    const entry = await this.getEntry(year)
    return this.toPlanMap(entry && entry.data)
  }

  /**
   * Emits the cached plan map for a year immediately, then again each time that
   * year's cache is rewritten. Replaces the old setInterval polling of cbpData.
   */
  watchPlanMap(planYear?: string): Observable<Record<string, any>> {
    const year = planYear || this.getCurrentFinancialYear()
    return merge(
      from(this.getPlanMap(year)),
      this.planMapUpdates.pipe(
        filter((update: any) => update.planYear === year),
        map((update: any) => update.map),
      ),
    )
  }

  /** Clears one plan year, or every plan year when called with no argument. */
  async clear(planYear?: string): Promise<void> {
    try {
      if (planYear) {
        await this.appDb.delete(STORE_NAME, planYear)
        return
      }
      await this.appDb.clear(STORE_NAME)
    } catch (err) {
      console.warn('CbpPlanCacheService: clear failed', err)
    }
  }
}
