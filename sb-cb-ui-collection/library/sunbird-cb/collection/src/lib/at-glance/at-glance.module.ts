import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AtGlanceComponent } from './at-glance.component'
import { RouterModule } from '@angular/router'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { PipeDurationTransformModule } from '@sunbird-cb/utils'

@NgModule({
    declarations: [AtGlanceComponent],
    imports: [
        CommonModule, WidgetResolverModule, RouterModule,
        MatCardModule, MatDividerModule, MatIconModule, PipeDurationTransformModule,
    ],
    exports: [AtGlanceComponent]
})
export class AtGlanceModule { }
