import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

export interface UnenrollDialogData {
  contentName: string
}

@Component({
  selector: 'ws-app-unenroll-confirm-dialog',
  templateUrl: './unenroll-confirm-dialog.component.html',
  styleUrls: ['./unenroll-confirm-dialog.component.scss'],
  standalone: false,
})
export class UnenrollConfirmDialogComponent {
  understood = false

  constructor(
    public dialogRef: MatDialogRef<UnenrollConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UnenrollDialogData,
  ) { }

  onCancel(): void {
    this.dialogRef.close(false)
  }

  onContinue(): void {
    if (this.understood) {
      this.dialogRef.close(true)
    }
  }
}
