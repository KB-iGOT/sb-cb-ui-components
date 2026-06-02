import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import * as _ from 'lodash'
import { forkJoin, of } from 'rxjs';
import { SharedService } from '../../modules/shared/services/shared.service';
@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss']
})
export class AddDesignationComponent {
  designationForm: FormGroup;
  maxFileSizeMB = 25;
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  uploadError: string | null = null;
  uploadedFile: File | null = null;
  cbpPlanFinalObj: any
  loading = false
  @ViewChild('designation', { read: ElementRef }) designationRef?: ElementRef
  desigantionFilterEnable = false
  isLoadingMoreDesignations = false;
  designationOffset = 0
  odcsDesignationCount = 0
  defaultSearchDesignationCount = 0
  designationListLoadCount = 50
  designationDefaultLoadCount = 50
  noMoreLegacyDesignations = false
  designationSearchText = ''
  designationInitInProgress = false
  scrollListenerAttached = false
  masterData: any = {}
  searchDesignationLoadCount = 50
  matchedDesignationIds = []
  constructor(public dialogRef: MatDialogRef<AddDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private snackBar: MatSnackBar) {

    this.masterData = {
      designationBackup: [],
      designationFiltered: [], // filtered search results
    };

  }

  ngOnInit() {
    console.log('this.matched_role_mappings', this.data?.matched_role_mappings)
    this.matchedDesignationIds = this.data?.matched_role_mappings?.map((item: any) => item?.igot_designation_id) || []
    this.initializeForm();

   const searchControl = this.designationForm.get('searchDesignation');

if (searchControl) {
  searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((res: any) => {

      const txt = res?.toString()?.trim() ?? '';

      this.designationSearchText = txt;

      // RESET SEARCH PAGINATION
      this.searchDesignationLoadCount = 50;

      if (txt?.length) {

        this.desigantionFilterEnable = true;

        // API SEARCH ONLY
        this.getDesignation(txt, 0);

      } else {

        this.desigantionFilterEnable = false;

        this.masterData.designation =
          (this.masterData.designationBackup || []).slice(
            0,
            this.designationDefaultLoadCount
          );

        this.designationListLoadCount =
          this.designationDefaultLoadCount;

        this.designationOffset = 0;

        this.checkCurrentDesignationPresent();
      }
    });
}


   if (
  !this.masterData.designationBackup ||
  this.masterData.designationBackup.length === 0
) {
  this.getDesignationSafe();
}

  }

  private getDesignationSafe(): void {
    if (this.designationInitInProgress || this.isLoadingMoreDesignations) {
      return
    }
    this.designationInitInProgress = true
    this.getDesignation()
  }

