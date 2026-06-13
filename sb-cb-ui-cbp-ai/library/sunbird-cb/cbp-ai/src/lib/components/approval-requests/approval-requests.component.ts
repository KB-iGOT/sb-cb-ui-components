
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { type } from 'os';
import { element } from 'protractor';
import { ListPopupComponent } from '../list-popup/list-popup.component';
import { SharedService } from '../../modules/shared/services/shared.service';

@Component({
    selector: 'app-approval-requests',
    templateUrl: './approval-requests.component.html',
    styleUrls: ['./approval-requests.component.scss'],
    standalone: false
})
export class ApprovalRequestsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  selectedMinistryType: string = 'ministry';
  ministryData: any = []
  ministryFullData: any = []
  roleMappingForm!: FormGroup;
  disableBtn = true
  searchText = '';
  displayedColumns: string[] = ['request_id', 'date', 'designation', 'status', 'actions'];
  cbpFinalObj: any = {}
  departmentData: any = []
  approvalRequests = [
    // {
    //   name: 'Work Allocation',
    //   originalName: 'ACBP_Ministry_of_Women_and_Child_Development_Extract...',
    //   size: 4.5,
    //   date: 'Oct 13, 2025'
    // },
    // {
    //   name: 'Screenshot 2025-10-08 at 12',
    //   originalName: 'Screenshot 2025-10-08 at 12.54.18 PM.png',
    //   size: 331.8,
    //   date: 'Oct 13, 2025'
    // }
  ];
  loading = false
  filteredMinistryData: any = []
  searchControl: FormControl = new FormControl('');
  panelOpen = false;
  departmentPanelOpen = false
  filteredList = [];
  filteredDepartmentList = [];
  loginUserOrgIds = []
  originalMinistryData = []
  cbpPlanFinalObj: any
  filterForm!: FormGroup;
  status = [
    { "code": "", label: "All Status" },
    { "code": "pending", label: "Pending" },
    { "code": "approved", label: "Approved" },
    { "code": "rejected", label: "Rejected" },
    { "code": "draft", label: "Revoked" },
  ];
  time = [
    { "code": "", label: "All Time" },
    { "code": "last_7_days", label: "Last 7 Days" },
    { "code": "last_30_days", label: "Last 30 Days" },
    { "code": "last_90_days", label: "Last 90 Days" }
  ];
  filteredStatus = [...this.status];
  filteredTime = [...this.time];
  pageIndex = 0;
  pageSize = 10;
  totalRecords = 0;
  showRejectPopupFlag = false
  showRevokeRequestPopupFlag = false
  rejectionDetail:any
  revokeRequestedRequest:any 
  constructor(public dialog: MatDialog, public sharedService: SharedService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.roleMappingForm = this.fb.group({
      ministryType: ['ministry', Validators.required],
      ministry: [null, Validators.required],
      sectors: [[]],
      departments: [[]]

    });
    this.filterForm = this.fb.group({
      status: [''],
      time: [''],
      search: ['']
    });
    // this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    this.getMinistryData()


  }

  ngOnInit() {
    this.cbpPlanFinalObj = this.sharedService.getCBPPlanLocalStorage()
    console.log('cbpFinalObj--', this.cbpFinalObj)
    this.searchControl.valueChanges.subscribe(searchText => {
      if (searchText) {
        this.filterMinistryData(searchText);
      } else {
        this.filteredMinistryData = this.ministryData
      }

    });
    this.sharedService.summaryTriggerExecuted.subscribe((data: any) => {
      if (data && data?.file_id) {
        this.getApprovalRequests()
      }
    })
    if (this.cbpPlanFinalObj && this.cbpPlanFinalObj.ministry && this.cbpPlanFinalObj.ministry.identifier) {
      this.getApprovalRequests()
    }
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

 getApprovalRequests() {

  let reqBody: any = {
    state_center_id: this.cbpPlanFinalObj?.ministry?.identifier,
    include_summary: true,
    page: this.pageIndex + 1,
    page_size: this.pageSize
  };

  const search = this.filterForm.get('search')?.value;
  const status = this.filterForm.get('status')?.value;
  const time = this.filterForm.get('time')?.value;

  if (search) {
    reqBody.search = search;
  }

  if (status) {
    reqBody.status = status;
  }

  // Time filter
  if (time) {

    const today = new Date();
    let fromDate = new Date();

    if (time === 'last_7_days') {
      fromDate.setDate(today.getDate() - 7);
    }

    if (time === 'last_30_days') {
      fromDate.setDate(today.getDate() - 30);
    }

    if (time === 'last_90_days') {
      fromDate.setDate(today.getDate() - 90);
    }

    reqBody.from_date = fromDate.toISOString().split('T')[0];
    reqBody.to_date = today.toISOString().split('T')[0];
  }

  if (this.cbpPlanFinalObj?.departments) {
    reqBody.department_id = this.cbpPlanFinalObj.departments;
  }

  this.loading = true;

  this.sharedService.getApprovalRequests(reqBody).subscribe((res) => {

    this.loading = false;

    this.approvalRequests = res?.items || [];
    this.dataSource.data = this.approvalRequests;
    this.totalRecords = res?.total || 0;

  });
}



  filteredapprovalRequests() {
    let data = [...this.approvalRequests];

    const search = this.filterForm.get('search')?.value?.toLowerCase() || '';
    const status = this.filterForm.get('status')?.value;
    const time = this.filterForm.get('time')?.value;
    // Search Filter
    if (search) {
      data = data.filter(r =>
        (r.request_name || '').toLowerCase().includes(search)
      );
    }

    // Status Filter
    if (status) {
      data = data.filter(r => r.status === status);
    }

    // Time Filter
    if (time) {
      const now = new Date();

      data = data.filter(r => {
        const created = new Date(r.created_at);
        const diffDays =
          (now.getTime() - created.getTime()) / (1000 * 3600 * 24);

        if (time === 'last_7_days') return diffDays <= 7;
        if (time === 'last_30_days') return diffDays <= 30;
        if (time === 'last_90_days') return diffDays <= 90;

        return true;
      });
    }

    return data;
  }

  deleteDocument(docToDelete: any) {
    this.approvalRequests = this.approvalRequests.filter(doc => doc !== docToDelete);
    this.loading = true
    this.sharedService.deleteSummary(docToDelete?.file_id).subscribe((res) => {
      if (res) {
        this.sharedService.deleteFile(docToDelete?.file_id).subscribe((dres) => {
          this.loading = true
          if (dres) {
            this.loading = false
            this.snackBar.open('Document Deleted Successfully', 'X', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.getApprovalRequests()
          } else {
            this.loading = false
            this.snackBar.open('Error While Deleting Document', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            this.getApprovalRequests()
          }

        })
        this.loading = false
        this.snackBar.open('Document Summary Deleted Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } else {
        this.loading = false
        this.snackBar.open('Error While Deleting Document Summary', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    })

  }

  applyFilters() {
    const filtered = this.filteredapprovalRequests();

    this.dataSource.data = filtered;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  onMinistryTypeChange(event) {
    this.roleMappingForm.reset()

    // console.log('event', event)
    this.getMinistryData()
    this.sharedService.cbpPlanFinalObj['ministryType'] = event.value
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    this.selectedMinistryType = event?.value
    this.roleMappingForm.get('sectors')?.setValue([]);

    this.roleMappingForm.controls.ministryType.setValue(this.selectedMinistryType)
  }

  onMinistryChange(event: any) {
    const selectedMinistryId = event.value;

    // console.log('Selected Ministry ID:', selectedMinistryId);

    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.identifier === selectedMinistryId);
    console.log('Selected Ministry:', selectedMinistry); ``
    this.sharedService.cbpPlanFinalObj['ministry'] = { identifier: selectedMinistryId?.identifier, name: selectedMinistryId?.orgName }
    if (selectedMinistryId && this.selectedMinistryType === 'state') {
      this.sharedService.getDepartmentList(selectedMinistryId).subscribe((res) => {
        this.departmentData = res
      })
    }
    if (this.selectedMinistryType === 'state') {
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.roleMappingForm.controls.ministryType.value
      this.sharedService.cbpPlanFinalObj['ministry'] = { identifier: selectedMinistry?.identifier, name: selectedMinistry?.orgName }
      this.sharedService.cbpPlanFinalObj['departments'] = this.roleMappingForm.controls.departments.value
      this.sharedService.cbpPlanFinalObj['sectors'] = this.roleMappingForm.controls.sectors.value
    } else {
      this.sharedService.cbpPlanFinalObj['ministryType'] = this.roleMappingForm.controls.ministryType.value
      this.sharedService.cbpPlanFinalObj['ministry'] = { identifier: selectedMinistry?.identifier, name: selectedMinistry?.orgName }
    }
    console.log('this.sharedService.cbpPlanFinalObj', this.sharedService.cbpPlanFinalObj)
    localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
    console.log('this.roleMappingForm', this.roleMappingForm)
  }



  filterMinistryData(searchText) {

    if (searchText) {
      console.log('searhTect, ', searchText)
      const search = searchText?.trim().toLowerCase() || '';
      this.filteredMinistryData = !search
        ? [...this.ministryData]
        : this.ministryData.filter(item =>
          item.orgName?.trim().toLowerCase().startsWith(search)
        );
    }

  }

  getMinistryData() {
    this.loading = true
    this.sharedService.getMinistryData(this.selectedMinistryType).subscribe((data: any) => {
      this.loading = false
      console.log('data--', data)
      this.ministryFullData = data
      this.ministryData = []
      if (this.selectedMinistryType === 'ministry') {
        data.forEach((item) => {
          if (item?.sbOrgType === 'ministry') {
            this.ministryData.push(item)
            this.filteredMinistryData = [...this.ministryData];
          }
        })
      } else if (this.selectedMinistryType === 'state') {
        data.forEach((item) => {
          if (item?.sbOrgType === 'state') {
            this.ministryData.push(item)
            this.filteredMinistryData = [...this.ministryData];
          }
        })
      }
      this.getUserProfileData()
    })

    console.log('this.ministryData--', this.ministryData)
    console.log('this.filteredMinistryData--', this.filteredMinistryData)
  }

  routeToMain() {
    this.router.navigate(['/ai/']);
  }

  viewSummary(doc) {
    const dialogRef = this.dialog.open(ListPopupComponent, {
      width: '800px',
      data: { element: doc, type: 'doc-summary' },
      disableClose: true,
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      // No need to do anything special here to reset inline expanded state
      // Because you're using dialog, not inline expand – view remains in initial (collapsed) state
    });
  }

  viewRequest(request: any): void {
    console.log('request--', request)
    this.loading = true
    this.router.navigate(['/ai/review-request', request.id]);
  }

  revokeApprovalRequest(request: any): void {
    this.showRevokeRequestPopupFlag = true
    this.revokeRequestedRequest = request
    console.log('request--', request)
   
  }

  revokeApprovalRequestConfirm() {
    this.loading = true
    let reqBody =
    {
      "request_id": this.revokeRequestedRequest?.id
    }

    this.sharedService.revokeApprovalRequest(reqBody).subscribe({

      next: (res: any) => {
        console.log('res', res)
        this.loading = false
         this.snackBar.open('Request Revoked Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.showRevokeRequestPopupFlag = false
        this.getApprovalRequests()
      },
      error: () => {
        this.loading = false
        this.snackBar.open('Failed to revoke the approval request.', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  closeRevokePopup() {
    this.showRevokeRequestPopupFlag = false
  }
  onOpened(opened: boolean) {
    this.panelOpen = opened;
  }

  onOpenedDepartment(opened: boolean) {
    this.departmentPanelOpen = opened
  }

  filterData(event) {
    if (event && event.target && event.target.value) {
      const s = event.target.value.toLowerCase();

      this.filteredList = this.ministryData.filter(x =>
        x.orgName.toLowerCase().includes(s)
      );
    } else {
      this.filteredList = this.ministryData
    }

  }

  filterDepartmentData(event) {
    if (event && event.target && event.target.value) {
      const s = event.target.value.toLowerCase();

      this.filteredDepartmentList = this.departmentData.filter(x =>
        x.orgName.toLowerCase().includes(s)
      );
    } else {
      this.filteredDepartmentList = this.departmentData
    }

  }

  getUserProfileData() {
    this.sharedService.getUserProfile().subscribe((data) => {
      console.log('data--', data)
      this.loginUserOrgIds = data?.organization_ids
      let filteredMinistryData = []
      console.log('this.ministryFullData--', this.ministryFullData)
      this.ministryFullData.map((item) => {
        if (this.loginUserOrgIds.indexOf(item?.identifier) > -1) {
          filteredMinistryData.push(item)
        }
      })

      this.ministryData = filteredMinistryData
      this.originalMinistryData = filteredMinistryData
      this.filteredList = filteredMinistryData;
      console.log('this.filteredList--', this.filteredList)
    })
  }

  routeToInitial() {
    this.router.navigate(['/ai/initial']);
  }


  filterList(value: string, type: string) {
    const search = value.toLowerCase();

    switch (type) {

      case 'status':
        this.filteredStatus = this.status.filter(v => v.label?.toLowerCase().includes(search));
        break;
      case 'time':
        this.filteredTime = this.time.filter(v => v.label?.toLowerCase().includes(search));
        break;
    }
  }

  clearSearch() {
    this.searchText = '';
    this.applyFilters();
  }

  onPageChange(event: any) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;

  this.getApprovalRequests();
}

showRejectPopup(element) {
  console.log('element', element)
  this.showRejectPopupFlag = true
  this.rejectionDetail = element
}

closeRejectPopup() {
  this.showRejectPopupFlag = false
}

}
