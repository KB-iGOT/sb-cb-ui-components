import { Component, Inject, ViewEncapsulation } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'd-v2-flag-dialogue',
  templateUrl: './flag-dialogue.component.html',
  styleUrls: ['./flag-dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlagDialogueComponent {

  constructor(
    public dialogRef: MatDialogRef<FlagDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

}
