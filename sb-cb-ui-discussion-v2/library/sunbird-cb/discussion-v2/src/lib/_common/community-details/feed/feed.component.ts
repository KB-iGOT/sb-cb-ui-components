import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class FeedComponent implements OnInit, OnChanges{
  @Input() widgetData: any = []
  @Input() userJoinedCommunity: boolean = false
  @Input() community!: any
  @Input() postCategoryTypeFilter: any
  @Input() showNewPost: boolean = true 
  @Input() selectedTab: string = 'Feeds' 
  @Input() discussionId: string = ''
  loadingPosts: boolean = false
  loogedInUserProfile: any = {}
  pageNumber = 0
  commentListLimit = 10
  commentListOffSet = 0
  commentsLength = 0
  posts: any[] = []
  loadingMore = false
  searchResults: any

  constructor(
        // private configSvc: ConfigurationsService,
        private discussV2Svc: DiscussionV2Service,
        private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    
  }


  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.community && Object.keys(changes.community.currentValue).length) {
      if(this.community) {
        this.fetchPosts()
      }
    }
    
    if (changes.discussionId && changes.discussionId.currentValue) {
      this.scrollToDiscussion();
    }
  }


  fetchPosts(searchString?:any) {
    this.loadingPosts = true
    
    const req = this.fetchPostRequest(true, searchString)
    const tabType = searchString ? '' : this.selectedTab
    this.discussV2Svc.getPosts(req,tabType ).subscribe(res => {
      this.loadingPosts = false
      this.searchResults = _.get(res, 'result.search_results') || {}
      this.posts = _.get(res, 'result.search_results.data') || []

      if(this.discussionId){
        this.scrollToDiscussion()
      }
    },(err: any) => {
      this.loadingPosts = false
      this._snackBar.open('Something went wrong! please try reporting again later.')
      console.error(err)
    })
  }

  fetchPostsMore(searchString?: any) {
    this.loadingPosts = true
    
    const req = this.fetchPostRequest(false, searchString)
    const tabType = searchString ? '' : this.selectedTab
    this.discussV2Svc.getPosts(req, tabType).subscribe(res => {
      console.log('res = > ', res)
      this.loadingPosts = false
      this.searchResults = _.get(res, 'result.search_results') || {}
      this.posts = [...this.posts, ...(_.get(res, 'result.search_results.data') || [])]
    },(err: any) => {
      this.loadingPosts = false
      this._snackBar.open('Something went wrong! please try reporting again later.')
      console.error(err)
    })
  }

  fetchPostRequest(pageReset: boolean, searchString?: string) {
    if(this.selectedTab !== 'Feeds' || searchString?.length) {
      const req: any = {
        "filterCriteriaMap": {
          "type": "question",
          "communityId": this.community.communityId,
          // isActive: true // this is to get only active posts, deleted posts won't be returned
        },
        "requestedFields": [],
        "pageNumber": pageReset? 0 : this.commentListOffSet,
        "pageSize": this.commentListLimit,
        "orderBy": "createdOn",
        "orderDirection": "ASC",
        "facets": []
      }
      if(searchString?.length) {
        req['searchString'] = searchString
      }
  
      if(this.postCategoryTypeFilter && Object.keys(this.postCategoryTypeFilter).length) {
        req.filterCriteriaMap = {...req.filterCriteriaMap, ...this.postCategoryTypeFilter}
      }
      return req
    } else {
      let req: any = {
        "communityId": this.community.communityId,
        "pageNumber": pageReset? 0 : this.commentListOffSet,
      }

      return req
    }
    
  }

  likeUnlikeEvent(event: any) {
    // if(this.userLikedComments.includes(event.commentId)) {
    //   this.likeUnlikeCommentApi('dislike', event.commentId)
    // } else {
      this.upVotePost('like', event.discussionId)
    // }
  }

  upVotePost(flag: string, discussionId: string) {
    this.discussV2Svc.upVotePost(discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
        if (flag === 'like') {
          post.upVoteCount = post.upVoteCount ? post.upVoteCount + 1 : 1
          // this.userLikedComments.push(commentId)
        } else {
          post.downVoteCount = post.downVoteCount? post.downVoteCount + 1 : 1
          // const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          // this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  bookmarkEvent(event: any) {
    if(event.bookmark){
      this.bookmarkPost(event.post)
    } else {
      this.unbookmarkPost(event.post)
    }
  }

  bookmarkPost(post: any) {
    const communityId = post.communityId
    const discussionId = post.discussionId
    this.discussV2Svc.bookmarkPost(communityId, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open('Post bookmarked successffuly!')
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
        post.bookmark = true
      }
    })
  }
  unbookmarkPost(post: any) {
    const communityId = post.communityId
    const discussionId = post.discussionId
    this.discussV2Svc.UnBookmarkPost(communityId, discussionId).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open('Post un-bookmarked successffuly!')
        const post = this.posts.find((comm: any) => comm.discussionId === discussionId)
        post.bookmark = false
      }
    })
  }

  newCommentEvent(event: any){
    if(event && event.type === 'question'){
      this.fetchPosts()
    }
  }

  loadMoreComments() {
    this.commentListOffSet = this.commentListOffSet + 1
    this.fetchPostsMore()
  }

  onSearch(event: any){
    const searchValue = event.target.value;
    console.log('Search text:', searchValue);
    // Add your search logic here{
    this.fetchPosts(searchValue)

  }

  ngAfterViewInit() {
    // Get the discussion ID from route params or wherever it's coming from
    
    if (this.discussionId) {
      setTimeout(() => {
        const element = document.getElementById('post-' + this.discussionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1000); // Small delay to ensure content is loaded
    }
  }
  scrollToDiscussion() {
    const discussionExists = this.posts.find((comm: any) => comm.discussionId === this.discussionId);
  
    if (!discussionExists && this.discussionId) {
      // Fetch specific discussion if not found in current posts
      const req = {
        "filterCriteriaMap":{
          "type":"question",
          "communityId": this.community.communityId,
          "discussionId":this.discussionId,
          "isActive":true
        },
        "requestedFields":[],
        "pageNumber":0,
        "pageSize":5
      }
  
      this.discussV2Svc.getPosts(req, '').subscribe(res => {
        const discussionData = _.get(res, 'result.search_results.data') || [];
        if (discussionData.length) {
          this.posts = [ ...this.posts,discussionData[0]];
          this.scrollToElement();
        }
      }, (err: any) => {
        this._snackBar.open('Unable to fetch the discussion');
        console.error(err);
      });
    } else if (this.discussionId) {
      this.scrollToElement();
    }
  }
  private scrollToElement() {
    setTimeout(() => {
      const element = document.getElementById('post-' + this.discussionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1000);
  }
}
