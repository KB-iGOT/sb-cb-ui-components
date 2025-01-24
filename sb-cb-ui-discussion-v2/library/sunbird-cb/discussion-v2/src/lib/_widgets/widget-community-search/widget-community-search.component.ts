import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-widget-community-search',
  templateUrl: './widget-community-search.component.html',
  styleUrls: ['./widget-community-search.component.scss']
})
export class WidgetCommunitySearchComponent {

  searchTextValue: any;
  communityDataList: any = [];
  @Output() searchText = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  
  constructor(private activatedRoute: ActivatedRoute, private discussV2Svc: DiscussionV2Service) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if(params['c']) {
        this.searchTextValue = params['c'];
        this.fetchCommunityList(this.searchTextValue)
      }
    })
   }

   fetchCommunityList(_searchText?: any){
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [
      ],
      "pageNumber": 0,
      "pageSize": 200
    }
    // if(searchText) {
    //   request['searchString'] = searchText
    // }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.data && res.result.search_results.data.length){
        this.communityDataList = res.result.search_results.data;
      }
      console.log(res);
    })
   }

  onSearch(searchEvent: any){
    if(searchEvent && searchEvent.target && searchEvent.target.value){
      this.searchTextValue = searchEvent.target.value;
    }

    this.searchText.emit(this.searchTextValue);
    // this.fetchCommunityList(this.searchTextValue)
  }

  onCardClick(community: any){
    console.log(community);
    this.cardClick.emit(community);
  }
}
