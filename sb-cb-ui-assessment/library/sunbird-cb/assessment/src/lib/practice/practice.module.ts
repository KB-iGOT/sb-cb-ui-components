import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PracticeComponent } from './practice.component'
import { OverviewComponent } from './components/overview/overview.component'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'

import { PipeDurationTransformModule } from './../pipes/pipe-duration-transform/pipe-duration-transform.module'
import { PipeLimitToModule } from './../pipes/pipe-limit-to/pipe-limit-to.module'
import { SkeletonLoaderModule } from './skeleton-loader/skeleton-loader.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { ResultComponent } from './components/result/result.component'
import { FillInTheBlankComponent } from './components/question/fitb/fitb.component'
import { MultipleChoiseQuesComponent } from './components/question/mcq-mca/mcq-mca.component'
import { SingleChoiseQuesComponent } from './components/question/mcq-sca/mcq-sca.component'
import { MatchTheFollowingQuesComponent } from './components/question/mtf/mtf.component'
// import { TranslateModule } from '@ngx-translate/core'
import { StandaloneAssessmentComponent } from './components/standalone-assessment/standalone-assessment.component'
import { AssessmentHeaderComponent } from './components/assessment-header/assessment-header.component'
import { AssessmentFooterComponent } from './components/assessment-footer/assessment-footer.component'
import { AssessmentQuestionContainerComponent } from './components/assessment-question-container/assessment-question-container.component'
import { AssessmentQuestionCountContainerComponent } from './components/assessment-question-count-container/assessment-question-count-container.component'
import { AssessmentPerformanceSummaryComponent } from './components/assessment-performance-summary/assessment-performance-summary.component'
import { AssessmentPerformanceInsightSummaryComponent } from './components/assessment-performance-insight-summary/assessment-performance-insight-summary.component'
import { FinalAssessmentPopupComponent } from './components/final-assessment-popup/final-assessment-popup.component'
import { QuestionSafeUrlPipe } from './question-safe-pipe.pipe'
@NgModule({
    declarations: [
        FillInTheBlankComponent,
        MatchTheFollowingQuesComponent,
        MultipleChoiseQuesComponent,
        OverviewComponent,
        PracticeComponent,
        QuestionComponent,
        ResultComponent,
        SingleChoiseQuesComponent,
        SubmitQuizDialogComponent,
        StandaloneAssessmentComponent,
        AssessmentHeaderComponent,
        AssessmentFooterComponent,
        AssessmentQuestionContainerComponent,
        AssessmentQuestionCountContainerComponent,
        AssessmentPerformanceSummaryComponent,
        AssessmentPerformanceInsightSummaryComponent,
        FinalAssessmentPopupComponent,
        QuestionSafeUrlPipe,
    ],
    imports: [
        CommonModule,
        PipeDurationTransformModule,
        PipeLimitToModule,
        MatCardModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatListModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSidenavModule,
        MatExpansionModule,
        MatTableModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatChipsModule,
        SkeletonLoaderModule,
        // TranslateModule,
        MatMenuModule,
        MatSelectModule,
    ],
    exports: [
        PracticeComponent,
        StandaloneAssessmentComponent,
        AssessmentHeaderComponent,
        AssessmentFooterComponent,
        AssessmentQuestionContainerComponent,
        AssessmentQuestionCountContainerComponent,
        AssessmentPerformanceSummaryComponent,
        AssessmentPerformanceInsightSummaryComponent,
        SkeletonLoaderModule,
        FillInTheBlankComponent,
        MatchTheFollowingQuesComponent,
        MultipleChoiseQuesComponent,
        OverviewComponent,
        PracticeComponent,
        QuestionComponent,
        ResultComponent,
    ]
})
export class PracticePlModule { }
