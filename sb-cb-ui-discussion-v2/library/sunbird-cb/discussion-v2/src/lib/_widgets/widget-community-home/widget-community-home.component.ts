import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';

@Component({
  selector: 'd-v2-widget-community-home',
  templateUrl: './widget-community-home.component.html',
  styleUrls: ['./widget-community-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetCommunityHomeComponent implements OnInit {
  @Input() communityId!: string
  @Input() feedWidgetData: any | undefined
  @Input() communityWidgetData: any | undefined
  communityData: any = {}
  userJoinedCommunityList: any = []
  userJoinedCommunity: boolean = false
  hideCardBody:boolean | undefined
  shortCutData: any[]= [
    {
      name:"Saved Posts",
      icon:"bookmark_border",
      link:"/page/learn"
    },
    {
      name:"Posts By You",
      icon:"list_alt",
      link:""
    },
    {
      name:"Pending Request",
      icon:"update",
      link:""
    }
  ]
  trendingDiscussions = [
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    // Add more discussions...
  ];
  
  constructor(private discussV2Svc: DiscussionV2Service,
    private configSvc: ConfigurationsService,
    private userEnrollSvc: UserEnrollCommunityService
  ) { }

  ngOnInit() {
    console.log(this.communityId)
    
    this.fetchCommunityData(this.communityId)
    this.checkUserJoinedCommunity()
  }
  fetchCommunityData(id: string) {
    this.discussV2Svc.communityDetailRead(id).subscribe((resData: any) => {
      if(resData.result && resData.result.communityDetails){
        this.communityData = resData.result.communityDetails
      }
      console.log(resData,'resData')
    })
    // Fetch community data using id
  }

  async checkUserJoinedCommunity() {
    this.userJoinedCommunityList = await this.userEnrollSvc.getEnrollData()
    this.manageUserCommunityStatus()
    // this.discussV2Svc.usersJoinedCommunityList().subscribe((resData: any) => {
    //   console.log(resData,'resData')
    //   if(resData.result && resData.result.communityDetails && resData.result.communityDetails.length){
    //     this.userJoinedCommunityList = resData.result.communityDetails
    //     this.manageUserCommunityStatus()
    //   }
    // })
  }

  manageUserCommunityStatus(){
    this.userJoinedCommunityList.forEach((community: any) => {
      if(community.communityid === this.communityId){
        this.userJoinedCommunity = community.status
      }
    })
  }
  joinCommunity(){
    let request = {
      "communityId":this.communityId
    }
    this.discussV2Svc.communityJoin(request).subscribe((resData: any) => {
      
      if(resData.params && resData.params.status === 'success'){
        let resultData = [
          {
            "communityid": this.communityId,
            "status": true
          }
        ]
        const community = this.userJoinedCommunityList.find((community: any) => community.communityid === this.communityId);
        if (community) {
          community.status = true;
        } else {
          this.userJoinedCommunityList = [...this.userJoinedCommunityList, ...resultData];
          this.userEnrollSvc.setEnrollData(this.userJoinedCommunityList)
          
        }
        this.manageUserCommunityStatus()
      }
    })
  }
  checkCommunityPresence(): boolean {
    return this.userJoinedCommunityList.some((community: any) => community.communityid === this.communityId);
  }
  unJoinCommunity(){
    
    let request = { "communityId":this.communityId }
    this.discussV2Svc.communityUnjoin(request).subscribe((resData: any) => {
      if(resData.params && resData.params.status === 'success'){
        const community = this.userJoinedCommunityList.find((community: any) => community.communityid === this.communityId);
        if (community) {
          community.status = false;
        }
        this.userEnrollSvc.setEnrollData(this.userJoinedCommunityList)
        this.manageUserCommunityStatus()
      }
    })
  }

  getUserId(){
    let userId = ''
    if(this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile?.userId){
      userId = this.configSvc.userProfile.userId
    }
    return userId
  }
}
