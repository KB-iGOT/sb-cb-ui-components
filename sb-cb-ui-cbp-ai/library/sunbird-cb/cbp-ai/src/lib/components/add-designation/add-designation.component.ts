import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import * as _ from 'lodash-es'
import { forkJoin, of } from 'rxjs';
import { SharedService } from '../../modules/shared/services/shared.service';
@Component({
    selector: 'app-add-designation',
    templateUrl: './add-designation.component.html',
    styleUrls: ['./add-designation.component.scss'],
    standalone: false
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
  readonly MAX_DESIGNATIONS = 10;
  maxDesignationCount = 10;
  private designationScrollHandler = this.onDesignationSelectScroll.bind(this);
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

    // const searchControl = this.designationForm.get('searchDesignation');

    // if (searchControl) {
    //   searchControl.valueChanges
    //     .pipe(
    //       debounceTime(300),
    //       distinctUntilChanged()
    //     )
    //     .subscribe((res: any) => {

    //       const txt = res?.toString()?.trim() ?? '';

    //       this.designationSearchText = txt;

    //       // RESET SEARCH PAGINATION
    //       this.searchDesignationLoadCount = 50;

    //       if (txt?.length) {

    //         this.desigantionFilterEnable = true;

    //         // API SEARCH ONLY
    //         this.getDesignation(txt, 0);

    //       } else {

    //         this.desigantionFilterEnable = false;

    //         this.masterData.designation =
    //           (this.masterData.designationBackup || []).slice(
    //             0,
    //             this.designationDefaultLoadCount
    //           );

    //         this.designationListLoadCount =
    //           this.designationDefaultLoadCount;

    //         this.designationOffset = 0;

    //         this.checkCurrentDesignationPresent();
    //       }
    //     });
    // }


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
      designations: this.fb.array([])
    });

    this.addDesignationBlock();
  }

  get designationArray(): FormArray {
    return this.designationForm.get('designations') as FormArray;
  }

  addDesignationBlock(): void {
    if (this.designationArray.length >= this.maxDesignationCount) {
      return;
    }

    const group = this.createDesignationForm();

    group.get('designation_name')?.valueChanges.subscribe(() => {
      this.checkCurrentDesignationPresent();
    });

    group.get('searchDesignation')?.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((value: string) => {

      const txt = value?.trim() || '';

      this.designationSearchText = txt;
      this.searchDesignationLoadCount = 50;

      if (txt) {

        this.desigantionFilterEnable = true;

        this.getDesignation(txt, 0);

      } else {

        this.desigantionFilterEnable = false;

        this.masterData.designation =
          (this.masterData.designationBackup || []).slice(
            0,
            this.designationDefaultLoadCount
          );

        this.checkCurrentDesignationPresent();
      }
    });

    this.designationArray.push(group);
  }

  saveDesignationBlock(index: number): void {

    const group = this.designationArray.at(index) as FormGroup;

    group.markAllAsTouched();

    if (group.invalid) {
      return;
    }

    group.patchValue({
      isEdit: false
    });

    this.cdRef.detectChanges();
  }
  editDesignationBlock(index: number): void {
    this.designationArray.at(index).get('isEdit')?.setValue(true);
  }

  deleteDesignationBlock(index: number): void {
    this.designationArray.removeAt(index);

    if (this.designationArray.length === 0) {
      this.addDesignationBlock();
    }
  }

  createDesignationForm(): FormGroup {
    return this.fb.group({
      designation_name: [null, Validators.required],
      instruction: ['', Validators.required],
      uploadDoc: [null, []],
      searchDesignation: [''],
      isEdit: [true]
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
     this.resetPopup();
  this.dialogRef.close();
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



saveDesignation(): void {

  if (!this.canGenerateCBP) {
    this.snackBar.open(
      'Please save all designation sections before generating CBP.',
      'X',
      { duration: 3000 }
    );
    return;
  }

  const designationRows = this.designationArray.controls
    .map(control => ({
      designation_name: control.get('designation_name')?.value,
      instruction: control.get('instruction')?.value
    }))
    .filter(row => row.designation_name);

  if (!designationRows.length) {
    this.snackBar.open(
      'Please select at least one designation.',
      'X',
      { duration: 3000 }
    );
    return;
  }

  this.loading = true;

  const baseObj: any = {
    state_center_id:
      this.sharedService.cbpPlanFinalObj.ministry.identifier,

    state_center_name:
      this.sharedService.cbpPlanFinalObj.ministry.orgName
  };

  if (
    this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'state' &&
    this.sharedService.cbpPlanFinalObj.department_name
  ) {
    baseObj.department_id =
      this.sharedService.cbpPlanFinalObj.departments;

    baseObj.department_name =
      this.sharedService.cbpPlanFinalObj.department_name;
  }

  if (
    this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'ministry' &&
    this.sharedService.cbpPlanFinalObj.department_name
  ) {
    baseObj.department_id =
      this.sharedService.cbpPlanFinalObj.departments;

    baseObj.department_name =
      this.sharedService.cbpPlanFinalObj.department_name;
  }

  const apiCalls = designationRows.map(row => {

    const req = {
      ...baseObj,
      designation_name: row.designation_name,
      instruction: row.instruction
    };

    return this.sharedService.addDesignation(req).pipe(
      catchError(error => {

        console.error(
          `Failed to add designation: ${row.designation_name}`,
          error
        );

        return of({
          error: true,
          designation: row.designation_name
        });
      })
    );
  });

  forkJoin(apiCalls).subscribe({
    next: (results: any[]) => {

      this.loading = false;

      const failed = results.filter(res => res?.error);

      if (failed.length) {

        const failedNames = failed
          .map(item => item.designation)
          .join(', ');

        this.snackBar.open(
          `Failed to add designations: ${failedNames}`,
          'X',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );

        return;
      }

      this.snackBar.open(
        'All designations added successfully',
        'X',
        {
          duration: 3000,
          panelClass: ['snackbar-success']
        }
      );

      this.dialogRef.close('saved');
    },

    error: () => {

      this.loading = false;

      this.snackBar.open(
        'Something went wrong. Please try again.',
        'X',
        {
          duration: 5000,
          panelClass: ['snackbar-error']
        }
      );
    }
  });
}

  closeDialog() {
    this.resetPopup();
  this.dialogRef.close();
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

          if (content?.length === 0) {
            this.noMoreLegacyDesignations = true;
          } else {
            this.noMoreLegacyDesignations = false;
          }

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
      this.designationArray.controls
        .map(control => control.get('designation_name')?.value)
        .filter(value => !!value);

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
  onDesignationDropdownClosed(index: number): void {
    const group = this.designationArray.at(index);

  const currentDesignation =
    group.get('designation_name')?.value;

  setTimeout(() => {

    group.get('searchDesignation')?.setValue(
      '',
      { emitEvent: false }
    );

    if (currentDesignation) {
      group.get('designation_name')
        ?.setValue(currentDesignation, { emitEvent: false });
    }

  }, 100);
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

      panel.removeEventListener(
  'scroll',
  this.designationScrollHandler
);

panel.addEventListener(
  'scroll',
  this.designationScrollHandler,
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

      // this.isLoadingMoreDesignations = true;

      this.searchDesignationLoadCount += 50;

      setTimeout(() => {

        this.masterData.designation =
          this.masterData.designationFiltered.slice(
            0,
            this.searchDesignationLoadCount
          );
          // this.isLoadingMoreDesignations = false;
        this.checkCurrentDesignationPresent();

        

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
    console.log('loadedLegacy--',loadedLegacy)
    console.log('this.noMoreLegacyDesignations--',this.noMoreLegacyDesignations)
    console.log('this.defaultSearchDesignationCount',this.defaultSearchDesignationCount)
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
      
        console.log('this.designationOffset--', this.designationOffset)

      this.getDesignation(undefined, this.designationOffset);
    } else {
      this.isLoadingMoreDesignations = false;
    }
  }

  get searchDesignationControl(): FormControl {
    return this.designationForm.get('searchDesignation') as FormControl;
  }

  clearDesignationSearch(index:number, event: Event): void {
   event.stopPropagation();

  const control = this.designationArray
    .at(index)
    .get('searchDesignation');

  control?.setValue('');

  this.desigantionFilterEnable = false;

  this.masterData.designation =
    (this.masterData.designationBackup || []).slice(
      0,
      this.designationDefaultLoadCount
    );

  this.checkCurrentDesignationPresent();
  }

  get canGenerateCBP(): boolean {

    if (this.designationArray.length === 0) {
      return false;
    }

    return this.designationArray.controls.every(
      control =>
        !control.get('isEdit')?.value &&
        control.valid
    );
  }

  getFilteredDesignations(currentIndex: number): any[] {

    // Get all selected designations except current row
    const selectedDesignations = this.designationArray.controls
      .map((control, index) =>
        index !== currentIndex
          ? control.get('designation_name')?.value
          : null
      )
      .filter(value => !!value);

    return (this.masterData?.designation || []).filter(
      (designation: any) => {

        const currentValue =
          this.designationArray.at(currentIndex)
            .get('designation_name')?.value;

        // Keep current selected value visible
        if (designation.name === currentValue) {
          return true;
        }

        return !selectedDesignations.includes(designation.name);
      }
    );
  }

  private resetPopup(): void {

  this.designationForm.reset();

  this.designationArray.clear();

  this.designationArray.push(
    this.createDesignationForm()
  );

  this.masterData.designation = [];
  this.masterData.designationBackup = [];
  this.masterData.designationFiltered = [];

  this.designationSearchText = '';
  this.designationOffset = 0;
  this.searchDesignationLoadCount = 50;
  this.designationListLoadCount = 50;

  this.noMoreLegacyDesignations = false;
  this.desigantionFilterEnable = false;

  this.uploadedFile = null;
  this.uploadError = null;

    this.masterData = {
    designation: [],
    designationBackup: [],
    designationFiltered: []
  };
  this.designationArray.clear();

  this.addDesignationBlock();
  this.getDesignationSafe();

}

}
