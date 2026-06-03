import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { WsWidgetSpotlightCardsComponent } from './spotlight-cards.component'

@NgModule({
  declarations: [WsWidgetSpotlightCardsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  exports: [WsWidgetSpotlightCardsComponent],
})
export class SpotlightCardsModule { }
