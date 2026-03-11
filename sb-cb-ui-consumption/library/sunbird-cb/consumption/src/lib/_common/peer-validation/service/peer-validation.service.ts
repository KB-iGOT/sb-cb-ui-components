import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  SEARCH: 'apis/proxies/v8/sunbirdigot/search',
  SAVE_DRAFT: 'apis/proxies/v8/forms/mdo/peersurvey'
}
@Injectable({
  providedIn: 'root'
})
export class PeerValidationService {

  private selectedCourse: any

  constructor(private http: HttpClient) { }

  searchContent(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH, payload)
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
}
