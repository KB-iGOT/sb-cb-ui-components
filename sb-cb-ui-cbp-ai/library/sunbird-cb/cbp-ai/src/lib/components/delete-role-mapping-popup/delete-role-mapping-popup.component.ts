import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../modules/shared/services/shared.service';

@Component({
  selector: 'app-delete-role-mapping-popup',
  templateUrl: './delete-role-mapping-popup.component.html',
  styleUrls: ['./delete-role-mapping-popup.component.scss']
})
export class DeleteRoleMappingPopupComponent {
  planData: any;
  isViewCourse = false;
  isFromGenerateCourse = false;
  documents: any
  workAllocationOrderDocumentMissing = false
  constructor(
    public dialogRef: MatDialogRef<DeleteRoleMappingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedService: SharedService
  ) {
    this.planData = data
    this.documents = this.data?.documents
    this.isViewCourse = this.data?.from === 'viewCourse';
    this.isFromGenerateCourse = this.data?.from === 'generateCourseRecommendations';
    console.log('this.data', this.data)
    if (this.documents && this.documents?.length) {
      let wAOCount = 0
      this.documents.forEach((item) => {
        if (item?.document_type === 'Work Allocation Order') {
          wAOCount = wAOCount + 1
        }
      })

      if (wAOCount < 1) {
        this.workAllocationOrderDocumentMissing = true
      } else {
        this.workAllocationOrderDocumentMissing = false
      }
    } 
    if (this.planData.role_mapping_exisiting && this.documents.length === 0) {
      this.workAllocationOrderDocumentMissing = true
    }
  }
  confirmDelete() {
    this.dialogRef.close('saved');
  }

  regenerateRoleMapping() {
    this.dialogRef.close('saved')
  }

  cancel(event) {

    this.dialogRef.close(event)
  }

  cancelCourse() {
    this.dialogRef.close()
  }
}