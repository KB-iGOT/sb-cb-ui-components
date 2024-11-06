import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopLearnersComponent } from './top-learners.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [TopLearnersComponent],
  imports: [
    CommonModule,
    SkeletonLoaderLibModule,
    MatTooltipModule
  ],
  exports: [TopLearnersComponent],
})
export class TopLearnersModule { }