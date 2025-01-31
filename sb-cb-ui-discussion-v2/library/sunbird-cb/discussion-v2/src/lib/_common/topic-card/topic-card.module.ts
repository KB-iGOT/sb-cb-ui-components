import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicCardComponent } from './topic-card.component';
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module';



@NgModule({
  declarations: [
    TopicCardComponent
  ],
  imports: [
    CommonModule,
    SkeletonLoaderModule
  ],
  exports: [
    TopicCardComponent
  ]
})
export class TopicCardModule { }
