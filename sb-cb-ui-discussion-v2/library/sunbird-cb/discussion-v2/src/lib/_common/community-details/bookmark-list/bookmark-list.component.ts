import { Component, Input, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  page: any = 0
  pageSize: any = 1
  totalNumberOfBookmarksCount: any = 0

  bookmarkPosts: any = []
  constructor(private discussV2Svc: DiscussionV2Service, private _snackBar: MatSnackBar){
    
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
      if(res && res.result && res.result.search_results 
        && res.result.search_results.data 
        && res.result.search_results.data.length) {
        let newData = res.result.search_results.data.map((v: any) => ({...v, bookmark: true}))
        this.bookmarkPosts = [...this.bookmarkPosts, ...newData]
        this.totalNumberOfBookmarksCount = res.result.search_results.totalCount
      }
    })
  }
  loadMoreMembers(){
    if( !(this.bookmarkPosts.length >= this.totalNumberOfBookmarksCount)) {
      this.page = this.page + 1
      this.getBookmarkData()
    }
  }

  bookmarkEvent(event: any) {
    this.unbookmarkPost(event.post)
  }
  unbookmarkPost(post: any) {
    const communityId = post.communityId
    const discussionId = post.discussionId
    this.discussV2Svc.UnBookmarkPost(communityId, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open('Post un-bookmarked successffuly!')
        const post = this.bookmarkPosts.find((comm: any) => comm.discussionId === discussionId)
        post.bookmark = false
        const postIndex = this.bookmarkPosts.findIndex((comm: any) => comm.discussionId === discussionId)
        this.bookmarkPosts.splice(postIndex, 1)
        this.totalNumberOfBookmarksCount =  this.totalNumberOfBookmarksCount-1
      }
    })
  }

}
