import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerPdfComponent } from './player-pdf.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
@NgModule({
    declarations: [PlayerPdfComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatMenuModule,
        MatButtonModule,
        MatSliderModule,
        MatToolbarModule,
        ReactiveFormsModule,
        BtnFullscreenModule,
        MatInputModule,
    ],
    exports: [PlayerPdfComponent]
})
export class PlayerPdfModule { }
