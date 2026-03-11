import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Optional, Inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { PvConfigStepComponent } from '../pv-config-step/pv-config-step.component'
import { PeerValidationService } from '../../service/peer-validation.service'
import { LOADER_SERVICE, ILoaderService } from '../../service/loader-service.token'

@Component({
  selector: 'sb-uic-pv-create',
  templateUrl: './pv-create.component.html',
  styleUrls: ['./pv-create.component.scss']
})
export class PvCreateComponent implements OnInit, AfterViewInit {
  @ViewChild(PvConfigStepComponent) configStepComponent!: PvConfigStepComponent

  stepsLabels = ['Configuration', 'Questions']
  currentStepperIndex = 0
  isNewSurvey = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private peerValidationService: PeerValidationService,
    @Inject(LOADER_SERVICE) private loaderService: ILoaderService
  ) { }

  ngOnInit() {
    // Detect if this is a new survey from the URL
    const urlSegments = this.router.url.split('/')
    this.isNewSurvey = urlSegments.includes('new')
    // Also check query params
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'new') {
        this.isNewSurvey = true
      }
    })
    console.log('Peer Validation Create Component Initialized, isNew:', this.isNewSurvey)
  }

  ngAfterViewInit() {
    console.log('Config Step Component:', this.configStepComponent)
  }

  backToDashboard() {
    // Navigate back to survey dashboard
    this.router.navigate(['/app/home/peer-validation'], { queryParams: { tab: 'all' } })
  }

  onLoaderChange(value: boolean) {
    if (this.loaderService) {
      this.loaderService.changeLoaderState(value)
    }
  }

  saveDraftAndExit() {
    if (this.currentStepperIndex === 0 && this.isNewSurvey) {
      const selectedCourse = this.configStepComponent?.selectedCourse
      if (!selectedCourse) {
        this.snackBar.open('Please select a content to save to draft', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        })
        return
      }

      const payload = this.buildDraftPayload()
      if (this.loaderService) {
        this.loaderService.changeLoaderState(true)
      }
      this.peerValidationService.saveDraft(payload).subscribe({
        next: () => {
          if (this.loaderService) {
            this.loaderService.changeLoaderState(false)
          }
          this.snackBar.open('Draft saved successfully', '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
          this.router.navigate(['/app/home/peer-validation'], { queryParams: { tab: 'draft' } })
        },
        error: (error) => {
          if (this.loaderService) {
            this.loaderService.changeLoaderState(false)
          }
          console.error('Error saving draft:', error)
          this.snackBar.open('Failed to save draft. Please try again.', '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
        }
      })
    } else {
      this.router.navigate(['/app/home/peer-validation'], { queryParams: { tab: 'draft' } })
    }
  }

  buildDraftPayload(): any {
    const formData = this.configStepComponent.configForm.value
    const course = this.configStepComponent.selectedCourse

    const endDate = formData.endDate ? new Date(formData.endDate).toISOString() : ''

    const payload: any = {
      title: course.name || '',
      endDate: endDate,
      clientVersion: 1.1,
      additionalProperties: {
        identifier: course.identifier || '',
        triggerAfter: formData.minTriggerDays,
        completionLookBack: formData.maxTriggerDays,
        thumbnail: course.posterImage || '',
        duration: (course.courseCategory === 'Blended Program') ? String(course.programDuration)
          : (course.duration ? String(course.duration) : '0')
      }
    }

    // Remove empty string fields from additionalProperties
    Object.keys(payload.additionalProperties).forEach(key => {
      if (payload.additionalProperties[key] === '') {
        delete payload.additionalProperties[key]
      }
    })

    // Remove empty string fields from top-level
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        delete payload[key]
      }
    })

    return payload
  }

  onNext() {
    // Validate current step before proceeding
    if (this.currentStepperIndex === 0) {
      if (!this.configStepComponent || !this.configStepComponent.isFormValid()) {
        console.log('Form is invalid. Please fill all required fields.')
        // Mark all fields as touched to show validation errors
        if (this.configStepComponent && this.configStepComponent.configForm) {
          Object.keys(this.configStepComponent.configForm.controls).forEach(key => {
            this.configStepComponent.configForm.get(key)?.markAsTouched()
          })
        }
        return
      }
    }

    if (this.currentStepperIndex < this.stepsLabels.length - 1) {
      this.currentStepperIndex++
      console.log('Next step:', this.currentStepperIndex)
    }
  }

  onPreviousStepper() {
    if (this.currentStepperIndex > 0) {
      this.currentStepperIndex--
      console.log('Previous step:', this.currentStepperIndex)
    }
  }

  onStepChanged(index: number) {
    // If trying to navigate away from step 0 (Configuration), validate the form first
    if (this.currentStepperIndex === 0 && index > 0) {
      // First, allow the navigation to happen
      this.currentStepperIndex = index
      // Then validate and revert if needed
      // if (!this.validateConfigurationStep()) {
      //   return
      // }
    } else {
      // For all other navigation, just update the index
      this.currentStepperIndex = index
    }
    console.log('Step changed to:', this.currentStepperIndex)
  }

  validateConfigurationStep(): boolean {
    // Check if we have the component reference
    if (!this.configStepComponent) {
      console.error('Config Step component reference not found')
      // Revert to step 0
      setTimeout(() => {
        this.currentStepperIndex = 0
        this.cdr.detectChanges()
      }, 0)
      return false
    }

    // Check if form is valid
    if (!this.configStepComponent.isFormValid()) {
      console.log('Cannot proceed. Please complete the configuration step.')
      // Mark all fields as touched to show validation errors
      if (this.configStepComponent.configForm) {
        Object.keys(this.configStepComponent.configForm.controls).forEach(key => {
          this.configStepComponent.configForm.get(key)?.markAsTouched()
        })
      }
      // Revert to step 0
      setTimeout(() => {
        this.currentStepperIndex = 0
        this.cdr.detectChanges()
      }, 0)
      return false
    }

    return true
  }

  onPublish() {
    // Publish the survey
    console.log('Survey Published')
    // Navigate to peer validation dashboard with active tab selected
    this.router.navigate(['/app/home/peer-validation'], { queryParams: { tab: 'active' } })
  }

}
