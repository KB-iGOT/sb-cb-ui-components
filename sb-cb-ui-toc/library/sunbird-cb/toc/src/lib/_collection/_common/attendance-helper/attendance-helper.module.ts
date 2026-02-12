import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttendanceHelperComponent } from './attendance-helper.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../../../_shared/translate-loader.factory'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
    declarations: [AttendanceHelperComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatMenuModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [AttendanceHelperComponent]
})
export class AttendanceHelperModule { }
