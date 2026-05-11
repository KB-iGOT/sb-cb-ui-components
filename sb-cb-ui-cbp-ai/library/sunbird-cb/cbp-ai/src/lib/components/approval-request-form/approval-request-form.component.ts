import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import _ from 'lodash'
import { forkJoin, of } from 'rxjs';
import { SharedService } from '../../modules/shared/services/shared.service';
@Component({
    selector: 'app-approval-request-form',
    templateUrl: './approval-request-form.component.html',
    styleUrls: ['./approval-request-form.component.scss'],
    standalone: false
})
export class ApprovalRequestFormComponent {
  approvalRequestForm: FormGroup;
  cbpPlanFinalObj: any
  loading = false
  @ViewChild('mdo', { read: ElementRef }) mdoRef?: ElementRef
  mdoFilterEnable = false
  isLoadingMoremdos = false;
  mdoOffset = 0
  odcsmdoCount = 0
  defaultSearchmdoCount = 0
  mdoListLoadCount = 50
  mdoDefaultLoadCount = 50
  noMoreLegacymdos = false
  mdoSearchText = ''
  mdoInitInProgress = false
  scrollListenerAttached = false
  masterData: any = {}
  role_mapping_ids = []
  constructor(public dialogRef: MatDialogRef<ApprovalRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private snackBar: MatSnackBar) {
      this.role_mapping_ids = data
    this.masterData = {
      mdoBackup: [],
      mdoFiltered: [], // filtered search results
    };

  }

