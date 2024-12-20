import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line
import _ from 'lodash'
import { FlagDialogueComponent } from '../../_shared/flag-dialogue/flag-dialogue.component';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'd-v2-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.IPostCardConfig
  @Input() post!: any
  @Input() replyData: any[] = []
  @Input() hierarchyPath = []
  @Input() userLikedPosts: any = []
  @Output() likeUnlikeData = new EventEmitter<any>()

  data = {
    replyToggle: false,
  }
  replyDataCopy: any[] = []
  fetchedReplyData: any = []
  fetchedSearchData: any
  loading = false
  loadingMore = false
  isEditMode: boolean = false
  editCommentData: any = ''
  answerPostLimit: any = 2
  answerPostPage = 0
  loogedInUserProfile: any = {}
  flagSelectionList: any
  reportPending = false

  constructor(
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private discussV2Svc: DiscussionV2Service,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.replyDataCopy = [...this.replyData || [] ]
  }

  expandReplyComment() {
    this.data.replyToggle = !this.data.replyToggle
    if (this.data.replyToggle && this.replyData && this.replyData.length) {
      this.loading = true
      this.getListOfReplies()
    }
  }

  loadMoreAnswers() {
    this.answerPostPage = this.answerPostPage + 1
    // this.answerPostLimit = this.answerPostCount + this.answerPostLimit
    this.getListOfRepliesMore()
  }

  getListOfReplies() {
    // let reveseReplayDataCopy = [...this.replyDataCopy]
    // reveseReplayDataCopy.reverse()
    // let ids:any = reveseReplayDataCopy.slice(0,this.answerPostLimit)
    const req = {
      "filterCriteriaMap": {
        discussionId : [...this.replyDataCopy]
      },
      "requestedFields": [],
      "pageNumber": this.answerPostPage,
      "pageSize": this.answerPostLimit,
      "orderBy": "createdOn",
      "orderDirection": "ASC",
      "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      this.fetchedSearchData = _.get(res, 'result.search_results') || {}
      this.fetchedReplyData = (_.get(res, 'result.search_results.data') || [])
      this.loading = false
      }, () => {
        this.loading = false
      })
  }

  getListOfRepliesMore() {
    this.loadingMore = true
    // let start: number = this.answerPostCount - this.answerPostLimit
    // let reveseReplayDataCopy = [...this.replyDataCopy]
    // reveseReplayDataCopy.reverse()
    // let ids:any = reveseReplayDataCopy.slice(start,this.answerPostCount)
    const req = {
      "filterCriteriaMap": {
        discussionId : [...this.replyDataCopy]
      },
      "requestedFields": [],
      "pageNumber": this.answerPostPage,
      "pageSize": this.answerPostLimit,
      "orderBy": "createdOn",
      "orderDirection": "ASC",
      "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      this.fetchedReplyData = [...this.fetchedReplyData , ...(_.get(res, 'result.search_results.data') || [])]
      this.loadingMore = false
      }, () => {
        this.loadingMore = false
      })
  }
  

  viewMoreOrLess(item: any) {
    if (item.description.length > 152) {
      item.expanded = !item.expanded
    }
  }

  likeUnlikeComment(post: any) {
    this.likeUnlikeData.emit(post)
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
        const post = this.fetchedReplyData.find((comm: any) => comm.discussionId === discussionId)
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

  openFlagDialogue(comment: any) {
    this.getAllFlagList(comment)
  }

  getAllFlagList(comment: any) {
    this.discussV2Svc.fetchAllFlags().subscribe((res: any) => {
      if (res && res.result
        && res.result.response
        && res.result.response.value
        && res.result.response.value.length) {
        this.flagSelectionList = res.result.response.value
        const confirmDialog = this.dialog.open(FlagDialogueComponent, {
          width: '600px',
          panelClass: 'flag-dialog',
          backdropClass: 'flag-dialog-backdrop',
          data: { comment, flagSelectionList: this.flagSelectionList },
        })
        confirmDialog.afterClosed().subscribe((result: any) => {
          if (result) {
            this.reportPost(result)
          }
        })
      }
    })
  }

  reportPost(flagDetails: any) {
    this.reportPending = true
    let requestData: any = {
      "discussionId": this.post.discussionId
    }
    requestData = { ...requestData, ...flagDetails }
    console.log('requestData: ', requestData)

    this.discussV2Svc.reportPost(requestData).subscribe(res => {
      if (res && res.responseCode === 'OK') {
        this.loading = false
      }
      this.reportPending = false
      this.post = res.result
      this._snackBar.open(_.get(this.cardConfig, 'reportIcon.successMsg') || 'Reported successfully! Thank you for reporting.')
    },
      () => {
        this._snackBar.open(_.get(this.cardConfig, 'reportIcon.errorMsg') || 'Something went wrong! please try reporting again later.')
        this.reportPending = false
        this.loading = false
      })
  }

  openDeleteDialogue(_comment: any) {
    // const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
    //   width: '600px',
    //   panelClass: 'flag-dialog',
    //   backdropClass: 'flag-dialog-backdrop',
    //   data: {
    //     comment,
    //     flagSelectionList: this.flagSelectionList
    //   },
    // })
    // confirmDialog.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //     // this.deleteCommentMethod(comment)
    //   }
    // })

  }
  // deleteCommentMethod(comment: any) {
  //   this.commentSvc.deleteComment(comment.commentId, this.commentSvc.entityType, this.commentSvc.entityId, this.commentSvc.workflow).subscribe((_res: any) => {
  //     comment.status = 'inactive'
  //     this._snackBar.open('Comment deleted successfully')
  //   }, (_err: any)=> {
  //     this._snackBar.open('Something went wrong! please try again later.')
  //   })
  // }

  toggelEdit(postData:any) {
    this.editCommentData = {}
    this.editCommentData = {...postData}
    this.isEditMode = true
  }

  updateRepliesData(eventData: any) {
    console.log(eventData)
    this.replyDataCopy = eventData.replyDataCopy
    this.fetchedReplyData = [...eventData.replyData]
    return this.fetchedReplyData 
  }

  newCommentEvent(event: any) {
    console.log('newCommentEvent::', event)
  }

}
