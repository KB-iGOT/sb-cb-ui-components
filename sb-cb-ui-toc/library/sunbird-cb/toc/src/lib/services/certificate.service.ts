import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

/**
 * Certificate Service
 * Handles certificate-related operations
 */
@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private readonly PROXY_SLAG_V8 = '/apis/proxies/v8'
  
  constructor(private http: HttpClient) {}

  /**
   * Get certificate details by certificate ID
   */
  getCertificateDetails(certId: string): Observable<any> {
    return this.http.get(`${this.PROXY_SLAG_V8}/certificates/v1/cert/${certId}`)
  }

  /**
   * Download certificate
   */
  downloadCertificate(certId: string): Observable<Blob> {
    return this.http.get(`/apis/public/v8/cert/download/${certId}`, {
      responseType: 'blob'
    })
  }

  /**
   * Get user certificates
   */
  getUserCertificates(userId: string): Observable<any> {
    return this.http.get(`${this.PROXY_SLAG_V8}/certificates/v1/user/${userId}`)
  }

  /**
   * Verify certificate
   */
  verifyCertificate(certId: string): Observable<any> {
    return this.http.get(`${this.PROXY_SLAG_V8}/certificates/v1/verify/${certId}`)
  }

  /**
   * Download certificate v2
   */
  downloadCertificate_v2(certId: string): Observable<Blob> {
    return this.http.get(`/apis/public/v8/cert/v2/download/${certId}`, {
      responseType: 'blob'
    })
  }

  /**
   * Validate enrollment eligibility
   */
  validateEnrollmentEligibility(contentId: string, partnerId: string): Observable<any> {
    return of({ eligible: true })
  }

  /**
   * Submit consent for content
   */
  consentSubmit(request: any): Observable<any> {
    return this.http.post(`${this.PROXY_SLAG_V8}/consent/v1/submit`, request)
  }

   downloadCertificate_v3(certId: string): Observable<any> {
    return this.http.get(`/apis/protected/v8/cohorts/course/batch/cert/download/${certId}`)
  }
}
