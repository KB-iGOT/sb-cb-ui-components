import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommentsService } from './_services/comments.service'
import { PipesModule } from './_pipes/pipes.module'
import { SkeletonLoaderModule } from './skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { WidgetCommentModule } from './_common/widget-comment/widget-comment.module'
import { WidgetDiscussionv2Module } from './_common/widget-discussionv2/widget-discussionv2.module'
import { NewPostDialogueComponent } from './_common/new-post-dialogue/new-post-dialogue.component'
import { MatListModule } from '@angular/material/list'
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    NewPostDialogueComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    PipesModule,
    SkeletonLoaderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    PickerModule,
    CKEditorModule,
    WidgetCommentModule,
    WidgetDiscussionv2Module,
  ],
  providers: [
    CommentsService,
  ],
  exports: [
    NewPostDialogueComponent,
    WidgetCommentModule,
    WidgetDiscussionv2Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiscussionV2Module { }
