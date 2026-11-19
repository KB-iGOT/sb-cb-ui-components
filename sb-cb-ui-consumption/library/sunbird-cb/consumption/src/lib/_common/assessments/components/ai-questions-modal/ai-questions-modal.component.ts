import { Component, Inject } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as XLSX from 'xlsx'
import { AssessmentService } from '../../service/assessment.service'
import { NsAssessment } from '../../service/assessment.model'
import {
  AiQuestionsProgressComponent, IAiQuestionsProgressData
} from '../ai-questions-progress/ai-questions-progress.component'

/** A course linked in Basic Details. The AI drafts the questions from its content. */
export interface IAiQuestionsCourse {
  identifier: string
  name: string
  language?: string
  provider?: string
  /** Transcripts and documents the course already holds. Left out when the host does not know. */
  contextDocuments?: string[]
}

/** How the host turns on AI question generation, and which content the questions are drafted from. */
export interface IAiQuestionsGenConfig {
  enable: boolean
  /** The reference content (courses) the AI drafts the questions from. */
  refContent: IAiQuestionsCourse[]
}

export interface IAiQuestionsModalData {
  /** "What is the number of questions you will be adding?", or null when the assessment type sets no limit. */
  plannedCount: number | null
  existingCount: number
  courses: IAiQuestionsCourse[]
  /** The duration from Assessment Settings, in seconds. */
  expectedDuration?: number
  isBasicAssessment?: boolean
  isOptionWeightage?: boolean
}

export interface IAiQuestionsRequest {
  courses: IAiQuestionsCourse[]
  language: string
  notes: string
  questionTypes: Array<{ qType: string, count: number }>
  level: string
  expectedDuration: number | null
  /** Percentage per Bloom's level, or null when the distribution is switched off. */
  bloomsDistribution: Record<string, number> | null
  transcripts: File[]
  documents: File[]
  referenceSheet: File | null
}

/** What the modal closes with once the AI service has generated the questions. */
export interface IAiQuestionsResult {
  request: IAiQuestionsRequest
  /** The status response for the job once it reports COMPLETED. */
  response: any
}

interface IQuestionTypeRow {
  qType: string
  label: string
  /** Share of the questions this type takes when the split is first made. */
  weight: number
  enabled: boolean
  count: number
}

interface IReferenceSheet {
  file: File
  total: number
  fromAI: number
  manual: number
}

type UploadKind = 'transcripts' | 'documents' | 'reference'

const LANGUAGES = ['Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Malayalam', 'Marathi', 'Punjabi', 'Tamil',
  'Telugu']
const ASSESSMENT_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const BLOOM_LEVELS = [
  { key: 'remember', label: 'Remember', description: 'Recall facts' },
  { key: 'understand', label: 'Understand', description: 'Explain concepts' },
  { key: 'apply', label: 'Apply', description: 'Use in new situations' },
  { key: 'analyze', label: 'Analyze', description: 'Draw connections' },
  { key: 'evaluate', label: 'Evaluate', description: 'Justify decisions' },
  { key: 'create', label: 'Create', description: 'Produce new work' }
]
/** The Bloom's mix each assessment level starts from. */
const LEVEL_MIX: Record<string, Record<string, number>> = {
  Beginner: { remember: 30, understand: 30, apply: 20, analyze: 10, evaluate: 5, create: 5 },
  Intermediate: { remember: 10, understand: 20, apply: 25, analyze: 20, evaluate: 15, create: 10 },
  Advanced: { remember: 5, understand: 10, apply: 20, analyze: 25, evaluate: 20, create: 20 }
}
const BLOOM_STEP = 5
const NOTES_MAX_LENGTH = 1000
const MAX_TRANSCRIPTS = 10
const MAX_DOCUMENTS = 3
const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024
/** Where the split starts when the assessment type sets no number of questions to reach. */
const UNCAPPED_DEFAULT_TOTAL = 10
/** The most questions one AI request generates. */
const MAX_QUESTIONS_PER_RUN = 200
/** The key the AI service expects in question_type_counts for each question type. */
const AI_QUESTION_TYPE_KEYS: Record<string, string> = {
  'MCQ-SCA': 'mcq',
  'MCQ-MCA': 'multichoice',
  'FTB': 'ftb',
  'MTF': 'mtf',
  'MCQ-SCA-TF': 'true_false',
  'MCQ-MCA-W': 'mcq_weightage',
}

@Component({
  selector: 'sb-uic-ai-questions-modal',
  templateUrl: './ai-questions-modal.component.html',
  styleUrls: ['./ai-questions-modal.component.scss'],
  standalone: false
})
export class AiQuestionsModalComponent {
  readonly languages = LANGUAGES
  readonly levels = ASSESSMENT_LEVELS
  readonly bloomLevels = BLOOM_LEVELS
  readonly bloomStep = BLOOM_STEP
  readonly notesMaxLength = NOTES_MAX_LENGTH
  readonly maxTranscripts = MAX_TRANSCRIPTS
  readonly maxDocuments = MAX_DOCUMENTS

