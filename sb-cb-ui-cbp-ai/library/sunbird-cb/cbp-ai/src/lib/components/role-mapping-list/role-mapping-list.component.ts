import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewCbpPlanComponent } from '../view-cbp-plan/view-cbp-plan.component';
import { EditCbpPlanComponent } from '../edit-cbp-plan/edit-cbp-plan.component';
import { GenerateCourseRecommendationComponent } from '../generate-course-recommendation/generate-course-recommendation.component';
import { DeleteRoleMappingComponent } from '../delete-role-mapping/delete-role-mapping.component';
import { ViewCourseRecommendationComponent } from '../view-course-recommendation/view-course-recommendation.component';
import { ViewFinalCbpPlanComponent } from '../view-final-cbp-plan/view-final-cbp-plan.component';
import { ListPopupComponent } from '../list-popup/list-popup.component';
import { AddDesignationComponent } from '../add-designation/add-designation.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ApprovalRequestFormComponent } from '../approval-request-form/approval-request-form.component';
import { SharedService } from '../../modules/shared/services/shared.service';
import { DesignationApprovalRequestFormComponent } from '../designation-approval-request-form/designation-approval-request-form.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-role-mapping-list',
  templateUrl: './role-mapping-list.component.html',
  styleUrls: ['./role-mapping-list.component.scss']
})
export class RoleMappingListComponent {
  @Input() formData: any = {}
  searchText = ''
  selectedValue = ''
  //'select'
  displayedColumns: string[] = [
    'select',
    'designation_name',
    'role_responsibilities',
    'activities',
    'behavioral',
    'functional',
    'domain',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  originalDataSource = new MatTableDataSource<any>([]);
  filteredData = [];
  originalData: any[] = [];
  searchResults: any[] = []; // Store search results for pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedResponsibilityRows: { [id: string]: boolean } = {};
  expandedActivityRows: { [id: string]: boolean } = {};
  activeRowElement: any
  cbpFinalObj: any = {}
  loading = false
  selection = new SelectionModel<any>(true, []); // true = multi-select
  matchedRoleMapping = 0
  unMatchedRoleMapping = 0
  matchedRoleMappingIds = []
  matchedDesignationNames: string[] = [];
  portalData: any = {}
  @Output() moveToInitialScreen = new EventEmitter<any>()
  activeTab: 'matched' | 'unmatched' = 'matched';

  matchedDesignationSet = new Set<string>();
  masterData: any[] = [];
  tabFilteredData: any[] = [];   // after matched/unmatched filter
  matchedRoleMappingData: any[] = [];
  constructor(
    public sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  ngOnInit() {

    this.portalData = this.activatedRoute.snapshot.data['parentData']
    this.sharedService.checkRoleMappingFormValidation.next(true)
    this.sharedService.updateDesignationHierarchySubject.subscribe((data) => {
      if (data) {
        if (this.portalData && this.portalData?.parentAppData && this.portalData?.parentAppData?.fromPortal &&
          this.portalData?.parentAppData?.fromPortal === 'mdo'
        ) {

        } else {
          this.loadRoleMappingList()
        }
      }

    })
    if (this.portalData && this.portalData?.parentAppData && this.portalData?.parentAppData?.fromPortal &&
      this.portalData?.parentAppData?.fromPortal === 'mdo'
    ) {

    } else {
      this.loadRoleMappingList()
    }



  }

  getCompetenciesByType(competencies: any[], type: string): any[] {
    return competencies?.filter(c => c.type === type) || [];
  }

  viewDetails(element: any): void {
    console.log('View clicked:', element);

  }

  deleteItem(element: any): void {
    console.log('Delete clicked:', element);
    // Optionally remove from dataSource
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== element.id);
  }

  searchData() {
    this.applyFilter();
  }

  applyFilter() {
    // if (this.searchText.trim()) {
    //   // Search only in designation names
    //   this.searchResults = this.filterByDesignationName(this.searchText);
    //   this.dataSource = new MatTableDataSource(this.searchResults);
    // } else {
    //   // If search is cleared, restore original data
    //   this.searchResults = [];
    //   this.dataSource = new MatTableDataSource(this.originalData);
    // }

    // // Set up pagination for filtered results
    // setTimeout(() => {
    //   if (this.paginator) {
    //     this.dataSource.paginator = this.paginator;
    //     this.paginator.firstPage();
    //   }
    // }, 100);
    this.applyAllFilters();
  }

  clearSearch() {
    // this.searchText = '';
    // this.searchResults = [];
    // this.dataSource = new MatTableDataSource(this.originalData);

    // setTimeout(() => {
    //   if (this.paginator) {
    //     this.dataSource.paginator = this.paginator;
    //     this.paginator.firstPage();
    //   }
    // }, 100);
    this.searchText = '';
    this.applyAllFilters();
  }

  refreshRoleMappingData() {
    console.log('Refreshing role mapping data...');
    if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier) {
      const ministryType = this.sharedService.cbpPlanFinalObj.ministry.sbOrgType;
      const ministryId = this.sharedService.cbpPlanFinalObj.ministry.identifier;

      this.loading = true;

      if (ministryType === 'ministry') {
        if (this.sharedService.cbpPlanFinalObj.departments) {
          const departmentId = this.sharedService.cbpPlanFinalObj.departments;
          this.sharedService.getRoleMappingByStateCenterAndDepartment(ministryId, departmentId).subscribe({
            next: (res) => {
              this.loading = false;
              console.log('State role mapping data refreshed:', res);
              this.updateDataSource(res);
            },
            error: (error) => {
              this.loading = false;
              console.error('Error refreshing state role mapping data:', error);
            }
          });
        } else {
          this.sharedService.getRoleMappingByStateCenter(ministryId).subscribe({
            next: (res) => {
              this.loading = false;
              console.log('Center role mapping data refreshed:', res);
              this.updateDataSource(res);
            },
            error: (error) => {
              this.loading = false;
              console.error('Error refreshing center role mapping data:', error);
            }
          });
        }

      } else if (ministryType === 'state') {
        const departmentId = this.sharedService.cbpPlanFinalObj.departments;
        this.sharedService.getRoleMappingByStateCenterAndDepartment(ministryId, departmentId).subscribe({
          next: (res) => {
            this.loading = false;
            console.log('State role mapping data refreshed:', res);
            this.updateDataSource(res);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error refreshing state role mapping data:', error);
          }
        });
      }
    }
    this.loading = false
  }

