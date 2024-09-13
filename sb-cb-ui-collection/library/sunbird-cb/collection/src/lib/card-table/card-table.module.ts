import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardTableComponent } from './card-table.component'
import {
  HorizontalScrollerModule,
  PipeCountTransformModule,
  PipeDurationTransformModule,
} from '@sunbird-cb/utils'
import { PipeTableListModule } from './pipe-table-list/pipe-table-list.module'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
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
