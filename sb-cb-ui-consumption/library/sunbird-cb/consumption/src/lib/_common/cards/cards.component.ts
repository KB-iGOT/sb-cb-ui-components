import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver-v2';
import { NsCardContent } from '../../_models/card-content.model';
import { UtilityService, ConfigurationsService } from '@sunbird-cb/utils-v2';
import { WidgetContentService } from '../../_services/widget-content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-uic-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent  extends WidgetBaseComponent
implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard>  {

  @Input() widgetData!: NsCardContent.ICard;
  @Output() triggerTelemetry = new EventEmitter<any>()
  isIntranetAllowedSettings = false
  cbPlanMapData: any
  cbPlanInterval: any
  constructor(private utilitySvc: UtilityService,
    private configSvc: ConfigurationsService,
    private contSvc: WidgetContentService,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.cbPlanInterval = setInterval(() => {
      this.getCbPlanData()
    },                                1000)
    
  }

  get isLiveOrMarkForDeletion() {
    if (
      !this.widgetData.content.status ||
      this.widgetData.content.status === 'Live' ||
      this.widgetData.content.status === 'MarkedForDeletion'
    ) {
      return true
    }
    return false
  }

  get showIntranetContent() {
    if (this.widgetData.content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return false
  }
  async getRedirectUrlData(content: any){

    const userProfile = this.configSvc.userProfile
    if(content.externalId) {
      let extUrl: string = content.redirectUrl.replace('<username>',userProfile.userId)
      // const url = this.router.serializeUrl(
      //   this.router.createUrlTree([extUrl])
      // );
      this.router.navigate(
        [`app/toc/${content.contentId}/overview`])
      
      // window.open(extUrl, '_blank');
      // window.open(content.redirectUrl)
    } else {
      let urlData = await this.contSvc.getResourseLink(content)
      this.router.navigate(
        [urlData.url],
        {
          queryParams: urlData.queryParams
        })
    }
    
  }
  getCbPlanData() {
    let cbpList: any={}
    if (localStorage.getItem('cbpData')) {
      let cbpListArr = JSON.parse(localStorage.getItem('cbpData') || '')
      if (cbpListArr && cbpListArr.length) {
        cbpListArr.forEach((data: any) => {
          cbpList[data.identifier] = data
        })
      }
      this.cbPlanMapData = cbpList
      // this.karmaPointLoading = false
      clearInterval(this.cbPlanInterval)
    }
  }

  raiseCardClick(data: any) {
    this.triggerTelemetry.emit(data)
  }
}
