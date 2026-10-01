import { Component, Inject, OnDestroy } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import * as _ from 'lodash'
import { NsBulkUpload } from '../../bulk-upload.model'
import { BulkUploadService, OtpContactType } from '../../bulk-upload.service'

/** Closes with `true` once the OTP is verified */
@Component({
  selector: 'sb-uic-bulk-upload-verify-otp',
  templateUrl: './bulk-upload-verify-otp.component.html',
  styleUrls: ['./bulk-upload-verify-otp.component.scss'],
  standalone: false
})
export class BulkUploadVerifyOtpComponent implements OnDestroy {

  private destroySubject$ = new Subject<void>()
  otpType: OtpContactType | '' = ''
  otpSent = false
  otpEntered = ''
  timeLeft = 0
  showResendOTP = false
  sendingOtp = false
  verifyingOtp = false
  interval: any

  constructor(
    public dialogRef: MatDialogRef<BulkUploadVerifyOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NsBulkUpload.IOtpDialogData,
    private bulkUploadService: BulkUploadService,
    private matSnackBar: MatSnackBar,
  ) { }

  get timerText(): string {
    return `${Math.floor(this.timeLeft / 60)}m: ${this.timeLeft % 60}s`
  }

  get contactLabel(): string {
    return this.otpType === 'phone' ? 'Mobile number' : 'Email address'
  }

  handleSendOTP(): void {
    if (!this.otpType) {
      return
    }
    const type = this.otpType
    const key = type === 'email' ? this.data.email : this.data.mobile
    this.sendingOtp = true
    this.bulkUploadService.sendOtp(this.data.otp, type, key as string | number)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe({
        next: () => {
          this.sendingOtp = false
          this.otpSent = true
          this.matSnackBar.open(`An OTP has been sent to your ${this.contactLabel}, (Valid for 15 min's)`)
          this.startTimer()
        },
        error: (error: HttpErrorResponse) => {
          this.sendingOtp = false
          this.matSnackBar.open(_.get(error, 'error.params.errmsg')
            || `Unable to send OTP to your ${this.contactLabel}, please try again later!`)
        },
      })
  }

  handleResendOTP(): void {
    this.otpEntered = ''
    this.handleSendOTP()
  }

  handleVerifyOTP(): void {
    if (!this.otpType || !this.otpEntered) {
      return
    }
    const type = this.otpType
    const key = type === 'email' ? this.data.email : this.data.mobile
    this.verifyingOtp = true
    this.bulkUploadService.verifyOtp(this.data.otp, type, key as string | number, this.otpEntered.trim())
      .pipe(takeUntil(this.destroySubject$))
      .subscribe({
        next: () => {
          this.verifyingOtp = false
          this.dialogRef.close(true)
        },
        error: (error: HttpErrorResponse) => {
          this.verifyingOtp = false
          this.matSnackBar.open(_.get(error, 'error.params.errmsg') || 'Unable to verify OTP, please try again later!')
        },
      })
  }

  handleCloseModal(): void {
    this.dialogRef.close(false)
  }

  private startTimer(): void {
    this.stopTimer()
    this.showResendOTP = false
    this.timeLeft = this.data.otp.resendTimeInSec || 150
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft = this.timeLeft - 1
      } else {
        this.stopTimer()
        this.showResendOTP = true
      }
    }, 1000)
  }

  private stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  ngOnDestroy(): void {
    this.stopTimer()
    this.destroySubject$.next()
    this.destroySubject$.complete()
  }
}
