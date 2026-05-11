import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiCbpComponent } from './ai-cbp.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadDocumentPageComponent } from './modules/upload-document-page/upload-document-page.component';
import { ApprovalRequestsComponent } from './components/approval-requests/approval-requests.component';
import { RoleMappingListComponent } from './components/role-mapping-list/role-mapping-list.component';
import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
import { InitialScreenComponent } from './modules/initial-screen/initial-screen.component';
import { ReviewRequestComponent } from './components/review-request/review-request.component';

const routes: Routes = [
    {
        path: '',
        component: AiCbpComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'upload-documents', component: UploadDocumentPageComponent },
            { path: 'approve-requests', component: ApprovalRequestsComponent },
            {
                path: 'list',
                component: RoleMappingListComponent,
                pathMatch: 'full'
            },
            {
                path: 'initial',
                component: RoleMappingGenerationComponent,
                pathMatch: 'full'
            },
            {
                path: 'logout',
                component: InitialScreenComponent,
                pathMatch: 'full'
            },
            {
                path: 'review-request/:request_id',
                component: ReviewRequestComponent,
                pathMatch: 'full'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AiCbpRoutingModule { }