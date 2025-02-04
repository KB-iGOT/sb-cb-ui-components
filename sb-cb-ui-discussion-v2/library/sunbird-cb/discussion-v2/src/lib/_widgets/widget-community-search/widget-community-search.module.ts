import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunitySearchComponent } from './widget-community-search.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityCardModule } from '../../_common/community-card/community-card.module';
import { FormsModule } from '@angular/forms';
import { SortByModule } from '../../_common/sort-by/sort-by.module';
import { FilterModule } from '../../_common/filter/filter.module';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';



@NgModule({
  declarations: [
    WidgetCommunitySearchComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CommunityCardModule,
    FormsModule,
    SortByModule,
    FilterModule,
    SimilarCommunityCardModule
  ],
  exports: [
    WidgetCommunitySearchComponent
  ]
})
export class WidgetCommunitySearchModule { }
