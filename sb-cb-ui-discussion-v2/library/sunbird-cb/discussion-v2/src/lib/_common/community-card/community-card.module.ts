import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityCardComponent } from './community-card.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    CommunityCardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [CommunityCardComponent]
})
export class CommunityCardModule { }
