import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnSocialVoteComponent } from './btn-social-vote.component'
import { MatBadgeModule } from '@angular/material/badge'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { DialogSocialActivityUserModule } from '../../dialog/dialog-social-activity-user/dialog-social-activity-user.module'

@NgModule({
  declarations: [BtnSocialVoteComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatBadgeModule, DialogSocialActivityUserModule],
  exports: [BtnSocialVoteComponent],
})
export class BtnSocialVoteModule { }
