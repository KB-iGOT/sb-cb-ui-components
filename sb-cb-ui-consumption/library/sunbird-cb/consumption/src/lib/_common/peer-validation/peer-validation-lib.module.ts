import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { PvDashboardComponent } from './component/pv-dashboard/pv-dashboard.component'
import { PvCreateComponent } from './component/pv-create/pv-create.component'
import { PvQuestionStepComponent } from './component/pv-question-step/pv-question-step.component'
import { PvConfigStepComponent } from './component/pv-config-step/pv-config-step.component'
import { HorizontalDynamicStepperModule } from '../horizontal-dynamic-stepper/horizontal-dynamic-stepper.module'



@NgModule({
  declarations: [
    PvDashboardComponent,
    PvCreateComponent,
    PvQuestionStepComponent,
    PvConfigStepComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    HorizontalDynamicStepperModule
  ],
  exports: [
    PvDashboardComponent,
    PvCreateComponent,
    PvQuestionStepComponent,
    PvConfigStepComponent
  ]
})
export class PeerValidationLibModule { }
