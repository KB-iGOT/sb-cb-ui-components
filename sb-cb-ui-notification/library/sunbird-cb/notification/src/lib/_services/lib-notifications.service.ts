import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const API_END_POINTS = {
  NOTIFICATIONS_COUNT: `apis/proxies/v8/v1/notifications/list`,
  MARK_AS_READ: `apis/proxies/v8/v1/notifications/read`

}

@Injectable({
  providedIn: 'root'
})
export class LibNotificationsService {
  constructor(private http: HttpClient) { }
  getNotifications(): Observable<any> {
    return this.http.get(API_END_POINTS.NOTIFICATIONS_COUNT)
  }

  markAsRead(request: any): Observable<any> {
    return this.http.patch(API_END_POINTS.MARK_AS_READ, request);
  }
}
