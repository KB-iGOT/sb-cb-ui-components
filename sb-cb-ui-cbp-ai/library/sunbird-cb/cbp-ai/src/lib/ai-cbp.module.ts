import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AiCbpComponent } from './ai-cbp.component';
import { ApprovalRequestFormComponent } from './components/approval-request-form/approval-request-form.component';
import { ReviewRequestComponent } from './components/review-request/review-request.component';
import { ApprovalRequestsComponent } from './components/approval-requests/approval-requests.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';  
import { UpdateDesignationHierarchyComponent } from './components/update-designation-hierarchy/update-designation-hierarchy.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { RoleMappingService } from './modules/shared/services/role-mapping.service';
import { GapAnalysisRecommendedCourseComponent } from './components/gap-analysis-recommended-course/gap-analysis-recommended-course.component';
import { OrderByNamePipe } from './modules/shared/pipes/order-by-name.pipe';
import { UploadDocumentPageComponent } from './modules/upload-document-page/upload-document-page.component';
import { UploadDialogComponent } from './modules/upload-document-page/upload-dialog/upload-dialog.component';
import { InitialScreenComponent } from './modules/initial-screen/initial-screen.component';
import { ProgressDialogComponent } from './modules/upload-document-page/progress-dialog/progress-dialog.component';
import { DeleteRoleMappingPopupComponent } from './components/delete-role-mapping-popup/delete-role-mapping-popup.component';
import { ListPopupComponent } from './components/list-popup/list-popup.component';
import { SuggestMoreCoursesComponent } from './components/suggest-more-courses/suggest-more-courses.component';
import { AddDesignationComponent } from './components/add-designation/add-designation.component';
import { AddPersonalisationComponent } from './components/add-personalisation/add-personalisation.component';
import { ViewCbpPlanComponent } from './components/view-cbp-plan/view-cbp-plan.component';
import { EditCbpPlanComponent } from './components/edit-cbp-plan/edit-cbp-plan.component';
import { GenerateCourseRecommendationComponent, RegenerateConfirmationDialog } from './components/generate-course-recommendation/generate-course-recommendation.component';
import { ViewCourseRecommendationComponent } from './components/view-course-recommendation/view-course-recommendation.component';
import { DeleteRoleMappingComponent } from './components/delete-role-mapping/delete-role-mapping.component';
import { ViewFinalCbpPlanComponent } from './components/view-final-cbp-plan/view-final-cbp-plan.component';
import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
import { RoleMappingListComponent } from './components/role-mapping-list/role-mapping-list.component'
import { PipePublicURLModule } from './pipe-public-URL/pipe-public-URL.module';
import { DirectiveModule } from './modules/shared/directives/directive.module';


import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { MarkdownModule } from 'ngx-markdown';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';
import { AiCbpRoutingModule } from './ai-cbp-routing.module';

@NgModule({
  declarations: [
    AiCbpComponent,
    ApprovalRequestFormComponent,
    ReviewRequestComponent,
    ApprovalRequestsComponent,
    DashboardComponent,
    UpdateDesignationHierarchyComponent,
    AddCourseComponent,
    GapAnalysisRecommendedCourseComponent,
    OrderByNamePipe,
    UploadDocumentPageComponent,
    UploadDialogComponent,
    InitialScreenComponent,
    ProgressDialogComponent,
    DeleteRoleMappingPopupComponent,
    ListPopupComponent,
    SuggestMoreCoursesComponent,
    AddDesignationComponent,
    AddPersonalisationComponent,
    ViewCbpPlanComponent,
    EditCbpPlanComponent,
    GenerateCourseRecommendationComponent,
    RegenerateConfirmationDialog,
    ViewCourseRecommendationComponent,
    DeleteRoleMappingComponent,
    ViewFinalCbpPlanComponent,
    RoleMappingGenerationComponent,
    RoleMappingListComponent

    

  ],
  imports: [
    CommonModule,
    RouterModule,
      MatSidenavModule, MatListModule,  MatCardModule, FormsModule,
        MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
        MatRadioModule, MatDialogModule, MatChipsModule, MatSelectModule,MatLegacyCheckboxModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        MarkdownModule.forRoot(),
        DragDropModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxDaterangepickerMd.forRoot(),
         PaginationModule.forRoot(),
            ToastrModule.forRoot(),
            NgbModalModule,
            DirectiveModule,
            PipePublicURLModule,
            AiCbpRoutingModule
  ],
  exports: [
     AiCbpComponent,
    ApprovalRequestFormComponent,
    ReviewRequestComponent,
    ApprovalRequestsComponent,
    DashboardComponent,
    UpdateDesignationHierarchyComponent,
    AddCourseComponent,
    GapAnalysisRecommendedCourseComponent,
    OrderByNamePipe,
    UploadDocumentPageComponent,
    UploadDialogComponent,
    InitialScreenComponent,
    ProgressDialogComponent,
    DeleteRoleMappingPopupComponent,
    ListPopupComponent,
    SuggestMoreCoursesComponent,
    AddDesignationComponent,
    AddPersonalisationComponent,
    ViewCbpPlanComponent,
    EditCbpPlanComponent,
    GenerateCourseRecommendationComponent,
    RegenerateConfirmationDialog,
    ViewCourseRecommendationComponent,
    DeleteRoleMappingComponent,
    ViewFinalCbpPlanComponent,
    RoleMappingGenerationComponent,
    RoleMappingListComponent
  ],
  providers: [
    RoleMappingService
  ]
})
export class AiCbpModule { }
