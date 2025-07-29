import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


const API_END_POINTS = {
  LIST: (pageNumber: number, pageSize: number) => `apis/proxies/v8/v1/notifications/list?page=${pageNumber}&size=${pageSize}`,
  LIST_WITH_CATEGORY: (pageNumber: number, pageSize: number, subType: string) => `apis/proxies/v8/v1/notifications/list?page=${pageNumber}&size=${pageSize}&sub_type=${subType}`,
  MARK_AS_READ: `apis/proxies/v8/v1/notifications/read`,
  NOTIFICATIONS: (pageNumber: number, pageSize: number) => `apis/proxies/v8/v1/notifications/list?page=${pageNumber}&size=${pageSize}`,
  SEARCH: `apis/proxies/v8/sunbirdigot/search`
}

@Injectable({
  providedIn: 'root'
})
export class LibNotificationsService {
  _unreadCount = new BehaviorSubject<boolean>(false)
  unreadCount$ = this._unreadCount.asObservable()

  _handleClick = new BehaviorSubject<any>('')
  handleClick$ = this._handleClick.asObservable()

  constructor(private http: HttpClient) { }
  getNotifications(pageNumber: number, pageSize: number, subType: string): Observable<any> {
    if (subType === 'all') {
      return this.http.get(API_END_POINTS.LIST(pageNumber, pageSize))
    } else {
      return this.http.get(API_END_POINTS.LIST_WITH_CATEGORY(pageNumber, pageSize, subType))
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

  updateUnreadCount(): void {
    this._unreadCount.next(true)
  }

  searchContent(query: string): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH, query);
  }

  emitClick(content: any): void {
    this._handleClick.next(content)
  }

}
