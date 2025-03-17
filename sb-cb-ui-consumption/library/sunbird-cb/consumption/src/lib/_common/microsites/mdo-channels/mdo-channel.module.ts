import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MdoChannelV1Component } from './mdo-channel-v1/mdo-channel-v1.component';
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module';
import { HighlightsOfWeekModule } from '../../highlights-of-week/highlights-of-week.module';
import { EventsModule } from '../../events/events.module';
import { SpeakersModule } from '../../speakers/speakers.module';

import {
  AnnouncementsModule,
  CardsModule,
  CommonMethodsService,
  CommonStripModule,
  CompetencyPassbookModule,
  CompetencyPassbookMdoModule,
  ContentStripWithTabsLibModule,
  DataPointsModule,
  SlidersLibModule,
  HttpLoaderFactory,
  TopLearnersModule,
  CbpPlanModule
} from './../../../../public-api'
import { MdoChannelV2Component } from './mdo-channel-v2/mdo-channel-v2.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { UserProgressModule } from '../../user-progress/user-progress.module';
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module';
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module';
import { OrderByPipeModule } from '../../../_pipes/order-by/order-by.pipe.module';
import { SafeUrlPipeModule } from '../../../_pipes/safe-url/safe-url.module';
import { VideoConferenceModule } from '../../video-conference/video-conference.module';



@NgModule({
  declarations: [MdoChannelV1Component, MdoChannelV2Component],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    AnnouncementsModule,
    TopLearnersModule,
    CbpPlanModule,
    CardsModule,
    CommonStripModule,
    CompetencyPassbookModule,
    CompetencyPassbookMdoModule,
    ContentStripWithTabsLibModule,
    DataPointsModule,
    SlidersLibModule,
    HighlightsOfWeekModule,
    UserProgressModule,
    EventsModule,
    SpeakersModule,
    MdoLeaderboardModule,
    KeyHighlightsModule,
    MatTabsModule,
    OrderByPipeModule,
    SafeUrlPipeModule,
    VideoConferenceModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [MdoChannelV1Component, MdoChannelV2Component],
  providers:[
    CommonMethodsService],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MDOChannelModule { }
