import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { MatCardModule } from '@angular/material/card';
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatLegacyCheckboxModule,
    MatIconModule,
    TranslateModule
  ],
  exports:[
    FilterComponent
  ]
})
export class FilterModule { }
