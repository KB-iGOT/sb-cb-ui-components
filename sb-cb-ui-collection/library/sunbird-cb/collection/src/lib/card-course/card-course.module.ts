import { NgModule } from '@angular/core'
import { CardCourseComponent } from './card-course.component'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { HorizontalScrollerModule, PipeNameTransformModule } from '@sunbird-cb/utils'
import { MatProgressBarModule } from '@angular/material/progress-bar'

@NgModule({
  declarations: [CardCourseComponent],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatProgressBarModule,
    MatExpansionModule, MatIconModule, MatProgressSpinnerModule, AvatarPhotoModule, HorizontalScrollerModule, PipeNameTransformModule],
  entryComponents: [CardCourseComponent],
})
export class CardCourseModule {

}
