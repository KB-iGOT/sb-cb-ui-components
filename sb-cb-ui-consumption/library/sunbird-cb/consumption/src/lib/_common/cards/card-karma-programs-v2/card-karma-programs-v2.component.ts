import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from "lodash";
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService, EventService, MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils-v2';
import { Router } from '@angular/router';

@Component({
    selector: 'sb-uic-card-karma-programs-v2',
    templateUrl: './card-karma-programs-v2.component.html',
    styleUrls: ['./card-karma-programs-v2.component.scss'],
    standalone: false
})
export class CardKarmaProgramsV2Component implements OnInit {

  @Input() widgetData!: NsContent.IContent;
  @Input() randomColorApply: boolean = false
  @Output() userData = new EventEmitter<any>()
  @Output() raiseTemeletry = new EventEmitter<any>()
  defaultThumbnail: any
  sourceLogos: any
  defaultSLogo: any
  widgetType: any = ''
  widgetSubType: any =''
  randomColors: any = [
    '#EF941D',
    '#F97440',
    '#35B5B0',
    '#9988FF',
    '#254092',
    '#926525',
    '#4F72DF'
  ]

  constructor(
    private events: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private router : Router,) { 
      this.langtranslations.languageSelectedObservable.subscribe(() => {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
        }
      })
    }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    } else {
      this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
      this.defaultSLogo =  '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }
    this.setRandomColor()
  }

  setRandomColor(){
    if(this.widgetData && this.widgetData.content) {
      if(this.randomColorApply){
        const randomIndex1 = Math.floor(Math.random() * Math.floor(this.randomColors.length))
        this.widgetData.content['bgColor'] = this.randomColors[randomIndex1]
      }else {
        this.widgetData.content['bgColor'] = '#1a4ca1'
      }
    }
  }

  redirectTo(content: any) {
    this.raiseTemeletry.emit(content)
    this.router.navigate(
      [`/app/learn/karma-programs/${content.title}/${content.playListKey}/${content.orgId}/micro-sites`],
    )
  }

  get getRandomColors(){
    const randomIndex1 = Math.floor(Math.random() * Math.floor(this.randomColors.length))
    return this.randomColors[randomIndex1]
  }
}
