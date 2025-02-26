import { Component, Input, OnInit } from '@angular/core';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';

// tslint:disable-next-line
import _ from 'lodash'
import { Router } from '@angular/router';
@Component({
  selector: 'd-v2-trending-discussions',
  templateUrl: './trending-discussions.component.html',
  styleUrls: ['./trending-discussions.component.scss']
})
export class TrendingDiscussionsComponent implements OnInit {
 @Input() data: any = [] 
 @Input() expandCard: boolean= false
 @Input() communityId!: string
 hideCardBody:boolean | undefined
 searchResults: any
 loadingPosts: boolean = true
 posts: any
  constructor(private discussV2Svc: DiscussionV2Service, private router: Router) { }
  ngOnInit(): void {
    this.fetchPosts()
  }
  fetchPosts() {

    this.loadingPosts = true
     const req = {
         "filterCriteriaMap": {
           "type": "question",
           isActive: true // this is to get only active posts, deleted posts won't be returned
         },
         "requestedFields": [],
         "pageNumber": 0,
         "pageSize": 3,
         "orderBy": "answerPosts",
         "orderDirection": "desc",
         "facets": []
     }
     if(this.communityId) {
      req['filterCriteriaMap'] = {...req['filterCriteriaMap'], ...{communityId:this.communityId}}
     }
     this.discussV2Svc.searchPosts(req).subscribe(res => {
       this.loadingPosts = false
       this.searchResults = _.get(res, 'result.search_results') || {}
       this.posts = _.get(res, 'result.search_results.data') || []
     },(err: any) => {
       this.loadingPosts = false
      //  this._snackBar.open('Something went wrong! please try reporting again later.')
       console.error(err)
     })
   }
   navigateToPost(post: any) {
    let cardConfig = {
      enabled: false,
      position: 'title',
      redirectUrl: '/app/discussion-forum-v2/post/',
      id: ''
    }
    this.router.navigate([cardConfig.redirectUrl + post.discussionId])
   }
}
