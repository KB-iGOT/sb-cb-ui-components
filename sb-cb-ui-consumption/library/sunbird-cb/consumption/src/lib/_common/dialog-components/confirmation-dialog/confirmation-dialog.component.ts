import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef, MAT_LEGACY_DIALOG_DATA } from '@angular/material/legacy-dialog';

type DialogData = {
  title?: string;
  description?: string;
  iconName?: string;
  iconUrl?: string;
  type?: string;
  buttonsPositionClass?: string;
  buttons?: {
    classes?: string;
    text?: string;
    response?: string | boolean;
  }[];
};

@Component({
  selector: 'ws-widget-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  dialgoData: DialogData = {};

  constructor(
    private dialogRef: MatLegacyDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: DialogData
  ) { 
    this.dialgoData = data
  }

  closeDialog(response: string) {
    this.dialogRef.close(response);
  }

}
