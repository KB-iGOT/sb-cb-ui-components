import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import  _ from 'lodash'
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
    this.initializeForm();

    const searchControl = this.designationForm.get('searchDesignation');

    if (searchControl) {
      searchControl.valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    startWith('')
  )
  .subscribe(res => {
    const txt = res?.toString()?.trim() ?? '';

    if (txt?.length) {
      this.desigantionFilterEnable = true;
      this.masterData.designationFiltered =
        this.masterData.designationBackup.filter((item: any) =>
          item.name.toLowerCase().includes(txt.toLowerCase())
        );

      // show initial page of filtered results
      this.masterData.designation = this.masterData.designationFiltered.slice(0, this.designationListLoadCount);

    } else {
      this.desigantionFilterEnable = false;

      // show first page from backup
      this.masterData.designation = this.masterData.designationBackup.slice(0, this.designationDefaultLoadCount);
      this.designationListLoadCount = this.designationDefaultLoadCount;
      this.designationOffset = 0;
    }
  });
    }


    if (!this.masterData['designationBackup']) {
      this.getDesignationSafe()
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
          const content = _.get(res, 'result.result.data', [])
          const mapped = content.map((item: any) => ({
            name: item?.designation || '',
            status: item?.status || 'Active',
          }))

          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'result.result.totalcount', _.get(res, 'result.result.data.totalCount', _.get(res, 'result.result.totalCount', 0)))
          this.defaultSearchDesignationCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          if (!this.masterData['designationBackup'] || reqOffset === 0) {
            this.masterData['designationBackup'] = mapped
          } else {
            const combined = (this.masterData['designationBackup'] || []).concat(mapped)
            this.masterData['designationBackup'] = _.uniqBy(combined, (it: any) => (it?.name || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacyDesignations = true
          }

          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchDesignationCount && (this.masterData['designationBackup'] || []).length >= this.defaultSearchDesignationCount) {
            this.noMoreLegacyDesignations = true
          }

          // Ensure visible list matches the requested display count
          this.masterData['designation'] = (this.masterData['designationBackup'] || []).slice(0, this.designationListLoadCount)
          // loading flag cleared in finalize()
          this.checkCurrentDesignationPresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyDesignations = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }
  checkCurrentDesignationPresent() {
    const selectedDesignations: string[] =
      this.designationForm.get('designation_name')?.value || [];

    if (!Array.isArray(selectedDesignations) || !selectedDesignations.length) {
      return;
    }

    if (!this.masterData?.designation) {
      return;
    }

    selectedDesignations.forEach((selectedName: string) => {
      const exists = this.masterData.designation.some(
        (item: any) =>
          item?.name?.toLowerCase() === selectedName?.toLowerCase()
      );

      if (!exists) {
        const newDesignation = {
          name: selectedName,
          status: 'Active',
          id: 'custom-' + Date.now() + '-' + Math.random()
        };

        // Add to backup list as well
        this.masterData.designationBackup =
          this.masterData.designationBackup || [];

        this.masterData.designationBackup.unshift(newDesignation);

        // Also update visible list
        this.masterData.designation.unshift(newDesignation);
      }
    });
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

  designationSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreDesignations) return

    this.designationSearchText = txt
    if (txt?.length) {
      this.desigantionFilterEnable = true
      this.isLoadingMoreDesignations = true
      this.getDesignation(txt, 0)
    } else if (this.masterData && this.masterData?.designationBackup) {
      this.masterData.designation = this.masterData?.designationBackup.slice(0, this.designationDefaultLoadCount)
      this.desigantionFilterEnable = false
      this.checkCurrentDesignationPresent()
    }
  }
  setupScrollListener(opened: boolean): void {
    if (opened) {
      if (!this.scrollListenerAttached) {
        this.scrollListenerAttached = true

        this.desigantionFilterEnable = false
        this.designationListLoadCount = this.designationDefaultLoadCount
        this.designationOffset = 0

        this.isLoadingMoreDesignations = true
        this.getDesignation(undefined, 0)

        // Clear search box once
        if (this.designationForm.get('searchDesignation')) {
          this.designationForm.get('searchDesignation')!.setValue('')
        }

        setTimeout(() => {
          const searchInput = document.querySelector('.search-input') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)

        // Attach scroll listener safely
        setTimeout(() => {
          const panel = document.querySelector('.mat-select-panel.search-panel') as HTMLElement | null
          if (panel) {
            // align panel width to trigger
            try {
              const triggerEl = this.designationRef && this.designationRef.nativeElement as HTMLElement
              if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect()
                // set width and left so panel aligns exactly below the trigger
                panel.style.width = `${Math.round(rect.width)}px`
                // leave left to overlay positioning but nudge if necessary
                // compute left relative to viewport and apply to panel
                const overlayLeft = rect.left
                panel.style.left = `${Math.round(overlayLeft)}px`
              }
            } catch (e) {
              // ignore DOM errors in SSR or unexpected cases
            }

            const scrollHandler = this.onDesignationSelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      this.scrollListenerAttached = false
    }
  }

  onDesignationSelectScroll(event: any): void {
    const element = event?.target
    if (!this.desigantionFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreDesignations) {
          // If org uses IGOT designation taxonomy, request more from the API by increasing the limit
          if (this.masterData?.designationBackup?.length > this.masterData?.designation?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoreDesignations = true
            this.designationListLoadCount += this.designationDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.designation = this.masterData?.designationBackup?.slice(0, this.designationListLoadCount)
              this.checkCurrentDesignationPresent()
              this.isLoadingMoreDesignations = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.designationBackup || []).length
            if (!this.noMoreLegacyDesignations && this.defaultSearchDesignationCount && loadedLegacy < this.defaultSearchDesignationCount) {
              this.isLoadingMoreDesignations = true
              this.designationOffset = (this.designationOffset || 0) + this.designationDefaultLoadCount
              // increase display count to include newly fetched items
              this.designationListLoadCount += this.designationDefaultLoadCount
              this.getDesignation(undefined, this.designationOffset)
            }
          }
        }
      }
    }
  }

  get searchDesignationControl(): FormControl {
    return this.designationForm.get('searchDesignation') as FormControl;
  }


}
