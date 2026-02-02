import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

/**
 * NPS Grid Service - Stub implementation
 * Provides NPS grid/survey functionality
 */
@Injectable({
  providedIn: 'root',
})
export class NPSGridService {
  constructor() {}

  getGridData(): Observable<any> {
    return of([])
  }

  submitGridResponse(data: any): Observable<any> {
    return of({ success: true })
  }

  getGridConfig(): Observable<any> {
    return of({})
  }

  submitBpFormWithProfileDetails(formData: any, profileData?: any): Observable<any> {
    return of({ success: true })
  }
}
