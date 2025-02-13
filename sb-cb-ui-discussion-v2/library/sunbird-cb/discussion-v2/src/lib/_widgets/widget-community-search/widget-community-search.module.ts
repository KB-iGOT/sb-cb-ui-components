import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunitySearchComponent } from './widget-community-search.component';
import { MatIconModule } from '@angular/material/icon';
import { CommunityCardModule } from '../../_common/community-card/community-card.module';
import { FormsModule } from '@angular/forms';
import { SortByModule } from '../../_common/sort-by/sort-by.module';
import { FilterModule } from '../../_common/filter/filter.module';
import { SimilarCommunityCardModule } from '../../_common/similar-community-card/similar-community-card.module';
import { PipesModule } from '../../_pipes/pipes.module';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'



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
    SimilarCommunityCardModule,
    PipesModule,
    MatBottomSheetModule,
  ],
  exports: [
    WidgetCommunitySearchComponent
  ],
  providers:[{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },]
})
export class WidgetCommunitySearchModule { }
