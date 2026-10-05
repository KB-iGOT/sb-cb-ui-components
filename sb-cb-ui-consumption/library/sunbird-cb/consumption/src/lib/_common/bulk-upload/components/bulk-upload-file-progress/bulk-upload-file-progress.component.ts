import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NsBulkUpload } from '../../bulk-upload.model'

@Component({
  selector: 'sb-uic-bulk-upload-file-progress',
  templateUrl: './bulk-upload-file-progress.component.html',
  styleUrls: ['./bulk-upload-file-progress.component.scss'],
  standalone: false
})
export class BulkUploadFileProgressComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: NsBulkUpload.IFileProgressDialogData) { }

}
