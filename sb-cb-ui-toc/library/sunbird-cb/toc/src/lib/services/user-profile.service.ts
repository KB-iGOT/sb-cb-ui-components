import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

/**
 * User Profile Service stub
 * Handles user profile related operations
 */
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return of({})
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.patch('/apis/proxies/v8/user/profileDetails', data)
  }

  searchProfile(data: any): Observable<any> {
    return this.http.post('/apis/proxies/v8/user/v1/search', data)
  }

  getWhiteListDomain(): Observable<any> {
    return of({ domains: [] })
  }

  getGroups(): Observable<any> {
    return this.http.get<any>('/api/user/v1/groups')
  }

  handleTranslateTo(key: string): string {
    return key
  }

  searchIgotDesignation(query: string): Observable<any> {
    return of({ designations: [] })
  }

  searchDesignation(query: string): Observable<any> {
    return of({ designations: [] })
  }

  getMasterLanguages(): Observable<any> {
    return of({ languages: [] })
  }

  editProfileDetails(data: any): Observable<any> {
    return of({ success: true })
  }

  updatePrimaryEmailDetails(data: any): Observable<any> {
    return of({ success: true })
  }
}
