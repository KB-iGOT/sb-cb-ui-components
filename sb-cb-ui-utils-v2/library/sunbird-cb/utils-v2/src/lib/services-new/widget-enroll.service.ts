import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationsService } from '../services/configurations.service';
import { Observable } from 'rxjs';
import { NsContent } from '../services/widget-content.model';
import { map } from 'rxjs/operators';



const PROXIES_V8 = '/apis/proxies/v8';
const API_END_POINTS = {
  ENROLL_CONTENT_DATA: `${PROXIES_V8}/learner/course/v4/user/enrollment/details`
};

console.log('fghjk')
@Injectable({
  providedIn: 'root'
})
export class WidgetEnrollService {

  constructor(
        private http: HttpClient,
        private configSvc: ConfigurationsService
  ) { }

  fetchEnrollContentData(payload: any): Observable<NsContent.IContent[]> {
    let userId = this.configSvc.userProfile && this.configSvc.userProfile.userId
      return this.http.post<NsContent.IContent[]>(
        `${API_END_POINTS.ENROLL_CONTENT_DATA}/${userId}`, payload
      )
    }

    
}
