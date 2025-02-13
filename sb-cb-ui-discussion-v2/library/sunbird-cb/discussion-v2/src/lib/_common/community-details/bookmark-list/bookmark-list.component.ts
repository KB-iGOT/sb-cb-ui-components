import { Component, Input, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';

@Component({
  selector: 'd-v2-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit{
  @Input() communityData: any
  @Input() widgetData: any
  @Input() communityId: any
  @Input() userJoinedCommunity: boolean = false
  disableLoadmore: boolean = false
  page: any = 0
  pageSize: any = 1

  bookmarkPosts: any = []
  constructor(private discussV2Svc: DiscussionV2Service){
    
  }

  ngOnInit(): void {
    this.getBookmarkData()
  }

  getBookmarkData() {
    
    let request : any = {
      "communityId": this.communityId,
    "page" : this.page,
      "pageSize" :  this.pageSize
    }
    this.discussV2Svc.getBookmarkDataList(request).subscribe((res: any) => {
      if(res && res.result && res.result.data && res.result.data.length) {
        let newData = res.result.data.map((v: any) => ({...v, bookmark: true}))
        this.bookmarkPosts = [...this.bookmarkPosts, ...newData]
      } else {
        this.disableLoadmore = true
      }
    })
  }
  loadMoreMembers(){
    this.page = this.page + 1
    this.getBookmarkData()
  }

}
