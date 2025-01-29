import { Component, Input, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit{
  @Input() communityId = '';
  communityMembersList: any
  constructor(private discussV2Svc: DiscussionV2Service){

  }

  ngOnInit() {
    this.getAllMembersOfCommunity();
  }
  getAllMembersOfCommunity(){
    this.discussV2Svc.communityUserList(this.communityId).subscribe((res: any) => {
      if(res.result && res.result && res.result.userDetails  && res.result.userDetails.length){
        this.communityMembersList = res.result.userDetails;
      }
    })
  }
}
