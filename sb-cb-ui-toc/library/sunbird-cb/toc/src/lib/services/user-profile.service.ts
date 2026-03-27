import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'

const API_ENDPOINTS = {
  UPDATE_PROFILE: '/apis/proxies/v8/user/profileDetails',
  SEARCH_PROFILE: '/apis/proxies/v8/user/v1/search',
  GET_GROUPS: '/api/user/v1/groups',
  GET_WHITELIST_DOMAIN: '/apis/proxies/v8/user/v1/email/approvedDomains',
  GET_SUNBIRD_IGOT_SEARCH: '/apis/proxies/v8/sunbirdigot/v4/search',
  GET_SEARCH_DESIGNATIONS: '/apis/proxies/v8/designation/search',
  GET_MASTER_LANGUAGES: '/apis/protected/v8/user/profileRegistry/getMasterLanguages',
  EDIT_PROFILE_DETAILS: '/apis/proxies/v8/user/v3/extPatch',
  UPDATE_PRIMARY_EMAIL: '/apis/proxies/v8/user/otp/v2/extPatch',
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.SEARCH_PROFILE)
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.patch(API_ENDPOINTS.UPDATE_PROFILE, data)
  }

  searchProfile(data: any): Observable<any> {
    return this.http.post(API_ENDPOINTS.SEARCH_PROFILE, data)
  }

  getWhiteListDomain(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.GET_WHITELIST_DOMAIN)
  }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.GET_GROUPS)
  }

  handleTranslateTo(menuName: string): string {
    const translationKey = 'profileInfo.' + menuName.replace(/\s/g, '')
    return this.translateService.instant(translationKey)
  }

  searchIgotDesignation(_req: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.GET_SUNBIRD_IGOT_SEARCH, _req)
  }

  searchDesignation(_req: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.GET_SEARCH_DESIGNATIONS, _req)
  }

  getMasterLanguages(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.GET_MASTER_LANGUAGES)
  }

  editProfileDetails(data: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.EDIT_PROFILE_DETAILS, data)
  }

  updatePrimaryEmailDetails(data: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.UPDATE_PRIMARY_EMAIL, data)
  }
}
