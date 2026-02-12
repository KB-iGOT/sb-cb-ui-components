import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { PvConfigStepComponent } from '../pv-config-step/pv-config-step.component'

@Component({
  selector: 'sb-uic-pv-create',
  templateUrl: './pv-create.component.html',
  styleUrls: ['./pv-create.component.scss'],
  standalone: false
})
export class PvCreateComponent implements OnInit, AfterViewInit {
  @ViewChild(PvConfigStepComponent) configStepComponent!: PvConfigStepComponent

  stepsLabels = ['Configuration', 'Questions']
  currentStepperIndex = 0
  isSPVRoute = false

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Check if URL contains spv/peer-validation
    this.isSPVRoute = this.router.url.includes('spv/peer-validation')
    // Initialize component
    console.log('Peer Validation Create Component Initialized')
  }

  ngAfterViewInit() {
    console.log('Config Step Component:', this.configStepComponent)
  }

  backToDashboard() {
    // Navigate back to survey dashboard
    const route = this.isSPVRoute ? '/app/home/spv/peer-validation' : '/app/home/peer-validation'
    this.router.navigate([route], { queryParams: { tab: 'all' } })
  }

  saveDraftAndExit() {
    // Save draft and exit
    console.log('Save Draft & Exit')
    // Navigate to peer validation dashboard with draft tab selected
    const route = this.isSPVRoute ? '/app/home/spv/peer-validation' : '/app/home/peer-validation'
    this.router.navigate([route], { queryParams: { tab: 'draft' } })
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
    const route = this.isSPVRoute ? '/app/home/spv/peer-validation' : '/app/home/peer-validation'
    this.router.navigate([route], { queryParams: { tab: 'active' } })
  }

}
