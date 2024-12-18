import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDiscussionv2Component } from './widget-discussionv2.component';
import { NewPostComponent } from '../new-post/new-post.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { PipesModule } from '../../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from '../../_shared/shared.module';
import { ImageSlidersModule } from '../image-sliders/image-sliders.module';



@NgModule({
  declarations: [
    WidgetDiscussionv2Component,
    NewPostComponent,
    PostCardComponent,
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
    // CKEditorModule,
    SharedModule,
    ImageSlidersModule
  ],
  exports: [
    WidgetDiscussionv2Component,
    NewPostComponent,
    PostCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetDiscussionv2Module { }
