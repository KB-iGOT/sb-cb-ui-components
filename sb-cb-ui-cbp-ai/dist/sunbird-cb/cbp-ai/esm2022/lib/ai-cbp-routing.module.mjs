import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AiCbpComponent } from './ai-cbp.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadDocumentPageComponent } from './modules/upload-document-page/upload-document-page.component';
import { ApprovalRequestsComponent } from './components/approval-requests/approval-requests.component';
import { RoleMappingListComponent } from './components/role-mapping-list/role-mapping-list.component';
import { RoleMappingGenerationComponent } from './components/role-mapping-generation/role-mapping-generation.component';
import { InitialScreenComponent } from './modules/initial-screen/initial-screen.component';
import { ReviewRequestComponent } from './components/review-request/review-request.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
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
export class AiCbpRoutingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: AiCbpRoutingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: AiCbpRoutingModule, imports: [i1.RouterModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: AiCbpRoutingModule, imports: [RouterModule.forChild(routes), RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: AiCbpRoutingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [RouterModule.forChild(routes)],
                    exports: [RouterModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktY2JwLXJvdXRpbmcubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGlicmFyeS9zdW5iaXJkLWNiL2NicC1haS9zcmMvbGliL2FpLWNicC1yb3V0aW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQVUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDaEYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDNUcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdkcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sd0VBQXdFLENBQUM7QUFDeEgsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDM0YsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0RBQXNELENBQUM7OztBQUU5RixNQUFNLE1BQU0sR0FBVztJQUNuQjtRQUNJLElBQUksRUFBRSxFQUFFO1FBQ1IsU0FBUyxFQUFFLGNBQWM7UUFDekIsUUFBUSxFQUFFO1lBQ04sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRTtZQUNwRCxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsMkJBQTJCLEVBQUU7WUFDcEUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLHlCQUF5QixFQUFFO1lBQ2xFO2dCQUNJLElBQUksRUFBRSxNQUFNO2dCQUNaLFNBQVMsRUFBRSx3QkFBd0I7Z0JBQ25DLFNBQVMsRUFBRSxNQUFNO2FBQ3BCO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsU0FBUyxFQUFFLDhCQUE4QjtnQkFDekMsU0FBUyxFQUFFLE1BQU07YUFDcEI7WUFDRDtnQkFDSSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxTQUFTLEVBQUUsc0JBQXNCO2dCQUNqQyxTQUFTLEVBQUUsTUFBTTthQUNwQjtZQUNEO2dCQUNJLElBQUksRUFBRSw0QkFBNEI7Z0JBQ2xDLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLFNBQVMsRUFBRSxNQUFNO2FBQ3BCO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFNRixNQUFNLE9BQU8sa0JBQWtCOytHQUFsQixrQkFBa0I7Z0hBQWxCLGtCQUFrQix3Q0FGakIsWUFBWTtnSEFFYixrQkFBa0IsWUFIakIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDN0IsWUFBWTs7NEZBRWIsa0JBQWtCO2tCQUo5QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlLCBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQWlDYnBDb21wb25lbnQgfSBmcm9tICcuL2FpLWNicC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGFzaGJvYXJkQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50JztcbmltcG9ydCB7IFVwbG9hZERvY3VtZW50UGFnZUNvbXBvbmVudCB9IGZyb20gJy4vbW9kdWxlcy91cGxvYWQtZG9jdW1lbnQtcGFnZS91cGxvYWQtZG9jdW1lbnQtcGFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQXBwcm92YWxSZXF1ZXN0c0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hcHByb3ZhbC1yZXF1ZXN0cy9hcHByb3ZhbC1yZXF1ZXN0cy5jb21wb25lbnQnO1xuaW1wb3J0IHsgUm9sZU1hcHBpbmdMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3JvbGUtbWFwcGluZy1saXN0L3JvbGUtbWFwcGluZy1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSb2xlTWFwcGluZ0dlbmVyYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcm9sZS1tYXBwaW5nLWdlbmVyYXRpb24vcm9sZS1tYXBwaW5nLWdlbmVyYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7IEluaXRpYWxTY3JlZW5Db21wb25lbnQgfSBmcm9tICcuL21vZHVsZXMvaW5pdGlhbC1zY3JlZW4vaW5pdGlhbC1zY3JlZW4uY29tcG9uZW50JztcbmltcG9ydCB7IFJldmlld1JlcXVlc3RDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcmV2aWV3LXJlcXVlc3QvcmV2aWV3LXJlcXVlc3QuY29tcG9uZW50JztcblxuY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXG4gICAge1xuICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgY29tcG9uZW50OiBBaUNicENvbXBvbmVudCxcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHsgcGF0aDogJ2Rhc2hib2FyZCcsIGNvbXBvbmVudDogRGFzaGJvYXJkQ29tcG9uZW50IH0sXG4gICAgICAgICAgICB7IHBhdGg6ICd1cGxvYWQtZG9jdW1lbnRzJywgY29tcG9uZW50OiBVcGxvYWREb2N1bWVudFBhZ2VDb21wb25lbnQgfSxcbiAgICAgICAgICAgIHsgcGF0aDogJ2FwcHJvdmUtcmVxdWVzdHMnLCBjb21wb25lbnQ6IEFwcHJvdmFsUmVxdWVzdHNDb21wb25lbnQgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiBSb2xlTWFwcGluZ0xpc3RDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgcGF0aE1hdGNoOiAnZnVsbCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogJ2luaXRpYWwnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogUm9sZU1hcHBpbmdHZW5lcmF0aW9uQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgIHBhdGhNYXRjaDogJ2Z1bGwnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhdGg6ICdsb2dvdXQnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogSW5pdGlhbFNjcmVlbkNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiAncmV2aWV3LXJlcXVlc3QvOnJlcXVlc3RfaWQnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogUmV2aWV3UmVxdWVzdENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgIH1cbl07XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1JvdXRlck1vZHVsZS5mb3JDaGlsZChyb3V0ZXMpXSxcbiAgICBleHBvcnRzOiBbUm91dGVyTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBBaUNicFJvdXRpbmdNb2R1bGUgeyB9Il19