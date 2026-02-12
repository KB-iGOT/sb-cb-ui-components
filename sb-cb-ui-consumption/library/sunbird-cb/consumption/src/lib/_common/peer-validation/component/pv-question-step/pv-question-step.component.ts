import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms'

interface Question {
  text: string
  required: boolean
  type: 'rating' | 'text'
}

interface AdditionalQuestion {
  id: number
  type: 'multiple-mcq' | 'single-mcq' | 'text'
  question: string
  selectionType: string
  isRequired: boolean
  allowNA: boolean
  options: string[]
}

@Component({
  selector: 'sb-uic-pv-question-step',
  templateUrl: './pv-question-step.component.html',
  styleUrls: ['./pv-question-step.component.scss'],
  standalone: false
})
export class PvQuestionStepComponent implements OnInit {
  questionForm!: FormGroup
  courseName = 'Effective Communication Startegies'
  charCount = 0
  ratingOptions = [1, 2, 3, 4, 5]
  additionalQuestionCount = 0
  showMcqEditor = false
  currentMcqType: 'multiple-mcq' | 'single-mcq' | null = null
  mcqEditorForm!: FormGroup
  savedAdditionalQuestions: AdditionalQuestion[] = []
  nextQuestionId = 1

  questions: Question[] = [
    {
      text: 'How confident are you in applying the communication frameworks learned in this course to your daily workplace interactions?',
      required: false,
      type: 'rating'
    },
    {
      text: 'To what extent has this course improved your ability to manage difficult conversations with stakeholders?',
      required: true,
      type: 'rating'
    },
    {
      text: 'Describe a specific instance where you applied the learnings',
      required: true,
      type: 'text'
    }
  ]

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm()
    this.initializeMcqEditorForm()
  }

  initializeForm(): void {
    this.questionForm = this.fb.group({
      question1: [''],
      question2: ['', Validators.required],
      question3: ['', [Validators.required, Validators.maxLength(300)]]
    })

    // Update char count on initialization if there's existing value
    const question3Value = this.questionForm.get('question3')?.value || ''
    this.charCount = question3Value.length
  }

  updateCharCount(event: any): void {
    this.charCount = event.target.value.length
  }

  initializeMcqEditorForm(): void {
    this.mcqEditorForm = this.fb.group({
      question: ['', Validators.required],
      selectionType: ['Multiple selection-MCQs'],
      isRequired: [false],
      allowNA: [false],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    })
  }

  get mcqOptions(): FormArray {
    return this.mcqEditorForm.get('options') as FormArray
  }

  addOption(): void {
    if (this.mcqOptions.length < 6) {
      this.mcqOptions.push(this.fb.control('', Validators.required))
    }
  }

  removeOption(index: number): void {
    if (this.mcqOptions.length > 2) {
      this.mcqOptions.removeAt(index)
    }
  }

  addQuestionType(type: 'multiple-mcq' | 'single-mcq' | 'text'): void {
    if (this.additionalQuestionCount < 2) {
      if (type === 'multiple-mcq' || type === 'single-mcq') {
        this.currentMcqType = type
        this.showMcqEditor = true
        this.mcqEditorForm.patchValue({
          selectionType: type === 'multiple-mcq' ? 'multiple-mcq' : 'single-mcq'
        })
        this.mcqEditorForm.get('selectionType')?.disable()
      }
    }
  }

  closeMcqEditor(): void {
    this.showMcqEditor = false
    this.currentMcqType = null
    this.initializeMcqEditorForm()
  }

  saveMcqQuestion(): void {
    if (this.mcqEditorForm.valid && this.currentMcqType) {
      const newQuestion: AdditionalQuestion = {
        id: this.nextQuestionId++,
        type: this.currentMcqType,
        question: this.mcqEditorForm.value.question,
        selectionType: this.mcqEditorForm.value.selectionType,
        isRequired: this.mcqEditorForm.value.isRequired,
        allowNA: this.mcqEditorForm.value.allowNA,
        options: this.mcqOptions.value.filter((opt: string) => opt.trim() !== '')
      }

      this.savedAdditionalQuestions.push(newQuestion)
      this.additionalQuestionCount++
      console.log('Saved question:', newQuestion)
      this.closeMcqEditor()
    }
  }

  deleteAdditionalQuestion(id: number): void {
    this.savedAdditionalQuestions = this.savedAdditionalQuestions.filter(q => q.id !== id)
    this.additionalQuestionCount--
  }

  isFormValid(): boolean {
    return this.questionForm.valid
  }

  getFormData() {
    return this.questionForm.value
  }
}
