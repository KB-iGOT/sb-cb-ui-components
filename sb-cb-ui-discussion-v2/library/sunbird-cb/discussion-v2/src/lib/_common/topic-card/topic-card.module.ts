import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicCardComponent } from './topic-card.component';
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module';
import { PipesModule } from '../../_pipes/pipes.module';



@NgModule({
  declarations: [
    TopicCardComponent
  ],
  imports: [
    CommonModule,
    SkeletonLoaderModule,
    PipesModule
  ],
  exports: [
    TopicCardComponent
  ]
})
export class TopicCardModule { }
