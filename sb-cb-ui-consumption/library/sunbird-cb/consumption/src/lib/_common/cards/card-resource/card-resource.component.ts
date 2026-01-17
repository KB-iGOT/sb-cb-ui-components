import { Component, Input, OnInit } from '@angular/core';
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver-v2';
import { NsCardContent } from '../../../_models/card-content.model';

@Component({
    selector: 'ws-cb-widget-card-resource',
    templateUrl: './card-resource.component.html',
    styleUrls: ['./card-resource.component.scss'],
    standalone: false
})
export class CardResourceComponent extends WidgetBaseComponent
implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard>  {

  @Input() widgetData!: NsCardContent.ICard;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
