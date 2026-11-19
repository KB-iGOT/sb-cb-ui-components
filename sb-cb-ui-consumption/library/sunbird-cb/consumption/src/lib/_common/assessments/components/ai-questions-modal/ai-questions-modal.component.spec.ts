import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { of } from 'rxjs'

import { AiQuestionsModalComponent, IAiQuestionsModalData } from './ai-questions-modal.component'
import { AiQuestionsProgressComponent } from '../ai-questions-progress/ai-questions-progress.component'
import { AssessmentService } from '../../service/assessment.service'

describe('AiQuestionsModalComponent', () => {
  let component: AiQuestionsModalComponent
  let fixture: ComponentFixture<AiQuestionsModalComponent>
  const completed = { status: 'COMPLETED', job_id: 'job_1' }
  /** What the progress dialog closes with: the completed status, or nothing when the job fails or times out. */
  let progressResult: any
  const dialogRef: any = { close: jest.fn() }
  const dialog = { open: jest.fn((_component: any, _config: any) => ({ afterClosed: () => of(progressResult) })) }
  const assessmentService = {
    getPrimaryCategory: jest.fn(() => 'Practice Question Set'),
  }
  const data: IAiQuestionsModalData = {
    plannedCount: 20,
    existingCount: 5,
    courses: [{ identifier: 'do_1', name: 'Cervical Cancer Screening', language: 'English' }],
    expectedDuration: 1800,
    isBasicAssessment: true
  }

  /** Built directly so a test can open the modal with different data. */
  function createWith(overrides: Partial<IAiQuestionsModalData>): AiQuestionsModalComponent {
    return new AiQuestionsModalComponent(dialogRef, { ...data, ...overrides }, { open: jest.fn() } as any,
      assessmentService as any, dialog as any)
  }

  /** The multipart body handed to the progress dialog by the last generate. */
  function sentFormData(): FormData {
    return dialog.open.mock.calls[0][1].data.formData
  }

  beforeEach(() => {
    jest.clearAllMocks()
    progressResult = completed
    TestBed.configureTestingModule({
      declarations: [AiQuestionsModalComponent],
      imports: [NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: AssessmentService, useValue: assessmentService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(AiQuestionsModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('splits the questions still needed across the basic assessment types', () => {
    expect(component.questionsNeeded).toBe(15)
    expect(component.maxQuestions).toBe(15)
    expect(component.questionTypes.map(type => type.qType)).toEqual(['MCQ-SCA', 'MCQ-MCA', 'FTB', 'MTF'])
    expect(component.typesTotal).toBe(15)
    expect(component.errorMessage).toBe('')
  })

  it('allows generating fewer questions than are still needed', () => {
    component.questionTypes[0].count = 0
    expect(component.typesTotal).toBe(8)
    expect(component.isTypesTotalValid).toBe(true)
    expect(component.errorMessage).toBe('')
  })

  it('blocks generating more questions than are still needed', () => {
    component.questionTypes[0].count += 1
    expect(component.errorMessage).toBe('Question types add up to 16. Only 15 more are needed to reach 20.')
  })

  it('blocks generating when no type has a count', () => {
    component.questionTypes.forEach(type => type.count = 0)
    expect(component.errorMessage).toBe('Choose how many questions of each type to generate.')
  })

  it('limits one run to 200 questions when more are still needed', () => {
    const modal = createWith({ plannedCount: 500, existingCount: 1 })
    expect(modal.questionsNeeded).toBe(499)
    expect(modal.maxQuestions).toBe(200)
    expect(modal.typesTotal).toBe(200)
    expect(modal.errorMessage).toBe('')

    modal.questionTypes[0].count += 1
    expect(modal.errorMessage).toBe('Question types add up to 201. AI can generate at most 200 at a time.')

    modal.questionTypes.forEach(type => type.count = 0)
    modal.questionTypes[0].count = 10
    expect(modal.errorMessage).toBe('')
  })

  it('limits one run to 200 questions when the assessment type sets no count', () => {
    const modal = createWith({ plannedCount: null })
    expect(modal.maxQuestions).toBe(200)
    expect(modal.typesTotal).toBe(10)

    modal.questionTypes[0].count = 250
    expect(modal.errorMessage).toContain('at most 200')
  })

  it('tops a type switched back on up to the run limit', () => {
    const modal = createWith({ plannedCount: 500, existingCount: 0 })
    const mtf = modal.questionTypes[3]
    mtf.count = 0
    modal.onTypeToggle(mtf, false)
    modal.onTypeToggle(mtf, true)
    expect(modal.typesTotal).toBe(200)
  })

  it('opens the progress dialog with the multipart form the AI service takes', () => {
    component.notes = 'Focus on screening age'
    component.generate()

    expect(dialog.open).toHaveBeenCalledWith(AiQuestionsProgressComponent, expect.objectContaining({
      disableClose: true,
    }))
    const formData = sentFormData()
    expect(JSON.parse(formData.get('question_type_counts') as string))
      .toEqual({ mcq: 7, multichoice: 2, ftb: 4, mtf: 2 })
    expect(formData.get('course_ids')).toBe('do_1')
    expect(formData.get('course_names')).toBe('Cervical Cancer Screening (English)')
    expect(formData.get('force')).toBe('true')
    expect(formData.get('assessment_type')).toBe('practice')
    expect(formData.get('difficulty')).toBe('intermediate')
    expect(formData.get('total_questions')).toBe('15')
    expect(formData.get('time_limit')).toBe('30')
    expect(JSON.parse(formData.get('blooms_config') as string))
      .toEqual({ remember: 10, understand: 20, apply: 25, analyze: 20, evaluate: 15, create: 10 })
    expect(formData.get('language')).toBe('english')
    expect(formData.get('additional_instructions')).toBe('Focus on screening age')
    expect(formData.getAll('files')).toEqual([])
  })

  it('leaves out blooms_config when the distribution is switched off', () => {
    component.bloomOn = false
    component.generate()

    expect(sentFormData().has('blooms_config')).toBe(false)
    expect(dialogRef.close).toHaveBeenCalledWith(expect.objectContaining({
      request: expect.objectContaining({ bloomsDistribution: null }),
    }))
  })

  it('sends every uploaded file under files', () => {
    const transcript = new File(['WEBVTT'], 'module.vtt')
    const pdf = new File(['%PDF'], 'guide.pdf')
    component.transcripts = [transcript]
    component.documents = [pdf]
    component.generate()

    expect((sentFormData().getAll('files') as File[]).map(file => file.name)).toEqual(['module.vtt', 'guide.pdf'])
  })

  it('closes with the request and the completed status response', () => {
    component.generate()
    expect(dialogRef.close).toHaveBeenCalledWith({
      request: expect.objectContaining({ language: 'English', level: 'Intermediate', expectedDuration: 1800 }),
      response: completed,
    })
  })

  it('stays open and can be retried when the job fails or times out', () => {
    progressResult = undefined
    component.generate()
    expect(dialogRef.close).not.toHaveBeenCalled()
    expect(component.generating).toBe(false)
  })
})
