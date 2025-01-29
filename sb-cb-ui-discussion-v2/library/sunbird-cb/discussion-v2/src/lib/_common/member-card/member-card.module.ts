import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from './member-card.component';
import { SharedModule } from '../../_shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    MemberCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatCardModule
  ],
  exports:[
    MemberCardComponent
  ]
})
export class MemberCardModule { }
