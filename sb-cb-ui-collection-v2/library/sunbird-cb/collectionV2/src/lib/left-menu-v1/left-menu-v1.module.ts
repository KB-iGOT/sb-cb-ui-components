import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LeftMenuV1Component } from './left-menu-v1.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
    declarations: [LeftMenuV1Component],
    imports: [
        CommonModule,
        RouterModule,
        SbUiResolverModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatChipsModule,
        MatCardModule,
        MatListModule,
        MatExpansionModule,
    ],
    exports: [
        LeftMenuV1Component,
    ]
})
export class LeftMenuV1Module { }
