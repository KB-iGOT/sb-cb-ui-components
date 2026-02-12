import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ShareTocComponent } from './share-toc/share-toc.component'
import { TranslateModule } from '@ngx-translate/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/input'
import { MatLegacyListModule as MatListModule } from '@angular/material/list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/select'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  declarations: [ShareTocComponent],
  imports: [
    CommonModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports: [ShareTocComponent],
})
export class ShareTocModule { }
