import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { DiscussionV2Component } from '../../discussion-v2.component'
import { NewCommentComponent } from '../../_common/new-comment/new-comment.component'
import { CommentCardComponent } from '../../_common/comment-card/comment-card.component'
import { WidgetCommentComponent } from '../../_common/widget-comment/widget-comment.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { AvatarPhotoComponent } from '../../_common/avatar-photo/avatar-photo.component'
import { CommentsService } from '../../_services/comments.service'
import { PipesModule } from '../../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatMenuModule } from '@angular/material/menu'
import { FlagDialogueComponent } from '../../_common/flag-dialogue/flag-dialogue.component'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { ConfirmDialogueComponent } from '../../_common/confirm-dialogue/confirm-dialogue.component'

@NgModule({
  declarations: [
    DiscussionV2Component,
    NewCommentComponent,
    CommentCardComponent,
    WidgetCommentComponent,
    AvatarPhotoComponent,
    FlagDialogueComponent,
    ConfirmDialogueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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
    PickerModule
  ],
  providers: [
    CommentsService,
  ],
  exports: [
    DiscussionV2Component,
    NewCommentComponent,
    CommentCardComponent,
    WidgetCommentComponent,
    PickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetCommentModule { }
