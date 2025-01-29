import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityCardComponent } from './community-card.component';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module';



@NgModule({
  declarations: [
    CommunityCardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    SkeletonLoaderModule
  ],
  exports: [CommunityCardComponent]
})
export class CommunityCardModule { }
