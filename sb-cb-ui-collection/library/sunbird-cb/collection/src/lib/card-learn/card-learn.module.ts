import { CommonModule } from '@angular/common'
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { HorizontalScrollerModule } from '@sunbird-cb/utils'
// import { ActivitiesService } from '../../../../../../project/ws/app/src/lib/routes/activities/services/activities.service'
import { ActivityCardModule } from '../activity-card/activity-card.module'
import { TourModule } from '../_common/tour-guide/tour-guide.module'
import { UserImageModule } from '../_common/user-image/user-image.module'
import { CardLearnComponent } from '././card-learn.component'
import { ChallengeModule } from '../challenge/challenge.module'

@NgModule({
    declarations: [CardLearnComponent],
    imports: [
        CommonModule,
        UserImageModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatCardModule,
        HorizontalScrollerModule,
        ActivityCardModule,
        TourModule,
        ChallengeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class CardLearnModule { }
