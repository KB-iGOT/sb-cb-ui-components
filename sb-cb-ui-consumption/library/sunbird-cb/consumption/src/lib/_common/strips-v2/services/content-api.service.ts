import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { ApiMethod, ApiRegistryEntry } from '../models/content-section.model'
import { API_REGISTRY } from '../registry/api-registry'
import { ConfigurationsService, WidgetEnrollService } from '@sunbird-cb/utils-v2'
import { WidgetUserServiceLib } from '../../../_services/widget-user-lib.service'

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  private http = inject(HttpClient);
  private configSvc = inject(ConfigurationsService);
  private userService = inject(WidgetUserServiceLib);
  private userServiceLib = inject(WidgetEnrollService);
  private readonly cardClickDetailsSubject = new Subject<any>()
  readonly cardClickDetails$ = this.cardClickDetailsSubject.asObservable()

  publishCardClickDetails(details: any): void {
    this.cardClickDetailsSubject.next(details)
  }

  async loadContent(apiDetailsKey: string): Promise<Observable<unknown>> {
    switch (apiDetailsKey) {
      case 'aparApi':
      case 'trainingPlanApi':
        let userId = this.configSvc?.userProfile?.userId as string
        return of(await this.userService.fetchCbpPlanList(userId).toPromise())
      default:
        const config: ApiRegistryEntry | undefined = API_REGISTRY[apiDetailsKey]
        if (!config) {
          console.warn(`[ContentApiService] No API config found for key: ${apiDetailsKey}`)
          return of(null)
        }

        return this.executeRequest(config, apiDetailsKey)
    }
  }

  private executeRequest(config: ApiRegistryEntry, apiDetailsKey: string): Observable<unknown> {
    const firstResponse$ = this.makeHttpRequest(config)

    if (!config.chainedApi) {
      return firstResponse$
    }

    const chainedConfig = config.chainedApi

    return firstResponse$.pipe(
      switchMap(firstResponse => {
        const sourceList = this.getNestedValue(firstResponse, chainedConfig.sourceListPath)

        if (!Array.isArray(sourceList) || sourceList.length === 0) {
          return of([])
        }

        const identifiers = sourceList
          .map(item => (item as Record<string, unknown>)[chainedConfig.identifierField])
          .filter((id): id is string => typeof id === 'string' && !!id)

        if (identifiers.length === 0) {
          return of([])
        }

        if (apiDetailsKey === 'caProgramApi') {
          let request = {
            request: {
              courseId: identifiers
            }
          }
          return this.userServiceLib.fetchEnrollContentData(request)
        }

        return this.makeHttpRequest({
          endpoint: chainedConfig.endpoint,
          method: chainedConfig.method,
          body: chainedConfig.buildBody(identifiers),
          queryParams: chainedConfig.queryParams,
          addUserId: chainedConfig.addUserId
        }).pipe(
          map(secondResponse => {
            const enrolledList = this.getNestedValue(secondResponse, chainedConfig.enrolledListPath)

            if (!Array.isArray(enrolledList) || enrolledList.length === 0) {
              return []
            }

            const enrolledIds = new Set(
              enrolledList.map(item => (item as Record<string, unknown>)[chainedConfig.enrolledMatchField])
            )

            const filteredContent = sourceList.filter(item =>
              enrolledIds.has((item as Record<string, unknown>)[chainedConfig.identifierField])
            )

            return this.setNestedValue(firstResponse, chainedConfig.sourceListPath, filteredContent)
          })
        )
      })
    )
  }

  private makeHttpRequest(config: {
    endpoint: string
    method: ApiMethod
    body?: Record<string, unknown>
    queryParams?: Record<string, string>
    addUserId?: boolean
  }): Observable<unknown> {
    let endpoint = config.endpoint
    const params = this.buildHttpParams(config.queryParams)

    if (config.addUserId) {
      const userId = this.getUserId()
      if (userId) {
        endpoint = `${endpoint}${userId}`
      }
    }

    switch (config.method) {
      case ApiMethod.Get:
        return this.http.get(endpoint, { params }).pipe(
          catchError(error => {
            console.error('[ContentApiService] GET request failed:', error)
            return of(null)
          })
        )
      case ApiMethod.Post:
        return this.http.post(endpoint, config.body ?? {}, { params }).pipe(
          catchError(error => {
            console.error('[ContentApiService] POST request failed:', error)
            return of(null)
          })
        )
      default:
        return of(null)
    }
  }

  getUserId(): string | null {
    return this.configSvc.userProfileV2?.userId ?? null
  }

  private buildHttpParams(queryParams: Record<string, string> | undefined): HttpParams {
    let params = new HttpParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        params = params.set(key, value)
      })
    }
    return params
  }

  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((acc, key) => {
      return acc !== null && acc !== undefined && typeof acc === 'object'
        ? (acc as Record<string, unknown>)[key]
        : undefined
    }, obj)
  }

  private setNestedValue(obj: unknown, path: string, value: unknown): unknown {
    const keys = path.split('.')
    if (keys.length === 1) {
      return { ...(obj as Record<string, unknown>), [keys[0]]: value }
    }
    const [first, ...rest] = keys
    const objRecord = obj as Record<string, unknown>
    return {
      ...objRecord,
      [first]: this.setNestedValue(objRecord[first], rest.join('.'), value)
    }
  }
}

