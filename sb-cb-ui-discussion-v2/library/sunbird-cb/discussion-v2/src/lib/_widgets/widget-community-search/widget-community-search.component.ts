import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { combineLatest } from 'rxjs';
import { communityConstants } from '../../_model/filter-constants.model'
@Component({
  selector: 'd-v2-widget-community-search',
  templateUrl: './widget-community-search.component.html',
  styleUrls: ['./widget-community-search.component.scss']
})
export class WidgetCommunitySearchComponent {

  searchTextValue: any = '';
  localSearchTextValue: any = '';
  communityDataList: any = [];
  topicName: any = ''
  orgDetails: any
  @Output() searchText = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  isLoading: boolean = false;
  filterObjectList: any = {}
  constants: any
  filterKeys: any =[]
  sortOptionSelected: any= {}
  
  constructor(private activatedRoute: ActivatedRoute, private discussV2Svc: DiscussionV2Service) {
    
    
    this.constants= communityConstants
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
    this.getFilterFacets()
   }

   fetchCommunityList(searchText?: any, topicName?:any, sortData?: any,filterApply?:any) {
    
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
    if(sortData && Object.keys(sortData).length){
      request['orderBy'] = sortData.orderByKey
      request['orderDirection']= sortData.orderDirection
    }

    if(filterApply && Object.keys(filterApply).length){
      request['filterCriteriaMap'] = {...request['filterCriteriaMap'],...filterApply}
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
  sortOptionSelection(sortData: any){
    this.sortOptionSelected = sortData
    this.fetchCommunityList('',this.topicName,sortData)
  }

  getFilterFacets() {
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 100,
      "facets": [
          "topicName",
          "orgId",
          "competencyArea",
          "competencyTheme",
          "competencySubTheme"
      ]
    }
    this.filterObjectList = {
      [this.constants.orgId] : {},
      [this.constants.topicName] : {},
      [this.constants.competencyArea] : {},
      [this.constants.competencyTheme] : {},
      [this.constants.competencySubTheme] : {}
    }
    this.filterKeys  = [this.constants.orgId,this.constants.topicName,this.constants.competencyArea,this.constants.competencyTheme, this.constants.competencySubTheme]
    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      if(res && res.result && res.result.search_results && res.result.search_results.facets ){
        let facets: any = res.result.search_results.facets
        // if(facets[this.constants.competencyArea] ) {
        //   let tempFilter: any = {}
        //   tempFilter['label'] = this.constants.competencyAreaLabel
        //   tempFilter['values'] =facets[this.constants.competencyArea]
        //   this.filterObjectList[this.constants.competencyArea] =  tempFilter
        // }
        Object.keys(facets).forEach((ele: any) => {
          let tempFilter: any = {}
          tempFilter['label'] = this.constants[`${ele}Label`]
          let newValues = []
          if(facets[ele] && facets[ele].length ){
            newValues = facets[ele].map((v: any) => ({...v, checked: false}))
          }
          tempFilter['values'] = newValues
          console.log(ele)
          if(ele === 'topicName') {
            newValues.forEach((element: any) => {
              if(element.value === this.topicName ){
                element['checked']= true
              }
            });
          }
          this.filterObjectList[ele] =  tempFilter
        })
        console.log('this.filterObjectList', this.filterObjectList)
      }
    })
  }


  selectedFilters(filterRequest: any){
    console.log(filterRequest,'filterRequest..........')
    let filterObject: any = {}
    Object.keys(filterRequest).forEach((_ele: any)=> {
      if(filterRequest[_ele] && filterRequest[_ele].length) {
        let data = {
          [_ele]: filterRequest[_ele]
        }
        filterObject = {...filterObject, ...data}
      }
      
    })
    this.fetchCommunityList(this.searchTextValue, this.topicName, this.sortOptionSelected, filterObject)

  }

  
}
