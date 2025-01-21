import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'd-v2-widget-community-home',
  templateUrl: './widget-community-home.component.html',
  styleUrls: ['./widget-community-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetCommunityHomeComponent {
  hideCardBody:boolean | undefined
}
