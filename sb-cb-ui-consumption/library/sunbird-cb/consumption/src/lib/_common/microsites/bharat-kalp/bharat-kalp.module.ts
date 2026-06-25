import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module'
import { SlidersLibModule } from '../../sliders/sliders.module'
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module'
import { ContentStripWithTabsLibModule } from '../../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module'
import { EventsModule } from '../../events/events.module'
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module'
import { DataPointsModule } from '../../data-points/data-points.module'
import { SpeakersModule } from '../../speakers/speakers.module'
import { UserProgressModule } from '../../user-progress/user-progress.module'
import { ContentStripFacetFilterModule } from '../../strips/content-strip-facet-filter/content-strip-facet-filter.module'
import { MicrositesComponentsModule } from '../micro-sites-components/microsites-components.module'
import { CommonMethodsService } from '../../../_services/common-methods.service'
import { BharatKalpComponent } from './bharat-kalp/bharat-kalp.component'
import { WeekProgressComponent } from './week-progress/week-progress.component'

@NgModule({
  declarations: [BharatKalpComponent, WeekProgressComponent],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
    MatSnackBarModule,
    SkeletonLoaderLibModule,
    SlidersLibModule,
    KeyHighlightsModule,
    ContentStripWithTabsLibModule,
    DataPointsModule,
    EventsModule,
    MdoLeaderboardModule,
    SpeakersModule,
    UserProgressModule,
    ContentStripFacetFilterModule,
    PipeSafeSanitizerModule,
    MicrositesComponentsModule,
  ],
  exports: [BharatKalpComponent],
  providers: [CommonMethodsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BharatKalpModule { }
