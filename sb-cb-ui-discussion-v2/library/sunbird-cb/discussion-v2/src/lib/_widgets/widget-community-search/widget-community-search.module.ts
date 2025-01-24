import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunitySearchComponent } from './widget-community-search.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityCardModule } from '../../_common/community-card/community-card.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WidgetCommunitySearchComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CommunityCardModule,
    FormsModule
  ],
  exports: [
    WidgetCommunitySearchComponent
  ]
})
export class WidgetCommunitySearchModule { }
