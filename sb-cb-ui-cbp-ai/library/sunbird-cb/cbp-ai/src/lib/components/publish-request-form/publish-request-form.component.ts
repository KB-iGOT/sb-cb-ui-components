import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash'
import { SharedService } from '../../modules/shared/services/shared.service';
@Component({
  selector: 'app-publish-request-form',
  templateUrl: './publish-request-form.component.html',
  styleUrls: ['./publish-request-form.component.scss']
})
export class PublishRequestFormComponent {
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
  role_mapping_ids: any = []
  constructor(public dialogRef: MatDialogRef<PublishRequestFormComponent>,
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
  }



  initializeForm() {
    this.approvalRequestForm = this.fb.group({
      request_name: ['', Validators.required],
      due_date: [new Date(), Validators.required]
    });
  }



  cancelForm() {
    this.dialogRef.close()
  }

  closeDialog() {
    this.dialogRef.close()
  }

  approveAndPublish() {

    if (this.approvalRequestForm.invalid) {
      return;
    }

    this.loading = true;

    const formValue = this.approvalRequestForm.value;

    const payload = {
      request_id: this.role_mapping_ids?.demand_id || this.data?.demand_id,
      plan_name: formValue.request_name,
      due_date: new Date(formValue.due_date).toISOString()
    };

    console.log('payload', payload);

    this.sharedService.approveAndPublishMDOApprovalRequests(payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          this.snackBar.open(
            'Plan approved and published successfully',
            'X',
            {
              duration: 3000,
              panelClass: ['snackbar-success']
            }
          );

          this.dialogRef.close('success');
        },

        error: (err) => {
          this.loading = false
          console.error(err);

          const errorMessage =
            err?.error?.detail ||
            err?.error?.message ||
            'Failed to reject request';

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
