import { Component, Inject } from '@angular/core'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-unenroll-confirm-dialog',
  templateUrl: './unenroll-confirm-dialog.component.html',
  styleUrls: ['./unenroll-confirm-dialog.component.scss'],
  standalone: false,
})
export class UnenrollConfirmDialogComponent {
  understood = false
  showFeedbackForm = false
  feedbackReasons = [
    'Content is not relevant to my role',
    'Course is too difficult / too easy',
    'Not enough time to complete',
    'Poor content quality',
    'Enrolled by mistake',
  ]
  feedbackForm = new FormGroup({
    reasons: new FormArray(this.feedbackReasons.map(() => new FormControl(false))),
    comments: new FormControl(''),
  })

  constructor(
    public dialogRef: MatDialogRef<UnenrollConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
  ) { }

  onCancel(): void {
    this.dialogRef.close(false)
  }

  onContinue(): void {
    if (this.understood) {
      this.showFeedbackForm = true
    }
  }

  onBack(): void {
    this.showFeedbackForm = false
  }

  hasSelectedFeedbackReason(): boolean {
    return (this.feedbackForm.get('reasons') as FormArray).value.some(Boolean)
  }

  onConfirmUnenroll(): void {
    if (this.hasSelectedFeedbackReason()) {
      this.raiseTelemetryEvent()
      const selectedReasonFlags = (this.feedbackForm.get('reasons') as FormArray).value
      const selectedReasons = this.feedbackReasons.filter((_, index) => selectedReasonFlags[index])
      const feedbackPayload = {
        selectedReasons,
        comments: this.feedbackForm.get('comments')?.value || '',
      }

      console.log('Un-enroll feedback:', feedbackPayload)
      this.dialogRef.close(true)
    }
  }

  raiseTelemetryEvent(): void {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: 'btn-un-enroll',
      },
      {
        id: this.data?.content?.name || 'unknown-content',
        type: this.data?.content?.primaryCategory || ''
      },
      {
        pageIdExt: 'btn-un-enroll',
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      })

  }
}
