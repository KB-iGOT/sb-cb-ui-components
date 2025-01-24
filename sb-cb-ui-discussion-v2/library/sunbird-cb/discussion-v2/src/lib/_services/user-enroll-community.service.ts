import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_END_POINTS = {
  USERS_COMMUNITY_LIST: `/apis/proxies/v8/community/v1/user/communities`,
}

@Injectable({
  providedIn: 'root'
})
export class UserEnrollCommunityService {

  userEnrolledCommunityList : any = [];
  constructor(private http: HttpClient) { }


  setEnrollData(data: any) {
    this.userEnrolledCommunityList = data;
  }
  async getEnrollData() {
    ;
    if(this.userEnrolledCommunityList.length) {
      return this.userEnrolledCommunityList;
    } else {
      this.userEnrolledCommunityList = await this.getUserEnrolledCommunityList();
      return this.userEnrolledCommunityList
    }
  }
  clearEnrollData() {
    this.userEnrolledCommunityList = null;
  }

  async getUserEnrolledCommunityList() {
    return this.http.get<any>(`${API_END_POINTS.USERS_COMMUNITY_LIST}`).toPromise().then((res: any) => {
      if(res && res.result && res.result.communityDetails && res.result.communityDetails.length) {
        return res.result.communityDetails;
      } 
      return [];  
    }).catch((err: any) => {
      console.error(err);
      return [];
    });
  }
}
