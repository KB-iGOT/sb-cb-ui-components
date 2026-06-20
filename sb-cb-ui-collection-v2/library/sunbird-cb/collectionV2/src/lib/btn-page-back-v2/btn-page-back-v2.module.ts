import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { BtnPageBackV2Component } from './btn-page-back-v2.component'

@NgModule({
    declarations: [BtnPageBackV2Component],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
    ],
    exports: [BtnPageBackV2Component]
})
export class BtnPageBackV2Module { }
