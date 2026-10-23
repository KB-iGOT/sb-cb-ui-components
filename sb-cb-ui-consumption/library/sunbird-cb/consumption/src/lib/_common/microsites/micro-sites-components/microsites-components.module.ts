import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { MatTooltipModule } from '@angular/material/tooltip'

import { AnnouncementsModule } from '../../announcements/announcements.module'
import { CardsModule } from '../../cards/cards.module'
import { CommonMethodsService } from '../../../_services/common-methods.service'
import { CommonStripModule } from '../../common-strip/common-strip.module'
import { CompetencyPassbookModule } from '../../competency-passbook/competency-passbook.module'
import { CompetencyPassbookMdoModule } from '../../competency-passbook-mdo/competency-passbook-mdo.module'
import { ContentStripWithTabsLibModule } from '../../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module'
import { DataPointsModule } from '../../data-points/data-points.module'
import { SlidersLibModule } from '../../sliders/sliders.module'
import { TopLearnersModule } from '../../top-learners/top-learners.module'
import { CbpPlanModule } from '../../cbp-plan/cbp-plan.module'
import { HighlightsOfWeekModule } from '../../highlights-of-week/highlights-of-week.module'
import { UserProgressModule } from '../../user-progress/user-progress.module'
import { EventsModule } from '../../events/events.module'
import { SpeakersModule } from '../../speakers/speakers.module'
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module'
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module'
import { HttpLoaderFactory } from '../../http-loader-factory'
// Import all section components
import { TopSectionComponent } from './components/top-section/top-section.component'
import { LookerSectionComponent } from './components/looker-section/looker-section.component'
import { TopLearnersComponent } from './components/top-learners/top-learners.component'
import { MainContentComponent } from './components/main-content/main-content.component'
import { SupportSectionComponent } from './components/support-section/support-section.component'
import { CompetencyComponent } from './components/competency/competency.component'
import { ContentStripComponent } from './components/content-strip/content-strip.component'
import { ColumnSectionDisplayComponent } from './components/column-section-display/column-section-display.component'
import { MobileSectionsComponent } from './components/mobile-sections/mobile-sections.component'

// Import any shared widgets/components
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { EditorDialogComponent } from './components/editor-dialog/editor-dialog.component'
import { MatDialogModule } from '@angular/material/dialog' // Updated to non-legacy module
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { SlwConfigDialogComponent } from './components/slw-config-dialog/slw-config-dialog.component'
import { ActionItemsComponent } from './components/action-items/action-items.component'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core' // or MatMomentDateModule if you use moment.js
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module'
import { OrderByPipeModule } from '../../../_pipes/order-by/order-by.pipe.module'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { SafeUrlPipeModule } from '../../../_pipes/safe-url/safe-url.module'
import { VideoConferenceModule } from '../../video-conference/video-conference.module'
import { StripSectionCreateComponent } from './components/strip-section-create/strip-section-create.component'
import { StripAddContentComponent } from './components/strip-add-content/strip-add-content.component'
import { AddTabDialogComponent } from './components/add-tab-dialog/add-tab-dialog.component'
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'
import { EventsCalendarModule } from '../../events-calendar/events-calendar.module'
import { AiProgramComponent } from './components/ai-program/ai-program.component'
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [
    TopSectionComponent,
    LookerSectionComponent,
    TopLearnersComponent,
    MainContentComponent,
    SupportSectionComponent,
    CompetencyComponent,
    ContentStripComponent,
    ColumnSectionDisplayComponent,
    MobileSectionsComponent,
    EditorDialogComponent,
    SlwConfigDialogComponent,
    ActionItemsComponent,
    StripSectionCreateComponent,
    StripAddContentComponent,
    AddTabDialogComponent,
    ConfirmDialogComponent,
    AiProgramComponent
  ],
  exports: [
    TopSectionComponent,
    LookerSectionComponent,
    TopLearnersComponent,
    MainContentComponent,
    SupportSectionComponent,
    CompetencyComponent,
    ContentStripComponent,
    ColumnSectionDisplayComponent,
    MobileSectionsComponent,
    EditorDialogComponent,
    SlwConfigDialogComponent,
    ActionItemsComponent,
    StripAddContentComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [CommonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
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
    MatSelectModule,
    MatPaginatorModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    DragDropModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EventsCalendarModule,
    PipeDurationTransformModule], providers: [
      CommonMethodsService,
      provideHttpClient(withInterceptorsFromDi())
    ]
})
export class MicrositesComponentsModule { }


