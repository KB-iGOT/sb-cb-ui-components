import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_END_POINTS = {
  USERS_COMMUNITY_LIST: `/apis/proxies/v8/community/v1/user/communities`,
  COMMUNITY_SEARCH: `/apis/proxies/v8/community/v1/search`,
}

@Injectable({
  providedIn: 'root'
})
export class UserEnrollCommunityService {

  userEnrolledCommunityList : any = [];
  userEnrolledCommunityDetailList : any = [];
  allCommunitiesList: any = []
  constructor(private http: HttpClient) { }


  setEnrollData(data: any) {
    this.userEnrolledCommunityList = data;
  }
  async getEnrollData() {
    if(this.userEnrolledCommunityList.length) {
      return this.userEnrolledCommunityList;
    } else {
      let userCommunityData = await this.getUserEnrolledCommunityList();
      this.userEnrolledCommunityList = userCommunityData.communityId
      this.userEnrolledCommunityDetailList = userCommunityData.communityDetails
      return this.userEnrolledCommunityList
    }
  }
  clearEnrollData() {
    this.userEnrolledCommunityList = [];
  }

  async getUserEnrolledCommunityList() {
    let emptyData = {
      communityId: [],
      communityDetails:[]
    } 
    return this.http.get<any>(`${API_END_POINTS.USERS_COMMUNITY_LIST}`).toPromise().then((res: any) => {
      if(res && res.result && res.result.communityId && res.result.communityId.length) {
        return res.result;
      } 
      return emptyData;  
    }).catch((err: any) => {
      console.error(err);
      return emptyData;
    });
  }


  async similarCommuninties(){
    let emptyData = {
      "filterCriteriaMap":{"status":"active"},
      "requestedFields":[],
      "pageNumber":0,
      "pageSize":500,
      "facets":[]
    }
    if(this.allCommunitiesList && this.allCommunitiesList.length){
      return this.allCommunitiesList
    } else {
      return this.http.post<any>(`${API_END_POINTS.COMMUNITY_SEARCH}`, emptyData).toPromise().then((res: any) => {
        if(res && res.result && res.result.search_results && res.result.search_results.data && res.result.search_results.data.length) {
          this.allCommunitiesList = res.result.search_results.data;
          return res.result.search_results.data;
        } 
        return emptyData;  
      }).catch((err: any) => {
        console.error(err);
        return emptyData;
      });
    }
  }
}
