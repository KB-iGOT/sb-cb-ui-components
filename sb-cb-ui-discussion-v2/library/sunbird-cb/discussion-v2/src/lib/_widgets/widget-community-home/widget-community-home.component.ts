import { Component, Input, ViewEncapsulation, OnInit, Inject } from '@angular/core';
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
  enableShare: boolean = false
  rootOrgId: String= ''
  compentencyKey: any
  environment: any
  competenciesObject: any = []
  competencySelected = ''
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

  strip: any = {
    key: 'blendedPrograms',
    logo: '',
    title: 'Blended Program',
    stripTitleLink: {
      link: '',
      icon: '',
    },
    sliderConfig: {
      showNavs : true,
      showDots: false,
    },
    loader: true,
    stripBackground: '',
    titleDescription: 'Blended Program',
    stripConfig: {
      cardSubType: 'standard',
    },
    viewMoreUrl: {
      path: '',
      viewMoreText: 'Show all',
      queryParams: '',
    },
    tabs: [],
    filters: [],
  }
  
  constructor(
    @Inject('environment') environment: any,
    private discussV2Svc: DiscussionV2Service,
    private configSvc: ConfigurationsService,
    private userEnrollSvc: UserEnrollCommunityService
  ) { 
    
    this.environment = environment
    if(this.configSvc 
      && this.configSvc.userProfile
      && this.configSvc.userProfile.rootOrgId){
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.compentencyKey = this.configSvc.compentency[environment.compentencyVersionKey]
    // this.communityData['competencies_v6'] = [
    //     {
    //         "competencyThemeIdentifier": "kcmfinal_fw_theme_92909bf6-2cea-47ea-b426-dc31803f2177",
    //         "competencyAreaIdentifier": "kcmfinal_fw_competencyarea_af8caa53-7f84-499e-86b2-e32e5b59908e",
    //         "competencyThemeRefId": "COMTHEME-000205",
    //         "competencyThemeType": "Core",
    //         "competencyThemeAdditionalProperties": {
    //             "displayName": "Administration Matters",
    //             "timeStamp": 1724675757333
    //         },
    //         "competencySubThemeName": "Handling Allowances & Reimbursement",
    //         "competencySubThemeIdentifier": "kcmfinal_fw_subtheme_35bf9d51-7299-45a5-ad99-1f7c7db1e4ba",
    //         "competencySubThemeDescription": "Handling Allowances & Reimbursement Competency Sub-Theme",
    //         "competencyThemeName": "Administration Matters",
    //         "competencyAreaName": "Functional",
    //         "competencyAreaRefId": "COMAREA-000003",
    //         "competencySubThemeAdditionalProperties": {
    //             "displayName": "Handling Allowances & Reimbursement",
    //             "timeStamp": 1724675891609
    //         },
    //         "competencySubThemeRefId": "COMSUBTHEME-000276",
    //         "competencyThemeDescription": "Administration Matters competency Theme",
    //         "competencyAreaDescription": "Functional competencies are common among many domains, cutting across MDOs, as well as roles and activities."
    //     }
    // ]
  }

  ngOnInit() {
    console.log(this.communityId)
    
    this.fetchCommunityData(this.communityId)
    this.checkUserJoinedCommunity()
  }
  fetchCommunityData(id: string) {
    this.discussV2Svc.communityDetailRead(id).subscribe((resData: any) => {
      if(resData.result && resData.result.communityDetails){
        this.communityData = {...resData.result.communityDetails , ...resData.result.communityDetails.data}

    this.loadCompetencies()
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

  resetEnableShare(_event: any) {
    this.enableShare = false
  }



  loadCompetencies(): void {
    
    if (this.communityData && this.communityData['competencies'] && this.communityData['competencies'].length) {
      const competenciesObject: any = {}
      if (typeof this.communityData['competencies'] === 'string'
        && this.checkValidJSON(this.communityData['competencies'])) {
        this.communityData['competencies'] = JSON.parse(this.communityData['competencies'])
      }
      this.communityData['competencies'].forEach((_obj: any) => {
        if (competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]) {
          if (competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
            [_obj[this.compentencyKey.vCompetencyTheme]]) {
            const competencyTheme = competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
              [_obj[this.compentencyKey.vCompetencyTheme]]
            if (competencyTheme.indexOf(_obj[this.compentencyKey.vCompetencySubTheme]) === -1) {
              competencyTheme.push(_obj[this.compentencyKey.vCompetencySubTheme])
            }
          } else {
            competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
              [_obj[this.compentencyKey.vCompetencyTheme]] = []
            competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
              [_obj[this.compentencyKey.vCompetencyTheme]]
              .push(_obj[this.compentencyKey.vCompetencySubTheme])
          }
        } else {
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]] = {}
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]][_obj[this.compentencyKey.vCompetencyTheme]] = []
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]][_obj[this.compentencyKey.vCompetencyTheme]]
          .push(_obj[this.compentencyKey.vCompetencySubTheme])
        }
      })

      for (const key in competenciesObject) {
        if (competenciesObject.hasOwnProperty(key)) {
          const _temp: any = {}
          _temp['key'] = key
          _temp['value'] = competenciesObject[key]
          this.competenciesObject.push(_temp)
        }
      }
      this.handleShowCompetencies(this.competenciesObject[0])
    }
  }
  checkValidJSON(str: any) {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }
  handleShowCompetencies(item: any, _option?: any): void {
    this.competencySelected = item.key
    const valueObj = item.value
    const competencyArray = []
    for (const key in valueObj) {
      if (valueObj.hasOwnProperty(key)) {
        const _tempObj: any = {}
        _tempObj['key'] = key
        _tempObj['value'] = valueObj[key]
        competencyArray.push(_tempObj)
      }
    }

    this.strip['loaderWidgets'] = this.transformCompetenciesToWidget(this.competencySelected, competencyArray, this.strip)
  }

  private transformCompetenciesToWidget(
    competencyArea: string,
    competencyArrObject: any,
    strip: any) {
    return (competencyArrObject || []).map((content: any, idx: number) => (
      content ? {
        widgetType: 'card',
        widgetSubType: 'competencyCard',
        widgetHostClass: 'mr-4',
        widgetData: {
          content,
          competencyArea,
          cardCustomeClass: strip.customeClass ? strip.customeClass : '',
          context: { pageSection: strip.key, position: idx },
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'competencyCard',
        widgetHostClass: 'mr-4',
        widgetData: {},
      }
    ))
  }
}
