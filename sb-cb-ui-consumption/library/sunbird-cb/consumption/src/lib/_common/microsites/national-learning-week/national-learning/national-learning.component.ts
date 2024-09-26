import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash'

@Component({
  selector: 'sb-uic-national-learning',
  templateUrl: './national-learning.component.html',
  styleUrls: ['./national-learning.component.scss']
})
export class NationalLearningComponent implements OnInit {
  @Input() sectionList:any = []
  @Input() configDetails: any
  @Input() nwlConfiguration: any
  providerId: string = '123456789'
  providerName: ''
  descriptionMaxLength = 500
  constructor(public router: Router, private events: EventService) {
   }

   ngOnInit(): void {
   }


  hideKeyHightlight(event: any, learnerReview: any) {
    if (event) {
      learnerReview['hideSection'] = true
    }
  }

  showAllContent(_stripData: any, columnData: any) {
    if (columnData && columnData.contentStrip && columnData.contentStrip.strips && columnData.contentStrip.strips.length) {
      const stripData: any = _stripData
        let tabSelected =  stripData.viewMoreUrl && stripData.viewMoreUrl.queryParams && stripData.viewMoreUrl.queryParams.tabSelected && stripData.viewMoreUrl.queryParams.tabSelected || ''
        this.router.navigate(
          [`app/learn/national-learning-week/see-all`],
          { queryParams: {  pageDetails: true, tabSelected, key: columnData.sectionKey  } })

    } else {
       this.router.navigate(
        [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-CBP`],
        { queryParams: { pageDetails: true } })
    }
  }

  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData.contentStrip['hideSection'] = true
    }
  }

  raiseTabClick(event) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-leaderboard',
        id: `${event}-tab`,
      },
      {
      },
      {
        module: 'National Learning Week',
      }
    )
  }

  raiseTelemetryInteratEvent(event: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mandatory-courses',
        id: `mandatory-courses-card`,
      },
      {
        id: event.identifier,
        type: event.primaryCategory,
      },
      {
        pageIdExt: `mandatory-courses-card`,
        module: 'National Learning Week',
      }
    )
  }

}
