import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { SharedService } from '../../modules/shared/services/shared.service';

@Component({
  selector: 'app-publish-approve-request-form',
  templateUrl: './publish-approve-request-form.component.html',
  styleUrls: ['./publish-approve-request-form.component.scss'],
  standalone: false
})
export class PublishApproveRequestFormComponent implements OnInit {

  approvalRequestForm: FormGroup;
  loading = false;
  minDate = new Date()
  constructor(
    public dialogRef: MatDialogRef<PublishApproveRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.approvalRequestForm = this.fb.group({
      request_name: ['', Validators.required],
      due_date: [null, Validators.required]
    });
  }

  cancelForm(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
approveAndPublish() {

    if (this.approvalRequestForm.invalid) {
      return;
    }

    this.loading = true;

    const formValue = this.approvalRequestForm.value;

    const payload = {
      request_id:  this.data?.demand_id,
      plan_name: formValue.request_name,
      due_date: formValue.due_date ? new Date(formValue.due_date).toISOString().split('T')[0] : null
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