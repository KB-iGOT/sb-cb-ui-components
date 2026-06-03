import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateDialogComponent } from './certificate-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorQuillModule } from '../../discussion-forum/editor-quill/editor-quill.module'

import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { SvgEditorComponent } from './svg-editor/svg-editor.component'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
    declarations: [CertificateDialogComponent, SvgEditorComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EditorQuillModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        PipeSafeSanitizerModule,
    ],
    exports: [
        CertificateDialogComponent,
    ]
})
export class CertificateDialogModule { }
