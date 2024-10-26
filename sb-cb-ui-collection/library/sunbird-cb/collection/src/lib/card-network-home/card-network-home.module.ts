import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { HorizontalScrollerModule, PipeNameTransformModule } from '@sunbird-cb/utils'
import { ActivityCardModule } from '../activity-card/activity-card.module'
import { TourModule } from '../_common/tour-guide/tour-guide.module'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { CardNetworkHomeComponent } from './card-network-home.component'
import { ChallengeModule } from '../challenge/challenge.module'
import { MatGridListModule } from '@angular/material/grid-list'
import { FormsModule } from '@angular/forms'

@NgModule({
    declarations: [CardNetworkHomeComponent],
    imports: [
        CommonModule,
        AvatarPhotoModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        HorizontalScrollerModule,
        ActivityCardModule,
        TourModule,
        PipeNameTransformModule,
        ChallengeModule,
        MatInputModule,
        MatGridListModule,
        FormsModule,
    ],
    providers: []
})
export class CardNetworkHomeModule {

}
