import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { NsAssessment } from '../../service/assessment.model'

@Component({
  selector: 'sb-uic-assessment-basic-info',
  templateUrl: './assessment-basic-info.component.html',
  styleUrls: ['./assessment-basic-info.component.scss']
})

export class AssessmentBasicInfoComponent implements OnInit, OnDestroy {

  @Input() config: any

  assessmentForm!: FormGroup
  reAttemptOptions: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  titleMaxLength = 70
  instructionsMaxLength = 500
  durationTouched = false
  overallScoreCutoffOptions = [
    {
      id: 'AssessmentLevel',
      name: 'Overall score cutoff',
      description: 'With this selection the scores are calculated based on the overall correct answers.',
    },
    {
      id: 'SectionLevel',
      name: 'Sectional score cutoff',
      description: 'With this selection the scores are calculated based on the each section you create.',
    },
  ]
  isFinalAssessment: boolean = false
  isPracticeAssessment: boolean = false
  private showTimerSubscription?: Subscription
  private assessmentTypeSubscription?: Subscription
  private questionWeightageTypeSubscription?: Subscription
  private totalNumberOfSectionsSubscription?: Subscription
  assessmentTypeList = [
    {
      name: 'Question Weightage',
      value: NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE,
    },
    {
      name: 'Option Weightage',
      value: NsAssessment.EAssessmentType.OPTION_WEIGHTAGE,
    },
  ]
  difficultyLevels = ['Easy', 'Medium', 'Difficult', 'HOTS']
  selectedSectionIndex = 0
  negativePercentageOptions = ['0%', '25%', '50%', '75%', '100%']

  constructor(private fb: FormBuilder) {
    this.initForm()
  }

  ngOnInit(): void {
    if (this.config && this.config?.primaryCategory === 'Course Assessment') {
      this.isFinalAssessment = true
    }
    if (this.config && this.config?.primaryCategory === 'Practice Question Set') {
      this.isPracticeAssessment = true
    }
    this.setupShowTimerSubscription()
    this.setupAssessmentTypeSubscription()
    this.setupQuestionWeightageTypeSubscription()
    this.setupTotalNumberOfSectionsSubscription()
    this.updateValidators()
  }

  ngOnDestroy(): void {
    this.showTimerSubscription?.unsubscribe()
    this.assessmentTypeSubscription?.unsubscribe()
    this.questionWeightageTypeSubscription?.unsubscribe()
    this.totalNumberOfSectionsSubscription?.unsubscribe()
  }

  setupShowTimerSubscription(): void {
    this.showTimerSubscription = this.assessmentForm.get('showTimer')?.valueChanges.subscribe(() => {
      this.updateValidators()
    })
  }

  setupAssessmentTypeSubscription(): void {
    this.assessmentTypeSubscription = this.assessmentForm.get('assessmentType')?.valueChanges.subscribe((value) => {
      // Reset advanced assessment fields when switching assessment type
      if (value === 'advanced') {
        this.assessmentForm.get('questionWeightageType')?.setValue(NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE, { emitEvent: false })
      } else {
        this.assessmentForm.get('questionWeightageType')?.setValue(null, { emitEvent: false })
      }
      this.assessmentForm.get('numberOfQuestionsToDisplay')?.setValue(0, { emitEvent: false })
      this.assessmentForm.get('totalNumberOfSections')?.setValue(1, { emitEvent: false })
      this.updateSections(1)
      this.selectedSectionIndex = 0
      this.updateValidators()
    })
  }

  setupQuestionWeightageTypeSubscription(): void {
    this.questionWeightageTypeSubscription = this.assessmentForm.get('questionWeightageType')?.valueChanges.subscribe(() => {
      // Reset fields when switching weightage type
      this.assessmentForm.get('numberOfQuestionsToDisplay')?.setValue(0, { emitEvent: false })
      this.assessmentForm.get('totalNumberOfSections')?.setValue(1, { emitEvent: false })
      this.updateSections(1)
      this.selectedSectionIndex = 0
      this.updateValidators()
    })
  }

  setupTotalNumberOfSectionsSubscription(): void {
    this.totalNumberOfSectionsSubscription = this.assessmentForm.get('totalNumberOfSections')?.valueChanges.subscribe((value) => {
      if (value && value >= 1 && value <= 5) {
        this.updateSections(value)
        if (this.selectedSectionIndex >= value) {
          this.selectedSectionIndex = value - 1
        }
        this.updateValidators()
      }
    })
  }

  updateSections(count: number): void {
    const sections = this.assessmentForm.get('sections') as FormArray
    const currentLength = sections.length

    if (count > currentLength) {
      // Add new sections
      for (let i = currentLength; i < count; i++) {
        sections.push(this.createSectionGroup())
      }
    } else if (count < currentLength) {
      // Remove extra sections
      for (let i = currentLength - 1; i >= count; i--) {
        sections.removeAt(i)
      }
    }
  }

  createSectionGroup(): FormGroup {
    return this.fb.group({
      paragraph: [false],
      difficultyLevels: this.fb.array(
        this.difficultyLevels.map(() => this.createDifficultyLevelGroup())
      )
    })
  }

