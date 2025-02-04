import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortByComponent } from './sort-by.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'




@NgModule({
  declarations: [
    SortByComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule
  ],
  exports:[
    SortByComponent
  ]
})
export class SortByModule { }
