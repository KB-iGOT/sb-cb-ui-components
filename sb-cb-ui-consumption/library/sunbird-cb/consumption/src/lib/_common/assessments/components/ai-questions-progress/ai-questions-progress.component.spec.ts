import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { of, Subject, throwError } from 'rxjs'

import { AiQuestionsProgressComponent } from './ai-questions-progress.component'
import { AssessmentService } from '../../service/assessment.service'

describe('AiQuestionsProgressComponent', () => {
  const POLL = 15 * 1000
  const MAX_WAIT = 15 * 60 * 1000
  const started = { message: 'Generation started (Queued)', status: 'PENDING', job_id: 'job_1' }
  let component: AiQuestionsProgressComponent
  let dialogRef: { close: jest.Mock }
  let snackBar: { open: jest.Mock }
  let assessmentService: { generateAiQuestions: jest.Mock, getAiQuestionsStatus: jest.Mock }
  const formData = new FormData()

  /** Each status check answers with the next of these, repeating the last. */
  function statusesInTurn(...responses: any[]): void {
    let call = 0
    assessmentService.getAiQuestionsStatus.mockImplementation(() => {
      const response = responses[Math.min(call++, responses.length - 1)]
      return response instanceof Error ? throwError(response) : of(response)
    })
  }

  beforeEach(() => {
    jest.useFakeTimers()
    dialogRef = { close: jest.fn() }
    snackBar = { open: jest.fn() }
    assessmentService = {
      generateAiQuestions: jest.fn(() => of(started)),
      getAiQuestionsStatus: jest.fn(),
    }
    component = new AiQuestionsProgressComponent(
      dialogRef as unknown as MatDialogRef<AiQuestionsProgressComponent>,
      { formData },
      assessmentService as unknown as AssessmentService,
      snackBar as unknown as MatSnackBar
    )
  })

  afterEach(() => {
    component.ngOnDestroy()
    jest.useRealTimers()
  })

  it('starts the job with the form it was given', () => {
    statusesInTurn({ status: 'IN_PROGRESS' })
    component.ngOnInit()
    expect(assessmentService.generateAiQuestions).toHaveBeenCalledWith(formData)
  })

  it('checks the job every 15 seconds until it completes, then closes with the status response', () => {
    const done = { status: 'COMPLETED', job_id: 'job_1' }
    statusesInTurn({ status: 'IN_PROGRESS' }, { status: 'IN_PROGRESS' }, done)
    component.ngOnInit()

    jest.advanceTimersByTime(POLL - 1)
    expect(assessmentService.getAiQuestionsStatus).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(assessmentService.getAiQuestionsStatus).toHaveBeenCalledWith('job_1')
    expect(dialogRef.close).not.toHaveBeenCalled()

    jest.advanceTimersByTime(POLL * 2)
    expect(assessmentService.getAiQuestionsStatus).toHaveBeenCalledTimes(3)
    expect(dialogRef.close).toHaveBeenCalledWith(done)

    jest.advanceTimersByTime(POLL * 3)
    expect(assessmentService.getAiQuestionsStatus).toHaveBeenCalledTimes(3)
  })

  it('closes with nothing and says why when the job fails', () => {
    statusesInTurn({ status: 'FAILED', message: 'No content found for the course.' })
    component.ngOnInit()
    jest.advanceTimersByTime(POLL)

    expect(snackBar.open).toHaveBeenCalledWith('No content found for the course.')
    expect(dialogRef.close).toHaveBeenCalledWith()
  })

  it('keeps waiting through a dropped status check', () => {
    statusesInTurn(new Error('offline'), { status: 'COMPLETED' })
    component.ngOnInit()
    jest.advanceTimersByTime(POLL * 2)

    expect(snackBar.open).not.toHaveBeenCalled()
    expect(dialogRef.close).toHaveBeenCalledWith({ status: 'COMPLETED' })
  })

  it('gives up after three status checks fail in a row', () => {
    assessmentService.getAiQuestionsStatus.mockImplementation(() => throwError({ error: { message: 'Bad gateway' } }))
    component.ngOnInit()

    jest.advanceTimersByTime(POLL * 2)
    expect(dialogRef.close).not.toHaveBeenCalled()

    jest.advanceTimersByTime(POLL)
    expect(snackBar.open).toHaveBeenCalledWith('Bad gateway')
    expect(dialogRef.close).toHaveBeenCalledWith()
  })

  it('closes with nothing when the job cannot be started', () => {
    assessmentService.generateAiQuestions.mockReturnValue(throwError({ error: { message: 'Course not found' } }))
    component.ngOnInit()

    expect(snackBar.open).toHaveBeenCalledWith('Course not found')
    expect(dialogRef.close).toHaveBeenCalledWith()
  })

  it('treats a start response without a job id as a failure', () => {
    assessmentService.generateAiQuestions.mockReturnValue(of({ message: 'Generation started (Queued)' }))
    component.ngOnInit()

    expect(snackBar.open).toHaveBeenCalledWith('The questions could not be generated. Try again.')
    expect(dialogRef.close).toHaveBeenCalledWith()
  })

  it('gives up after 15 minutes without the job finishing', () => {
    statusesInTurn({ status: 'IN_PROGRESS' })
    component.ngOnInit()

    jest.advanceTimersByTime(MAX_WAIT - 1)
    expect(dialogRef.close).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(assessmentService.getAiQuestionsStatus).toHaveBeenCalledTimes(MAX_WAIT / POLL)
    expect(snackBar.open).toHaveBeenCalledWith(
      'Generating the questions is taking longer than expected. Try again in a few minutes.')
    expect(dialogRef.close).toHaveBeenCalledWith()

    jest.advanceTimersByTime(POLL * 3)
    expect(assessmentService.getAiQuestionsStatus).toHaveBeenCalledTimes(MAX_WAIT / POLL)
  })

  it('stops checking once the dialog is destroyed', () => {
    const status = new Subject<any>()
    assessmentService.getAiQuestionsStatus.mockReturnValue(status)
    component.ngOnInit()
    jest.advanceTimersByTime(POLL)

    component.ngOnDestroy()
    status.next({ status: 'COMPLETED' })
    jest.advanceTimersByTime(POLL * 3)

    expect(dialogRef.close).not.toHaveBeenCalled()
    expect(assessmentService.getAiQuestionsStatus).toHaveBeenCalledTimes(1)
  })
})
