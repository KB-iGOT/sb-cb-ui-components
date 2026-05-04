import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ShareTocComponent } from './share-toc/share-toc.component'
import { TranslateModule } from '@ngx-translate/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatListModule as MatListModule } from '@angular/material/list'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule as MatRadioModule } from '@angular/material/radio'
import { MatSelectModule as MatSelectModule } from '@angular/material/select'
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTabsModule as MatTabsModule } from '@angular/material/tabs'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'

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
    RouterModule

  ],
  exports: [ShareTocComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareTocModule { }
