import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardTableComponent } from './card-table.component'
import {
  HorizontalScrollerModule,
  PipeCountTransformModule,
  PipeDurationTransformModule,
} from '@sunbird-cb/utils'
import { PipeTableListModule } from './pipe-table-list/pipe-table-list.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatSortModule } from '@angular/material/sort'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { RouterModule } from '@angular/router'
import { PipeTableMetaModule } from './pipe-table-meta/pipe-table-meta.module'
import { PipeRelativePathTableModule } from './relative-url/relative-url.module'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
@NgModule({
  declarations: [CardTableComponent],
  imports: [
    CommonModule,
    HorizontalScrollerModule,
    WidgetResolverModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    PipeTableListModule,
    RouterModule,
    MatCardModule,
    PipeDurationTransformModule,
    PipeCountTransformModule,
    PipeTableMetaModule,
    PipeRelativePathTableModule,
    // PipeNicRelativeModule,
  ],
  exports: [
    CardTableComponent,
  ],
  // entryComponents: [CardTableComponent],
})
export class CardTableModule { }
