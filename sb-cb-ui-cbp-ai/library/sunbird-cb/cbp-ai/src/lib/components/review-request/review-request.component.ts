import { Component, ViewChild } from '@angular/core';
import { SharedService } from '../../modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-review-request',
  templateUrl: './review-request.component.html',
  styleUrls: ['./review-request.component.scss']
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
    'domain'
  ];
  dataSource = new MatTableDataSource<any>([]);

  constructor(public sharedService: SharedService, private snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('request_id');

    if (requestId) {
      this.getRequestDetails(requestId);
    }


  }

  getRequestDetails(requestId) {
    this.loading = true
    this.sharedService.viewApprovalRequests(requestId).subscribe({

      next: (res: any) => {
        console.log('res', res)
        this.request = res
        this.loading = false
        this.dataSource = new MatTableDataSource(res?.items);
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
    this.router.navigate(['/ai/approve-requests']);
  }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const designation = data.designation_name?.toLowerCase() || '';
      const wing = data.wing_division_section?.toLowerCase() || '';

      const responsibilities = (data.role_responsibilities || [])
        .join(' ')
        .toLowerCase();

      const activities = (data.activities || [])
        .join(' ')
        .toLowerCase();

      const competencies = (data.competencies || [])
        .map(c => `${c.theme} ${c.sub_theme}`)
        .join(' ')
        .toLowerCase();

      const combined =
        designation +
        wing +
        responsibilities +
        activities +
        competencies;

      return combined.includes(filter);
    };

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


}
