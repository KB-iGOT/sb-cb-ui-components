import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ContentStripMultipleComponent } from './content-strip-multiple.component'
import { HorizontalScrollerModule } from '@sunbird-cb/utils'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [ContentStripMultipleComponent],
    imports: [
        CommonModule,
        RouterModule,
        HorizontalScrollerModule,
        WidgetResolverModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatCardModule,
    ]
})
export class ContentStripMultipleModule {}
