import { Component, Inject, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-unenroll-confirm-dialog',
  templateUrl: './unenroll-confirm-dialog.component.html',
  styleUrls: ['./unenroll-confirm-dialog.component.scss'],
  standalone: false,
})
export class UnenrollConfirmDialogComponent implements OnInit {
  understood = false
  showFeedbackForm = false
  hasSelectedReason = false
  feedbackReasons =  [
    "Content is not relevant to my role",
    "Course is too difficult / too easy",
    "Not enough time to complete",
    "Poor content quality",
    "Enrolled by mistake",
  ]
  feedbackForm: any

  constructor(
    public dialogRef: MatDialogRef<UnenrollConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
  ) {
  }

  ngOnInit() {
    this.feedbackReasons = this.data?.tocConfig?.unEnrollContent?.feedbackReasons || this.feedbackReasons
    this.feedbackForm = new FormGroup({
      reasons: new FormArray(this.feedbackReasons.map(() => new FormControl(false))),
      comments: new FormControl(''),
    })

    // Subscribe to form changes to update hasSelectedReason
    this.feedbackForm.get('reasons')?.valueChanges.subscribe((values: boolean[]) => {
      this.hasSelectedReason = values.some(Boolean)
    })
  }

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
    return (this.feedbackForm?.get('reasons') as FormArray)?.value?.some(Boolean)
  }

  onConfirmUnenroll(): void {
    if (this.hasSelectedReason) {
      this.raiseTelemetryEvent()
      const selectedReasonFlags = (this.feedbackForm?.get('reasons') as FormArray).value
      const selectedReasons = this.feedbackReasons.filter((_, index) => selectedReasonFlags[index])
      const feedbackPayload = {
        reasons: selectedReasons,
        comments: this.feedbackForm.get('comments')?.value || '',
      }
      this.dialogRef.close(feedbackPayload)
    }
  }

  raiseTelemetryEvent(): void {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: 'unenroll',
        subType: 'unenroll'
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
