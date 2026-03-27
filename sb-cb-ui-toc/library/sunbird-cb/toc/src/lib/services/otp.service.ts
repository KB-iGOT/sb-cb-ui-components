import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_ENDPOINTS = {
  GENERATE_OTP: '/apis/proxies/v8/otp/v1/generate',
  VERIFY_OTP: '/apis/proxies/v8/otp/v4/verify',
}

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private http: HttpClient) {}

  generateOtp(mobileNumber: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.GENERATE_OTP, {
      request: { key: mobileNumber, type: 'phone' },
    })
  }

  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.VERIFY_OTP, {
      request: { key: mobileNumber, otp, type: 'phone' },
    })
  }

  resendOtp(mobileNumber: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.GENERATE_OTP, {
      request: { key: mobileNumber, type: 'phone' },
    })
  }

  sendOtp(mobileNumber: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.GENERATE_OTP, {
      request: { key: mobileNumber, type: 'phone' },
    })
  }

  sendEmailOtp(email: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.GENERATE_OTP, {
      request: { key: email, type: 'email' },
    })
  }

  // Component calls: verifyEmailOTP(otp, email)
  verifyEmailOTP(otp: string, email: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.VERIFY_OTP, {
      request: { key: email, otp, type: 'email' },
    })
  }

  // Component calls: verifyOTP(otp, mobile)
  verifyOTP(otp: string, mobileNumber: string): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.VERIFY_OTP, {
      request: { key: mobileNumber, otp, type: 'phone' },
    })
  }
}
