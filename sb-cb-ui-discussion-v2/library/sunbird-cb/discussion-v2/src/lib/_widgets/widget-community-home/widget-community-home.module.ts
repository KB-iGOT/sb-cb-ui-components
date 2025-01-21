import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunityHomeComponent } from './widget-community-home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CardToggleModule } from '../../_common/card-toggle/card-toggle.module';



@NgModule({
  declarations: [
    WidgetCommunityHomeComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    CardToggleModule
  ],
  exports: [
    WidgetCommunityHomeComponent
  ]
})
export class WidgetCommunityHomeModule { }
