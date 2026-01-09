import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { MultipleChoiceQuestionComponent } from '../multiple-choice-question/multiple-choice-question.component'
import { MatchTheFollowingComponent } from '../match-the-following/match-the-following.component'
import { AssessmentService } from '../../service/assessment.service'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ConfirmationDialogComponent } from '../../../dialog-components/confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'sb-uic-assessment-question-list',
  templateUrl: './assessment-question-list.component.html',
  styleUrls: ['./assessment-question-list.component.scss']
})
export class AssessmentQuestionListComponent implements OnInit, OnChanges {
  @Input() questionData: any = { qType: '', identifier: '' }
  @Input() questionIndex: number = 0
  @Input() isExpanded: boolean = false
  @Input() sectionLevelDefinition: any = null
  @Input() assessmentData: any = null
  @Output() questionUpdated = new EventEmitter<any>()
  @Output() questionDeleted = new EventEmitter<any>()
  @Output() questionExpanded = new EventEmitter<number>()

  @ViewChild('mcqComponent') mcqComponent?: MultipleChoiceQuestionComponent
  @ViewChild('mtfComponent') mtfComponent?: MatchTheFollowingComponent

  difficultyLevels = [
    { name: 'Easy', value: 'easy' },
    { name: 'Medium', value: 'medium' },
    { name: 'Difficult', value: 'difficult' },
    { name: 'HOTS', value: 'hots' }
  ]
  selectedDifficultyLevel: string = 'easy'

