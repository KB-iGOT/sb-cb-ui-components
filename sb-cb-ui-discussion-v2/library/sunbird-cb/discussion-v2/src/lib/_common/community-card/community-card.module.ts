import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityCardComponent } from './community-card.component';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module';
import { PipesModule } from '../../_pipes/pipes.module';
import { MultiLineEllipsisModule } from '../../_directives/multi-line-ellipsis/multi-line-ellipsis.module';
import { SingleLineTooltipModule } from '../../_directives/single-line-tooltip/single-line-tooltip.module';



@NgModule({
  declarations: [
    CommunityCardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    SkeletonLoaderModule,
    PipesModule,
    MultiLineEllipsisModule,
    SingleLineTooltipModule
  ],
  exports: [CommunityCardComponent]
})
export class CommunityCardModule { }
