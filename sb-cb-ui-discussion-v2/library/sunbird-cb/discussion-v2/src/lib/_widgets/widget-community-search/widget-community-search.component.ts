import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { combineLatest } from 'rxjs';
import { communityConstants } from '../../_model/filter-constants.model'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { FilterComponent } from '../../_common/filter/filter.component';
@Component({
  selector: 'd-v2-widget-community-search',
  templateUrl: './widget-community-search.component.html',
  styleUrls: ['./widget-community-search.component.scss']
})
export class WidgetCommunitySearchComponent {

  searchTextValue: any = '';
  localSearchTextValue: any = '';
  globalSearchEnabled: boolean = false;
  communityDataList: any = [];
  communityDataListLoader: any = []
  topicName: any = ''
  orgDetails: any
  @Output() searchText = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  isLoading: boolean = false;
  filterObjectList: any = {}
  constants: any
  filterKeys: any =[]
  sortOptionSelected: any= {}
  pageSize: any = 1
  pageNumber: any = 0
  totalCount: any
  
  
  constructor(private bottomSheet: MatBottomSheet,private activatedRoute: ActivatedRoute, private discussV2Svc: DiscussionV2Service) {
    
    
    this.constants= communityConstants
    combineLatest([
      this.activatedRoute.queryParams,
      this.activatedRoute.paramMap
    ]).subscribe(([queryParams, params]) => {
      
      this.isLoading = true;
      this.communityDataListLoader = [0,1,2,3,4,5,6,7,8,9,10];
      // Check query params first
      if (queryParams['c'] || queryParams['c'] === '') {
        this.searchTextValue = queryParams['c'];
        this.fetchCommunityList(this.searchTextValue);
        this.globalSearchEnabled = true
      } 
      else if (params.get('topicName')) {
        this.topicName = params.get('topicName')
        this.fetchCommunityList(this.searchTextValue, params.get('topicName'));
        this.globalSearchEnabled = false
      } 
      // Default case
      else {
        this.fetchCommunityList();
      }
      this.onSearch(this.searchTextValue,'t')
    });
    this.getFilterFacets()
   }

   fetchCommunityList(searchText?: any, topicName?:any, sortData?: any,filterApply?:any,factesRequest?:any) {
    
    let request: any = {
      "filterCriteriaMap": {
          "status": "active"
      },
      "requestedFields": [
      ],
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize
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
    if(factesRequest && factesRequest.length) {
      request['facets']= factesRequest
    }

    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      if(res.result && res.result && res.result.search_results && res.result.search_results.additionalInfo && res.result.search_results.additionalInfo.length ) {
        this.orgDetails = this.discussV2Svc.convertOrgArrayToObject(res.result.search_results.additionalInfo)
      }
      
      if(res.result && res.result && res.result.search_results && res.result.search_results.data && res.result.search_results.data.length){
        this.communityDataList = [...this.communityDataList, ...res.result.search_results.data];
        this.totalCount = res.result.search_results.totalCount
      }
      if(factesRequest && factesRequest.length) {
        let facets: any = res.result.search_results.facets
        Object.keys(facets).forEach((ele: any) => {
          let tempFilter: any = {}
          tempFilter['label'] = this.constants[`${ele}Label`]
          let newValues = []
          if(facets[ele] && facets[ele].length ){
            newValues = facets[ele].map((v: any) => ({...v, checked: false}))
          }
          tempFilter['values'] = newValues
          this.filterObjectList[ele] =  tempFilter
        })
        if(this.filterObjectList[this.constants.competencyTheme].values && this.filterObjectList[this.constants.competencyTheme].values.length === 0  ) {
          this.filterObjectList[this.constants.competencySubTheme].values = []
        }
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
      "pageNumber": this.pageNumber,
      "pageSize": this.pageSize,
      "facets": [
          "topicName",
          "orgId",
          "competencyArea"
      ]
    }
    this.filterObjectList = {
      [this.constants.orgId] : {},
      [this.constants.topicName] : {},
      [this.constants.competencyArea] : {},
      [this.constants.competencyTheme] : {},
      [this.constants.competencySubTheme] : {}
    }
    
    this.filterKeys  = [this.constants.orgId,this.constants.competencyArea,this.constants.competencyTheme, this.constants.competencySubTheme]
    if(!this.topicName) {
      this.filterKeys.splice(1, 0, this.constants.topicName);
    }
    this.discussV2Svc.communitySearch(request).subscribe((res: any) => {
      if(res && res.result && res.result.search_results && res.result.search_results.facets ){
        
        let emptyData = {
          competencyTheme: [],
          competencySubTheme:[]
        }
        let facets: any = {...res.result.search_results.facets,...emptyData}
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
          if(ele === 'topicName') {
            newValues.forEach((element: any) => {
              if(element.value === this.topicName ){
                element['checked']= true
              }
            });
          }
          this.filterObjectList[ele] =  tempFilter
        })
      }
    })
  }


  selectedFilters(filterData: any){
    
    let filterRequest = filterData.selectedOptions
    let recentRequestKey = filterData.recentSelectedKey|| ''
    // let recentRequestOption = filterData.recentSelectedOption
    
    let filterObject: any = {}
    let factesRequest: any = []

    if(!filterRequest[this.constants.competencyArea].length) {
      filterRequest[this.constants.competencySubTheme] = []
      filterRequest[this.constants.competencyTheme] = []
      this.filterObjectList[this.constants.competencyTheme].values = []
      this.filterObjectList[this.constants.competencySubTheme].values = []
    }
    Object.keys(filterRequest).forEach((_ele: any)=> {
      if(filterRequest[_ele] && filterRequest[_ele].length) {
        let data = {
          [_ele]: filterRequest[_ele]
        }
        filterObject = {...filterObject, ...data}
      }
    })
    if(recentRequestKey === this.constants.competencyArea 
      && filterRequest[this.constants.competencyArea].length){
      factesRequest.push(this.constants.competencyTheme)
    } else if(recentRequestKey === this.constants.competencyTheme
      && filterRequest[this.constants.competencyTheme].length
     )
    {
      factesRequest.push(this.constants.competencySubTheme)
    }
    this.fetchCommunityList(this.searchTextValue, this.topicName, this.sortOptionSelected, filterObject,factesRequest)

  }


  // Bottom sheet open only in mobileview
  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(FilterComponent, {
      data: {
        filterObjectList: this.filterObjectList,
        filterKeys: this.filterKeys,
        loadBottomSheet: true
      },
      panelClass: 'filter-bottomsheet',
    })
    bottomSheetRef.afterDismissed().subscribe((result: any) => {
     if (result) {
      const filter = result.filter

      this.selectedFilters({selectedOptions:filter})
     }
    })
  }
  loadMoreMembers(){
    
    if( !(this.communityDataList.length >= this.totalCount)) {
      this.pageNumber = this.pageNumber + 1
      this.fetchCommunityList(this.searchTextValue, this.topicName, this.sortOptionSelected)
    }
  }
  
}
