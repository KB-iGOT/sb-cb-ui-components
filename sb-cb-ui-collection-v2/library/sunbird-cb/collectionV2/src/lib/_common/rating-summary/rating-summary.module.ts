import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RatingSummaryComponent } from './rating-summary.component'
import { PipeCountTransformModule } from '@sunbird-cb/utils-v2'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  declarations: [RatingSummaryComponent],
  imports: [
    CommonModule,
    PipeCountTransformModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    RatingSummaryComponent,
  ],
})
export class RatingSummaryModule { }
