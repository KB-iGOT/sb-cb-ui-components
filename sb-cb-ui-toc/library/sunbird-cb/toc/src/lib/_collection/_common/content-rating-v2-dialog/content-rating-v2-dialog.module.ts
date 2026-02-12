import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContentRatingV2DialogComponent } from './content-rating-v2-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../../../_shared/translate-loader.factory'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/button'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/input'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
    declarations: [ContentRatingV2DialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // EditorQuillModule, // TODO: Re-enable when EditorQuillModule is available
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatCheckboxModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [
        ContentRatingV2DialogComponent,
    ]
})
export class ContentRatingV2DialogModule { }