  initializeForm() {
    this.designationForm = this.fb.group({
      designation_name: [[], Validators.required],
      instruction: ['', Validators.required],
      uploadDoc: [null, []],
      searchDesignation: [''],
    });
    this.designationForm.get('designation_name')?.valueChanges
  .subscribe(() => {
    this.checkCurrentDesignationPresent();
  });
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    // Validate file size
    const maxBytes = this.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.uploadError = `File exceeds maximum size of ${this.maxFileSizeMB}MB`;
      this.designationForm.get('uploadDoc')?.setErrors({ maxSize: true });
      return;
    }

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.uploadError = `Invalid file type. Allowed: PDF, Word, Excel, TXT`;
      this.designationForm.get('uploadDoc')?.setErrors({ fileType: true });
      return;
    }

    this.uploadedFile = file;
    this.uploadError = null;
    this.designationForm.patchValue({ uploadDoc: file });
    this.designationForm.get('uploadDoc')?.updateValueAndValidity();
  }

  cancelForm() {
    this.dialogRef.close()
  }

  // saveDesignation() {
  //   this.loading = true
  //   const formData = new FormData();
  //   formData.append('designationName', this.designationForm.get('designationName')?.value);
  //   formData.append('roleDetails', this.designationForm.get('roleDetails')?.value);
  //   if (this.uploadedFile) {
  //     formData.append('uploadDoc', this.uploadedFile);
  //   }
  //   this.cbpPlanFinalObj = this.sharedService.getCBPPlanLocalStorage()
  //   console.log('this.designationForm', this.designationForm)
  //   let req: any = {
  //     "state_center_id": this.sharedService.cbpPlanFinalObj.ministry.identifier,
  //     "state_center_name": this.sharedService.cbpPlanFinalObj.ministry.orgName,
  //     // "department_id": "",
  //     "designation_name": this.designationForm.value.designation_name,
  //     "instruction": this.designationForm.value.instruction,
  //   }
  //   if (this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'state' && this.sharedService.cbpPlanFinalObj.department_name) {
  //     req['department_id'] = this.sharedService.cbpPlanFinalObj.departments
  //     req['department_name'] = this.sharedService.cbpPlanFinalObj.department_name
  //   }
  //   if (this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'ministry' && this.sharedService.cbpPlanFinalObj.department_name) {
  //     req['department_id'] = this.sharedService.cbpPlanFinalObj.departments
  //     req['department_name'] = this.sharedService.cbpPlanFinalObj.department_name
  //   }

  //   console.log('req', req)
  //   this.sharedService.addDesignation(req).subscribe({
  //     next: (_res) => {
  //       this.loading = false
  //       this.snackBar.open('Designation Added Successfully', 'X', {
  //         duration: 3000,
  //         panelClass: ['snackbar-success']
  //       });
  //       this.dialogRef.close('saved')
  //     },
  //     error: (error) => {
  //       this.loading = false
  //       this.snackBar.open('Failed to add designation. Please try again.', 'X', {
  //         duration: 5000,
  //         panelClass: ['snackbar-error']
  //       });
  //       console.error('Error adding designation:', error);
  //     }
  //   })
  // }



  saveDesignation() {
    const selectedDesignations: string[] = this.designationForm.get('designation_name')?.value || [];

    if (!selectedDesignations.length) {
      this.snackBar.open('Please select at least one designation', 'X', { duration: 3000 });
      return;
    }

    this.loading = true;

    const baseObj = {
      state_center_id: this.sharedService.cbpPlanFinalObj.ministry.identifier,
      state_center_name: this.sharedService.cbpPlanFinalObj.ministry.orgName,
      instruction: this.designationForm.value.instruction,
    };

    if (this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'state' && this.sharedService.cbpPlanFinalObj.department_name) {
      baseObj['department_id'] = this.sharedService.cbpPlanFinalObj.departments;
      baseObj['department_name'] = this.sharedService.cbpPlanFinalObj.department_name;
    }

    if (this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'ministry' && this.sharedService.cbpPlanFinalObj.department_name) {
      baseObj['department_id'] = this.sharedService.cbpPlanFinalObj.departments;
      baseObj['department_name'] = this.sharedService.cbpPlanFinalObj.department_name;
    }

    // Create an array of observables, one per designation
    const apiCalls = selectedDesignations.map(designationName => {
      const req = {
        ...baseObj,
        designation_name: designationName,
      };

      return this.sharedService.addDesignation(req).pipe(
        catchError(error => {
          console.error(`Failed to add designation: ${designationName}`, error);
          // Return observable that emits an error object but does not break forkJoin
          return of({ error: true, designation: designationName });
        })
      );
    });

    // Wait for all API calls to complete
    forkJoin(apiCalls).subscribe(results => {
      this.loading = false;

      // Check if any call failed
      const failed = results.filter(res => res?.error);

      if (failed.length > 0) {
        const failedNames = failed.map(f => f.designation).join(', ');
        this.snackBar.open(`Failed to add designations: ${failedNames}`, 'X', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      } else {
        this.snackBar.open('All designations added successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close('saved');
      }
    });
  }

  closeDialog() {
    this.dialogRef.close()
  }

  getDesignation(searchText?: string, offset?: number): void {

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.designationOffset
    let reqLimit = this.designationDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacyDesignations = false
      reqLimit = 50
    }
    const requestBody: any = {
      filterCriteriaMap: {
        status: 'Active'
      },
      requestedFields: [],
      pageNumber: pageIndex,
      pageSize: reqLimit,
    }
    if (searchText?.length) {
      requestBody['searchString'] = searchText
      // when searching, start from first page
      requestBody.pageNumber = 0
      // allow larger page for search if needed
      requestBody.pageSize = pageIndex === 0 ? 50 : this.designationListLoadCount
      // reset guard when performing a fresh search
      this.noMoreLegacyDesignations = false
    }

    // indicate loading state so scroll handlers don't trigger parallel calls
    this.isLoadingMoreDesignations = true

    this.sharedService.searchPublicDesignation(requestBody).pipe(finalize(() => {
      this.isLoadingMoreDesignations = false
      this.designationInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {

  const content = _.get(res, 'result.result.data', []);

  const matchedIds = new Set(this.matchedDesignationIds);

  const mapped = content
  .filter((item: any) => !matchedIds.has(item?.id))
  .map((item: any) => ({
    id: item?.id,
    name: item?.designation || '',
    status: item?.status || 'Active',
  }));

  const total = _.get(
    res,
    'result.result.totalcount',
    _.get(
      res,
      'result.result.data.totalCount',
      _.get(res, 'result.result.totalCount', 0)
    )
  );

  this.defaultSearchDesignationCount = total;

  // =========================
  // SEARCH MODE
  // =========================

  if (searchText?.length) {

    this.masterData.designationFiltered = mapped;

    this.masterData.designation =
      this.masterData.designationFiltered.slice(
        0,
        this.searchDesignationLoadCount
      );

    this.checkCurrentDesignationPresent();

    return;
  }

  // =========================
  // NORMAL MODE
  // =========================

  if (!this.masterData['designationBackup'] || reqOffset === 0) {

    this.masterData['designationBackup'] = mapped;

  } else {

    const combined =
      (this.masterData['designationBackup'] || []).concat(mapped);

    this.masterData['designationBackup'] = _.uniqBy(
      combined,
      (it: any) => (it?.name || '').toLowerCase()
    );
  }

  this.masterData.designation =
    (this.masterData.designationBackup || []).slice(
      0,
      this.designationListLoadCount
    );

  // selected value preserve
  const designationControl =
    this.designationForm.get('designation_name');

  if (designationControl) {

    const currentValues =
      designationControl.value || [];

    const validValues = currentValues.filter(
      (value: string) =>
        this.masterData.designationBackup.some(
          (item: any) => item?.name === value
        )
    );

    if (validValues.length !== currentValues.length) {
      designationControl.setValue(validValues);
    }
  }

  // no more data
  if (!mapped || mapped.length === 0) {
    this.noMoreLegacyDesignations = true;
  }

  if (
    this.defaultSearchDesignationCount &&
    (this.masterData['designationBackup'] || []).length >=
    this.defaultSearchDesignationCount
  ) {
    this.noMoreLegacyDesignations = true;
  }

  this.checkCurrentDesignationPresent();
},
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyDesignations = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }
  // FIX 2: Also inject selected items into designationBackup
checkCurrentDesignationPresent() {

  const selectedDesignations: string[] =
    this.designationForm.get('designation_name')?.value || [];

  if (!this.masterData?.designation) {
    return;
  }

  // Create selected entries
  const selectedItems = selectedDesignations.map((name: string) => ({
    name,
    status: 'Active'
  }));

  // Remove selected items from current lists
  const remainingVisible = (this.masterData.designation || []).filter(
    (item: any) =>
      !selectedDesignations.some(
        selected => selected.toLowerCase() === item?.name?.toLowerCase()
      )
  );

  const remainingBackup = (this.masterData.designationBackup || []).filter(
    (item: any) =>
      !selectedDesignations.some(
        selected => selected.toLowerCase() === item?.name?.toLowerCase()
      )
  );

  // Put selected items on top
  this.masterData.designation = _.uniqBy(
    [...selectedItems, ...remainingVisible],
    (item: any) => item?.name?.toLowerCase()
  );

  this.masterData.designationBackup = _.uniqBy(
    [...selectedItems, ...remainingBackup],
    (item: any) => item?.name?.toLowerCase()
  );
}
  onDesignationDropdownClosed(): void {
    // Keep the designation value but clear the search input
    const currentDesignation = this.designationForm.get('designation_name')!.value
    setTimeout(() => {
      if (this.designationForm.get('searchDesignation')) {
        this.designationForm.get('searchDesignation')!.setValue('')
      }
      // Ensure the designation value remains selected
      if (currentDesignation) {
        const designationControl = this.designationForm.get('designation_name');
        if (designationControl) {
          designationControl.setValue(currentDesignation)
        }
      }
    }, 100)
  }

  // designationSearch(evt: any) {
  //   const searchText = evt?.target?.value
  //   const txt = (searchText || '').toString().trim()
  //   if (this.isLoadingMoreDesignations) return

  //   this.designationSearchText = txt
  //   if (txt?.length) {
  //     this.desigantionFilterEnable = true
  //     this.isLoadingMoreDesignations = true
  //     this.getDesignation(txt, 0)
  //   } else if (this.masterData && this.masterData?.designationBackup) {
  //     this.masterData.designation = this.masterData?.designationBackup.slice(0, this.designationDefaultLoadCount)
  //     this.desigantionFilterEnable = false
  //     this.checkCurrentDesignationPresent()
  //   }
  // }
 setupScrollListener(opened: boolean): void {

 if (!opened) {
    this.scrollListenerAttached = false;
    return;
  }

  if (this.scrollListenerAttached) return;
  this.scrollListenerAttached = true;
  this.desigantionFilterEnable = false;

  // ✅ Only reset pagination if we have no data yet
  if (!this.masterData.designationBackup?.length) {
    this.designationListLoadCount = this.designationDefaultLoadCount;
    this.designationOffset = 0;
    this.getDesignation(undefined, 0);
  } else {
    // ✅ Restore from backup without resetting offset
    this.masterData.designation = this.masterData.designationBackup.slice(
      0, this.designationListLoadCount
    );
    this.checkCurrentDesignationPresent();
  }

  // focus search input
  setTimeout(() => {

    const searchInput =
      document.querySelector('.search-input') as HTMLInputElement;

    if (searchInput) {
      searchInput.focus();
    }

  }, 200);

  // attach scroll
  setTimeout(() => {

    const panel = document.querySelector(
      '.mat-select-panel.search-panel'
    ) as HTMLElement | null;

    if (!panel) {
      return;
    }

    // REMOVE OLD LISTENER
    panel.removeEventListener(
      'scroll',
      this.onDesignationSelectScroll as any
    );

    panel.addEventListener(
      'scroll',
      this.onDesignationSelectScroll.bind(this),
      { passive: true }
    );

  }, 300);
}

  onDesignationSelectScroll(event: any): void {

    const element = event?.target;

    const reachedBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 5;

    if (!reachedBottom || this.isLoadingMoreDesignations) {
      return;
    }

    // =========================
    // SEARCH MODE
    // =========================
    if (this.desigantionFilterEnable) {

      this.isLoadingMoreDesignations = true;

      this.searchDesignationLoadCount += 50;

      setTimeout(() => {

        this.masterData.designation =
          this.masterData.designationFiltered.slice(
            0,
            this.searchDesignationLoadCount
          );

        this.checkCurrentDesignationPresent();

        this.isLoadingMoreDesignations = false;

      }, 300);

      return;
    }

    // =========================
    // NORMAL MODE
    // =========================

    // local pagination
    if (
      this.masterData?.designationBackup?.length >
      this.masterData?.designation?.length
    ) {

      this.isLoadingMoreDesignations = true;

      this.designationListLoadCount +=
        this.designationDefaultLoadCount;

      setTimeout(() => {

        this.masterData.designation =
          this.masterData.designationBackup.slice(
            0,
            this.designationListLoadCount
          );

        this.checkCurrentDesignationPresent();

        this.isLoadingMoreDesignations = false;

      }, 300);

      return;
    }

    // server pagination
    const loadedLegacy =
      (this.masterData?.designationBackup || []).length;

    if (
      !this.noMoreLegacyDesignations &&
      this.defaultSearchDesignationCount &&
      loadedLegacy < this.defaultSearchDesignationCount
    ) {

      this.isLoadingMoreDesignations = true;

      this.designationOffset =
        (this.designationOffset || 0) +
        this.designationDefaultLoadCount;

      this.designationListLoadCount +=
        this.designationDefaultLoadCount;

      this.getDesignation(undefined, this.designationOffset);
    }
  }

  get searchDesignationControl(): FormControl {
    return this.designationForm.get('searchDesignation') as FormControl;
  }

  clearDesignationSearch(event: Event): void {
    this.searchDesignationLoadCount = 50;
    event.stopPropagation();

    this.searchDesignationControl.setValue('');

    this.desigantionFilterEnable = false;

    this.masterData.designation =
      (this.masterData.designationBackup || []).slice(
        0,
        this.designationDefaultLoadCount
      );

    this.designationListLoadCount = this.designationDefaultLoadCount;
    this.designationOffset = 0;
  }


}
