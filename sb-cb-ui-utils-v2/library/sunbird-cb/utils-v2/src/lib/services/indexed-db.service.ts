import { Injectable } from '@angular/core'

/**
 * The application's only IndexedDB service: it owns the single database, and every cache
 * in the app — in this library, in @sunbird-cb/consumption and in the portal — reads and
 * writes through it.
 *
 * Every cache the app keeps lives in ONE database, at ONE version, created by ONE upgrade
 * handler. Before this the app ran four parallel databases — `iGotAppDB/dictionary`,
 * `iGotCbpDB/cbpPlans`, `SearchV3DB/enrollmentDetails` and `zoho-form/enrollment` — because
 * each service opened its own connection: adding a store to a database another service
 * already opens at a lower version races into a VersionError, so every new cache got a new
 * database instead.
 *
 * Adding a store is now: add it to APP_DB_STORES and bump APP_DB_VERSION. The upgrade
 * handler creates whatever is missing, so an existing browser gains the new store without
 * losing what the other stores already hold.
 *
 * Keys are out-of-line everywhere (`put(value, key)`), so a store is a plain key -> value
 * map and no store imposes a shape on the values a caller keeps in it.
 *
 * It lives here rather than in a feature library because both @sunbird-cb/consumption and
 * the portal write to it, and a second copy would mean a second connection — which is how
 * the app ended up with several databases in the first place.
 */

export const APP_DB_NAME = 'iGotAppDB'

/** Bump whenever APP_DB_STORES gains an entry. */
export const APP_DB_VERSION = 2

export const APP_DB_STORES = {
  /** Content metadata keyed by do_id, plus the `all` dictionary blob. */
  DICTIONARY: 'dictionary',
  /** CBP/CVP plan entries keyed by financial year. */
  CBP_PLANS: 'cbpPlans',
  /** The signed-in user's enrolment dictionary. */
  ENROLMENT: 'enrollmentDetails',
  /** Identifiers of the comprehensive assessments shown on the home strips. */
  COMPREHENSIVE_ASSESSMENT: 'comprehensiveAssessment',
}

/** Databases this service replaced; dropped once, on first successful open. */
const LEGACY_DB_NAMES = ['iGotCbpDB', 'SearchV3DB', 'zoho-form']

const LEGACY_CLEANUP_KEY = 'appDbLegacyCleanup'

/** Single key the enrolment dictionary is stored under. */
const ENROLMENT_KEY = 'current'

