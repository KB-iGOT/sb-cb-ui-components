import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserAutocompleteComponent } from './user-autocomplete.component'
import { UserImageModule } from '../user-image/user-image.module'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/input'

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
})
export class UserAutocompleteModule { }
