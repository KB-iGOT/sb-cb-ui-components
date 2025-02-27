import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line
import _ from 'lodash'
import { FlagDialogueComponent } from '../../_shared/flag-dialogue/flag-dialogue.component';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogueComponent } from '../../_shared/confirm-dialogue/confirm-dialogue.component';
import { NewPostDialogueComponent } from '../new-post-dialogue/new-post-dialogue.component';

@Component({
  selector: 'd-v2-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.IPostCardConfig
  @Input() type!: string
  @Input() post!: any
  @Input() replyData: any[] = []
  @Input() hierarchyPath = []
  @Input() userLikedPosts: any = []
  @Input() userJoinedCommunity!: boolean 
  @Input() community!: string
  @Output() likeUnlikeData = new EventEmitter<any>()
  @Output() bookmarkEvent = new EventEmitter<any>()
  @Output() newReply = new EventEmitter<any>()
  @Output() newComment = new EventEmitter<any>()

  data = {
    replyToggle: false,
  }
  replyDataCopy: any[] = []
  fetchedReplyData: any = []
  fetchedSearchData: any
  loading = false
  loadingMore = false
  editCommentData: any = ''
  answerPostLimit: any = 10
  answerPostPage = 0
  loogedInUserProfile: any = {}
  flagSelectionList: any
  reportPending = false
  viewMoreLength = 246
  editMode: boolean =  false

  constructor(
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private discussV2Svc: DiscussionV2Service,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
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
        // discussionId : [...this.replyDataCopy],
        isActive: true, // this is to get only active posts, deleted posts won't be returned
        communityId: this.post.communityId,
        "type": "answerPost",
        parentDiscussionId: this.post.discussionId,
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": this.answerPostLimit,
      "orderBy": "createdOn",
      "orderDirection": "DESC",
      "facets": []
    }
    this.discussV2Svc.searchPosts(req).subscribe(res => {
      this.fetchedSearchData = _.get(res, 'result.search_results') || {}
      this.fetchedReplyData = (_.get(res, 'result.search_results.data') || [])
      this.loading = false
      this.newReply.emit({ response: [], type: 'reply', replyDataCopy:this.replyDataCopy, replyData: this.fetchedReplyData })
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
        discussionId : [...this.replyDataCopy],
        isActive: true // this is to get only active posts, deleted posts won't be returned
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
    if (this.getEditorTextLength(item.description) > this.viewMoreLength) {
      item.expanded = !item.expanded
    }
  }

  likeUnlikeComment(post: any) {
    this.likeUnlikeData.emit(post)
  }

  bookmark(bookmark:boolean, post: any) {
    this.bookmarkEvent.emit({
      bookmark,
      post
    })
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

  openDeleteDialogue(post: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '600px',
      panelClass: 'flag-dialog',
      backdropClass: 'flag-dialog-backdrop',
      data: {
        post,
        flagSelectionList: this.flagSelectionList
      },
    })
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteCommentMethod(post)
      }
    })

  }
  deleteCommentMethod(post: any) {
    this.discussV2Svc.deletePost(post.discussionId).subscribe((_res: any) => {
      post.status = 'inactive'
      this._snackBar.open('Comment deleted successfully')
    }, (_err: any)=> {
      this._snackBar.open('Something went wrong! please try again later.')
    })
  }

  editHandler(post: any) {
    if(this.cardConfig && this.cardConfig.editAsDialogue){
      this.openEditDialogue(post)
    } else {
      this.editMode = true
    }
  }

  editEventsHandler(event: any) {
    if(event && event.cancelEdit) {
      this.editMode = false
    }
    if(event && event.edit){
      event.post.createdBy = this.post.createdBy
      this.post = event.post
      this.editMode = false
    }
  }

  openEditDialogue(post: any) {
    const newPostDialog = this.dialog.open(NewPostDialogueComponent, {
      width: '996px',
      maxHeight: '90vh',// Add maximum height (90% of viewport height)
      disableClose: true,
      data: {
        type: this.type,
        panelClass: ['post-dialog', 'scrollable-dialog'], // Add scrollable class
        backdropClass: 'post-dialog-backdrop',
        parentDiscussionId: this.hierarchyPath.length ? this.hierarchyPath[0] : '',
        community: this.community,
        config: this.cardConfig,
        currentUser: {...this.loogedInUserProfile},
        post: post,
        editMode: true
      } 
    });
    newPostDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.newComment.emit({result: result.result, type: result.type})
      }
    })
  }

  updateRepliesData(eventData: any) {
    this.replyDataCopy = eventData.replyDataCopy
    this.fetchedReplyData = [...eventData.replyData]
    return this.fetchedReplyData 
  }

  newCommentEvent(event: any) {
    console.log('newCommentEvent::', event)
    if (event.result && event.result.discussionId) {
      this.loading = true
      // this.emptySearch()
      this.replyDataCopy.push(event.result.discussionId)
      this.replyDataCopy = this.replyDataCopy.slice()
      this.ref.markForCheck()
      this.getListOfReplies()
      // this.newReply.emit({ response: event.response, type: 'reply', replyData: this.replyDataCopy })
    }
  }

  getFileExtension(file: string): string {
    return file.split('.').pop() || '';
  }

  getFileName(url: string): string {
    const filename = url.split('/').pop() || '';
    // Decode the URL-encoded filename
    return decodeURIComponent(filename);
  }

  getFileIcon(url: string): string {
    const extension = this.getFileExtension(url);
    switch(extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      default:
        return 'insert_drive_file';
    }
  }

  openDocument(event: MouseEvent, url: string) {
    event.preventDefault();
    window.open(url, '_blank');
  }

  getEditorTextLength(content: any) {
    let test = content.replace(/<[^>]*>/g, '')
    test = test.replace(/&nbsp;/gi, ' ')
    test = test.trim()
    return test.length
  }

}
