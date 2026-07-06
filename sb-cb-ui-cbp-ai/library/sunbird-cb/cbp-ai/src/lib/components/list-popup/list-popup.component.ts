import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-popup',
  templateUrl: './list-popup.component.html',
  styleUrls: ['./list-popup.component.scss']
})
export class ListPopupComponent {
  listData:any
  listType:any
  competencyList: any[] = []
  private competencyTypeMap = {
    domain: 'Domain',
    behavioral: 'Behavioral',
    functional: 'Functional'
  }
  constructor( public dialogRef: MatDialogRef<ListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('data--',data)
      if(data && data.element && data.type) {
        this.listData = data.element
        this.listType = data.type
        const competencyType = this.competencyTypeMap[this.listType]
        if (competencyType) {
          this.competencyList = (this.listData?.competencies || []).filter((comp: any) => comp.type === competencyType)
        }
      }

      console.log('this.listData', data)
    }
  closeDialog() {
    this.dialogRef.close()
  }
}
