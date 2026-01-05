import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { AssessmentService } from '../../service/assessment.service'

@Component({
  selector: 'sb-uic-assessment-main',
  templateUrl: './assessment-main.component.html',
  styleUrls: ['./assessment-main.component.scss']
})
export class AssessmentMainComponent implements OnInit {

  @Input() config: any
  @Output() loader = new EventEmitter<any>()

  isStepTwoEnabled = false

  constructor(
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    if (this.config && this.config.identifier === '' && this.config?.primaryCategory === '') {
      this.config.primaryCategory = 'Course Assessment'
    }
    if (this.config && this.config.identifier !== '') {
      this.callLoader(true)
      this.assessmentService.getAssessmentHierarchyDetails(this.config.identifier).subscribe((data: any) => {
        this.callLoader(false)
        this.config.primaryCategory = data.primaryCategory || 'Course Assessment'
        this.config.contextCategory = data.contextCategory || ''
      })
    }
  }

  enableStepTwo(): void {
    this.isStepTwoEnabled = true
  }

  callLoader(show: boolean): void {
    this.loader.emit(show)
  }


}
