import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'd-v2-widget-community-search',
  templateUrl: './widget-community-search.component.html',
  styleUrls: ['./widget-community-search.component.scss']
})
export class WidgetCommunitySearchComponent {

  searchTextValue: any = '';
  communityDataList: any = [];
  topicName: any
  orgDetails: any
  @Output() searchText = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  isLoading: boolean = false;
  
  constructor(private activatedRoute: ActivatedRoute, private discussV2Svc: DiscussionV2Service) {
    debugger
    
    combineLatest([
      this.activatedRoute.queryParams,
      this.activatedRoute.paramMap
    ]).subscribe(([queryParams, params]) => {
      this.isLoading = true;
      this.communityDataList = [0,1,2,3,4,5,6,7,8,9,10];
      // Check query params first
      if (queryParams['c'] || queryParams['c'] === '') {
        this.searchTextValue = queryParams['c'];
        this.fetchCommunityList(this.searchTextValue);
      } 
      else if (params.get('topicName')) {
        this.topicName = params.get('topicName')
        this.fetchCommunityList(this.searchTextValue, params.get('topicName'));
      } 
      // Default case
      else {
        this.fetchCommunityList();
      }
      this.onSearch(this.searchTextValue,'t')
    });
   }

   fetchCommunityList(searchText?: any, topicName?:any) {
    debugger
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [
      ],
      "pageNumber": 0,
      "pageSize": 200
    }
    if(searchText) {
      request['searchString'] = searchText
    }
    if(topicName) {
      request['filterCriteriaMap']['topicName'] = topicName
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      if(res.result && res.result && res.result.search_results && res.result.search_results.additionalInfo && res.result.search_results.additionalInfo.length ) {
        this.orgDetails = this.discussV2Svc.convertOrgArrayToObject(res.result.search_results.additionalInfo)
      }
      if(res.result && res.result && res.result.search_results && res.result.search_results.data && res.result.search_results.data.length){
        this.communityDataList = res.result.search_results.data;
      } else {
        this.communityDataList = []
      }
      this.isLoading = false;
    },(_err: any) => {
      this.isLoading = false;
      this.communityDataList = []
    })
   }

  onSearch(searchEvent: any, option?:any){
    if(option){
      this.searchTextValue = this.searchTextValue
    } else {
      this.searchTextValue = searchEvent.target.value;
      this.searchText.emit(this.searchTextValue);
    }
    // this.fetchCommunityList(this.searchTextValue)
  }

  onCardClick(community: any){
    console.log(community);
    this.cardClick.emit(community);
  }
}
