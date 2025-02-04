import { Component, Input } from '@angular/core';
// tslint:disable-next-line
import _ from 'lodash'
import { NsDiscussionV2 } from '../../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'd-v2-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.IPostCardConfig
  @Input() type!: string
  @Input() post!: any
  viewMoreLength = 200

  loogedInUserProfile: any = {}
  constructor(
    private configSvc: ConfigurationsService,
  ) {

  }

  ngOnInit() {
    this.loogedInUserProfile = {...this.configSvc.userProfile, ...this.configSvc.unMappedUser}
  }

  viewMoreOrLess(item: any) {
    if (item.description.length > this.viewMoreLength) {
      item.expanded = !item.expanded
    }
  }

}