/** Upper bound on any single IndexedDB operation, in ms. */
const DB_TIMEOUT_MS = 2000

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null

  // ── Connection ─────────────────────────────────────────────────────────────

  openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise
    }
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(APP_DB_NAME, APP_DB_VERSION)
      let blocked = false

      req.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        Object.keys(APP_DB_STORES).forEach((name: string) => {
          const store = (APP_DB_STORES as Record<string, string>)[name]
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store)
          }
        })
      }

      req.onsuccess = () => {
        const db = req.result
        if (blocked) {
          // Already rejected below and the caller has moved on. Left open, this late
          // connection would itself block the next version's upgrade.
          db.close()
          return
        }
        // A tab still holding an older version open blocks the next version's upgrade.
        // Closing here lets that upgrade through instead of hanging the tab that wants it;
        // this tab's connection is re-opened lazily by the next call.
        db.onversionchange = () => {
          db.close()
          this.dbPromise = null
        }
        resolve(db)
      }

      req.onerror = () => reject(req.error)

      // A pending deleteDatabase(), or another tab holding this database open across a
      // version change, leaves the open request queued: neither onsuccess nor onerror
      // ever fires. Without this the promise never settles and every caller awaiting a
      // cache hangs with it — silently, with nothing logged.
      req.onblocked = () => {
        blocked = true
        reject(new Error(`${APP_DB_NAME}: open blocked by another connection`))
      }
    }).then((db: IDBDatabase) => {
      // Best-effort housekeeping — it must never turn a successful open into a failure.
      try {
        this.dropLegacyDatabases()
      } catch { /* ignore */ }
      return db
    }).catch((err: any) => {
      // Never keep a rejected promise cached, or the first failure would disable every
      // cache for the lifetime of the page.
      this.dbPromise = null
      throw err
    })
    return this.dbPromise
  }

  // ── Store operations ───────────────────────────────────────────────────────

  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = await this.openDB()
    return new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly')
      const req = tx.objectStore(storeName).get(key)
      req.onsuccess = () => resolve(req.result as T)
      req.onerror = () => reject(req.error)
    })
  }

  async put(storeName: string, key: string, value: any): Promise<void> {
    const db = await this.openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const req = tx.objectStore(storeName).put(value, key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const req = tx.objectStore(storeName).delete(key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const req = tx.objectStore(storeName).clear()
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  // ── Soft-failure helper ────────────────────────────────────────────────────

  /**
   * Bounds an IndexedDB await. A cache is an optimisation, so a database that is slow,
   * blocked or unavailable must degrade to a miss rather than stall the caller.
   * Resolves to undefined on timeout or error; never rejects.
   */
  withTimeout<T>(operation: Promise<T>, label: string): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      let settled = false
      const finish = (value: T | undefined) => {
        if (!settled) {
          settled = true
          clearTimeout(timer)
          resolve(value)
        }
      }
      const timer = setTimeout(
        () => {
          if (!settled) {
            console.warn(`IndexedDbService: ${label} timed out after ${DB_TIMEOUT_MS}ms`)
            finish(undefined)
          }
        },
        DB_TIMEOUT_MS,
      )
      operation.then(finish, (err: any) => {
        console.warn(`IndexedDbService: ${label} failed`, err)
        finish(undefined)
      })
    })
  }

  // ── Enrolment dictionary ───────────────────────────────────────────────────
  //
  // The signed-in user's enrolment dictionary, keyed by content id. Written at startup by
  // InitService.fetchEnrolmentDictionary() and read by the search and CBP screens, which
  // all fall back to the API on an empty cache.

  async setEnrollmentDetails(data: any): Promise<void> {
    try {
      await this.put(APP_DB_STORES.ENROLMENT, ENROLMENT_KEY, data)
    } catch (error) {
      console.error('IndexedDbService: setEnrollmentDetails failed', error)
      throw error
    }
  }

  async getEnrollmentDetails(): Promise<any> {
    try {
      const details = await this.get<any>(APP_DB_STORES.ENROLMENT, ENROLMENT_KEY)
      return details ?? null
    } catch (error) {
      console.error('IndexedDbService: getEnrollmentDetails failed', error)
      return null
    }
  }

  async clearEnrollmentDetails(): Promise<void> {
    try {
      await this.delete(APP_DB_STORES.ENROLMENT, ENROLMENT_KEY)
    } catch (error) {
      console.error('IndexedDbService: clearEnrollmentDetails failed', error)
      throw error
    }
  }

  // ── Legacy cleanup ─────────────────────────────────────────────────────────

  /**
   * Drops the databases this one replaced, once per browser. Their contents were all
   * re-fetchable caches, so nothing is migrated. Failures are ignored: a delete blocked by
   * another tab simply retries on the next load that still sees the flag unset.
   */
  private dropLegacyDatabases(): void {
    try {
      if (localStorage.getItem(LEGACY_CLEANUP_KEY) === String(APP_DB_VERSION)) {
        return
      }
    } catch {
      return // storage unavailable (private mode); skip rather than delete on every load
    }

    let pending = LEGACY_DB_NAMES.length
    const done = () => {
      pending -= 1
      if (pending === 0) {
        try {
          localStorage.setItem(LEGACY_CLEANUP_KEY, String(APP_DB_VERSION))
        } catch { /* ignore */ }
      }
    }

    LEGACY_DB_NAMES.forEach((name: string) => {
      try {
        const req = indexedDB.deleteDatabase(name)
        req.onsuccess = () => done()
        req.onerror = () => done()
        // Held open by another tab — leave it, the next load retries.
        req.onblocked = () => { pending = -1 }
      } catch {
        done()
      }
    })
  }
}
