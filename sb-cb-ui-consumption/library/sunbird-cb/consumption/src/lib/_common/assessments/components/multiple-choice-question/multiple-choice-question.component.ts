import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'

@Component({
  selector: 'sb-uic-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss']
})
export class MultipleChoiceQuestionComponent implements OnInit, OnChanges {
  @Input() questionType: string = 'MCQ-SCA'; // MCQ-SCA, MCQ-MCA, MCQ-SCA-TF
  @Input() options: any[] = [];
  @Output() optionsUpdated = new EventEmitter<any[]>();
  @Output() addOptionRequest = new EventEmitter<void>();

  optionsList: any[] = [];
  correctAnswer: any = null; // For single select (MCQ-SCA, MCQ-SCA-TF)
  correctAnswers: any = {}; // For multiple select (MCQ-MCA)
  maxOptions: number = 7; // Maximum options for MCQ-SCA and MCQ-MCA

  ngOnInit(): void {
    this.initializeOptions()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && !changes['options'].firstChange && this.options && this.options.length > 0) {
      this.initializeOptions()
    }
  }

  initializeOptions(): void {
    // Check if options are provided first (for loading existing data)
    if (this.options && this.options.length > 0) {
      this.optionsList = this.options

      console.log('MCQ Component - Loading options:', this.optionsList)
      console.log('Question Type:', this.questionType)

      // Set correctAnswer for single choice questions based on isCorrect flag
      if (this.isMCQSCA() || this.isMCQTrueFalse()) {
        const correctOption = this.optionsList.find(opt => opt.isCorrect)
        console.log('Looking for correct option, found:', correctOption)
        if (correctOption) {
          this.correctAnswer = correctOption.id
          console.log('Set correctAnswer to ID:', this.correctAnswer, 'type:', typeof this.correctAnswer)
          console.log('Option details:', correctOption)
        } else {
          console.log('No correct option found. All options:', this.optionsList)
        }
      }

      // For multiple choice, set correctAnswers object
      if (this.isMCQMCA()) {
        this.correctAnswers = {}
        this.optionsList.forEach(opt => {
          if (opt.isCorrect) {
            this.correctAnswers[opt.id] = true
          }
        })
        console.log('Set correctAnswers to:', this.correctAnswers)
      }

      // Force change detection
      setTimeout(() => {
        console.log('After timeout - correctAnswer:', this.correctAnswer)
      }, 0)
    } else if (this.questionType === 'MCQ-SCA-TF') {
      // True/False question - only 2 options (default initialization for new questions)
      this.optionsList = [
        { id: 1, text: '', value: 'True', isCorrect: false },
        { id: 2, text: '', value: 'False', isCorrect: false }
      ]
    } else if (this.options && this.options.length > 0) {
      this.optionsList = this.options

      console.log('MCQ Component - Loading options:', this.optionsList)
      console.log('Question Type:', this.questionType)

      // Set correctAnswer for single choice questions based on isCorrect flag
      if (this.isMCQSCA() || this.isMCQTrueFalse()) {
        const correctOption = this.optionsList.find(opt => opt.isCorrect)
        console.log('Looking for correct option, found:', correctOption)
        if (correctOption) {
          this.correctAnswer = correctOption.id
          console.log('Set correctAnswer to ID:', this.correctAnswer, 'type:', typeof this.correctAnswer)
          console.log('Option details:', correctOption)
        } else {
          console.log('No correct option found. All options:', this.optionsList)
        }
      }

      // For multiple choice, set correctAnswers object
      if (this.isMCQMCA()) {
        this.correctAnswers = {}
        this.optionsList.forEach(opt => {
          if (opt.isCorrect) {
            this.correctAnswers[opt.id] = true
          }
        })
        console.log('Set correctAnswers to:', this.correctAnswers)
      }

      // Force change detection
      setTimeout(() => {
        console.log('After timeout - correctAnswer:', this.correctAnswer)
      }, 0)
    } else if (this.questionType === 'MCQ-SCA') {
      // Initialize with 2 empty options for MCQ-SCA
      this.optionsList = [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    } else if (this.questionType === 'MCQ-MCA') {
      // Initialize with 3 empty options for MCQ-MCA
      this.optionsList = [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false },
        { id: 3, text: '', isCorrect: false }
      ]
    } else {
      // Default: Initialize with 2 empty options
      this.optionsList = [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    }
  }

  isMCQSCA(): boolean {
    return this.questionType === 'MCQ-SCA'
  }

  isMCQMCA(): boolean {
    return this.questionType === 'MCQ-MCA'
  }

  isMCQTrueFalse(): boolean {
    return this.questionType === 'MCQ-SCA-TF'
  }

  onOptionTextChange(option: any, text: string): void {
    option.text = text
    this.emitOptionsUpdate()
  }

  onCorrectAnswerChange(optionId: number): void {
    // For single select (MCQ-SCA, MCQ-SCA-TF)
    this.optionsList.forEach(opt => {
      opt.isCorrect = opt.id === optionId
    })
    this.correctAnswer = optionId
    this.emitOptionsUpdate()
  }

  onCorrectAnswerToggle(option: any): void {
    // For multiple select (MCQ-MCA)
    option.isCorrect = !option.isCorrect
    this.emitOptionsUpdate()
  }

  addOption(): void {
    if (this.canAddMoreOptions()) {
      const newId = this.optionsList.length + 1
      this.optionsList.push({
        id: newId,
        text: '',
        isCorrect: false
      })
      this.emitOptionsUpdate()
      this.addOptionRequest.emit()
    }
  }

  canAddMoreOptions(): boolean {
    return this.optionsList.length < this.maxOptions
  }

  removeOption(index: number): void {
    if (this.optionsList.length > 2) {
      this.optionsList.splice(index, 1)
      this.emitOptionsUpdate()
    }
  }

  private emitOptionsUpdate(): void {
    this.optionsUpdated.emit(this.optionsList)
  }
}
