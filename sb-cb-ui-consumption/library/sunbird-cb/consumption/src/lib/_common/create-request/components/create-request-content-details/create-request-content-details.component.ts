import { Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'sb-uic-create-request-content-details',
  templateUrl: './create-request-content-details.component.html',
  styleUrls: [
    './create-request-content-details.component.scss',
    '../../../../styles/round-controls.scss'
  ]
})
export class CreateRequestContentDetailsComponent implements OnInit {
  @Input() contentDetailsForm!: FormGroup
  @Input() viewMode: string = ''

  userTypeOptions = [
    {
      displayName: 'Initiator',
      value: 'Initiator',
      isChecked: false,
      description: 'For users who raise or initiate a request, idea, or proposal for further review or action.'
    },
    {
      displayName: 'Reviewer',
      value: 'Reviewer',
      isChecked: false,
      description: 'For users responsible for examining, validating, or providing feedback before a decision is made.'
    },
    {
      displayName: 'Decision Maker',
      value: 'Decision Maker',
      isChecked: false,
      description: 'For users who have the authority to approve, reject, or finalize the request.'
    },
    {
      displayName: 'Strategic',
      value: 'Strategic',
      isChecked: false,
      description: 'For users involved in long-term planning, alignment, or strategic direction setting.'
    },
    {
      displayName: 'Policy Maker',
      value: 'Policy Maker',
      isChecked: false,
      description: 'For users responsible for defining, interpreting, or enforcing policies, guidelines, or regulatory frameworks.'
    }
  ];

  proficiencyLevels = [
    {
      displayName: 'Beginner',
      value: 'Beginner',
      description: 'For users with little or no prior knowledge who require foundational understanding and guidance.'
    },
    {
      displayName: 'Intermediate',
      value: 'Intermediate',
      description: 'For users with basic familiarity who can understand concepts with moderate complexity.'
    },
    {
      displayName: 'Advanced',
      value: 'Advanced',
      description: 'For users with strong expertise who can engage with detailed, technical, or specialized content.'
    }
  ];

  selectedUserTypes: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initialization()
  }

  initialization() {
    const userTypeControl = this.getControl('userType')
    if (userTypeControl && userTypeControl.value && Array.isArray(userTypeControl.value)) {
      const selectedUserTypeValues = [...userTypeControl.value]
      this.userTypeOptions.forEach(opt => {
        opt.isChecked = selectedUserTypeValues.includes(opt.value)
      })
      this.selectedUserTypes = selectedUserTypeValues
      userTypeControl.updateValueAndValidity()
    }
  }

  //#region (UI interaction)

  //#region (Form controls accessors)
  getControl(name: string) {
    return this.contentDetailsForm.get(name)
  }

  controlValidationStatus(controlName: string, errorType: string): boolean {
    const control = this.contentDetailsForm.get(controlName)
    if (!control) {
      return false
    }
    return control.touched && control.hasError(errorType)
  }

  onUserTypeSelectionChange(event: any, opt: { displayName: string, value: string, isChecked: boolean }) {
    opt.isChecked = event.checked
    if (opt.isChecked && !this.selectedUserTypes.includes(opt.value)) {
      this.selectedUserTypes.push(opt.value)
    } else {
      this.selectedUserTypes = this.selectedUserTypes.filter(v => v !== opt.value)
    }
    const userTypeControl = this.contentDetailsForm.get('userType')
    if (userTypeControl) {
      userTypeControl.setValue(this.selectedUserTypes)
      userTypeControl.markAsDirty()
      userTypeControl.updateValueAndValidity()
    }
  }

  // Restrict input to numbers only and update control value (keeps caret basic)
  numbersOnly(event: Event, controlName: 'hours' | 'minutes' | 'seconds') {
    const input = event.target as HTMLInputElement
    const cleaned = input.value.replace(/\D/g, '').slice(0, 2) // limit to 2 digits visually
    // update control without emitting extra validations outside Angular zone
    const ctrl = this.contentDetailsForm.get(controlName)
    if (ctrl) {
      ctrl.setValue(cleaned, { emitEvent: false })
      ctrl.updateValueAndValidity()
    }
    // also update the native input value so UI remains in sync
    input.value = cleaned
  }
  //#endregion (Form controls accessors)


  //#endregion (UI interaction)

}
