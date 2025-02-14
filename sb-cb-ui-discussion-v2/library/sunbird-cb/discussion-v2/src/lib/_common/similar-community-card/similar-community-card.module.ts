import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimilarCommunityCardComponent } from './similar-community-card.component';
import { CardToggleModule } from '../card-toggle/card-toggle.module';
import { SharedModule } from '../../_shared/shared.module';
import { NoDataModule } from '../no-data/no-data.module';



@NgModule({
  declarations: [
    SimilarCommunityCardComponent
  ],
  imports: [
    CommonModule,
    CardToggleModule,
    SharedModule,
    NoDataModule
  ],
  exports: [
    SimilarCommunityCardComponent
  ]
})
export class SimilarCommunityCardModule { }
