import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserUpdateComponent } from './user-update/user-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacySlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AvatarPhotoLibModule } from '../avatar-photo-lib/avatar-photo-lib.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyListModule } from '@angular/material/legacy-list';
import { DialogComponentsModule } from '../dialog-components/dialog-components.module';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';



@NgModule({
  declarations: [
    UserUpdateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatLegacyFormFieldModule,
    MatIconModule,
    MatLegacyCardModule,
    MatLegacySelectModule,
    MatLegacyInputModule,
    MatLegacyDialogModule,
    MatLegacyButtonModule,
    MatLegacySlideToggleModule,
    MatButtonToggleModule,
    AvatarPhotoLibModule,
    MatDatepickerModule,
    MatLegacyListModule,
    MatLegacyChipsModule,
    MatLegacyAutocompleteModule,
    DialogComponentsModule
  ],
  exports: [
    UserUpdateComponent
  ]
})
export class UserUpdateModule { }
