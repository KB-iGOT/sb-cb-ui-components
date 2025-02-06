import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';


@Component({
  selector: 'd-v2-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit, OnChanges {
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  @Input() topicDataList: any;
  orgDetails: any;
  toppicWiseCommunities: any = {};
  loadTopicsCount: number = 1;
  topicDataLoading: boolean = false
  toppicWiseCommunitiesCopy: any = {}

  ngOnInit(): void {
    this.toppicWiseCommunities = {
      // 'Artificial Intelligence and Machine Learning': {
      //   topicName: 'Artificial Intelligence and Machine Learning',
      //   topicId:"1037",
      //   isLoading: false,
      //   communityDataList: [],
      //   count: 0
      // }
    }
      
  }

  constructor(private discussV2Svc:DiscussionV2Service) { 
    
    // this.topicDataList
    // this.topicWiseData();
    // setTimeout(() => {
    // }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.topicDataList) {
      console.log('topicDataList changed:', this.topicDataList);
      
      this.loadTopicData();  
    }
  }
  // topicWiseData() {
  //   this.discussV2Svc.topicWiseCommunities().subscribe((res: any) => {  
      
  //     console.log(res);
  //   })
  // }

  onCardClick(cardData: any){
    
    console.log(cardData)
    this.cardClick.emit(cardData);
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }

  loadMoreTopics(){
    if(this.loadTopicsCount < this.topicDataList.length){
      let startIndex = this.loadTopicsCount
      this.loadTopicsCount += 1;
      this.loadCommunities(this.toppicWiseCommunitiesCopy,startIndex)
    }
  }




  async loadTopicData() {
    try {
      let topicBycomunities: any = this.topicDataList.reduce((acc: any, element: any) => {
        acc[element.value] = {
          topicName: element.value,
          isLoading: true,
          communities: [],
          count: element.count,
          topicId: ''
        };
        return acc;
      }, {});
      
      this.toppicWiseCommunitiesCopy = topicBycomunities
      await this.loadCommunities(topicBycomunities,0);
      
    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      this.topicDataLoading = false;
    }
  }

  async loadCommunities(topicBycomunities: any, startIndex:number) {
    let tempAllApiData: any = {}
    for (const key of Object.keys(topicBycomunities).slice(startIndex, this.loadTopicsCount)) {
      
      let tempApiData : any= {}
      tempApiData[key] = {}
      const data = await this.getCommunitiesByTopic(key);
      tempApiData[key]['isLoading'] = false;
      tempApiData[key]['communities'] = data;
      tempApiData[key]['count'] = topicBycomunities[key].count;
      tempApiData[key]['topicName'] = topicBycomunities[key].topicName;
      if (data.length > 0) {
        tempApiData[key]['topicId']  = data[0].topicId;
      }
      tempAllApiData = { ...tempApiData,...tempAllApiData}
    }
    console.log(this.toppicWiseCommunities,'before')
    this.toppicWiseCommunities = { ...this.toppicWiseCommunities,...tempAllApiData}
    console.log(this.toppicWiseCommunities,'after')
  }

  async getCommunitiesByTopic(topic: any): Promise<any[]> {
    let request: any = {
      filterCriteriaMap: {
        status: 'active',
        topicName: topic
      },
      requestedFields: [],
      pageNumber: 0,
      pageSize: 200
    };

    try {
      const res: any = await this.discussV2Svc.communitySearch(request).toPromise();
      if (res.result && res.result.search_results && res.result.search_results.data) {
        if(res.result && res.result && res.result.search_results && res.result.search_results.additionalInfo && res.result.search_results.additionalInfo.length){
          this.orgDetails = {...this.orgDetails, ...this.discussV2Svc.convertOrgArrayToObject(res.result.search_results.additionalInfo)}
        }
        return res.result.search_results.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching communities by topic:', error);
      return [];
    }
  }
}
