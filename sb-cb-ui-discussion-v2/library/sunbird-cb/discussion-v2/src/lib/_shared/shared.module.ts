import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { PipesModule } from '../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component'
import { FlagDialogueComponent } from './flag-dialogue/flag-dialogue.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AvatarPhotoComponent,
    FlagDialogueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PipesModule,
    SkeletonLoaderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  exports: [
    AvatarPhotoComponent,
    FlagDialogueComponent
  ],
})
export class SharedModule { }
