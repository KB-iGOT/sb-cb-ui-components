import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationsService } from '../services/configurations.service';
import { Observable } from 'rxjs';
import { NsContent } from '../services/widget-content.model';
import { map } from 'rxjs/operators';




const PROXIES_V8 = '/apis/proxies/v8';
const API_END_POINTS = {
  ENROLL_CONTENT_DATA: `${PROXIES_V8}/learner/course/v4/user/enrollment/details`,
  ENROLL_LIST_DATA: `${PROXIES_V8}/learner/course/v4/user/enrollment/list`,
  ENROLL_EXTERNAL_DATA: `${PROXIES_V8}/cios-enroll/v1/courselist/byuserid`,
  ENROLL_EVENTS_DATA: `${PROXIES_V8}/user/events/list`,
};

@Injectable({
  providedIn: 'root'
})
export class WidgetEnrollService {

  constructor(
        private http: HttpClient,
        private configSvc: ConfigurationsService
  ) { }

  fetchEnrollContentData(payload: any): Observable<NsContent.IContent[]> {
    const userId = this.configSvc.userProfile && this.configSvc.userProfile.userId
    const enrollmentDetailsConfig = this.configSvc.globalConfig?.apis?.user?.enrollmentDetails
    const baseUrl = (enrollmentDetailsConfig?.enabled && enrollmentDetailsConfig?.url) ? enrollmentDetailsConfig.url : API_END_POINTS.ENROLL_CONTENT_DATA
    return this.http.post<NsContent.IContent[]>(`${baseUrl}/${userId}`, payload)
  }
  fetchInternalEnrollmentData(userId: string, payload: any) {
    const enrollmentConfig = this.configSvc.globalConfig?.apis?.user?.enrollment
    const baseUrl = (enrollmentConfig?.enabled && enrollmentConfig?.url) ? enrollmentConfig.url : API_END_POINTS.ENROLL_LIST_DATA
    return this.http.post(`${baseUrl}/${userId}`, payload)
  }

fetchExternalEnrollmentData(payload: any) {
  const externalEnrollConfig = this.configSvc.globalConfig?.apis?.user?.externalEnrollment
  const url = (externalEnrollConfig?.enabled && externalEnrollConfig?.url) ? externalEnrollConfig.url : API_END_POINTS.ENROLL_EXTERNAL_DATA
  return this.http.post(url, payload).pipe(map((extRes: any) => {
    if (extRes && extRes?.result && extRes?.result?.courses) {
     extRes.result.courses = extRes?.result?.courses?.filter((ele: any) => {
  const completion = ele?.completionPercentage ?? ele?.completionpercentage ?? 0
  return !(
    (ele?.content?.contentPartner?.isActive === false ||
      ele?.content?.isActive === false) &&
    completion <= 100
  )
})
      extRes?.result?.courses?.forEach((ele: any) => {
        ele['completionPercentage'] = ele['completionpercentage']
        if (ele?.content) {
          ele['content']['issuedCertificates'] = ele['issued_certificates'] || []
        }
        ele['lastContentAccessTime'] = ele?.content?.lastUpdatedOn ? new Date(ele.content.lastUpdatedOn).getTime() : ''
     if(ele?.content){
            ele['content']['organisation'] = ele?.content && ele?.content?.contentPartner && ele?.content?.contentPartner?.contentPartnerName ? [ele?.content?.contentPartner?.contentPartnerName]: []
            ele['content']['completionStatus'] = ele['completionpercentage']< 100 ? 1: 2
            ele['content']['creatorLogo'] = ele['content']['contentPartner']['link']

          }
      })
    }
    return extRes
  }))
}

  fetchEventsEnrollmentData(userId: string, payload: any) {
    const eventsEnrollConfig = this.configSvc.globalConfig?.apis?.user?.eventsEnrollmentList
    const baseUrl = (eventsEnrollConfig?.enabled && eventsEnrollConfig?.url) ? eventsEnrollConfig.url : API_END_POINTS.ENROLL_EVENTS_DATA
    return this.http.post(`${baseUrl}/${userId}`, payload)
  }

  fetchEnrollStats(userId: any, url?: string): Observable<NsContent.IContent[]> {
    const endpoint = url ? `${url}/${userId}` : `apis/proxies/v8/learner/course/v4/user/enrollment/summary/${userId}`
    return this.http.get<NsContent.IContent[]>(endpoint)
  }

}
