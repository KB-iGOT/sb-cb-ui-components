import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatRadioModule } from '@angular/material/radio'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component'
import { BulkUploadVerifyOtpComponent } from './components/bulk-upload-verify-otp/bulk-upload-verify-otp.component'
import { BulkUploadFileProgressComponent } from './components/bulk-upload-file-progress/bulk-upload-file-progress.component'

@NgModule({
  declarations: [
    BulkUploadComponent,
    BulkUploadVerifyOtpComponent,
    BulkUploadFileProgressComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSnackBarModule,
  ],
  exports: [
    BulkUploadComponent,
  ],
})
export class BulkUploadLibModule { }
