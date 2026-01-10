import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { AssessmentService } from '../../service/assessment.service'
import { Subscription } from 'rxjs'
import { NsAssessment } from '../../service/assessment.model'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { SelectQuestionModalComponent } from '../select-question-modal/select-question-modal.component'
import { BulkUploadAllTypeQuestionComponent } from '../bulk-upload-all-type-question/bulk-upload-all-type-question.component'

@Component({
  selector: 'sb-uic-assessment-sessions',
  templateUrl: './assessment-sessions.component.html',
  styleUrls: ['./assessment-sessions.component.scss']
})
export class AssessmentSessionsComponent implements OnInit, OnDestroy, OnChanges {
  @Output() saved = new EventEmitter<any>()
  @Output() updated = new EventEmitter<any>()
  @Output() updateQuestion = new EventEmitter<any>()

  sessionsForm!: FormGroup
  basicAssessmentForm!: FormGroup
  assessmentData: any = {}
  difficultyLevels = [
    { name: 'Easy', count: 0 },
    { name: 'Medium', count: 0 },
    { name: 'Difficult', count: 0 },
    { name: 'HOTS', count: 0 }
  ]
  selectedSectionIndex = 0
  nameMaxLength = 70
  questionsList: Array<{ qType: string; identifier: string }> = []
  expandedQuestionIndex: number | null = null
  private subscriptions: Subscription[] = []

