import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'

/**
 * Profile V2 Service - Stub implementation
 * Provides profile management functionality
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileV2Service {
  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<any> {
    return of(null)
  }

  updateProfile(profileData: any): Observable<any> {
    return of({ success: true })
  }

  getProfileDetails(userId: string): Observable<any> {
    return of(null)
  }

  getFormV2ByID(formId: string): Observable<any> {
    return of({ fields: [] })
  }

  fetchCadre(): Observable<any> {
    return of({ cadres: [] })
  }

  fetchApprovalDetails(userId?: string): Observable<any> {
    return of({ approvals: [] })
  }

  withDrawApprovalRequest(userId: string, wfId?: string): Observable<any> {
    return of({ success: true })
  }
}
