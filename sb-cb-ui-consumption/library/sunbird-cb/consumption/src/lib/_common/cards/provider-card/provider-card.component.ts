import { Component, Input, OnInit } from '@angular/core';
import { NsCardContent } from '../../../_models/card-content.model';
import { Router } from '@angular/router';
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service';

@Component({
  selector: 'sb-uic-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss']
})
export class ProviderCardComponent implements OnInit {
  @Input() widgetData!: NsCardContent.ICard;
  @Input() randomColorApply: boolean = true
  @Input() isCardLoading: boolean = false

  colors = [
    '#EF941D', '#F97440', '#35B5B0', '#9988FF', '#816FEC',
    '#254092', '#926525', '#4F72DF'
  ];

  constructor(private router: Router, private contSvc: WidgetContentLibService) {}

  ngOnInit() {
    this.setRandomColor()
  }

  setRandomColor(){
    if(this.widgetData && this.widgetData.content) {
      if(this.randomColorApply){
        const randomIndex1 = Math.floor(Math.random() * Math.floor(this.colors.length))
        this.widgetData.content['bgColor'] = this.colors[randomIndex1]
      }else {
        this.widgetData.content['bgColor'] = '#1a4ca1'
      }
    }
  }
  

  redirectTo(content: any) {  
    this.router.navigate([`/app/learn/browse-by/provider/${content.name}/${content.orgId}/micro-sites`])
    content['typeOfTelemetry'] = this.widgetData.context.pageSection
    this.contSvc.changeTelemetryData(content)
  }


}