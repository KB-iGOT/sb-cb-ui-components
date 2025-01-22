import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunityHomeComponent } from './widget-community-home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CardToggleModule } from '../../_common/card-toggle/card-toggle.module';
import { ShortcutsModule, TrendingDiscussionsModule } from '../../../public-api';
import { CommunityDetailsModule } from '../../_common/community-details/community-details.module';



@NgModule({
  declarations: [
    WidgetCommunityHomeComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    CardToggleModule,
    TrendingDiscussionsModule,
    ShortcutsModule,
    CommunityDetailsModule
  ],
  exports: [
    WidgetCommunityHomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetCommunityHomeModule { }
