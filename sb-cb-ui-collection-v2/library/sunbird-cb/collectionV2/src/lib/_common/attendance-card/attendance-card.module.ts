import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttendanceCardComponent } from './attendance-card.component'
// ADDED: MatDatepickerModule needed by @sunbird-cb/discussion-v2 transitive dependency
// Makes PickerModule symbol available for ng-packagr compilation
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTabsModule } from '@angular/material/tabs'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  declarations: [AttendanceCardComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    // ADDED: MatDatepickerModule needed for ng-packagr to resolve @sunbird-cb/discussion-v2 PickerModule symbol
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [AttendanceCardComponent],
})
export class AttendanceCardModule { }
