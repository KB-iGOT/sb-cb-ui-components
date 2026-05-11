import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../modules/shared/services/shared.service';
import dayjs from 'dayjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import moment from 'moment';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  userProfile: any
  isSuperAdmin = false
  selected: any = {
    startDate: moment().subtract(3, 'month'),
    endDate: moment()
  };
  filtersForm!: FormGroup;
  ministriesList = [
    { id: 1, name: 'Ministry A' },
    { id: 2, name: 'Ministry B' },
    { id: 3, name: 'Ministry C' }
  ];

  departmentsList = [
    { id: 1, name: 'Dept X' },
    { id: 2, name: 'Dept Y' },
    { id: 3, name: 'Dept Z' }
  ];
  selectedMinistryType = 'ministry'
  selectedMinistryId = ''
  panelOpen = false;
  departmentPanelOpen = false
  filteredList = [];
  filteredDepartmentList = [];
  ministryData: any = []
  ministryFullData: any = []
  departmentData = []
  selectedMinistryObj = {}
  apiLoading = false
  loginUserOrgIds = []
  dashboardData: any
  gapAnalysisData: any
  dashboardResponseObj = {}
  cbpFinalObj: any = {}
  constructor(private fb: FormBuilder, private sharedService: SharedService, private snackBar: MatSnackBar, public router: Router) { }
  ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    this.isSuperAdmin = this.userProfile?.role_info?.role_name === 'Super Admin'
      && this.userProfile?.role_info?.is_active;
    this.loginUserOrgIds = this.userProfile?.organization_ids

    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    console.log('this.cbpFinalObj--', this.cbpFinalObj)


    // Initialize the form without disabling anything
    this.filtersForm = this.fb.group({
      centreState: [''],
      ministries: [[]],
      departments: [[]],
      dateRange: [{ startDate: moment().subtract(3, 'month'), endDate: moment() }]
    });

    if (this.cbpFinalObj) {
      let event = {value:this.cbpFinalObj?.ministry?.sbOrgType}
      let ministryEvent = {value: this.cbpFinalObj?.ministry?.identifier}

      this.onMinistryTypeChange(event)
      this.onMinistryChange(ministryEvent)
      setTimeout(()=>{
        this.filtersForm.patchValue({
        centreState: this.selectedMinistryType,
        ministries: [this.cbpFinalObj?.ministry?.identifier],
        departments: [this.cbpFinalObj?.departments]
      });
      },1000)
      
      
    }

    // Dynamically enable controls if super admin
    if (this.isSuperAdmin) {
      this.filtersForm.get('centreState')?.enable();
      this.filtersForm.get('ministries')?.enable();
      this.filtersForm.get('departments')?.enable();
    } else {
      // optionally disable for non-super-admin
      this.filtersForm.get('centreState')?.disable();
      this.filtersForm.get('ministries')?.disable();
      this.filtersForm.get('departments')?.disable();
    }

    // Trigger API call on filter change
    this.filtersForm.valueChanges.subscribe(val => {
      this.getDashboardData(val);
    });
  }

  getDashboardData(val) {

    console.log('val', val)
    let dateRangePayload = null;
    if (val.dateRange && val.dateRange.startDate && val.dateRange.endDate) {
      dateRangePayload = {
        from: moment(val.dateRange.startDate).format('YYYY-MM-DD'),
        to: moment(val.dateRange.endDate).format('YYYY-MM-DD')
      };
    }
    let payload = {
      ministries: val?.ministries,
      date_range: dateRangePayload

    }
    if (val?.departments?.length) {
      payload['departments'] = val?.departments
    }
    if (this.isSuperAdmin) {
      this.dashboardData = {};

      this.sharedService.getDashboardAdmin(payload).subscribe((res) => {
        console.log('res from admin', res);
        Object.assign(this.dashboardData, res); // merge data
        console.log('this.dashboardData after admin', this.dashboardData);
      });

      this.sharedService.getDashboardGapAnalysisAdmin(payload).subscribe((res) => {
        console.log('res from gap analysis', res);
        Object.assign(this.dashboardData, res); // merge data
        console.log('this.dashboardData after gap analysis', this.dashboardData);
      });

    } else {
      this.dashboardData = {};

      this.sharedService.getDashboardPublic(payload).subscribe((res) => {
        Object.assign(this.dashboardData, res);
      });

      this.sharedService.getDashboardGapAnalysisPublic(payload).subscribe((res) => {
        Object.assign(this.dashboardData, res);
      });
    }
    console.log('this.dashboardData', this.dashboardData)
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

  onMinistryChange(event: any) {
    const selectedMinistryId = event.value;
    console.log('Selected Ministry ID:', selectedMinistryId);
    this.departmentData = []
    // You can access the selected object if needed
    const selectedMinistry = this.ministryData.find(item => item.identifier === selectedMinistryId);
    this.selectedMinistryObj = selectedMinistry
    if (selectedMinistryId && this.selectedMinistryType === 'state') {
      this.sharedService.getDepartmentList(selectedMinistryId).subscribe((res) => {
        this.departmentData = res
        this.filteredDepartmentList = res
      })
    }
    if (selectedMinistryId && this.selectedMinistryType === 'ministry') {
      this.sharedService.getCenterBasedDepartment(selectedMinistryId).subscribe((res) => {
        if (res?.length) {
          this.departmentData = res
          this.filteredDepartmentList = res
        } else {
          this.snackBar.open('No Department Found for Selected Ministry', 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }

      })
    }
  }

  onDepartmentChange() {
    const formData = this.filtersForm.value;
    const selectedMinistry = this.ministryData.find(item => item.identifier === formData.ministry);
    this.sharedService.cbpPlanFinalObj['ministry'] = selectedMinistry
    const departmentName = this.departmentData.find(u => u.identifier === formData.departments);
    this.sharedService.cbpPlanFinalObj['department_name'] = departmentName?.orgName
  }

  async onMinistryTypeChange(event) {
    console.log('event', event)
    this.selectedMinistryType = event.value
    await this.getMinistryData()
    this.ministryData = []
    if (event?.value === 'state') {
      this.filtersForm.patchValue({
        centreState: this.selectedMinistryType,
        ministries: [],
        departments: []
      });
      this.ministryFullData.forEach((item) => {
        if (item?.type === 'state') {
          this.ministryData.push(item)
        }
      })
    } else if (event?.value === 'ministry') {
      this.ministryFullData.forEach((item) => {
        if (item?.type === 'central') {
          this.ministryData.push(item)
        }
      })
      
    }
    this.filtersForm.patchValue({
        centreState: this.selectedMinistryType,
        ministries: [],
        departments: []
      });
  }

  getMinistryData() {
    this.apiLoading = true
    this.sharedService.getMinistryData(this.selectedMinistryType).subscribe((data: any) => {
      console.log('data--', data)
      this.ministryFullData = data
      this.apiLoading = false
      this.ministryData = []
      let filteredMinistryData = []
      this.ministryFullData.map((item) => {
        if (this.loginUserOrgIds.indexOf(item?.identifier) > -1) {
          filteredMinistryData.push(item)
        }
        this.filteredList = filteredMinistryData;
      })
      if (this.selectedMinistryType === 'ministry') {
        data.forEach((item) => {
          if (item?.sbOrgType === 'ministry') {
            this.ministryData.push(item)
          }
        })
      } else if (this.selectedMinistryType === 'state') {
        data.forEach((item) => {
          if (item?.sbOrgType === 'state') {
            this.ministryData.push(item)
          }
        })
      }
    })


  }

  routeToInitial() {
    this.router.navigate(['/ai/initial']);
  }
}
