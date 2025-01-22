import { Component, Input, OnInit } from '@angular/core';
// import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { DiscussionV2Service } from '../../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// tslint:disable-next-line
import _ from 'lodash'
@Component({
  selector: 'd-v2-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit{
  @Input() widgetData: any = []
  @Input() userJoinedCommunity: boolean = false
  @Input() community: any = []
  loadingPosts: boolean = false
  loogedInUserProfile: any = {}
  pageNumber = 0
  commentListLimit = 5
  commentListOffSet = 0
  commentsLength = 0
  posts: any[] = []
  loadingMore = false
  searchResults: any

  constructor(
        // private configSvc: ConfigurationsService,
        private discussV2Svc: DiscussionV2Service,
        private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchPosts()
  }

  fetchPosts() {
    this.loadingPosts = true
    const req = {
        "filterCriteriaMap": {
          "type": "question",
          // "communityId": this.community.communityId,
          isActive: true // this is to get only active posts, deleted posts won't be returned
        },
        "requestedFields": [],
        "pageNumber": this.commentListOffSet,
        "pageSize": this.commentListLimit,
        "orderBy": "createdOn",
        "orderDirection": "ASC",
        "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      console.log('res = > ', res)
      this.loadingPosts = false
      this.searchResults = _.get(res, 'result.search_results') || {}
      this.posts = _.get(res, 'result.search_results.data') || []
    },(err: any) => {
      this.loadingPosts = false
      this._snackBar.open('Something went wrong! please try reporting again later.')
      console.error(err)
    })
  }
  loadMoreComments(){}
  likeUnlikeEvent(_e: any){} 
  newCommentEvent(_e: any){}
}
