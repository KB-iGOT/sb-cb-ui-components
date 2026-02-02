import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'

/**
 * OTP Service - Stub implementation
 * Provides OTP generation and verification functionality
 */
@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private http: HttpClient) {}

  generateOtp(mobileNumber: string): Observable<any> {
    return of({ success: true })
  }

  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return of({ verified: true })
  }

  resendOtp(mobileNumber: string): Observable<any> {
    return of({ success: true })
  }

  sendOtp(mobileNumber: string): Observable<any> {
    return of({ success: true })
  }

  sendEmailOtp(email: string): Observable<any> {
    return of({ success: true })
  }

  verifyEmailOTP(email: string, otp: string): Observable<any> {
    return of({ verified: true })
  }

  verifyOTP(mobileNumber: string, otp: string): Observable<any> {
    return of({ verified: true })
  }
}
