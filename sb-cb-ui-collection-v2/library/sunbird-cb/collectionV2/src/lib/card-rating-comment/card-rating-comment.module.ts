import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardRatingCommentComponent } from './card-rating-comment.component'

import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { PipeCountTransformModule, PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  declarations: [CardRatingCommentComponent],
  imports: [
    CommonModule,
    PipeCountTransformModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    AvatarPhotoModule,
    PipeRelativeTimeModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  exports: [
    CardRatingCommentComponent,
  ],
})
export class CardRatingCommentModule { }
