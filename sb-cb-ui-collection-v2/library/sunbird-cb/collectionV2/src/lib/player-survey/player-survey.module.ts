import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
import { PlayerSurveyComponent } from './player-survey.component'
// import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'
import { TranslateModule } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatSliderModule } from '@angular/material/slider'
import { SurveyFormQuestionComponent } from '../survey-form-question/survey-form-question.component'
import { SurveyFormSectionComponent } from '../survey-form-section/survey-form-section.component'
import { MatRadioModule } from '@angular/material/radio'
// REMOVED: MatDatepickerModule causes ng-packagr PickerModule resolution error
// Consumer applications must import MatDatepickerModule and MatNativeDateModule themselves
// import { MatDatepickerModule } from '@angular/material/datepicker'
// import { MatNativeDateModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
@NgModule({
    declarations: [
        PlayerSurveyComponent,
        SurveyFormQuestionComponent,
        SurveyFormSectionComponent
    ],
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatMenuModule,
        MatButtonModule,
        MatSliderModule,
        MatToolbarModule,
        ReactiveFormsModule,
        BtnFullscreenModule,
        MatInputModule,
        // MicroSurveyModule,
        MatRadioModule,
        // REMOVED: MatDatepickerModule causes ng-packagr build error
        // Consumer apps must import these modules:
        // MatNativeDateModule,
        // MatDatepickerModule,
        MatSelectModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        TranslateModule.forChild(),
    ],
    exports: [PlayerSurveyComponent],
})
export class PlayerSurveyModule { }
