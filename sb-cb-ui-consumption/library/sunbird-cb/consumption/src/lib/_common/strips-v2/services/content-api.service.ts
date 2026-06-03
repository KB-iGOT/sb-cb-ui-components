import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ApiMethod, ApiRegistryEntry } from '../models/content-section.model'
import { API_REGISTRY } from '../registry/api-registry'

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  private http = inject(HttpClient);

  loadContent(apiDetailsKey: string): Observable<unknown> {
    const config: ApiRegistryEntry | undefined = API_REGISTRY[apiDetailsKey]
    if (!config) {
      console.warn(`[ContentApiService] No API config found for key: ${apiDetailsKey}`)
      return of(null)
    }

    return this.executeRequest(config)
  }

  private executeRequest(config: ApiRegistryEntry): Observable<unknown> {
    const params = this.buildHttpParams(config.queryParams)

    switch (config.method) {
      case ApiMethod.Get:
        return this.http.get(config.endpoint, { params }).pipe(
          catchError(error => {
            console.error('[ContentApiService] GET request failed:', error)
            return of(null)
          })
        )
      case ApiMethod.Post:
        return this.http.post(config.endpoint, config.body ?? {}, { params }).pipe(
          catchError(error => {
            console.error('[ContentApiService] POST request failed:', error)
            return of(null)
          })
        )
      default:
        return of(null)
    }
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
}