  language = 'English'
  notes = ''
  level = 'Intermediate'
  bloomOn = true
  bloom: Record<string, number> = { ...LEVEL_MIX['Intermediate'] }
  questionTypes: IQuestionTypeRow[]
  transcripts: File[] = []
  documents: File[] = []
  referenceSheet: IReferenceSheet | null = null
  dragTarget: UploadKind | null = null
  generating = false

  constructor(
    public dialogRef: MatDialogRef<AiQuestionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAiQuestionsModalData,
    private snackBar: MatSnackBar,
    private assessmentService: AssessmentService,
    private dialog: MatDialog
  ) {
    this.questionTypes = this.getQuestionTypes()
    this.splitAcrossTypes()
  }

  /** The questions still needed to reach the planned count, or null when nothing caps them. */
  get questionsNeeded(): number | null {
    if (this.data.plannedCount === null) {
      return null
    }
    return Math.max(this.data.plannedCount - this.data.existingCount, 0)
  }

  /** The most this run can generate: what is still needed, and never more than one request allows. */
  get maxQuestions(): number {
    const needed = this.questionsNeeded
    return needed === null ? MAX_QUESTIONS_PER_RUN : Math.min(needed, MAX_QUESTIONS_PER_RUN)
  }

  /** True when the per-run limit, not the planned count, is what caps this run. */
  get isCappedPerRun(): boolean {
    const needed = this.questionsNeeded
    return needed === null || needed > MAX_QUESTIONS_PER_RUN
  }

  get subtitle(): string {
    const needed = this.questionsNeeded
    if (needed === null) {
      return `Fill in the details below to generate up to ${MAX_QUESTIONS_PER_RUN} questions for this section with AI.`
    }
    if (needed > MAX_QUESTIONS_PER_RUN) {
      return `Fill in the details below. ${needed} questions are still needed to reach ${this.data.plannedCount} as `
        + `set in Add Questions. AI can generate up to ${MAX_QUESTIONS_PER_RUN} at a time, so generate the rest in `
        + 'another run.'
    }
    return `Fill in the details below. AI can generate up to ${needed} questions, the number still needed to reach `
      + `${this.data.plannedCount} as set in Add Questions.`
  }

  /** Comparing against the bank only helps once it holds questions to repeat. */
  get showReferenceSheet(): boolean {
    return this.data.existingCount > 0
  }

  get durationMinutes(): number | null {
    return this.data.expectedDuration ? Math.round(this.data.expectedDuration / 60) : null
  }

  get typesTotal(): number {
    return this.questionTypes
      .filter(type => type.enabled)
      .reduce((sum, type) => sum + this.countOf(type), 0)
  }

  /** Any total from one up to the run's limit can be generated. */
  get isTypesTotalValid(): boolean {
    return this.typesTotal > 0 && this.typesTotal <= this.maxQuestions
  }

  get typesBadge(): string {
    return `${this.typesTotal} / ${this.maxQuestions} max`
  }

  get typesHint(): string {
    return this.isCappedPerRun
      ? `Choose how many of each type to generate, up to ${this.maxQuestions} in total, the most AI can generate `
        + 'at a time.'
      : `Choose how many of each type to generate, up to ${this.maxQuestions} in total, the number still needed.`
  }

  get bloomTotal(): number {
    return this.bloomLevels.reduce((sum, level) => sum + this.bloom[level.key], 0)
  }

  /** The first thing standing in the way of generating, shown beside the button. */
  get errorMessage(): string {
    const needed = this.questionsNeeded
    if (!this.data.courses?.length) {
      return 'Link at least one course in Basic Details.'
    }
    if (needed === 0) {
      return `The bank already has ${this.data.existingCount} questions, which meets the ${this.data.plannedCount} set `
        + 'in Add Questions. Increase that number to generate more.'
    }
    if (!this.typesTotal) {
      return 'Choose how many questions of each type to generate.'
    }
    if (this.typesTotal > this.maxQuestions) {
      return this.isCappedPerRun
        ? `Question types add up to ${this.typesTotal}. AI can generate at most ${MAX_QUESTIONS_PER_RUN} at a time.`
        : `Question types add up to ${this.typesTotal}. Only ${needed} more are needed to reach `
          + `${this.data.plannedCount}.`
    }
    if (this.bloomOn && this.bloomTotal !== 100) {
      return `Bloom's distribution adds up to ${this.bloomTotal}%. Make it 100%.`
    }
    return ''
  }

