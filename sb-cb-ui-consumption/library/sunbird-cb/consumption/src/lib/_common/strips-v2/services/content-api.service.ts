import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { ApiMethod, ApiRegistryEntry, ChainedApiConfig } from '../models/content-section.model'
import { API_REGISTRY } from '../registry/api-registry'
import { ConfigurationsService, WidgetEnrollService } from '@sunbird-cb/utils-v2'
import { WidgetUserServiceLib } from '../../../_services/widget-user-lib.service'
import * as _ from 'lodash'

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  private http = inject(HttpClient);
  private configSvc = inject(ConfigurationsService);
  private userService = inject(WidgetUserServiceLib);
  private userServiceLib = inject(WidgetEnrollService);
  private readonly cardClickDetailsSubject = new Subject<any>()
  readonly cardClickDetails$ = this.cardClickDetailsSubject.asObservable()

  private readonly emptySectionKeysSubject = new BehaviorSubject<string[]>([])
  readonly emptySectionKeys$ = this.emptySectionKeysSubject.asObservable()

  publishCardClickDetails(details: any): void {
    this.cardClickDetailsSubject.next(details)
  }

  reportEmptySection(sectionKey: string): void {
    if (!sectionKey) {
      return
    }
    const current = this.emptySectionKeysSubject.value
    if (!current.includes(sectionKey)) {
      this.emptySectionKeysSubject.next([...current, sectionKey])
    }
  }

  async loadContent(apiDetailsKey: string): Promise<Observable<unknown>> {
    switch (apiDetailsKey) {
      case 'aparApi':
      case 'trainingPlanApi':
        let userId = this.configSvc?.userProfile?.userId as string
        return of(await this.userService.fetchCbpPlanList(userId).toPromise())
      default:
        let config: ApiRegistryEntry | undefined
        const globalApiConfig = _.get(this.configSvc, 'globalConfig.apis.apiRegistryConfig')
        if (globalApiConfig && globalApiConfig[apiDetailsKey]) {
          const apiConfig = globalApiConfig[apiDetailsKey]
          const methodKey = String(apiConfig.method).split('.').pop() as keyof typeof ApiMethod
          config = { ...apiConfig, method: ApiMethod[methodKey] }

          if (config && config.chainedApi) {
            const chainedMethodKey = String(config.chainedApi.method).split('.').pop() as keyof typeof ApiMethod
            const buildBody = config.chainedApi.buildBody
            config.chainedApi = {
              ...config.chainedApi,
              method: ApiMethod[chainedMethodKey],
              buildBody: buildBody && typeof buildBody === 'string'
                ? new Function(`return ${this.stripParamTypes(buildBody)}`)()
                : buildBody
            }
          }
        } else {
          config = API_REGISTRY[apiDetailsKey]
        }

        if (!config) {
          console.warn(`[ContentApiService] No API config found for key: ${apiDetailsKey}`)
          return of(null)
        }

        return this.executeRequest(config, apiDetailsKey)
    }
  }

  private executeRequest(config: ApiRegistryEntry, apiDetailsKey: string): Observable<unknown> {
    const firstResponse$ = this.makeHttpRequest({
      ...config,
      body: this.applyUserContextFilters(config.body)
    })

    if (!config.chainedApi) {
      return firstResponse$
    }

    const chainedConfig = config.chainedApi

    if (chainedConfig.mode === 'mergeIndependent') {
      return this.executeMergeIndependentChain(firstResponse$, chainedConfig, apiDetailsKey)
    }

    return firstResponse$.pipe(
      switchMap(firstResponse => {
        const sourceList = this.getNestedValue(firstResponse, chainedConfig.sourceListPath)

        if (!Array.isArray(sourceList) || sourceList.length === 0) {
          return of([])
        }

        const identifierField = chainedConfig.identifierField as string
        const identifiers = sourceList
          .map(item => (item as Record<string, unknown>)[identifierField])
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

            const filteredEnrolledList = apiDetailsKey === 'standaloneApi'
              ? enrolledList.filter(item => this.hasActiveBatch(item))
              : enrolledList

            if (filteredEnrolledList.length === 0) {
              return []
            }

            const enrolledMatchField = chainedConfig.enrolledMatchField as string
            const enrolledIds = new Set(
              filteredEnrolledList.map(item => (item as Record<string, unknown>)[enrolledMatchField])
            )

            const filteredContent = sourceList.filter(item =>
              enrolledIds.has((item as Record<string, unknown>)[identifierField])
            )

            return this.setNestedValue(firstResponse, chainedConfig.sourceListPath, filteredContent)
          })
        )
      })
    )
  }

  // Calls the second endpoint unconditionally (independent of the first response, and even if
  // the first request errored — makeHttpRequest already swallows errors into `of(null)`), then
  // concatenates both lists rather than filtering the first by the second.
  private executeMergeIndependentChain(
    firstResponse$: Observable<unknown>,
    chainedConfig: ChainedApiConfig,
    apiDetailsKey: string
  ): Observable<unknown> {
    return firstResponse$.pipe(
      switchMap(firstResponse => {
        const sourceList = this.getNestedValue(firstResponse, chainedConfig.sourceListPath)
        const firstList = Array.isArray(sourceList) ? sourceList : []

        const secondResponse$ = apiDetailsKey === 'continueLearningApi'
          ? this.userServiceLib.fetchExternalEnrollmentData(chainedConfig.buildBody([]))
          : this.makeHttpRequest({
            endpoint: chainedConfig.endpoint,
            method: chainedConfig.method,
            body: chainedConfig.buildBody([]),
            queryParams: chainedConfig.queryParams,
            addUserId: chainedConfig.addUserId
          })

        return secondResponse$.pipe(
          map(secondResponse => {
            const secondListRaw = this.getNestedValue(secondResponse, chainedConfig.enrolledListPath)
            const secondList = Array.isArray(secondListRaw) ? secondListRaw : []
            const merged = [...firstList, ...secondList]
            return this.setNestedValue(firstResponse ?? {}, chainedConfig.sourceListPath, merged)
          })
        )
      })
    )
  }

  private applyUserContextFilters(body: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
    if (!body) {
      return body
    }

    const request = (body as Record<string, any>).request
    if (!request || !request.filters) {
      return body
    }

    const filters = { ...request.filters }

    if (Object.prototype.hasOwnProperty.call(filters, 'secureSettings.organisation')) {
      let orgId
      if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) {
        orgId = this.configSvc.userProfile.rootOrgId
      }
      if (orgId) {
        filters['secureSettings.organisation'] = orgId
      }
    }

    if (Object.prototype.hasOwnProperty.call(filters, 'secureSettings.isVerifiedKarmayogi')) {
      delete filters['secureSettings.isVerifiedKarmayogi']
      if (this.configSvc && this.configSvc.unMappedUser &&
        this.configSvc.unMappedUser.profileDetails &&
        !this.configSvc.unMappedUser.profileDetails.verifiedKarmayogi) {
        filters['secureSettings.isVerifiedKarmayogi'] = 'No'
      }
    }

    return {
      ...body,
      request: {
        ...request,
        filters
      }
    }
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

  private stripParamTypes(fnString: string): string {
    return fnString.replace(/\(([^)]*)\)(\s*=>)/, (_match, params: string, arrow: string) => {
      const cleanedParams = params
        .split(',')
        .map(param => param.split(':')[0].trim())
        .join(', ')
      return `(${cleanedParams})${arrow}`
    })
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

  private hasActiveBatch(item: unknown): boolean {
    const batches = _.get(item, 'content.batches')

    if (!Array.isArray(batches) || batches.length === 0) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return batches.some((batch: any) => {
      const endDate = batch && batch.endDate
      if (!endDate) {
        return false
      }
      const batchEndDate = new Date(endDate)
      batchEndDate.setHours(0, 0, 0, 0)
      return batchEndDate.getTime() > today.getTime()
    })
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

