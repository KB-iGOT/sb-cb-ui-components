import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { AvatarPhotoLibComponent } from './avatar-photo-lib.component'

@NgModule({
  declarations: [AvatarPhotoLibComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    SbUiResolverModule,
  ],
  exports: [AvatarPhotoLibComponent],
  entryComponents: [AvatarPhotoLibComponent],
})
export class AvatarPhotoLibModule { }