  /** The same types the manual question picker offers for this assessment type. */
  private getQuestionTypes(): IQuestionTypeRow[] {
    if (this.data.isOptionWeightage) {
      return [{ qType: 'MCQ-MCA-W', label: 'Weightage single choice', weight: 1, enabled: true, count: 0 }]
    }
    const types: IQuestionTypeRow[] = [
      { qType: 'MCQ-SCA', label: 'Single selection MCQs', weight: 50, enabled: true, count: 0 },
      { qType: 'MCQ-MCA', label: 'Multiple selection MCQs', weight: 20, enabled: true, count: 0 },
      { qType: 'FTB', label: 'Fill in the blanks', weight: 25, enabled: true, count: 0 },
      { qType: 'MTF', label: 'Match the following', weight: 15, enabled: true, count: 0 }
    ]
    if (!this.data.isBasicAssessment) {
      types.push({ qType: 'MCQ-SCA-TF', label: 'True/False', weight: 15, enabled: true, count: 0 })
    }
    return types
  }

  /** Spreads the run's limit across the enabled types in proportion to their weights. */
  private splitAcrossTypes(): void {
    const target = this.questionsNeeded === null ? UNCAPPED_DEFAULT_TOTAL : this.maxQuestions
    const enabled = this.questionTypes.filter(type => type.enabled)
    const weightTotal = enabled.reduce((sum, type) => sum + type.weight, 0)
    let assigned = 0
    enabled.forEach(type => {
      type.count = Math.floor(target * type.weight / weightTotal)
      assigned += type.count
    })
    // Rounding down leaves fewer than one per type over; the heaviest types take it
    const byWeight = [...enabled].sort((a, b) => b.weight - a.weight)
    byWeight.slice(0, target - assigned).forEach(type => type.count++)
  }

  countOf(type: IQuestionTypeRow): number {
    return Math.max(0, Math.floor(Number(type.count) || 0))
  }

  /** Switching a type on with no count gives it whatever is left of the run's limit, never pushing the total past it. */
  onTypeToggle(type: IQuestionTypeRow, enabled: boolean): void {
    type.enabled = enabled
    if (enabled && !this.countOf(type) && this.questionsNeeded !== null) {
      type.count = Math.max(this.maxQuestions - this.typesTotal, 0)
    }
  }

  selectLevel(level: string): void {
    this.level = level
    this.bloom = { ...LEVEL_MIX[level] }
  }

  changeBloom(key: string, delta: number): void {
    if (delta > 0 && this.bloomTotal >= 100) {
      this.snackBar.open('The total is already 100%. Lower another level first.')
      return
    }
    this.bloom[key] = Math.min(100, Math.max(0, this.bloom[key] + delta))
  }

  bloomShare(key: string): number {
    return this.bloom[key] / (this.bloomTotal || 1) * 100
  }