  createDifficultyLevelGroup(): FormGroup {
    return this.fb.group({
      numberOfQuestions: [0, [Validators.min(0)]],
      marksPerQuestion: [0, [Validators.min(0)]]
    })
  }

  get sections(): FormArray {
    return this.assessmentForm.get('sections') as FormArray
  }

  get hasMultipleSections(): boolean {
    return (this.assessmentForm.get('totalNumberOfSections')?.value || 1) > 1
  }

  getSectionDifficultyLevels(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('difficultyLevels') as FormArray
  }

  calculateTotalMarks(sectionIndex: number, levelIndex: number): number {
    const difficultyLevels = this.getSectionDifficultyLevels(sectionIndex)
    const level = difficultyLevels.at(levelIndex)
    const questions = level.get('numberOfQuestions')?.value || 0
    const marks = level.get('marksPerQuestion')?.value || 0
    return questions * marks
  }

  getSectionTotalQuestions(sectionIndex: number): number {
    const difficultyLevels = this.getSectionDifficultyLevels(sectionIndex)
    let total = 0
    for (let i = 0; i < difficultyLevels.length; i++) {
      total += difficultyLevels.at(i).get('numberOfQuestions')?.value || 0
    }
    return total
  }

  getSectionTotalMarks(sectionIndex: number): number {
    const difficultyLevels = this.getSectionDifficultyLevels(sectionIndex)
    let total = 0
    for (let i = 0; i < difficultyLevels.length; i++) {
      total += this.calculateTotalMarks(sectionIndex, i)
    }
    return total
  }

  getGrandTotalQuestions(): number {
    let grandTotal = 0
    for (let i = 0; i < this.sections.length; i++) {
      grandTotal += this.getSectionTotalQuestions(i)
    }
    return grandTotal
  }

  getGrandTotalMarks(): number {
    let grandTotal = 0
    for (let i = 0; i < this.sections.length; i++) {
      grandTotal += this.getSectionTotalMarks(i)
    }
    return grandTotal
  }

  selectSection(index: number): void {
    this.selectedSectionIndex = index
  }

  updateValidators(): void {
    const showTimer = this.assessmentForm.get('showTimer')?.value
    const assessmentType = this.assessmentForm.get('assessmentType')?.value
    const questionWeightageTypeValue = this.assessmentForm.get('questionWeightageType')?.value
    const durationHours = this.assessmentForm.get('durationHours')
    const durationMinutes = this.assessmentForm.get('durationMinutes')
    const durationSeconds = this.assessmentForm.get('durationSeconds')
    const numberOfReAttempts = this.assessmentForm.get('numberOfReAttempts')
    const scoreCutoffType = this.assessmentForm.get('scoreCutoffType')
    const questionWeightageType = this.assessmentForm.get('questionWeightageType')
    const numberOfQuestionsToDisplay = this.assessmentForm.get('numberOfQuestionsToDisplay')

    // Duration validators
    if (this.isFinalAssessment || (this.isPracticeAssessment && showTimer)) {
      durationHours?.setValidators([Validators.required, Validators.min(0), Validators.max(23)])
      durationMinutes?.setValidators([Validators.required, Validators.min(0), Validators.max(59)])
      durationSeconds?.setValidators([Validators.required, Validators.min(0), Validators.max(59)])
    } else {
      durationHours?.setValidators([Validators.min(0), Validators.max(23)])
      durationMinutes?.setValidators([Validators.min(0), Validators.max(59)])
      durationSeconds?.setValidators([Validators.min(0), Validators.max(59)])
    }

    // numberOfReAttempts validator - only required for Final Assessment
    if (this.isFinalAssessment) {
      numberOfReAttempts?.setValidators([Validators.required])
    } else {
      numberOfReAttempts?.clearValidators()
    }

    // scoreCutoffType validator - only required for Final Assessment with Basic assessment type
    if (this.isFinalAssessment && assessmentType === 'basic') {
      scoreCutoffType?.setValidators([Validators.required])
    } else {
      scoreCutoffType?.clearValidators()
    }

    // questionWeightageType validator - only required for Advanced Assessment
    if (assessmentType === 'advanced') {
      questionWeightageType?.setValidators([Validators.required])
    } else {
      questionWeightageType?.clearValidators()
    }

    // numberOfQuestionsToDisplay validator - only required for Option Weightage
    if (assessmentType === 'advanced' && questionWeightageTypeValue === NsAssessment.EAssessmentType.OPTION_WEIGHTAGE) {
      numberOfQuestionsToDisplay?.setValidators([Validators.required, Validators.min(0)])
    } else {
      numberOfQuestionsToDisplay?.clearValidators()
    }

    // totalNumberOfSections validator - only required for Question Weightage
    const totalNumberOfSections = this.assessmentForm.get('totalNumberOfSections')
    if (assessmentType === 'advanced' && questionWeightageTypeValue === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      totalNumberOfSections?.setValidators([Validators.required, Validators.min(1), Validators.max(5)])
    } else {
      totalNumberOfSections?.clearValidators()
    }

    // Question Weightage specific validators
    const showMarksQuestion = this.assessmentForm.get('showMarksQuestion')
    const sectionalPassingPercentage = this.assessmentForm.get('sectionalPassingPercentage')
    const sectionalTimeBound = this.assessmentForm.get('sectionalTimeBound')
    const minimumPassingPercentage = this.assessmentForm.get('minimumPassingPercentage')
    const negativePercentageQuestion = this.assessmentForm.get('negativePercentageQuestion')

    if (assessmentType === 'advanced' && questionWeightageTypeValue === NsAssessment.EAssessmentType.QUESTION_WEIGHTAGE) {
      showMarksQuestion?.setValidators([Validators.required])
      minimumPassingPercentage?.setValidators([Validators.required, Validators.min(0), Validators.max(100)])
      negativePercentageQuestion?.setValidators([Validators.required])

      // Sectional validators only when more than 1 section
      const totalSections = this.assessmentForm.get('totalNumberOfSections')?.value || 1
      if (totalSections > 1) {
        sectionalPassingPercentage?.setValidators([Validators.required])
        sectionalTimeBound?.setValidators([Validators.required])
      } else {
        sectionalPassingPercentage?.clearValidators()
        sectionalTimeBound?.clearValidators()
      }
    } else {
      showMarksQuestion?.clearValidators()
      sectionalPassingPercentage?.clearValidators()
      sectionalTimeBound?.clearValidators()
      minimumPassingPercentage?.clearValidators()
      negativePercentageQuestion?.clearValidators()
    }

    durationHours?.updateValueAndValidity({ emitEvent: false })
    durationMinutes?.updateValueAndValidity({ emitEvent: false })
    durationSeconds?.updateValueAndValidity({ emitEvent: false })
    numberOfReAttempts?.updateValueAndValidity({ emitEvent: false })
    scoreCutoffType?.updateValueAndValidity({ emitEvent: false })
    questionWeightageType?.updateValueAndValidity({ emitEvent: false })
    numberOfQuestionsToDisplay?.updateValueAndValidity({ emitEvent: false })
    totalNumberOfSections?.updateValueAndValidity({ emitEvent: false })
    showMarksQuestion?.updateValueAndValidity({ emitEvent: false })
    sectionalPassingPercentage?.updateValueAndValidity({ emitEvent: false })
    sectionalTimeBound?.updateValueAndValidity({ emitEvent: false })
    minimumPassingPercentage?.updateValueAndValidity({ emitEvent: false })
    negativePercentageQuestion?.updateValueAndValidity({ emitEvent: false })
  }

