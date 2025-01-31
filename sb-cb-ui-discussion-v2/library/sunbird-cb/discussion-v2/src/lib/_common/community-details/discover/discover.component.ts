import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';


@Component({
  selector: 'd-v2-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  topicDataList: any;
  toppicWiseCommunities: any;
  loadTopicsCount: number = 1;
  topicDataLoading: boolean = false

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
    this.getAllTopics();
    this.topicWiseData();
  }

  topicWiseData() {
    this.discussV2Svc.topicWiseCommunities().subscribe((res: any) => {  
      
      console.log(res);
    })
  }

  onCardClick(cardData: any){
    
    console.log(cardData)
    this.cardClick.emit(cardData);
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }


  getAllTopics(){ 
    this.topicDataLoading = true
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 200,
      "facets":["topicName"]
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.facets && res.result.search_results.facets.topicName && res.result.search_results.facets.topicName.length){
        this.topicDataList = res.result.search_results.facets.topicName;
        this.topicDataList.forEach((element: any) => {
            this.toppicWiseCommunities[element.value] = {
              topicName: element.value,
              isLoading: true,
              communities: [],
              count: element.count,
              topicId:''
            }
        });
        Object.keys(this.toppicWiseCommunities).forEach(async (key: any) => {
          
          let data = await this.getCommunitiesByTopic(key);
          
          this.toppicWiseCommunities[key].isLoading = false;
          this.toppicWiseCommunities[key].communities = data;
          this.toppicWiseCommunities[key].topicId = data[0].topicId;
        })

        this.topicDataLoading = false
      }
    })
  }
  async getCommunitiesByTopic(topic: any): Promise<any[]> {
    let request: any = {
      filterCriteriaMap: {
        status: 'active',
        topicName: topic
      },
      requestedFields: [],
      pageNumber: 0,
      pageSize: 3
    };

    try {
      const res: any = await this.discussV2Svc.communitySearch(request).toPromise();
      if (res.result && res.result.search_results && res.result.search_results.data) {
        return res.result.search_results.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching communities by topic:', error);
      return [];
    }
  }
  loadMoreTopics(){
    if(this.loadTopicsCount < this.topicDataList.length){
      this.loadTopicsCount += 1;
    }
  }
}
