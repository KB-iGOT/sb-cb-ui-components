import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core'
import { MatStepper } from '@angular/material/stepper'
import { AssessmentService } from '../../service/assessment.service'
import { map, switchMap } from 'rxjs/operators'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

@Component({
  selector: 'sb-uic-assessment-main',
  templateUrl: './assessment-main.component.html',
  styleUrls: ['./assessment-main.component.scss']
})
export class AssessmentMainComponent implements OnInit {

  @Input() config: any
  @Output() loader = new EventEmitter<any>()
  @ViewChild('stepper') stepper!: MatStepper

  isStepTwoEnabled = false
  isAssessmentLoaded = false

  constructor(
    private assessmentService: AssessmentService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    if (this.config && this.config.identifier === '' && this.config?.primaryCategory === '') {
      this.config.primaryCategory = 'Course Assessment'
    }
    if (this.config && this.config.identifier !== '') {
      this.callLoader(true)
      this.assessmentService.getAssessmentHierarchyDetailsModeEdit(this.config.identifier).subscribe({
        next: (data: any) => {
          this.enableStepTwo()
          this.callLoader(false)
          this.isAssessmentLoaded = true
          this.config.primaryCategory = data.primaryCategory || 'Course Assessment'
          this.config.contextCategory = data.contextCategory || ''
          // Use setTimeout to ensure ViewChild is available
          setTimeout(() => {
            if (this.stepper) {
              this.stepper.next()
            }
          }, 0)
        },
        error: (error: any) => {
          console.error('Error loading assessment', error)
          this.snackBar.open('Error loading assessment. Please try again.', 'Close', { duration: 5000 })
          this.callLoader(false)
          this.isAssessmentLoaded = true
        }
      })
    } else {
      this.isAssessmentLoaded = true
    }
  }

  enableStepTwo(): void {
    this.isStepTwoEnabled = true
  }

  callLoader(show: boolean): void {
    this.loader.emit(show)
  }

  saveAssessment(event: any) {
    const { children, ...assessmentDataWithoutChildren } = event
    const reqBody = {
      request: {
        questionset: {
          ...assessmentDataWithoutChildren
        }
      }
    }
    this.callLoader(true)
    if (this.config && this.config.identifier === '') {
      this.assessmentService.createAssessment(reqBody).pipe(
        switchMap((createResp: any) => {
          if (children && children.length > 0) {
            const hierarchyReq = this.assessmentService.createAssessmentHierarchyRequest(event, createResp.result.identifier)
            return this.assessmentService.updateAssessment(hierarchyReq).pipe(
              switchMap((hierarchyResp: any) => {
                return this.assessmentService.getAssessmentHierarchyDetailsModeEdit(createResp.result.identifier).pipe(
                  map((readResp: any) => {
                    return ({ createResp, hierarchyResp, readResp })
                  })
                )
              })
            )
          } else {
            return this.assessmentService.getAssessmentReadDetailsModeEdit(createResp.result.identifier).pipe(
              map((readResp: any) => {
                return ({ createResp, readResp })
              })
            )
          }
        })
      ).subscribe({
        next: (resp: any) => {
          console.log('Assessment created successfully', resp)
          this.snackBar.open('Assessment created successfully')
          this.enableStepTwo()
          if (this.stepper) {
            this.stepper.next()
          }
          this.callLoader(false)
        },
        error: (error: any) => {
          console.error('Error creating assessment', error)
          this.snackBar.open('Error creating assessment. Please try again.')
          this.callLoader(false)
        }
      })
    }
  }

  updateAssessment(event: any) {
    if (event && event.identifier) {
      const getAssessmentHierarchy = this.assessmentService.updateAssessmentHierarchyRequest(event.changedData, event.identifier)
      this.callLoader(true)
      this.assessmentService.updateAssessment(getAssessmentHierarchy).pipe(
        switchMap((updateResp: any) => {
          return this.assessmentService.getAssessmentHierarchyDetailsModeEdit(event.identifier).pipe(
            map((readResp: any) => {
              return ({ updateResp, readResp })
            })
          )
        })
      ).subscribe({
        next: (resp: any) => {
          console.log('Assessment updated successfully', resp)
          this.snackBar.open('Assessment updated successfully')
          this.enableStepTwo()
          if (this.stepper) {
            this.stepper.next()
          }
          this.callLoader(false)
        },
        error: (error: any) => {
          console.error('Error updating assessment', error)
          this.snackBar.open('Error updating assessment. Please try again.')
          this.callLoader(false)
        }
      })
    }
  }

}
