import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserAutocompleteComponent } from './user-autocomplete.component'
import { UserImageModule } from '../user-image/user-image.module'
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'

@NgModule({
  declarations: [UserAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    UserImageModule,
  ],
  exports: [UserAutocompleteComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserAutocompleteModule { }
