import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { NotificationDropdownComponent } from './notification-dropdown.component';



@NgModule({
  declarations: [NotificationDropdownComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
  ],
  exports: [NotificationDropdownComponent
  ],
})
export class NotificationDropdownModule { }
