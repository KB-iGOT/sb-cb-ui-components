import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EMPTY, Observable, Subscription, timer } from 'rxjs'
import { catchError, exhaustMap, filter, map, switchMap, take, tap, throwIfEmpty } from 'rxjs/operators'
import { AssessmentService } from '../../service/assessment.service'

export interface IAiQuestionsProgressData {
  /** The multipart body for the AI service's generate call. */
  formData: FormData
}

/** How often the job's status is checked. */
const STATUS_POLL_INTERVAL = 15 * 1000
/** How long to wait for the job before giving up. The dialog cannot be closed, so a stuck job must not hold it open. */
const MAX_WAIT = 15 * 60 * 1000
/** Checks that fail in a row before giving up, so one dropped request does not end a long wait. */
const MAX_STATUS_FAILURES = 3
const STATUS_COMPLETED = 'COMPLETED'
const FAILED_STATUSES = ['FAILED', 'ERROR', 'CANCELLED']
const DEFAULT_ERROR = 'The questions could not be generated. Try again.'
const TIMED_OUT_ERROR = 'Generating the questions is taking longer than expected. Try again in a few minutes.'

/**
 * Starts the generation job and waits for it, closing with the completed status response.
 * Closes with nothing when the job fails or takes too long.
 */
@Component({
  selector: 'sb-uic-ai-questions-progress',
  templateUrl: './ai-questions-progress.component.html',
  styleUrls: ['./ai-questions-progress.component.scss'],
  standalone: false
})
export class AiQuestionsProgressComponent implements OnInit, OnDestroy {
  private subscription?: Subscription

  constructor(
    private dialogRef: MatDialogRef<AiQuestionsProgressComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IAiQuestionsProgressData,
    private assessmentService: AssessmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subscription = this.assessmentService.generateAiQuestions(this.data.formData).pipe(
      switchMap(started => {
        if (!started?.job_id) {
          throw new Error(DEFAULT_ERROR)
        }
        return this.waitForJob(started.job_id)
      }),
    ).subscribe({
      next: response => this.dialogRef.close(response),
      error: error => {
        this.snackBar.open(error?.error?.message || error?.message || DEFAULT_ERROR)
        this.dialogRef.close()
      },
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  /** Checks the job every 15 seconds until it completes, erroring if it fails, the checks keep failing, or time runs out. */
  private waitForJob(jobId: string): Observable<any> {
    let failures = 0
    return timer(STATUS_POLL_INTERVAL, STATUS_POLL_INTERVAL).pipe(
      take(MAX_WAIT / STATUS_POLL_INTERVAL),
      // A check still waiting on a slow response is not doubled up by the next tick
      exhaustMap(() => this.assessmentService.getAiQuestionsStatus(jobId).pipe(
        tap(() => failures = 0),
        catchError(error => {
          if (++failures < MAX_STATUS_FAILURES) {
            return EMPTY
          }
          throw error
        }),
      )),
      filter(response => this.statusOf(response) === STATUS_COMPLETED
        || FAILED_STATUSES.includes(this.statusOf(response))),
      take(1),
      throwIfEmpty(() => new Error(TIMED_OUT_ERROR)),
      map(response => {
        if (this.statusOf(response) !== STATUS_COMPLETED) {
          throw response
        }
        return response
      }),
    )
  }

  private statusOf(response: any): string {
    return String(response?.status || '').toUpperCase()
  }
}
