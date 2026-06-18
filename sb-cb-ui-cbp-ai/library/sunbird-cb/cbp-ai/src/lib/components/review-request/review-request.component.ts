import { Component, ViewChild } from '@angular/core';
import { SharedService } from '../../modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewCbpPlanComponent } from '../view-cbp-plan/view-cbp-plan.component';
import { EditCbpPlanComponent } from '../edit-cbp-plan/edit-cbp-plan.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewCourseRecommendationComponent } from '../view-course-recommendation/view-course-recommendation.component';
import { RejectItemRequestFormComponent } from '../reject-item-request-form/reject-item-request-form.component';
import { PublishApproveRequestFormComponent } from '../publish-request-form/publish-approve-request-form.component';
import { RejectRequestFormComponent } from '../reject-request-form/reject-request-form.component';
import { ListPopupComponent } from '../list-popup/list-popup.component';
import { finalize } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-review-request',
    templateUrl: './review-request.component.html',
    styleUrls: ['./review-request.component.scss'],
    standalone: false
})
export class ReviewRequestComponent {
  request: any = {
  };
  searchText = ''
  expandedResponsibilityRows: { [id: string]: boolean } = {};
  expandedActivityRows: { [id: string]: boolean } = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading = false
  activeTab = 'matched'
  displayedColumns: string[] = [
    'designation_name',
    'role_responsibilities',
    'activities',
    'behavioral',
    'functional',
    'domain',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  portalData: any
  activeRowElement: any
  requestData: any
  requestId:any
  constructor(public sharedService: SharedService, public snackBar: MatSnackBar, public route: ActivatedRoute, public router: Router,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.portalData = this.route.snapshot.data['parentData']
    const requestId = this.route.snapshot.paramMap.get('request_id');
    this.requestId = this.route.snapshot.paramMap.get('request_id');

    const source = this.route.snapshot.queryParamMap.get('source');

    if (source === 'mdo') {
      this.portalData?.parentAppData?.fromPortal === 'mdo'
      this.sharedService.fromMdoPortal = true

      this.getMDORequestDetails(requestId);
    } else {
      this.getRequestDetails(requestId);
    }

    // if (this.portalData && this.portalData?.parentAppData && this.portalData?.parentAppData?.fromPortal &&
    //   this.portalData?.parentAppData?.fromPortal === 'mdo'


    // ) {

    // } else {
    //   if (requestId) {
    //     this.getRequestDetails(requestId);
    //   }
    // }


  }


  getRequestDetails(requestId) {
    this.loading = true


    this.sharedService.viewApprovalRequests(requestId).subscribe({

      next: (res: any) => {

        console.log('res', res)
        this.request = res
        this.loading = false
        this.dataSource = new MatTableDataSource(res?.items);
        this.initializeTableFilter();
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100);
      },
      error: () => {
        this.loading = false
        this.snackBar.open('Failed to load the approval request information.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  getMDORequestDetails(requestId) {
    this.loading = true

    this.sharedService.mdoBaseUrl = this.portalData?.configDetails?.mdoPath
    this.sharedService.mdoConfigDetails = this.portalData?.configDetails
    this.sharedService.baseUrl = this.portalData?.configDetails?.mdoPath + "/"
    this.sharedService.configDetails = this.portalData?.configDetails
    this.sharedService.viewMDOApprovalRequests(requestId).subscribe({

      next: (res: any) => {
        console.log('res', res)
        if (res && res.status &&
          (res.status?.toLowerCase() !== 'pending' && 
            res.status?.toLowerCase() !== 'approved' && 
            res.status?.toLowerCase() !== 'rejected')
        ) {
          this.snackBar.open('This Request is already revoked', 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          this.router.navigate(['/app/home/ai-cbp-requests']);
        }
        this.requestData = res
        this.sharedService.requestData = res
        this.request = res
        this.loading = false
        this.dataSource = new MatTableDataSource(res?.items);
        this.initializeTableFilter();
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100);
      },
      error: () => {
        this.loading = false
        this.snackBar.open('Failed to load the approval request information.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }


  toggleResponsibilityExpand(id: string): void {
    this.expandedResponsibilityRows[id] = !this.expandedResponsibilityRows[id];
  }

  isResponisbilityExpanded(id: string): boolean {


    // const dialogRef = this.dialog.open(ListPopupComponent, {
    //   width: '1000px',
    //   data: this.activeRowElement,
    //    panelClass: 'view-cbp-plan-popup',
    //   minHeight: '400px',          // Set minimum height
    //   maxHeight: '90vh',           // Prevent it from going beyond viewport
    //   disableClose: true // Optional: prevent closing with outside click
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   return false
    // });
    return this.expandedResponsibilityRows[id];
  }

  toggleActivityExpand(id: string): void {
    this.expandedActivityRows[id] = !this.expandedActivityRows[id];
  }

  isActivityExpanded(id: string): boolean {
    return this.expandedActivityRows[id];
  }

  getCompetenciesByType(competencies: any[], type: string): any[] {
    return competencies?.filter(c => c.type === type) || [];
  }

  backToApprovalRequest() {
    if (this.sharedService.fromMdoPortal) {
      this.router.navigate(['/app/home/ai-cbp-requests']);
    } else {
      this.router.navigate(['/ai/approve-requests']);
    }

  }

  applyFilter(): void {

    const filterValue = (this.searchText || '')
      .trim()
      .toLowerCase();

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch() {
    this.searchText = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initializeTableFilter(): void {

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {

      const designation =
        (data?.designation_name || '').toLowerCase();

      const wing =
        (data?.wing_division_section || '').toLowerCase();

      const responsibilities =
        (data?.role_responsibilities || [])
          .join(' ')
          .toLowerCase();

      const activities =
        (data?.activities || [])
          .join(' ')
          .toLowerCase();

      const competencies =
        (data?.competencies || [])
          .map((c: any) =>
            `${c?.theme || ''} ${c?.sub_theme || ''}`
          )
          .join(' ')
          .toLowerCase();

      const combinedText = `
      ${designation}
      ${wing}
      ${responsibilities}
      ${activities}
      ${competencies}
    `;

      return combinedText.includes(filter);
    };
  }


  openFullList(element: any, type: any) {
    const listToShow: string[] = element[type] || [];
    const title = type === 'role_responsibilities' ? 'Role & Responsibilities' : 'Activities';

    const dialogRef = this.dialog.open(ListPopupComponent, {
      width: '600px',
      data: { element: element, type: type },
      disableClose: true,
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      // No need to do anything special here to reset inline expanded state
      // Because you're using dialog, not inline expand – view remains in initial (collapsed) state
    });
  }



  editRoleMapping(element: any, menuTrigger: MatMenuTrigger) {
    if(menuTrigger) {
      menuTrigger.closeMenu();
    }    
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(EditCbpPlanComponent, {
      width: '1000px',
      data: { requestData: this.requestData, element: element, fromLibrary: true },
      panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '80vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result === 'saved') {
      //   console.log('Changes saved!');
      //   // Refresh data or show a toast here

      // }
      const requestId = this.route.snapshot.paramMap.get('request_id');
      if (this.sharedService.fromMdoPortal
      ) {
        this.getMDORequestDetails(requestId);
      }
    });
  }

  viewCBPPlan(element: any, menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
    this.activeRowElement = element
    console.log('View CBP Plan clicked', element);
    element['fromRequestPage'] = true
    element['requestStatus'] = this.request?.status
    const dialogRef = this.dialog.open(ViewCbpPlanComponent, {
      width: '1000px',
      data: element,
      panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '80vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
      }
    });
  }

  viewCourseRecommendation(element, menuTrigger: MatMenuTrigger) {
    console.log('View Course Recommendation clicked', element);
    if (menuTrigger) {
      menuTrigger.closeMenu();
    }

    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    element['fromRequestPage'] = true
    element['requestId'] = this.requestId
    element['requestStatus'] = this.request?.status
    const dialogRef = this.dialog.open(ViewCourseRecommendationComponent, {
      width: '1000px',
      data: element,
      panelClass: 'view-cbp-plan-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        console.log(this.sharedService.cbpPlanFinalObj)
        const requestId = this.route.snapshot.paramMap.get('request_id');
        if (this.sharedService.fromMdoPortal
        ) {
          this.getMDORequestDetails(requestId);
        }

      }
    });
  }

  approveAndPublish() {
    console.log('approveAndPublish clicked', this.requestData);
    const dialogRef = this.dialog.open(PublishApproveRequestFormComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: this.requestData,
      panelClass: 'publish-request-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        console.log(this.sharedService.cbpPlanFinalObj)
        const requestId = this.route.snapshot.paramMap.get('request_id');
        if (this.sharedService.fromMdoPortal
        ) {
          this.getMDORequestDetails(requestId);
          this.router.navigate(['/app/home/ai-cbp-requests']);
        }

      }
    });

  }

  rejectRequest() {
    console.log('approveAndPublish clicked', this.requestData);
    const dialogRef = this.dialog.open(RejectRequestFormComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: this.requestData,
      panelClass: 'publish-request-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        console.log(this.sharedService.cbpPlanFinalObj)
        const requestId = this.route.snapshot.paramMap.get('request_id');
        if (this.sharedService.fromMdoPortal
        ) {
          this.getMDORequestDetails(requestId);
          this.router.navigate(['/app/home/ai-cbp-requests']);
        }

      }
    });

  }

  rejectItemRequest(element, menuTrigger: MatMenuTrigger) {
    console.log('approveAndPublish clicked', element);

    console.log('View Course Recommendation clicked', element);
    menuTrigger.closeMenu();
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(RejectItemRequestFormComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { requestData: this.requestData, element: element },
      panelClass: 'publish-request-popup',
      minHeight: '400px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        console.log(this.sharedService.cbpPlanFinalObj)
        const requestId = this.route.snapshot.paramMap.get('request_id');
        if (this.sharedService.fromMdoPortal
        ) {
          this.getMDORequestDetails(requestId);
        }

      }
    });

  }

  rePublish(element) {
    const requestId = this.route.snapshot.paramMap.get('request_id');
    this.loading = true;
    let payload = {
      "request_id": requestId,
      "item_id": element?.demand_id

    }
    this.sharedService.rejectItemMDOApprovalRequests(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Reject Response =>', res);

          this.snackBar.open(
            'Request Republished successfully',
            'X',
            {
              duration: 3000,
              panelClass: ['snackbar-success']
            }
          );

          if (this.sharedService.fromMdoPortal
          ) {
            this.getMDORequestDetails(requestId);
          }

        },
        error: (err) => {
          console.error(err);

          this.loading = false
          const errorMessage =
            err?.error?.detail ||
            err?.error?.message ||
            'Failed to republish request';

          this.snackBar.open(
            errorMessage,
            'X',
            {
              duration: 5000,
              panelClass: ['snackbar-error']
            }
          );
        }
      });

  }


}
