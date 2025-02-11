import { Component, Input, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit{
  @Input() communityId = '';
  communityMembersList: any = []
  limit: number = 2
  offset: number = 0
  disableLoadmore: boolean = false
  constructor(private discussV2Svc: DiscussionV2Service){

  }

  ngOnInit() {
    this.getAllMembersOfCommunity();
  }
  getAllMembersOfCommunity(){
    let request = {
      "communityId":this.communityId,
      "offset" :this.offset,
      "limit" : this.limit
    }
    this.discussV2Svc.communityUserList(request).subscribe((res: any) => {
      
      if(res.result && res.result && res.result.userDetails  && res.result.userDetails.length){
        this.communityMembersList = [...this.communityMembersList,...res.result.userDetails];
      } else {
        this.disableLoadmore = true
      }
    })
  }
  onSearch(event: any){
   console.log(event);

  }
  loadMoreMembers(){
    this.offset = this.offset + 1
    this.getAllMembersOfCommunity()
  }
}