  private updateDataSource(res: any[]) {
    this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res;
    this.dataSource = new MatTableDataSource(res);
    this.originalData = res;
    this.searchResults = []; // Clear search results when data is updated

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 100);
    console.log('DataSource updated:', this.dataSource);
  }

  editRoleMapping(element: any) {
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(EditCbpPlanComponent, {
      width: '1000px',
      data: element,
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
      this.loadRoleMappingList();
    });
  }

  viewCBPPlan(element: any) {
    this.activeRowElement = element
    console.log('View CBP Plan clicked', element);
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

  generateCourseRecommendation(element: any) {
    console.log('Generate Course Recommendation clicked', element);
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(GenerateCourseRecommendationComponent, {
      width: '1100px',
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

        if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier) {
          if (this.sharedService.cbpPlanFinalObj.departments) {
            this.loading = true
            this.sharedService.getRoleMappingByStateCenter(this.sharedService.cbpPlanFinalObj.ministry.identifier).subscribe((res) => {
              console.log('res', res)
              this.selection.clear();
              this.loadRoleMappingList()
              this.loading = false
            })
          } else {
            this.loading = true
            this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.identifier, this.sharedService.cbpPlanFinalObj.departments).subscribe((res) => {
              console.log('res', res)
              this.selection.clear();
              this.loadRoleMappingList()
              console.log('this.dataSource', this.dataSource)
              this.loading = false
            })
          }


        } else if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier && this.sharedService.cbpPlanFinalObj.departments) {
          {
            this.loading = true
            this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.identifier, this.sharedService.cbpPlanFinalObj.departments).subscribe((res) => {
              console.log('res', res)
              this.selection.clear();
              this.loadRoleMappingList()
              console.log('this.dataSource', this.dataSource)
              this.loading = false
            })
          }
        }

      }
    });
  }

  viewCourseRecommendation(element: any) {
    console.log('View Course Recommendation clicked', element);
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
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
        if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier) {
          this.sharedService.getRoleMappingByStateCenter(this.sharedService.cbpPlanFinalObj.ministry.identifier).subscribe((res) => {
            console.log('res', res)
            this.dataSource = new MatTableDataSource(res)
            this.dataSource.paginator = this.paginator;
            this.loadRoleMappingList()
            this.originalData = res;
            console.log('this.dataSource', this.dataSource)
          })
        } else {

        }

      }
    });
  }

  /**
   * Filter data by designation name only
   * Supports single and multiple word searches
   */
  filterByDesignationName(searchText: string): any[] {
    const searchTerms = searchText.trim().toLowerCase().split(/\s+/);

    return this.originalData.filter(item => {
      const designationName = (item.designation_name || '').toLowerCase();

      // Check if all search terms are found in the designation name
      return searchTerms.every(term => designationName.includes(term));
    });
  }

  flattenObjectToString(obj: any): string {
    let result = '';

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        result += ' ' + value;
      } else if (Array.isArray(value)) {
        value.forEach(val => {
          if (typeof val === 'string') {
            result += ' ' + val;
          } else if (typeof val === 'object') {
            result += ' ' + this.flattenObjectToString(val);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        result += ' ' + this.flattenObjectToString(value);
      }
    }

    return result;
  }

  getSectors(sector) {
    if (sector && sector.length) {
      return Array.isArray(sector) ? sector.join('/ ') : ''
    }

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



  addMoreDesignation() {
    const dialogRef = this.dialog.open(AddDesignationComponent, {
      width: '600px',
      data: { state_center_id: '', matched_role_mappings: this.matchedRoleMappingData },
      panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        this.loadRoleMappingList();
      }
    });
  }

  deleteRoleMapping(element) {
    console.log('Generate Course Recommendation clicked', element);
    this.activeRowElement = element
    console.log('Edit Role Mapping clicked', element);
    // Navigate or open modal
    console.log('View CBP Plan clicked', element);
    const dialogRef = this.dialog.open(DeleteRoleMappingComponent, {
      width: '600px',
      data: element,
      panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here
        console.log(this.sharedService.cbpPlanFinalObj)
        if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier &&
          this.sharedService.cbpPlanFinalObj.ministry?.sbOrgType === 'ministry'
        ) {
          if (this.sharedService.cbpPlanFinalObj.departments) {
            this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.identifier, this.sharedService.cbpPlanFinalObj.departments).subscribe((res) => {
              console.log('res', res)
              this.dataSource = new MatTableDataSource(res)
              this.dataSource.paginator = this.paginator;
              this.originalData = res;
              console.log('this.dataSource', this.dataSource)
            })
          } else {
            this.sharedService.getRoleMappingByStateCenter(this.sharedService.cbpPlanFinalObj.ministry.identifier).subscribe((res) => {
              console.log('res', res)
              this.dataSource = new MatTableDataSource(res)
              this.dataSource.paginator = this.paginator;
              this.originalData = res;
              console.log('this.dataSource', this.dataSource)
            })
          }


        } else {
          this.sharedService.getRoleMappingByStateCenterAndDepartment(this.sharedService.cbpPlanFinalObj.ministry.identifier, this.sharedService.cbpPlanFinalObj.departments).subscribe((res) => {
            console.log('res', res)
            this.dataSource = new MatTableDataSource(res)
            this.dataSource.paginator = this.paginator;
            this.originalData = res;
            console.log('this.dataSource', this.dataSource)
          })
        }

      }
    });
  }

  viewFinalCBPPlan(context: string) {
    const dialogRef = this.dialog.open(ViewFinalCbpPlanComponent, {
      width: '1100px',
      data: {
        payload: this.originalData,
        openedFrom: context   // 👈 BEST PRACTICE
      },
      panelClass: 'view-cbp-plan-popup',
      minHeight: '300px',          // Set minimum height
      maxHeight: '90vh',           // Prevent it from going beyond viewport
      disableClose: true // Optional: prevent closing with outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        console.log('Changes saved!');
        // Refresh data or show a toast here


      }
    });
  }

  moveToInitialScreenLayout(event) {
    // this.moveToInitialScreen.emit(event)
    this.router.navigate(['/ai/initial'], {
      onSameUrlNavigation: 'reload'
    });
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

  loadRoleMappingList() {

    this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage()
    this.dataSource = new MatTableDataSource(this.cbpFinalObj?.role_mapping_generation)
    this.originalDataSource = new MatTableDataSource(this.cbpFinalObj?.role_mapping_generation)
    this.originalData = this.cbpFinalObj?.role_mapping_generation

    if (this.cbpFinalObj && this.cbpFinalObj?.ministry && (this.cbpFinalObj?.ministry.sbOrgType)) {
      this.sharedService.cbpPlanFinalObj = this.cbpFinalObj
      if (this.cbpFinalObj?.ministry.sbOrgType === 'ministry') {
        this.formData = {}
        this.formData['value'] = {}
        this.formData['value']['ministryType'] = this.cbpFinalObj?.ministry.sbOrgType
        this.formData['value']['ministry'] = this.cbpFinalObj?.ministry?.identifier
        this.formData['value']['departments'] = this.cbpFinalObj?.departments
      } else if (this.cbpFinalObj?.ministry.sbOrgType === 'state') {
        this.formData = {}
        this.formData['value'] = {}
        this.formData['value']['ministryType'] = this.cbpFinalObj?.ministry.sbOrgType
        this.formData['value']['ministry'] = this.cbpFinalObj?.ministry?.identifier
        this.formData['value']['departments'] = this.cbpFinalObj?.departments
      }
    }
    console.log('this.formData', this.formData)
    if (this.formData && this.formData.value && this.formData.value.ministryType === 'ministry') {
      let state_center_id = this.formData.value.ministry
      this.loading = true
      if (this.formData.value.departments?.length) {
        let department_id = this.formData.value.departments
        if (typeof department_id === 'string') {
          this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe({
            next: (res) => {
              this.loading = false
              this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
              localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
              let obj = {
                state_center_id: this.formData.value.ministry
              }
              if (this.formData.value.departments) {
                if (typeof this.formData.value.departments === 'string') {
                  obj['department_id'] = this.formData.value.departments
                }
              }
              this.sharedService.getMatchedRoleMapping(obj).subscribe((matchedRoleMapping) => {
                console.log('res', res)

                console.log('matchedRoleMapping', matchedRoleMapping)
                this.matchedRoleMappingData = matchedRoleMapping?.matched_details || []
                this.matchedRoleMapping = matchedRoleMapping?.matched_count
                this.matchedDesignationNames =
                  matchedRoleMapping?.matched_details?.map(
                    x => x.igot_designation_name?.toLowerCase()
                  ) || [];
                const matchedNames =
                  matchedRoleMapping?.matched_details?.map(x =>
                    x.igot_designation_name?.trim().toLowerCase()
                  ) || [];
                this.matchedDesignationSet = new Set(matchedNames);

                this.matchedRoleMapping = matchedNames.length;

                this.unMatchedRoleMapping = this.masterData.length - this.matchedRoleMapping;
                this.applyAllFilters();
              })

              this.dataSource = new MatTableDataSource(res)
              this.originalDataSource = new MatTableDataSource(res)
              setTimeout(() => {
                this.dataSource.paginator = this.paginator;
              }, 1000)
              this.originalData = res;
              this.masterData = res;

              console.log('this.dataSource', this.dataSource)
            },
            error: () => {
              this.loading = false
            }
          })
        } else {
          this.loading = false
        }

      } else {
        this.sharedService.getRoleMappingByStateCenter(state_center_id).subscribe((res) => {
          this.loading = false
          console.log('res', res)
          this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
          localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
          let obj = {
            state_center_id: this.formData.value.ministry
          }

          if (typeof this.formData.value.departments === 'string') {
            obj['department_id'] = this.formData.value.departments
          }
          this.sharedService.getMatchedRoleMapping(obj).subscribe((matchedRoleMapping) => {
            console.log('res', res)
            console.log('matchedRoleMapping', matchedRoleMapping)
            this.matchedRoleMappingData = matchedRoleMapping?.matched_details || []
            this.matchedRoleMapping = matchedRoleMapping?.matched_count
            this.matchedDesignationNames =
              matchedRoleMapping?.matched_details?.map(
                x => x.igot_designation_name?.toLowerCase()
              ) || [];
            const matchedNames =
              matchedRoleMapping?.matched_details?.map(x =>
                x.igot_designation_name?.trim().toLowerCase()
              ) || [];
            this.matchedDesignationSet = new Set(matchedNames);

            this.matchedRoleMapping = matchedNames.length;

            this.unMatchedRoleMapping = this.masterData.length - this.matchedRoleMapping;
            this.applyAllFilters();
          })
          this.dataSource = new MatTableDataSource(res)
          this.originalDataSource = new MatTableDataSource(res)
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 1000)

          this.originalData = res;
          this.masterData = res;
          console.log('this.dataSource', this.dataSource)
        })
      }

    }
    if (this.formData && this.formData.value && this.formData.value.ministryType === 'state') {
      this.loading = true
      console.log('this.formData', this.formData)
      let state_center_id = this.formData.value.ministry
      let department_id = this.formData.value.departments
      this.sharedService.getRoleMappingByStateCenterAndDepartment(state_center_id, department_id).subscribe({
        next: (res) => {
          this.loading = false
          this.sharedService.cbpPlanFinalObj['role_mapping_generation'] = res
          localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.sharedService.cbpPlanFinalObj))
          let obj = {
            state_center_id: this.formData.value.ministry
          }
          if (typeof this.formData.value.departments === 'string') {
            obj['department_id'] = this.formData.value.departments
          }
          this.sharedService.getMatchedRoleMapping(obj).subscribe((matchedRoleMapping) => {
            console.log('res', res)
            console.log('matchedRoleMapping', matchedRoleMapping)
            this.matchedRoleMappingData = matchedRoleMapping?.matched_details || []
            this.matchedRoleMapping = matchedRoleMapping?.matched_count
            this.matchedDesignationNames =
              matchedRoleMapping?.matched_details?.map(
                x => x.igot_designation_name?.toLowerCase()
              ) || [];
            const matchedNames =
              matchedRoleMapping?.matched_details?.map(x =>
                x.igot_designation_name?.trim().toLowerCase()
              ) || [];
            this.matchedDesignationSet = new Set(matchedNames);

            this.matchedRoleMapping = matchedNames.length;

            this.unMatchedRoleMapping = this.masterData.length - this.matchedRoleMapping;
            this.applyAllFilters();
          })
          this.dataSource = new MatTableDataSource(res)
          this.originalDataSource = new MatTableDataSource(res)
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 1000)
          this.originalData = res;
          this.masterData = res;
          console.log('this.dataSource', this.dataSource)
        },
        error: () => {
          this.loading = false
        }
      })



    }

  }

  toggleRow(row: any) {
    if (!row?.cbp_plans?.length) return;

    this.selection.toggle(row);
    console.log('Selected rows:', this.selection.selected);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows(event: any) {
    if (event.checked) {

      this.dataSource.data
        .filter(row => row?.cbp_plans?.length)
        .forEach(row => this.selection.select(row));
    } else {
      this.selection.clear();
    }
  }

  setDataSoure(tab?: 'matched' | 'unmatched') {

    this.activeTab = tab;

    // this.selection.clear();

    this.applyAllFilters();

  }

  applyAllFilters() {

    let data = [...this.masterData];

    if (this.activeTab === 'matched') {

      data = data.filter(item =>
        this.matchedDesignationSet.has(
          item.designation_name?.trim().toLowerCase()
        )
      );

    }

    if (this.activeTab === 'unmatched') {

      data = data.filter(item =>
        !this.matchedDesignationSet.has(
          item.designation_name?.trim().toLowerCase()
        )
      );

    }

    if (this.searchText.trim()) {

      const terms = this.searchText.toLowerCase().split(/\s+/);

      data = data.filter(item => {
        const name = (item.designation_name || '').toLowerCase();
        return terms.every(term => name.includes(term));
      });

    }

    this.dataSource = new MatTableDataSource(data);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });

  }

  sendForApprovalForm() {
    console.log('this.selection--', this.selection.selected)
    if (this.selection.selected.length) {
      const dialogRef = this.dialog.open(ApprovalRequestFormComponent, {
        width: '600px',
        data: this.selection.selected,
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
        this.selection.clear()
        this.loadRoleMappingList();
      });
    }

  }

  hasSelectableRows() {
    return this.dataSource?.data?.some((row: any) => row?.cbp_plans?.length > 0);
  }

  sendForDesignationNameApproval(element) {
    this.activeRowElement = element
    const dialogRef = this.dialog.open(DesignationApprovalRequestFormComponent, {
      width: '600px',
      data: element,
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
      this.loadRoleMappingList();
    });

  }

  getActivateCbpPlan(row) {
    let found = false
    if (row?.cbp_plans && row?.cbp_plans?.length) {
      row.cbp_plans.forEach(element => {
        if (element?.selected_courses && element?.selected_courses?.length) {
          found = true
        }
      })
    }
    return !found
  }

}
