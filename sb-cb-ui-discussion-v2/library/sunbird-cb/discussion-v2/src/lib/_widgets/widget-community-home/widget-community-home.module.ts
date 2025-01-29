import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetCommunityHomeComponent } from './widget-community-home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CardToggleModule } from '../../_common/card-toggle/card-toggle.module';
import { ShortcutsModule, TrendingDiscussionsModule } from '../../../public-api';
import { CommunityDetailsModule } from '../../_common/community-details/community-details.module';
import { MemberCardModule } from '../../_common/member-card/member-card.module';
import { SharedModule } from '../../_shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PipesModule } from '../../_pipes/pipes.module';



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
    CommunityDetailsModule,
    MemberCardModule,
    SharedModule,
    MatButtonModule,
    MatMenuModule,
    PipesModule
  ],
  exports: [
    WidgetCommunityHomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetCommunityHomeModule { }
