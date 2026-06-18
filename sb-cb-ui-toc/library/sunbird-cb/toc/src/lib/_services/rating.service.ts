import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { Observable, of } from 'rxjs'
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { NsAppRating } from '../models/rating.model'

const PROXY_SLAG_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  GET_RATING: (contentId: string, contentType: string, userId: string) =>
    `${PROXY_SLAG_V8}/ratings/v1/read/${contentId}/${contentType}/${userId}`,
  ADD_OR_UPDATE: `${PROXY_SLAG_V8}/ratings/v1/upsert`,
  GET_RATING_SUMMARY: (contentId: string, contentType: string) =>
    `${PROXY_SLAG_V8}/ratings/v1/summary/${contentId}/${contentType}`,
  GET_RATING_LOOKUP: `${PROXY_SLAG_V8}/ratings/v1/ratingLookUp`,
  GET_AUTHOR_REPLY: (contentId: string, userID: string) =>
    `${PROXY_SLAG_V8}/ratings/v1/read/${contentId}/Course/${userID}`,
  POST_AUTHOR_REPLY: `${PROXY_SLAG_V8}/ratings/v2/read`,
}

@Injectable({
  providedIn: 'root',
})
export class RatingService {

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    private commonMethodsSvc: CommonMethodsService,
  ) { }

  private playerConfig$: Observable<any> = this.http
    .get<any>(`${this.configSvc.sitePath}/feature/toc.json`)
    .pipe(catchError(() => of({})), shareReplay(1))

  private isPlayerApiEnabled(urlConfigPath: string, defaultUrl: string): Observable<boolean> {
    return this.playerConfig$.pipe(
      map((tocConfig: any) => !!this.commonMethodsSvc.getEnabledUrl({
        apiConfig: tocConfig?.playerApiConfig,
        urlConfigPath,
        defaultUrl,
      })),
      take(1),
    )
  }

  getRating(contentId: string, contentType: string, userId: string): Observable<any> {
    return this.isPlayerApiEnabled('userRating', '/apis/proxies/v8/ratings/v1/read').pipe(
      switchMap((enabled: boolean) => {
        if (!enabled) { return of({}) }
        const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
        if (!forPreview) {
          return this.http.get<any>(API_END_POINTS.GET_RATING(contentId, contentType, userId))
        }
        return of({})
      }),
    )
  }

  addOrUpdateRating(req: NsAppRating.IRating): Observable<any> {
    return this.http.post<any>(
      API_END_POINTS.ADD_OR_UPDATE, req
    )
  }

  getRatingSummary(contentId: string, contentType: string): Observable<any> {
    return this.isPlayerApiEnabled('contentOverallRating', '/apis/proxies/v8/ratings/v1/summary').pipe(
      switchMap((enabled: boolean) => {
        if (!enabled) { return of({}) }
        const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
        if (!forPreview) {
          return this.http.get<any>(API_END_POINTS.GET_RATING_SUMMARY(contentId, contentType))
        }
        return of({})
      }),
    )
  }

  getRatingLookup(req: NsAppRating.ILookupRequest): Observable<any> {
    return this.http.post<any>(
      API_END_POINTS.GET_RATING_LOOKUP, req
    )
  }

  getRatingReply(req: any): Observable<any> {
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      return this.http.post<any>(
        API_END_POINTS.POST_AUTHOR_REPLY, req
      )
    }
    return of({})
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    if (avg) {
      const avgRating = avg
      const ratingFloor = Math.floor(avgRating)
      if (ratingIndex <= ratingFloor) {
        return 'star'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 >= 0.29 && avgRating % 1 < 0.71) {
        return 'star_half'
      }
    }
    return 'star'
  }

  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    if (avg) {
      const avgRating = avg
      const ratingFloor = Math.floor(avgRating)
      if (ratingIndex <= ratingFloor) {
        return true
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 >= 0.29 && avgRating % 1 < 0.71) {
        return true
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 > 0.71) {
        return true
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 < 0.29) {
        return false
      }
    }
    return false
  }

  getAuthorReply(contentId: string, userID: string): Observable<any> {
    return this.http.get<any>(
      API_END_POINTS.GET_AUTHOR_REPLY(contentId, userID)
    )
  }
}
