import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { AllNotificationsComponent } from './all-notifications.component';


@NgModule({
  declarations: [AllNotificationsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
  ],
  exports: [
    AllNotificationsComponent
  ]
})
export class AllNotificationsModule { }