  onFilesPicked(event: Event, kind: UploadKind): void {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      this.handleFiles(Array.from(input.files), kind)
    }
    // Cleared so picking the same file again still fires a change
    input.value = ''
  }

  onDragOver(event: DragEvent, kind: UploadKind): void {
    event.preventDefault()
    this.dragTarget = kind
  }

  onDrop(event: DragEvent, kind: UploadKind): void {
    event.preventDefault()
    this.dragTarget = null
    const files = Array.from(event.dataTransfer?.files || [])
    if (files.length) {
      this.handleFiles(files, kind)
    }
  }

  removeFile(kind: 'transcripts' | 'documents', index: number): void {
    this[kind].splice(index, 1)
  }

  formatSize(bytes: number): string {
    return bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  private handleFiles(files: File[], kind: UploadKind): void {
    if (kind === 'reference') {
      this.loadReferenceSheet(files[0])
    } else {
      this.addFiles(files, kind)
    }
  }

  private addFiles(files: File[], kind: 'transcripts' | 'documents'): void {
    const isTranscript = kind === 'transcripts'
    const list = this[kind]
    const max = isTranscript ? MAX_TRANSCRIPTS : MAX_DOCUMENTS
    const errors: string[] = []

    files.forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || ''
      if (isTranscript && !['vtt', 'txt'].includes(extension)) {
        errors.push(`${file.name} is not a VTT or TXT file.`)
      } else if (!isTranscript && extension !== 'pdf') {
        errors.push(`${file.name} is not a PDF.`)
      } else if (!isTranscript && file.size > MAX_DOCUMENT_SIZE) {
        errors.push(`${file.name} is larger than 25 MB.`)
      } else if (list.some(added => added.name === file.name && added.size === file.size)) {
        // Already added
      } else if (list.length >= max) {
        errors.push(`Only ${max} ${isTranscript ? 'transcripts' : 'documents'} can be added.`)
      } else {
        list.push(file)
      }
    })

    if (errors.length) {
      this.snackBar.open(Array.from(new Set(errors)).join(' '))
    }
  }

  /** Reads the sheet only to confirm it has questions and to summarise them; the file itself goes to the AI. */
  private async loadReferenceSheet(file: File): Promise<void> {
    try {
      const workbook = XLSX.read(new Uint8Array(await file.arrayBuffer()), { type: 'array' })
      for (const sheetName of workbook.SheetNames) {
        const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' })
        const columns = rows.length ? Object.keys(rows[0]) : []
        const questionColumn = this.findQuestionColumn(columns)
        if (!questionColumn) {
          continue
        }

        const questionRows = rows.filter(row => String(row[questionColumn]).trim())
        if (!questionRows.length) {
          this.snackBar.open('The sheet has no questions in the Question column.')
          return
        }
        const sourceColumn = columns.find(column => column.toLowerCase().includes('source'))
        const fromAI = questionRows.filter(row => /^ai/i.test(String(sourceColumn ? row[sourceColumn] : '').trim())).length
        this.referenceSheet = { file, total: questionRows.length, fromAI, manual: questionRows.length - fromAI }
        this.snackBar.open(`Reference sheet loaded: ${questionRows.length} questions.`)
        return
      }
      this.snackBar.open('No "Question" column found. Add a column named Question and upload the sheet again.')
    } catch {
      this.snackBar.open('This file could not be read. Upload an .xlsx, .xls or .csv file.')
    }
  }

  private findQuestionColumn(columns: string[]): string | undefined {
    const labelled = columns.map(column => ({ column, label: column.trim().toLowerCase() }))
    const match = labelled.find(({ label }) => /^question( text)?$/.test(label))
      || labelled.find(({ label }) => label.includes('question') && !/type|no\b|number|#|s\.no/.test(label))
    return match?.column
  }

  /**
   * Hands the request to the progress dialog, which starts the job and waits for it. This modal stays open
   * underneath, so if the job fails or times out, nothing entered is lost.
   */
  generate(): void {
    if (this.errorMessage || this.generating) {
      return
    }
    const request = this.buildRequest()
    const data: IAiQuestionsProgressData = { formData: this.buildFormData(request) }
    this.generating = true
    this.dialog.open(AiQuestionsProgressComponent, {
      width: '400px',
      maxWidth: '95vw',
      panelClass: 'ai-questions-progress-panel',
      data,
      disableClose: true,
      autoFocus: false
    }).afterClosed().subscribe(response => {
      this.generating = false
      if (response) {
        const result: IAiQuestionsResult = { request, response }
        this.dialogRef.close(result)
      }
    })
  }

  private buildRequest(): IAiQuestionsRequest {
    return {
      courses: this.data.courses,
      language: this.language,
      notes: this.notes.trim(),
      questionTypes: this.questionTypes
        .filter(type => type.enabled && this.countOf(type) > 0)
        .map(type => ({ qType: type.qType, count: this.countOf(type) })),
      level: this.level,
      expectedDuration: this.data.expectedDuration || null,
      bloomsDistribution: this.bloomOn ? { ...this.bloom } : null,
      transcripts: [...this.transcripts],
      documents: [...this.documents],
      referenceSheet: this.referenceSheet?.file || null
    }
  }

  /** The multipart body the AI service takes. */
  private buildFormData(request: IAiQuestionsRequest): FormData {
    const formData = new FormData()
    const questionTypeCounts: Record<string, number> = {}
    request.questionTypes.forEach(type => {
      questionTypeCounts[AI_QUESTION_TYPE_KEYS[type.qType] || type.qType] = type.count
    })
    const totalQuestions = request.questionTypes.reduce((sum, type) => sum + type.count, 0)
    const isPractice = this.assessmentService.getPrimaryCategory()
      === NsAssessment.EAssessmentPrimaryCategory.PRACTICE_QUESTION_SET

    formData.append('question_type_counts', JSON.stringify(questionTypeCounts))
    formData.append('course_ids', request.courses.map(course => course.identifier).join(','))
    formData.append('course_names', request.courses
      .map(course => course.language ? `${course.name} (${course.language})` : course.name)
      .join(','))
    // Always a new job: an earlier result for the same courses would ignore the counts and types asked for now
    formData.append('force', 'true')
    formData.append('assessment_type', isPractice ? 'practice' : 'final')
    formData.append('difficulty', request.level.toLowerCase())
    formData.append('total_questions', String(totalQuestions))
    if (request.expectedDuration) {
      formData.append('time_limit', String(Math.round(request.expectedDuration / 60)))
    }
    if (request.bloomsDistribution) {
      formData.append('blooms_config', JSON.stringify(request.bloomsDistribution))
    }
    formData.append('language', request.language.toLowerCase())
    if (request.notes) {
      formData.append('additional_instructions', request.notes)
    }
    const files = [...request.transcripts, ...request.documents, request.referenceSheet]
    files.forEach(file => {
      if (file) {
        formData.append('files', file, file.name)
      }
    })
    return formData
  }
}
