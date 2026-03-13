import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  CONTENT_SEARCH: 'apis/proxies/v8/sunbirdigot/v4/search',
  SAVE_DRAFT: 'apis/proxies/v8/forms/mdo/peersurvey',
  FORM_READ: (id: any) => `apis/proxies/v8/forms/v2/getFormById?formId=${id}`,
  UPDATE_FORM: (id: any) => `apis/proxies/v8/forms/mdo/update/peersurvey/${id}`,
  PEER_VALIDATION_SEARCH: `apis/proxies/v8/forms/mdo/peersurvey/search`,
  PUBLISH_FORM: (id: any) => `apis/proxies/v8/forms/peersurvey/publish/${id}`,
  ARCHIVE_FORM: (id: any) => `apis/proxies/v8/forms/peersurvey/archive/${id}`,
  END_FORM: (id: any) => `apis/proxies/v8/forms/peersurvey/end/${id}`
}
@Injectable({
  providedIn: 'root'
})
export class PeerValidationService {

  private selectedCourse: any

  constructor(private http: HttpClient) { }

  searchContent(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.CONTENT_SEARCH, payload)
  }

  setSelectedCourse(course: any) {
    this.selectedCourse = course
  }

  getSelectedCourse() {
    return this.selectedCourse
  }

  saveDraft(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.SAVE_DRAFT, payload)
  }

  getFormById(id: any): Observable<any> {
    return this.http.get(API_END_POINTS.FORM_READ(id))
  }

  updateForm(id: any, payload: any): Observable<any> {
    return this.http.put(API_END_POINTS.UPDATE_FORM(id), payload)
  }

  publishForm(id: any): Observable<any> {
    return this.http.put(API_END_POINTS.PUBLISH_FORM(id), {})
  }

  archiveForm(id: any): Observable<any> {
    return this.http.put(API_END_POINTS.ARCHIVE_FORM(id), {})
  }

  endForm(id: any): Observable<any> {
    return this.http.put(API_END_POINTS.END_FORM(id), {})
  }

  searchPeerValidations(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.PEER_VALIDATION_SEARCH, payload)
  }
}
