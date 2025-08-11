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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserProgressModule } from '../../user-progress/user-progress.module';
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module';
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module';
import { OrderByPipeModule } from '../../../_pipes/order-by/order-by.pipe.module';
import { SafeUrlPipeModule } from '../../../_pipes/safe-url/safe-url.module';
import { VideoConferenceModule } from '../../video-conference/video-conference.module';
import { MdoChannelV3Component } from './mdo-channel-v3/mdo-channel-v3.component';
// Import all section components
import { TopSectionComponent } from './components/top-section/top-section.component';
import { LookerSectionComponent } from './components/looker-section/looker-section.component';
import { TopLearnersComponent } from './components/top-learners/top-learners.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SupportSectionComponent } from './components/support-section/support-section.component';
import { CompetencyComponent } from './components/competency/competency.component';
import { ContentStripComponent } from './components/content-strip/content-strip.component';
import { ColumnSectionDisplayComponent } from './components/column-section-display/column-section-display.component';
import { MobileSectionsComponent } from './components/mobile-sections/mobile-sections.component';

// Import any shared widgets/components
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2';
import { EditorDialogComponent } from './components/editor-dialog/editor-dialog.component';
import { MatDialogModule } from '@angular/material/dialog'; // Updated to non-legacy module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [MdoChannelV1Component, MdoChannelV2Component,
    MdoChannelV3Component,
    TopSectionComponent,
    LookerSectionComponent,
    TopLearnersComponent,
    MainContentComponent,
    SupportSectionComponent,
    CompetencyComponent,
    ContentStripComponent,
    ColumnSectionDisplayComponent,
    MobileSectionsComponent,
    EditorDialogComponent
  ],
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
    SbUiResolverModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
DragDropModule,
    HttpClientModule,
    MatIconModule,
  ],
  exports: [MdoChannelV1Component, MdoChannelV2Component, MdoChannelV3Component],
  providers: [
    CommonMethodsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MDOChannelModule { }