  ngOnInit() {
    this.initializeForm();
    console.log('this.role_mapping_ids--',this.role_mapping_ids)

    const searchControl = this.approvalRequestForm.get('searchmdo');

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
            this.mdoFilterEnable = true;
            this.masterData.mdoFiltered =
              this.masterData.mdoBackup.filter((item: any) =>
                item.name.toLowerCase().includes(txt.toLowerCase())
              );

            // show initial page of filtered results
            this.masterData.mdo = this.masterData.mdoFiltered.slice(0, this.mdoListLoadCount);

          } else {
            this.mdoFilterEnable = false;

            // show first page from backup
            this.masterData.mdo = this.masterData.mdoBackup.slice(0, this.mdoDefaultLoadCount);
            this.mdoListLoadCount = this.mdoDefaultLoadCount;
            this.mdoOffset = 0;
          }
        });
    }


    console.log(this.masterData['mdoBackup'])
    if (!this.masterData['mdoBackup'].length) {
      this.getmdoSafe()
    }

  }

  private getmdoSafe(): void {
    if (this.mdoInitInProgress || this.isLoadingMoremdos) {
      return
    }
    this.mdoInitInProgress = true
    this.getmdo()
  }

  initializeForm() {
    this.approvalRequestForm = this.fb.group({
      mdo_name: ['', Validators.required],
      request_name: ['', Validators.required],
      searchmdo: [''],
    });
  }



  cancelForm() {
    this.dialogRef.close()
  }

  savemdo() {
    const selectedmdo: string = this.approvalRequestForm.get('mdo_name')?.value;

    if (!selectedmdo) {
      this.snackBar.open('Please select an mdo leader/admin', 'X', { duration: 3000 });
      return;
    }

    this.loading = true;

    const baseObj = {
      state_center_id: this.sharedService.cbpPlanFinalObj.ministry.identifier,
      // state_center_name: this.sharedService.cbpPlanFinalObj.ministry.orgName,
      role_mapping_ids: this.role_mapping_ids.map((item: any) => item.id),
      request_name: this.approvalRequestForm.value.request_name,
    };

    if (this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'state' && this.sharedService.cbpPlanFinalObj.department_name) {
      baseObj['department_id'] = this.sharedService.cbpPlanFinalObj.departments;
     // baseObj['department_name'] = this.sharedService.cbpPlanFinalObj.department_name;
    }

    if (this.sharedService.cbpPlanFinalObj?.ministry?.sbOrgType === 'ministry' && this.sharedService.cbpPlanFinalObj.department_name) {
      baseObj['department_id'] = this.sharedService.cbpPlanFinalObj.departments;
     // baseObj['department_name'] = this.sharedService.cbpPlanFinalObj.department_name;
    }

    // Create an array of observables, one per mdo
    const req = {
      ...baseObj,
      mdo_id: selectedmdo
    };

    this.sharedService.saveApprovalRequest(req)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Request sent successfully', 'X', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.dialogRef.close('saved');
        },
        error: (error) => {
          console.log('error', error)
          this.snackBar.open((error?.error?.detail || 'Failed to send request'), 'X', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
  }

  closeDialog() {
    this.dialogRef.close()
  }

  getmdo(searchText?: string, offset?: number): void {

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.mdoOffset
    let reqLimit = this.mdoDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacymdos = false
      reqLimit = 50
    }
    // const requestBody: any = {
    //   filterCriteriaMap: {
    //     status: 'Active'
    //   },
    //   requestedFields: [],
    //   pageNumber: pageIndex,
    //   pageSize: reqLimit,
    // }

    const requestBody: any = {
      "request": {
        "filters": {
          "organisations.roles": [
            "MDO_LEADER",
            "MDO_ADMIN"
          ],
          "rootOrgId": this.sharedService.cbpPlanFinalObj.departments
        },
        "fields": [
          "firstName",
          "lastName",
          "id",
          "rootOrgId",
          "organisations",
          "roles"
        ],
        pageNumber: pageIndex,
        pageSize: reqLimit,
      }
    }
    if (searchText?.length) {
      requestBody['searchString'] = searchText
      // when searching, start from first page
      requestBody.pageNumber = 0
      // allow larger page for search if needed
      requestBody.pageSize = pageIndex === 0 ? 50 : this.mdoListLoadCount
      // reset guard when performing a fresh search
      this.noMoreLegacymdos = false
    }

    // indicate loading state so scroll handlers don't trigger parallel calls
    this.isLoadingMoremdos = true
    console.log('requestBody', requestBody)
    this.sharedService.searchPublicmdo(requestBody).pipe(finalize(() => {
      this.isLoadingMoremdos = false
      this.mdoInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {
          const content = _.get(res, 'admins', [])
          console.log('content--', content)
          const mapped = content.map((item: any) => ({
            id: item?.id,
            name: `${item?.first_name} ${item?.last_name}` || '',
            status: item?.status || 'Active',
            role_type: item?.role_type,
            department_name: item?.department_name

          }))

          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'count', _.get(res, 'count', _.get(res, 'count', 0)))
          this.defaultSearchmdoCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          if (!this.masterData['mdoBackup'] || reqOffset === 0) {
            this.masterData['mdoBackup'] = mapped
          } else {
            const combined = (this.masterData['mdoBackup'] || []).concat(mapped)
            this.masterData['mdoBackup'] = _.uniqBy(combined, (it: any) => (it?.name || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacymdos = true
          }

          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchmdoCount && (this.masterData['mdoBackup'] || []).length >= this.defaultSearchmdoCount) {
            this.noMoreLegacymdos = true
          }

          // Ensure visible list matches the requested display count
          this.masterData['mdo'] = (this.masterData['mdoBackup'] || []).slice(0, this.mdoListLoadCount)
          // loading flag cleared in finalize()
          this.checkCurrentmdoPresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacymdos = true
          // this.matSnackBar.open('Unable to fetch mdo details, please try again later!')
        }
      })
  }
checkCurrentmdoPresent() {
  const selectedmdo = this.approvalRequestForm.get('mdo_name')?.value;

  if (!selectedmdo || !this.masterData?.mdo) return;

  const exists = this.masterData.mdo.some(
    (item: any) => item?.name?.toLowerCase() === selectedmdo?.toLowerCase()
  );

  if (!exists) {
    const newmdo = {
      name: selectedmdo,
      status: 'Active',
      id: 'custom-' + Date.now()
    };

    this.masterData.mdoBackup = this.masterData.mdoBackup || [];
    this.masterData.mdoBackup.unshift(newmdo);
    this.masterData.mdo.unshift(newmdo);
  }
}
  onmdoDropdownClosed(): void {
    // Keep the mdo value but clear the search input
    const currentmdo = this.approvalRequestForm.get('mdo_name')!.value
    setTimeout(() => {
      if (this.approvalRequestForm.get('searchmdo')) {
        this.approvalRequestForm.get('searchmdo')!.setValue('')
      }
      // Ensure the mdo value remains selected
      if (currentmdo) {
        const mdoControl = this.approvalRequestForm.get('mdo_name');
        if (mdoControl) {
          mdoControl.setValue(currentmdo)
        }
      }
    }, 100)
  }

  mdoSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoremdos) return

    this.mdoSearchText = txt
    if (txt?.length) {
      this.mdoFilterEnable = true
      this.isLoadingMoremdos = true
      this.getmdo(txt, 0)
    } else if (this.masterData && this.masterData?.mdoBackup) {
      this.masterData.mdo = this.masterData?.mdoBackup.slice(0, this.mdoDefaultLoadCount)
      this.mdoFilterEnable = false
      this.checkCurrentmdoPresent()
    }
  }
  setupScrollListener(opened: boolean): void {
    if (opened) {
      if (!this.scrollListenerAttached) {
        this.scrollListenerAttached = true

        this.mdoFilterEnable = false
        this.mdoListLoadCount = this.mdoDefaultLoadCount
        this.mdoOffset = 0

        this.isLoadingMoremdos = true
        this.getmdo(undefined, 0)

        // Clear search box once
        if (this.approvalRequestForm.get('searchmdo')) {
          this.approvalRequestForm.get('searchmdo')!.setValue('')
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
              const triggerEl = this.mdoRef && this.mdoRef.nativeElement as HTMLElement
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

            const scrollHandler = this.onmdoSelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      this.scrollListenerAttached = false
    }
  }

  onmdoSelectScroll(event: any): void {
    const element = event?.target
    if (!this.mdoFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoremdos) {
          // If org uses IGOT mdo taxonomy, request more from the API by increasing the limit
          if (this.masterData?.mdoBackup?.length > this.masterData?.mdo?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoremdos = true
            this.mdoListLoadCount += this.mdoDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.mdo = this.masterData?.mdoBackup?.slice(0, this.mdoListLoadCount)
              this.checkCurrentmdoPresent()
              this.isLoadingMoremdos = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.mdoBackup || []).length
            if (!this.noMoreLegacymdos && this.defaultSearchmdoCount && loadedLegacy < this.defaultSearchmdoCount) {
              this.isLoadingMoremdos = true
              this.mdoOffset = (this.mdoOffset || 0) + this.mdoDefaultLoadCount
              // increase display count to include newly fetched items
              this.mdoListLoadCount += this.mdoDefaultLoadCount
              this.getmdo(undefined, this.mdoOffset)
            }
          }
        }
      }
    }
  }

  get searchmdoControl(): FormControl {
    return this.approvalRequestForm.get('searchmdo') as FormControl;
  }


}
