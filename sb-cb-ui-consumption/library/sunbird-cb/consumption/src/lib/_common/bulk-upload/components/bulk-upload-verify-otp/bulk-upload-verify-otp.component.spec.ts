import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatRadioModule } from '@angular/material/radio'
import { MatSnackBar } from '@angular/material/snack-bar'
import { of, throwError } from 'rxjs'

import { BulkUploadVerifyOtpComponent } from './bulk-upload-verify-otp.component'
import { BulkUploadService } from '../../bulk-upload.service'
import { BULK_UPLOAD_DEFAULT_CONFIG } from '../../bulk-upload.constants'

describe('BulkUploadVerifyOtpComponent', () => {
  let component: BulkUploadVerifyOtpComponent
  let fixture: ComponentFixture<BulkUploadVerifyOtpComponent>
  let bulkUploadService: any
  let dialogRef: any
  let snackBar: any
  const otp = { ...BULK_UPLOAD_DEFAULT_CONFIG.otp!, resendTimeInSec: 3 }

  beforeEach(() => {
    bulkUploadService = {
      sendOtp: jest.fn(() => of({})),
      verifyOtp: jest.fn(() => of({})),
    }
    dialogRef = { close: jest.fn() }
    snackBar = { open: jest.fn() }

    TestBed.configureTestingModule({
      declarations: [BulkUploadVerifyOtpComponent],
      imports: [FormsModule, MatRadioModule],
      providers: [
        { provide: BulkUploadService, useValue: bulkUploadService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MAT_DIALOG_DATA, useValue: { otp, email: 'admin@test.com', mobile: '9999999999' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(BulkUploadVerifyOtpComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('sends the otp to the selected contact and starts the timer', fakeAsync(() => {
    component.otpType = 'phone'
    component.handleSendOTP()

    expect(bulkUploadService.sendOtp).toHaveBeenCalledWith(otp, 'phone', '9999999999')
    expect(component.otpSent).toBe(true)
    expect(component.timerText).toBe('0m: 3s')

    tick(4000)
    expect(component.showResendOTP).toBe(true)
    discardPeriodicTasks()
  }))

  it('stays on the selection step when sending fails', () => {
    bulkUploadService.sendOtp.mockReturnValue(throwError({ error: { params: { errmsg: 'Limit reached' } } }))
    component.otpType = 'email'
    component.handleSendOTP()

    expect(component.otpSent).toBe(false)
    expect(snackBar.open).toHaveBeenCalledWith('Limit reached')
  })

  it('closes with true once the otp is verified', () => {
    component.otpType = 'email'
    component.otpEntered = ' 123456 '
    component.handleVerifyOTP()

    expect(bulkUploadService.verifyOtp).toHaveBeenCalledWith(otp, 'email', 'admin@test.com', '123456')
    expect(dialogRef.close).toHaveBeenCalledWith(true)
  })

  it('keeps the dialog open when verification fails', () => {
    bulkUploadService.verifyOtp.mockReturnValue(throwError({}))
    component.otpType = 'email'
    component.otpEntered = '000000'
    component.handleVerifyOTP()

    expect(dialogRef.close).not.toHaveBeenCalled()
    expect(snackBar.open).toHaveBeenCalledWith('Unable to verify OTP, please try again later!')
  })

  it('closes with false on cancel', () => {
    component.handleCloseModal()
    expect(dialogRef.close).toHaveBeenCalledWith(false)
  })
})
