import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingDiscussionsComponent } from './trending-discussions.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../_shared/shared.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    TrendingDiscussionsComponent,
    
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedModule,
    MatIconModule
  ],
  exports:[TrendingDiscussionsComponent]
})
export class TrendingDiscussionsModule { }
