import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { WsWidgetCarouselBannerComponent } from './carousel-banner.component'

@NgModule({
  declarations: [WsWidgetCarouselBannerComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  exports: [WsWidgetCarouselBannerComponent],
})
export class CarouselBannerModule {}