  htmlTasRemovalRegex = /<\/?[^>]+>|&nbsp;|<br\s*\/?>|<\/br>|&#39;|&quot;/gi
  assessmentNoSpecialChar = new RegExp(/^[a-zA-Z0-9\u0900-\u097F._\-\s$":/?,।()\[\]'! ]+$/)
  isRegexPassed: boolean = true
  questionText: string = ''
  fitbCount: number = 0
  fitbConfig = {
    maxOptions: 10,
  }
  questionOptions: any[] = []

  constructor(
    public assessemntService: AssessmentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initializeQuestionData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionData'] && !changes['questionData'].firstChange) {
      this.initializeQuestionData()
    }
  }

  initializeQuestionData(): void {
    console.log('Initializing question data:', this.questionData)
    // For initial load, just use whatever data we have
    // Complete data will be fetched when question is expanded
    this.populateQuestionForm()
  }

  populateQuestionForm(): void {
    console.log('Populating form with question data:', this.questionData)

    // Populate existing question data if available
    if (this.questionData) {
      // Set question text
      if (this.questionData.body) {
        this.questionText = this.questionData.body
      } else if (this.questionData.name) {
        this.questionText = this.questionData.name
      }

      // Set difficulty level
      if (this.questionData.questionLevel) {
        this.selectedDifficultyLevel = this.questionData.questionLevel.toLowerCase()
      }

      // Set MCQ options if available - check multiple possible data structures
      if (this.isMCQQuestion()) {
        console.log('Question editorState:', this.questionData.editorState)
        console.log('Question choices:', this.questionData.choices)
        console.log('Question answer:', this.questionData.answer)

        if (this.questionData.editorState?.options && this.questionData.editorState.options.length > 0) {
          this.questionOptions = this.questionData.editorState.options.map((opt: any, index: number) => ({
            id: index + 1,
            text: opt.value?.body || opt.body || '',
            value: opt.value?.body || opt.body || '',
            isCorrect: false // Will be set based on answer field below
          }))

          // Set correct answers based on answer field at question level
          if (this.questionData.answer !== undefined && this.questionData.answer !== null) {
            const answerStr = String(this.questionData.answer)
            const answerIndices = answerStr.split(',').map((a: string) => parseInt(a.trim()))
            answerIndices.forEach((idx: number) => {
              if (this.questionOptions[idx]) {
                this.questionOptions[idx].isCorrect = true
              }
            })
          }

          console.log('Loaded options from editorState:', this.questionOptions)
        } else if (this.questionData.choices?.options && this.questionData.choices.options.length > 0) {
          // Try alternative structure from choices
          this.questionOptions = this.questionData.choices.options.map((opt: any, index: number) => ({
            id: index + 1,
            text: opt.value?.body || opt.body || '',
            value: opt.value?.body || opt.body || '',
            isCorrect: false // Will be set based on answer field
          }))

          // Set correct answers based on answer field
          if (this.questionData.answer !== undefined && this.questionData.answer !== null) {
            const answerStr = String(this.questionData.answer)
            const answerIndices = answerStr.split(',').map((a: string) => parseInt(a.trim()))
            answerIndices.forEach((idx: number) => {
              if (this.questionOptions[idx]) {
                this.questionOptions[idx].isCorrect = true
              }
            })
          }
          console.log('Loaded options from choices:', this.questionOptions)
        }
      }

      // Set MTF pairs if available
      if (this.isMTFQuestion()) {
        console.log('MTF Question editorState:', this.questionData.editorState)
        console.log('MTF Question choices:', this.questionData.choices)
        console.log('MTF Question rhsChoices:', this.questionData.rhsChoices)

        if (this.questionData.editorState?.options && this.questionData.editorState.options.length > 0) {
          // Load pairs from editorState where each option has question (value.body) and answer (answer field)
          this.questionOptions = this.questionData.editorState.options.map((opt: any, index: number) => ({
            id: index + 1,
            question: opt.value?.body || '',
            answer: opt.answer || ''
          }))
          console.log('Loaded MTF pairs from editorState:', this.questionOptions)
        } else if (this.questionData.choices?.options && this.questionData.rhsChoices) {
          // Alternative structure with choices.options (questions) and rhsChoices (answers)
          this.questionOptions = this.questionData.choices.options.map((opt: any, index: number) => ({
            id: index + 1,
            question: opt.value?.body || opt.body || '',
            answer: this.questionData.rhsChoices[index] || ''
          }))
          console.log('Loaded MTF pairs from choices/rhsChoices:', this.questionOptions)
        }
      }
    }
  }

  hasSectionLevelDefinition(): boolean {
    return this.sectionLevelDefinition && Object.keys(this.sectionLevelDefinition).length > 0
  }

  isMCQQuestion(): boolean {
    return this.questionData.qType && this.questionData.qType.includes('MCQ')
  }

  isMTFQuestion(): boolean {
    return this.questionData.qType === 'MTF'
  }

  isTrueFalseQuestion(): boolean {
    return this.questionData.qType === 'MCQ-SCA-TF'
  }

  isUpdateMode(): boolean {
    return this.questionData.identifier && this.questionData.identifier.startsWith('do_')
  }

  onOptionsUpdated(options: any[]): void {
    this.questionOptions = options
  }

  onAddOption(): void {
    if (this.mcqComponent) {
      this.mcqComponent.addOption()
    }
  }

  onAddPair(): void {
    if (this.mtfComponent) {
      this.mtfComponent.addPair()
    }
  }

  canAddMoreOptions(): boolean {
    if (this.mcqComponent) {
      return this.mcqComponent.canAddMoreOptions()
    }
    return true
  }

  canAddMorePairs(): boolean {
    if (this.mtfComponent) {
      return this.mtfComponent.canAddMorePairs()
    }
    return true
  }

  canSaveMTFQuestion(): boolean {
    if (!this.questionText || this.questionText.trim().length === 0) {
      return false
    }
    if (!this.questionOptions || this.questionOptions.length < 2) {
      return false
    }
    // Check that all pairs have both question and answer
    return this.questionOptions.every(pair =>
      pair.question && pair.question.trim().length > 0 &&
      pair.answer && pair.answer.trim().length > 0
    )
  }

  onDifficultyLevelChange(level: string): void {
    this.selectedDifficultyLevel = level
  }

  getSelectedLevelMarks(): number {
    if (!this.sectionLevelDefinition || !this.selectedDifficultyLevel) {
      return 0
    }
    const selectedLevelName = this.getSelectedLevelName()
    const levelData = this.sectionLevelDefinition[selectedLevelName]
    return levelData?.marksForQuestion || 0
  }

  getSelectedLevelName(): string {
    const level = this.difficultyLevels.find(l => l.value === this.selectedDifficultyLevel)
    return level?.name || ''
  }

  getQuestionTypeName(): string {
    switch (this.questionData.qType) {
      case 'MCQ-SCA':
        return 'Single Selection MCQ'
      case 'MCQ-MCA':
        return 'Multiple Selection MCQ'
      case 'FTB':
        return 'Fill in the Blanks'
      case 'MTF':
        return 'Match the Following'
      case 'MCQ-SCA-TF':
        return 'True and False'
      default:
        return 'Unknown Question Type'
    }
  }

  onEditQuestion(): void {
    this.questionExpanded.emit(this.questionIndex - 1)
  }

  onExpandQuestion(): void {
    this.questionExpanded.emit(this.questionIndex - 1)

    // If this is an existing question (has do_ identifier), fetch complete data on expand
    if (this.questionData.identifier && this.questionData.identifier.startsWith('do_')) {
      const reqBody = {
        request: {
          search: {
            identifier: [this.questionData.identifier]
          }
        }
      }

      this.assessemntService.getQuestionReadDetailsModeEdit(reqBody).subscribe({
        next: (response: any) => {
          if (response?.result?.questions && response.result.questions.length > 0) {
            const completeQuestionData = response.result.questions[0]
            console.log('Fetched complete question data on expand:', completeQuestionData)
            // Merge complete data with existing questionData
            this.questionData = { ...this.questionData, ...completeQuestionData }
            // Now populate the form with complete data
            this.populateQuestionForm()
          }
        },
        error: (error: any) => {
          console.error('Error fetching question details:', error)
        }
      })
    }
  }

  onDeleteQuestion(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        planeDescription: 'Are you sure you want to delete this question? This action cannot be undone.',
        iconName: 'delete',
        type: 'warning',
        buttonsPositionClass: 'justify-center items-center',
        buttons: [
          {
            text: 'Cancel',
            classes: 'btn-out-line',
            response: false
          },
          {
            text: 'Delete',
            classes: 'succes-button',
            response: true
          }
        ],
      },
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.questionDeleted.emit({
          questionData: this.questionData,
          questionIndex: this.questionIndex
        })
      }
    })
  }

  onQuestionUpdated(updatedData: any): void {
    this.questionExpanded.emit(-1) // Collapse after update
    this.questionUpdated.emit(updatedData)
  }

  onEditCancelled(): void {
    this.questionExpanded.emit(-1) // Collapse
  }

  getQuestionContent(event: any) {
    const plainText = (event || '').replace(this.htmlTasRemovalRegex, ' ').trim()
    if (!plainText) {
      this.isRegexPassed = true
      this.questionText = ''
    } else {
      const isValid = this.assessmentNoSpecialChar.test(plainText)
      this.isRegexPassed = isValid
      if (isValid) {
        this.questionText = event
      }
    }
    if (this.questionData.qType === 'FTB') {
      this.checkBlankIntext()
    }
  }

  checkBlankIntext() {
    this.fitbCount = this.questionText.split('input').length - 1
  }

  canSaveQuestion(): boolean {
    // Check if questionText is not empty
    if (!this.questionText || !this.questionText.trim()) {
      return false
    }

    // Check if difficulty level is selected when section level definition exists
    if (this.hasSectionLevelDefinition() && !this.selectedDifficultyLevel) {
      return false
    }

    // Check if MCQ options have values
    if (this.isMCQQuestion()) {
      if (!this.questionOptions || this.questionOptions.length === 0) {
        return false
      }

      // Check if ALL options have text (for non-True/False questions)
      if (!this.isTrueFalseQuestion()) {
        const allOptionsHaveText = this.questionOptions.every(opt => opt.text && opt.text.trim())
        if (!allOptionsHaveText) {
          return false
        }
      }

      // Check if at least one correct answer is selected
      const hasCorrectAnswer = this.questionOptions.some(opt => opt.isCorrect)
      if (!hasCorrectAnswer) {
        return false
      }
    }

    return true
  }

  saveQuestion(): void {
    if (!this.canSaveQuestion() && !this.canSaveMTFQuestion()) {
      return
    }

    const questionUUID = this.questionData.identifier || this.assessemntService.generateUUID()
    const isNewQuestion = !this.questionData.identifier || !this.questionData.identifier.startsWith('do_')

    let answer = ''
    let editorStateOptions: any[] = []
    let choicesOptions: any[] = []
    let rhsChoices: any[] = []

    if (this.isMCQQuestion()) {
      // Get the correct answer index/indices for MCQ
      if (this.questionData.qType === 'MCQ-SCA' || this.questionData.qType === 'MCQ-SCA-TF') {
        // Single correct answer
        const correctOption = this.questionOptions.find(opt => opt.isCorrect)
        answer = correctOption ? String(this.questionOptions.indexOf(correctOption)) : ''
      } else if (this.questionData.qType === 'MCQ-MCA') {
        // Multiple correct answers
        const correctIndices = this.questionOptions
          .map((opt, idx) => opt.isCorrect ? String(idx) : null)
          .filter(idx => idx !== null)
        answer = correctIndices.join(',')
      }

      // Build editorState options for MCQ
      editorStateOptions = this.questionOptions.map((opt, idx) => ({
        answer: opt.isCorrect,
        value: {
          body: opt.text || opt.value || '',
          value: idx
        }
      }))

      // Build choices options for MCQ
      choicesOptions = this.questionOptions.map((opt, idx) => ({
        value: {
          body: opt.text || opt.value || '',
          value: idx
        }
      }))
    } else if (this.isMTFQuestion()) {
      // For MTF, build question-answer pairs structure
      // answer field remains empty or can be indices (0,1,2...)
      answer = this.questionOptions.map((_, idx) => String(idx)).join(',')

      // Build editorState options for MTF with answer field containing answer text
      editorStateOptions = this.questionOptions.map((pair, idx) => ({
        answer: pair.answer || '',
        value: {
          body: pair.question || '',
          value: idx
        }
      }))

      // Build choices options for MTF with question texts
      choicesOptions = this.questionOptions.map((pair, idx) => ({
        value: {
          body: pair.question || '',
          value: idx
        }
      }))

      // Build rhsChoices with answer texts
      rhsChoices = this.questionOptions.map(pair => pair.answer || '')
    }

    const questionRequest = {
      isNew: isNewQuestion,
      root: false,
      metadata: {
        code: 'question',
        mimeType: 'application/vnd.sunbird.question',
        body: this.questionText,
        primaryCategory: this.getPrimaryCategory(),
        qType: this.questionData.qType,
        editorState: {
          options: editorStateOptions,
          question: this.questionText
        },
        objectType: 'Question',
        answer: answer,
        name: this.questionText,
        choices: {
          options: choicesOptions
        },
        rhsChoices: rhsChoices,
        compatibilityLevel: this.assessmentData?.compatibilityLevel,
        questionLevel: this.getSelectedLevelName() || 'Easy',
        totalMarks: this.getSelectedLevelMarks() || 0
      },
      objectType: 'Question'
    }

    console.log('Question Request:', JSON.stringify(questionRequest, null, 2))

    const updatedQuestion = {
      ...this.questionData,
      questionText: this.questionText,
      questionIndex: this.questionIndex,
      questionRequest: questionRequest
    }
    this.onQuestionUpdated(updatedQuestion)
  }

  private getPrimaryCategory(): string {
    switch (this.questionData.qType) {
      case 'MCQ-SCA':
      case 'MCQ-MCA':
      case 'MCQ-SCA-TF':
        return 'Multiple Choice Question'
      case 'FTB':
        return 'Fill in the Blanks'
      case 'MTF':
        return 'MTF Question'
      default:
        return 'Multiple Choice Question'
    }
  }
}