  initForm(): void {
    this.assessmentForm = this.fb.group({
      assessmentType: ['basic', Validators.required],
      questionWeightageType: [null],
      numberOfQuestionsToDisplay: [0],
      totalNumberOfSections: [1],
      sections: this.fb.array([this.createSectionGroup()]),
      title: ['', [Validators.required, Validators.maxLength(this.titleMaxLength), Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\]*!'\s]+$/)]],
      scoreCutoffType: ['AssessmentLevel', Validators.required],
      numberOfReAttempts: [null, Validators.required],
      durationHours: [0, [Validators.min(0), Validators.max(23)]],
      durationMinutes: [0, [Validators.min(0), Validators.max(59)]],
      durationSeconds: [0, [Validators.min(0), Validators.max(59)]],
      instructions: ['', Validators.maxLength(this.instructionsMaxLength)],
      showTimer: [true],
      // Question Weightage settings
      showMarksQuestion: ['no'],
      sectionalPassingPercentage: ['no'],
      sectionalTimeBound: ['no'],
      minimumPassingPercentage: [50, [Validators.min(0), Validators.max(100)]],
      negativePercentageQuestion: ['0%']
    })
  }

  get titleLength(): number {
    return this.assessmentForm.get('title')?.value?.length || 0
  }

  get instructionsLength(): number {
    return this.assessmentForm.get('instructions')?.value?.length || 0
  }

  get controls() {
    return this.assessmentForm.controls
  }

  get totalDuration(): number {
    const hours = this.assessmentForm.get('durationHours')?.value || 0
    const minutes = this.assessmentForm.get('durationMinutes')?.value || 0
    const seconds = this.assessmentForm.get('durationSeconds')?.value || 0
    return hours + minutes + seconds
  }

  get isDurationRequired(): boolean {
    return this.isFinalAssessment || (this.isPracticeAssessment && this.assessmentForm.get('showTimer')?.value)
  }

  get isDurationInvalid(): boolean {
    return this.durationTouched && this.isDurationRequired && this.totalDuration <= 0
  }

  get isFormValid(): boolean {
    if (!this.assessmentForm.valid) {
      return false
    }
    // Additional check: if duration is required, total duration must be > 0
    if (this.isDurationRequired && this.totalDuration <= 0) {
      return false
    }
    return true
  }

  onDurationBlur(): void {
    this.durationTouched = true
  }

  onSave(): void {

  }

  onCancel(): void {

  }

}
