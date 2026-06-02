import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { SharedService } from '../../modules/shared/services/shared.service';

@Component({
  selector: 'app-reject-request-form',
  templateUrl: './reject-request-form.component.html',
  styleUrls: ['./reject-request-form.component.scss']
})
export class RejectRequestFormComponent implements OnInit {

  rejectRequestForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<RejectRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.rejectRequestForm = this.fb.group({
      rejection_comment: ['', [
        Validators.required,
        Validators.pattern(/^(?!\s*$).+/)
      ]],
    });
  }

  cancelForm(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  rejectRequest(): void {

    if (this.rejectRequestForm.invalid) {
      this.rejectRequestForm.markAllAsTouched();
      return;
    }

    const payload = {
      request_id: this.data?.demand_id || this.data?.id,
      rejection_comment: this.rejectRequestForm.value.rejection_comment?.trim()
    };

    console.log('Reject Payload =>', payload);

    this.loading = true;

    this.sharedService.rejectMDOApprovalRequests(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Reject Response =>', res);

          this.snackBar.open(
            'Request rejected successfully',
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