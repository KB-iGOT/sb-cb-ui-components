import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const API_END_POINTS = {
  LIST: (pageNumber: number, pageSize: number) => `apis/proxies/v8/v1/notifications/list?page=${pageNumber}&size=${pageSize}`,
  LIST_WITH_CATEGORY: (pageNumber: number, pageSize: number, category: string) => `apis/proxies/v8/v1/notifications/list?page=${pageNumber}&size=${pageSize}&category=${category}`,
  MARK_AS_READ: `apis/proxies/v8/v1/notifications/read`,
  NOTIFICATIONS: (pageNumber: number, pageSize: number) => `apis/proxies/v8/v1/notifications/list?page=${pageNumber}&size=${pageSize}`,

}

@Injectable({
  providedIn: 'root'
})
export class LibNotificationsService {
  constructor(private http: HttpClient) { }
  getNotifications(pageNumber: number, pageSize: number, category: string): Observable<any> {
    if (category === 'all') {
      return this.http.get(API_END_POINTS.LIST(pageNumber, pageSize))
    } else {
      return this.http.get(API_END_POINTS.LIST_WITH_CATEGORY(pageNumber, pageSize, category))
    }
  }

  getNotificationsByType(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(API_END_POINTS.NOTIFICATIONS(pageNumber, pageSize))
  }

  markAsRead(request: any): Observable<any> {
    return this.http.patch(API_END_POINTS.MARK_AS_READ, request);
  }

  markAllAsRead(request: any): Observable<any> {
    return this.http.patch(API_END_POINTS.MARK_AS_READ, request);
  }
}
