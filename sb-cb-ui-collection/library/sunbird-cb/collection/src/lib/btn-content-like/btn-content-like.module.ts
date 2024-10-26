import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatBadgeModule } from '@angular/material/badge'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { BtnContentLikeComponent } from './btn-content-like.component'

@NgModule({
    declarations: [BtnContentLikeComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatBadgeModule,
    ],
    exports: [BtnContentLikeComponent]
})
export class BtnContentLikeModule { }
