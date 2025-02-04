import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimilarCommunityCardComponent } from './similar-community-card.component';
import { CardToggleModule } from '../card-toggle/card-toggle.module';
import { SharedModule } from '../../_shared/shared.module';



@NgModule({
  declarations: [
    SimilarCommunityCardComponent
  ],
  imports: [
    CommonModule,
    CardToggleModule,
    SharedModule
  ],
  exports: [
    SimilarCommunityCardComponent
  ]
})
export class SimilarCommunityCardModule { }