  constructor(
    private fb: FormBuilder,
    private assessmentService: AssessmentService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this.loadAssessmentData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reload data when assessment hierarchy is updated from parent
    if (changes['assessmentData'] && !changes['assessmentData'].firstChange) {
      this.reloadAssessmentData()
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  initForm(): void {
    this.sessionsForm = this.fb.group({
      sections: this.fb.array([this.createSectionGroup()])
    })

    this.basicAssessmentForm = this.fb.group({
      totalQuestions: [0, [Validators.required, Validators.min(1)]],
      maxQuestions: [0, [Validators.required, Validators.min(1)]],
      minPassPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      additionalInstructions: ['', [Validators.maxLength(500)]]
    })
  }

  createSectionGroup(): FormGroup {
    return this.fb.group({
      name: ['Section A', [Validators.required, Validators.maxLength(this.nameMaxLength), Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\]*!'\s]+$/)]],
      additionalInstructions: ['']
    })
  }

  get sections(): FormArray {
    return this.sessionsForm.get('sections') as FormArray
  }

  get currentSectionGroup(): FormGroup {
    return this.sections.at(this.selectedSectionIndex) as FormGroup
  }

  loadAssessmentData(): void {
    // Get assessment hierarchy data from service
    this.assessmentData = this.assessmentService.getAssessmentHierarchyData()

    if (this.assessmentData && this.isAdvancedAssessmentQuestionWeightage()) {
      this.populateFormFromAssessmentData()
      this.calculateDifficultyLevelCounts()
    } else if (this.assessmentData && this.isBasicAssessment()) {
      this.populateBasicAssessmentForm()
    }
  }

  reloadAssessmentData(): void {
    // Reload fresh data from service
    this.loadAssessmentData()
    // Reload questions for current section to get updated identifiers
    this.loadQuestionsForSection(this.selectedSectionIndex)
  }

  isAdvancedAssessmentQuestionWeightage(): boolean {
    return this.assessmentData?.compatibilityLevel === NsAssessment.ECompatibilityLevel.ADVANCED ||
      this.assessmentData?.assessmentType === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE
  }

  isBasicAssessment(): boolean {
    return this.assessmentData?.compatibilityLevel === NsAssessment.ECompatibilityLevel.BASIC
  }

  hasBasicAssessmentSection(): boolean {
    // Check if basic assessment has a created section (with do_ identifier)
    return this.isBasicAssessment() &&
      this.assessmentData?.children &&
      this.assessmentData.children.length > 0 &&
      this.assessmentData.children[0]?.identifier?.startsWith('do_')
  }

  populateBasicAssessmentForm(): void {
    // For basic assessment, if there's existing section data, populate the form
    if (this.assessmentData.children && this.assessmentData.children.length > 0) {
      const section = this.assessmentData.children[0] // Basic assessment has only one section

      this.basicAssessmentForm.patchValue({
        totalQuestions: section.totalQuestions || 0,
        maxQuestions: section.maxQuestions || 0,
        minPassPercentage: section.minimumPassPercentage || 0,
        additionalInstructions: section.additionalInstructions || ''
      })

      // Store section identifier for updates
      this.basicAssessmentForm.addControl('sectionIdentifier', this.fb.control(section.identifier))

      // Load questions for basic assessment section
      this.loadQuestionsForSection(0)
    }
  }

  populateFormFromAssessmentData(): void {
    if (this.assessmentData.children && this.assessmentData.children.length > 0) {
      // Clear existing sections
      while (this.sections.length) {
        this.sections.removeAt(0)
      }

      // Add sections from assessment data
      this.assessmentData.children.forEach((section: any, index: number) => {
        const sectionGroup = this.fb.group({
          name: [section.name || `Section ${String.fromCharCode(65 + index)}`, [Validators.required, Validators.maxLength(this.nameMaxLength), Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\]*!'\s]+$/)]],
          additionalInstructions: [section.additionalInstructions || section.instructions || section.paragraph || '']
        })
        this.sections.push(sectionGroup)
      })

      if (this.sections.length === 0) {
        this.sections.push(this.createSectionGroup())
      }

      // Load questions for the initially selected section
      this.loadQuestionsForSection(this.selectedSectionIndex)
    }
  }

  calculateDifficultyLevelCounts(): void {
    // Reset counts
    this.difficultyLevels.forEach(level => level.count = 0)

    if (this.assessmentData.children) {
      this.assessmentData.children.forEach((section: any) => {
        if (section.sectionLevelDefinition) {
          Object.keys(section.sectionLevelDefinition).forEach(difficultyKey => {
            const definition = section.sectionLevelDefinition[difficultyKey]
            const levelIndex = this.difficultyLevels.findIndex(level =>
              level.name.toLowerCase() === difficultyKey.toLowerCase()
            )
            if (levelIndex >= 0 && definition.noOfQuestions) {
              this.difficultyLevels[levelIndex].count += definition.noOfQuestions
            }
          })
        }
      })
    }
  }



  selectSection(index: number): void {
    this.selectedSectionIndex = index
    // Load questions for the selected section
    this.loadQuestionsForSection(index)
    // Force change detection to update the form
    this.cdr.detectChanges()
  }

  loadQuestionsForSection(sectionIndex: number): void {
    this.questionsList = []
    if (this.assessmentData?.children && this.assessmentData.children[sectionIndex]) {
      const section = this.assessmentData.children[sectionIndex]
      if (section.children && section.children.length > 0) {
        section.children.forEach((question: any) => {
          this.questionsList.push({
            qType: question.qType || 'MCQ-SCA',
            identifier: question.identifier,
            ...question
          })
        })
      }
    }
    console.log('Loaded questions for section', sectionIndex, ':', this.questionsList)
  }

  getDifficultyLevelSummary(): string {
    return this.difficultyLevels
      .map(level => `${level.name} - ${level.count}`)
      .join(', ')
  }

  getSectionDifficultyLevelSummary(sectionIndex: number): string {
    if (!this.assessmentData.children || !this.assessmentData.children[sectionIndex]) {
      return 'Easy - 0, Medium - 0, Difficult - 0, HOTS - 0'
    }

    const section = this.assessmentData.children[sectionIndex]
    const sectionDifficultyLevels = [
      { name: 'Easy', count: 0 },
      { name: 'Medium', count: 0 },
      { name: 'Difficult', count: 0 },
      { name: 'HOTS', count: 0 }
    ]

    if (section.sectionLevelDefinition) {
      Object.keys(section.sectionLevelDefinition).forEach(difficultyKey => {
        const definition = section.sectionLevelDefinition[difficultyKey]
        const levelIndex = sectionDifficultyLevels.findIndex(level =>
          level.name.toLowerCase() === difficultyKey.toLowerCase()
        )
        if (levelIndex >= 0 && definition.noOfQuestions) {
          sectionDifficultyLevels[levelIndex].count = definition.noOfQuestions
        }
      })
    }

    return sectionDifficultyLevels
      .map(level => `${level.name} - ${level.count}`)
      .join(', ')
  }

  get nameLength(): number {
    return this.currentSectionGroup?.get('name')?.value?.length || 0
  }

  onBasicAssessmentSave(): void {
    if (this.basicAssessmentForm.valid) {
      const formData = this.basicAssessmentForm.value
      console.log('Saving Basic Assessment:', formData)
      this.saved.emit(formData)
    } else {
      console.log('Basic assessment form is invalid')
      this.basicAssessmentForm.markAllAsTouched()
    }
  }

  onSave(): void {
    // Validate only the current section
    const currentSection = this.currentSectionGroup
    if (currentSection.valid) {
      const currentSectionData = currentSection.value
      const sectionIdentifier = this.assessmentData.children?.[this.selectedSectionIndex]?.identifier || null

      const saveData = {
        sectionData: currentSectionData,
        sectionIdentifier: sectionIdentifier
      }

      console.log(`Saving Section ${this.selectedSectionIndex + 1}:`, saveData)
      this.saved.emit(saveData)
    } else {
      console.log('Current section is invalid')
      currentSection.markAllAsTouched()
    }
  }

  onUpdate(): void {
    // Validate only the current section
    const currentSection = this.currentSectionGroup
    if (currentSection.valid) {
      const currentSectionData = currentSection.value
      const originalSectionData = this.assessmentData.children?.[this.selectedSectionIndex]

      // Compare current values with original data and get only changed fields
      const changedData: any = {}

      // Check name
      const currentName = currentSectionData.name?.trim()
      const originalName = originalSectionData?.name
      if (currentName !== originalName) {
        changedData.name = currentName
      }

      // Check additional instructions
      const currentAdditionalInstructions = currentSectionData.additionalInstructions
      const originalAdditionalInstructions = originalSectionData?.additionalInstructions || originalSectionData?.instructions || originalSectionData?.paragraph || ''
      if (currentAdditionalInstructions !== originalAdditionalInstructions) {
        changedData.additionalInstructions = currentAdditionalInstructions
      }

      if (Object.keys(changedData).length > 0) {
        const sectionIdentifier = this.assessmentData.children?.[this.selectedSectionIndex]?.identifier || null

        const updateData = {
          changedData: changedData,
          sectionIdentifier: sectionIdentifier
        }
        console.log(`Updating Section ${this.selectedSectionIndex + 1}:`, updateData)
        this.updated.emit(updateData)
      } else {
        this.snackBar.open('No changes detected')
      }
    } else {
      console.log('Current section is invalid')
      currentSection.markAllAsTouched()
    }
  }

  addQuestions(): void {
    const dialogRef = this.dialog.open(SelectQuestionModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        title: 'Select the questions type'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected question type:', result)
        // Handle the selected question type
        // You can emit an event or navigate to question creation based on type
        this.handleQuestionTypeSelection(result)
      }
    })
  }

  private handleQuestionTypeSelection(questionType: string): void {

    // Create question object with qType and identifier
    const questionData = {
      qType: this.mapQuestionType(questionType),
      identifier: this.assessmentService.generateUUID()
    }

    // Add to questions list
    this.questionsList.push(questionData)

    console.log('Created question:', questionData)
    console.log('Current questions list:', this.questionsList)
  }

  private mapQuestionType(questionType: string): string {
    // Map the question types to appropriate codes
    switch (questionType) {
      case 'single-mcq':
        return 'MCQ-SCA'
      case 'multiple-mcq':
        return 'MCQ-MCA'
      case 'fill-blanks':
        return 'FTB'
      case 'match-following':
        return 'MTF'
      case 'true-false':
        return 'MCQ-SCA-TF'
      default:
        return questionType
    }
  }

  onQuestionExpanded(questionIndex: number): void {
    // Toggle expanded state - if same question clicked, collapse it
    this.expandedQuestionIndex = this.expandedQuestionIndex === questionIndex ? null : questionIndex
  }

  onQuestionUpdated(questionData: any): void {
    // For basic assessment, use the first section; for advanced, use selected section
    const sectionIndex = this.isBasicAssessment() ? 0 : this.selectedSectionIndex
    const sectionIdentifier = this.assessmentData.children?.[sectionIndex]?.identifier || null
    // Get identifier from questionData directly (not questionData.questionData)
    const questionIdentifier = questionData.identifier || this.assessmentService.generateUUID()

    // Wrap the question request with the question identifier as key
    const changedData = {
      [questionIdentifier]: questionData.questionRequest
    }

    const updateData = {
      changedData: changedData,
      sectionIdentifier: sectionIdentifier,
      questionIdentifier: questionIdentifier
    }
    this.updateQuestion.emit(updateData)

  }

  onQuestionDeleted(event: any): void {
    const questionData = event.questionData
    const questionIndex = event.questionIndex - 1 // Convert to 0-based index

    // For basic assessment, use the first section; for advanced, use selected section
    const sectionIndex = this.isBasicAssessment() ? 0 : this.selectedSectionIndex

    // Check if this is an existing question with do_ identifier
    if (questionData.identifier && questionData.identifier.startsWith('do_')) {
      // This is an existing question - need to call API to remove from section
      const sectionIdentifier = this.assessmentData.children?.[sectionIndex]?.identifier

      if (sectionIdentifier) {
        // Remove the question identifier from section's children array
        const section = this.assessmentData.children[sectionIndex]
        if (section.children && Array.isArray(section.children)) {
          section.children = section.children.filter((childId: string) => childId !== questionData.identifier)
        }

        // Build update request to remove question from hierarchy
        const deleteData = {
          sectionIdentifier: sectionIdentifier,
          questionIdentifier: questionData.identifier,
          isDelete: true
        }

        this.updateQuestion.emit(deleteData)
        console.log('Deleting existing question from hierarchy:', questionData.identifier)
      }
    } else {
      // This is a new unsaved question - just remove from local list
      this.questionsList.splice(questionIndex, 1)
      this.snackBar.open('Question removed')
      console.log('Removed new question from local list at index:', questionIndex)
    }
  }

  getCurrentSectionLevelDefinition(): any {
    if (this.assessmentData.children && this.assessmentData.children[this.selectedSectionIndex]) {
      return this.assessmentData.children[this.selectedSectionIndex].sectionLevelDefinition || null
    }
    return null
  }

  openBulkUploadDialog() {
    debugger
    const dialogRef = this.dialog.open(BulkUploadAllTypeQuestionComponent, {
      width: '90vw',
      maxWidth: '1200px',
      data: {
        maxFileSize: 400 * 1024 * 1024,
        questionTracking: this.getCurrentSectionLevelDefinition(),
        totalQuestions: this.basicAssessmentForm?.get('totalQuestions')?.value || null,
        compatibilityLevel: this.assessmentData?.compatibilityLevel,
        assessmentType: this.assessmentData?.assessmentType,
        existingQuestionsCount: this.questionsList?.length || 0
      },
      autoFocus: false
    })


    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'CREATE') {
        // Handle the created questions from bulk upload
        const questions = result.questions
        const isOldTemplate = result.isOldTemplate || false
        console.log('Questions to create from bulk upload:', questions)
        console.log('Is old template:', isOldTemplate)

        // For basic assessment, use the first section; for advanced, use selected section
        const sectionIndex = this.isBasicAssessment() ? 0 : this.selectedSectionIndex
        const sectionIdentifier = this.assessmentData.children?.[sectionIndex]?.identifier || null

        if (sectionIdentifier && questions && questions.length > 0) {
          // Emit the update event with the array of questions
          const updateData = {
            changedData: questions, // Array of questions
            sectionIdentifier: sectionIdentifier,
            isOldTemplate: isOldTemplate
          }
          this.updateQuestion.emit(updateData)
        }
      }
    })
  }
}
