import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerBriefComponent } from './player-brief.component'
import { PipeCountTransformModule, PipeDurationTransformModule } from '@sunbird-cb/utils'
import { DisplayContentTypeModule } from '../display-content-type/display-content-type.module'
import { UserContentRatingModule } from '../user-content-rating/user-content-rating.module'
import { UserImageModule } from '../user-image/user-image.module'
import { BtnMailUserModule } from '../../btn-mail-user/btn-mail-user.module'
import { MarkAsCompleteModule } from '../mark-as-complete/mark-as-complete.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [PlayerBriefComponent],
  imports: [
    CommonModule,
    PipeCountTransformModule,
    PipeDurationTransformModule,
    DisplayContentTypeModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    UserContentRatingModule,
    MatCardModule,
    UserImageModule,
    BtnMailUserModule,
    MatButtonModule,
    MarkAsCompleteModule,
  ],
  exports: [PlayerBriefComponent],
})
export class PlayerBriefModule { }
