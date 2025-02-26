import { Component, Input } from '@angular/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'd-v2-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent {
  @Input() community: any;
  @Input() orgDetails: any = {};
  @Input() isLoading: boolean = false;
  defaultThumbnail
  sourceLogos
  defaultSLogo
  constructor(private configSvc: ConfigurationsService) { 

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    } else {
      this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
      this.defaultSLogo =  '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }
  }

  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/Karmayogi_logo_icon.svg'
  }

  changeToDefaultThumbnailImg($event: any) {
    $event.target.src = this.defaultThumbnail
  }

}
