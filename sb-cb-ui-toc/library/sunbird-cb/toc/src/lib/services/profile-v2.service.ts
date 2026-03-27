import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'

const ENDPOINTS = {
  CADRE_CONFIG: '/apis/proxies/v8/data/v2/system/settings/get/cadreConfig',
  APPROVAL_DETAILS: '/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch',
  WITHDRAW_REQUEST: '/apis/protected/v8/workflowhandler/transition',
  GET_FORM_V2: (id: string) => `/apis/proxies/v8/forms/v2/getFormById?formId=${id}`,
  GET_USER_DETAILS: '/apis/proxies/v8/api/user/v2/read',
}

@Injectable({
  providedIn: 'root',
})
export class ProfileV2Service {
  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${ENDPOINTS.GET_USER_DETAILS}/${userId}`)
  }

  updateProfile(profileData: any): Observable<any> {
    return of({ success: true })
  }

  getProfileDetails(userId: string): Observable<any> {
    return of(null)
  }

  getFormV2ByID(formId: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.GET_FORM_V2(formId))
  }

  fetchCadre(): Observable<any> {
    return this.http.get<any>(ENDPOINTS.CADRE_CONFIG)
  }

  fetchApprovalDetails(userId?: string): Observable<any> {
    return this.http.post<any>(ENDPOINTS.APPROVAL_DETAILS, {
      serviceName: 'profile',
      applicationStatus: 'SEND_FOR_APPROVAL',
    })
  }

  withDrawApprovalRequest(userId: string, wfId?: string): Observable<any> {
    const payload = {
      action: 'WITHDRAW',
      state: 'SEND_FOR_APPROVAL',
      userId: userId,
      applicationId: userId,
      actorUserId: userId,
      wfId: wfId,
      serviceName: 'profile',
      updateFieldValues: [],
      comment: '',
    }
    return this.http.post<any>(ENDPOINTS.WITHDRAW_REQUEST, payload)
  }
}
