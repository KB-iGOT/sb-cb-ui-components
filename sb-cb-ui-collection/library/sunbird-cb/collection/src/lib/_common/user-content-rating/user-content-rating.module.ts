import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserContentRatingComponent } from './user-content-rating.component'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { InViewPortModule, PipeCountTransformModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [UserContentRatingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    InViewPortModule,
    PipeCountTransformModule,
  ],
  exports: [UserContentRatingComponent],
})
export class UserContentRatingModule { }
