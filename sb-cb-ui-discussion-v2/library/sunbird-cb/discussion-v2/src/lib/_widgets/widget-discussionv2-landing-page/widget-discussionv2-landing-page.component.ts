import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-widget-discussionv2-landing-page',
  templateUrl: './widget-discussionv2-landing-page.component.html',
  styleUrls: ['./widget-discussionv2-landing-page.component.scss']
})
export class WidgetDiscussionv2LandingPageComponent implements OnInit {
  @Input() feedWidgetData: any | undefined
  @Output() searchText = new EventEmitter<any>();
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  @Output() topicCardClick = new EventEmitter<any>();
  @Output() showAllTopics = new EventEmitter<any>();
  @Output() popularCommunityData = new EventEmitter<any>();
  userEnrollDetailsData: any;
  topicDataList: any = []
  topicDataLoading: boolean = false
  totalCommunitiesCount: any = 0
  userCommunityList: any = []

  selectedTab = 0;
  selectedTabId: any = 'feeds'

  mainTabs = [
    {
      label: 'Feeds',
      matIcon: '',
      iconSvg: 'assets/icons/discuss/feeds.svg',
      id: 'feeds',
      value: 0
    },
    {
      label: 'Communities',
      matIcon: '',
      iconSvg: 'assets/icons/discuss/community.svg',
      id: 'communities',
      value: 1
    },
    {
      label: 'My Communities',
      matIcon: '',
      iconSvg: 'assets/icons/discuss/community.svg',
      id: 'my_communities',
      value: 2
    }
  ]

  constructor(private userEnrollSvc: UserEnrollCommunityService,
    private discussV2Svc: DiscussionV2Service
  ) { }


  async ngOnInit(){
    this.getAllTopics()
    this.selectedTab = 0;
    this.selectedTabId = 'feeds'
    let data = await this.userEnrollSvc.getEnrollData()
    debugger
    this.userCommunityList = this.userEnrollSvc.userEnrolledCommunityList
    this.userEnrollDetailsData = this.userEnrollSvc.userEnrolledCommunityDetailList
    console.log(data)
  }

  getAllTopics(){ 
    this.topicDataLoading = true
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 0,
      "facets":["topicName"]
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.facets && res.result.search_results.facets.topicName && res.result.search_results.facets.topicName.length){
        this.topicDataList = res.result.search_results.facets.topicName;
        this.totalCommunitiesCount =  res.result.search_results.facets.topicName.reduce((sum: any, item: any) => sum + item.count, 0);
        this.topicDataLoading = false
      }
    })
  }

  onTabChange(event: any) {
    this.selectedTab = event.index;
    this.selectedTabId = this.mainTabs[event.index].id || 'feeds'
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }
  showAllTopicsMethod() {
    this.showAllTopics.emit();
  }

  onCardClick(cardData: any){
    this.cardClick.emit(cardData);
  }

  topicCardMethod(topicData: any) {
    this.topicCardClick.emit(topicData)
  }




  popularCommunity(popularData: any) {
    this.popularCommunityData.emit(popularData)
  }
  onSearch(event: any): void {
    const searchValue = event.target.value;
    this.searchText.emit(searchValue);
    console.log('Search text:', searchValue);
    // Add your search logic here
  }

}
