import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { CommentsService } from '../../_services/comments.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

// tslint:disable-next-line
import _ from 'lodash'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FlagDialogueComponent } from '../../_shared/flag-dialogue/flag-dialogue.component'
import { ConfirmDialogueComponent } from '../confirm-dialogue/confirm-dialogue.component'


@Component({
  selector: 'd-v2-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit, OnChanges {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.ICommentCardConfig
  @Input() comment!: any
  @Input() replyData: any[] = []
  @Input() hierarchyPath = []
  @Input() userLikedComments: any = []
  @Input() commentUsersData: any = {}
  @Output() newReply = new EventEmitter<any>()
  @Output() likeUnlikeData = new EventEmitter<any>()

  @Input() tagUserData: any = {}
  reportPending = false
  showEmojiPicker = false

  data = {
    replyToggle: false,
  }
  replyDataCopy: any[] = []
  fetchedReplyData: any = []
  loogedInUserProfile: any = {}
  loading = false
  isEditMode: boolean = false
  editCommentData: any = ''
  replayCommentsCount: any = 10
  flagSelectionList = [
    // "Sexual content",
    // "Violent or repulsive content",
    // "Hateful or abusive content",
    // "Harassment or bullying",
    // "Harmful or dangerous acts",
    // "Misinformation",
    // "Child abuse",
    // "Promotes terrorism",
    // "Spam or misleading",
    // "Others"
  ]

  constructor(
    public commentSvc: CommentsService,
    private configSvc: ConfigurationsService,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.replyDataCopy = [...this.replyData]

  }

  ngOnChanges(_changes: SimpleChanges): void {
    // if (changes.replyData && changes.replyData.currentValue) {
    //   this.replyDataCopy = [...changes.replyData.currentValue]
    // }
  }

  get getHierarchyPath() {
    return [...this.hierarchyPath, this.comment.commentId]
  }

  get getParentHierarchyPath() {
    return [...this.hierarchyPath, this.comment.parentCommentId]
  }

  newComment(event: any) {
    
    if (event.response && event.response.comment && event.response.comment.commentId) {
      this.loading = true

      this.replyDataCopy.push(event.response.comment.commentId)
      this.replyDataCopy = this.replyDataCopy.slice()
      this.ref.markForCheck()
      this.getListOfReplies()
      // this.newReply.emit({ response: event.response, type: 'reply', replyData: this.replyDataCopy })
    }
  }

  viewMoreOrLess(item: any) {
    if (item.comment.length > 152) {
      item.expanded = !item.expanded
    }
  }

  expandReplyComment() {
    this.data.replyToggle = !this.data.replyToggle
    if (this.data.replyToggle && this.replyData.length) {
      this.loading = true
      this.replayCommentsCount = 10
      this.getListOfReplies()
    }
  }

  getListOfReplies() {
    let reveseReplayDataCopy = [...this.replyDataCopy]
    reveseReplayDataCopy.reverse()
    let ids:any = reveseReplayDataCopy.slice(0,10)
    this.commentSvc.getListOfCommentsById(ids).subscribe(res => {
      if (res.result && res.result.comments.length) {
        let taggedUsersList = res.result.taggedUsers
        this.tagUserData = {...this.tagUserData,..._.keyBy(taggedUsersList, 'user_id')}
        const reply = res.result.comments
        // parrent comment id is user for sencond level comments only
        const replayModified = reply.map((replayData: any) => ({...replayData, parentCommentId: this.comment.commentId}))
        this.fetchedReplyData = [...replayModified,]
        this.newReply.emit({ response: [], type: 'reply', replyDataCopy:this.replyDataCopy, replyData: this.fetchedReplyData })
        this.loading = false
      }
    },
      () => {
        this.loading = false
      })
  }

  reportComment(flagDetails: any) {
    this.reportPending = true
    let requestData: any = {
      "commentId": this.comment.commentId
    }
    requestData = { ...requestData, ...flagDetails }

    this.commentSvc.reportComment(requestData).subscribe(res => {
      if (res && res.responseCode === 'OK') {
        this.loading = false
      }
      this.reportPending = false
      this.comment = res.result
      this._snackBar.open(_.get(this.cardConfig, 'reportIcon.successMsg') || 'Reported successfully! Thank you for reporting.')
    },
      () => {
        this._snackBar.open(_.get(this.cardConfig, 'reportIcon.errorMsg') || 'Something went wrong! please try reporting again later.')
        this.reportPending = false
        this.loading = false
      })
  }

  likeUnlikeComment(comment: any) {
    this.likeUnlikeData.emit(comment)
  }

  likeUnlikeEvent(event: any) {
    // this.commentSvc.checkIfUserlikedUnlikedComment(event.commentId, event.commentId).subscribe(res => {
    //   if (res.result && Object.keys(res.result).length > 0) {
    //     this.likeUnlikeCommentApi('unlike', event.commentId)
    //   } else {
    //     this.likeUnlikeCommentApi('like', event.commentId)
    //   }
    // })
    if(this.userLikedComments.includes(event.commentId)) {
      this.likeUnlikeCommentApi('dislike', event.commentId)
    } else {
      this.likeUnlikeCommentApi('like', event.commentId)
    }

  }

  likeUnlikeCommentApi(flag: string, commentId: string) {
    const payload = {
      flag,
      commentId,
      userId: this.loogedInUserProfile.userId,
      courseId: this.commentSvc.entityId
    }
    this.commentSvc.likeUnlikeComment(payload).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const comment = this.fetchedReplyData.find((comm: any) => comm.commentId === commentId)
        if (flag === 'like') {
          comment.commentData.like = comment.commentData.like ? comment.commentData.like + 1 : 1
          this.userLikedComments.push(commentId)
        } else {
          comment.commentData.like = comment.commentData.like - 1
          const index = this.userLikedComments.findIndex((x: any) => x === commentId)
          this.userLikedComments.splice(index, 1)
        }
      }
    })
  }

  openFlagDialogue(comment: any) {
    this.getAllFlagList(comment)
    // const confirmDialog = this.dialog.open(FlagDialogueComponent, {
    //   width: '600px',
    //   panelClass: 'flag-dialog',
    //   backdropClass: 'flag-dialog-backdrop',
    //   data: { comment, flagSelectionList: this.flagSelectionList },
    // })
    // confirmDialog.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //   }
    // })
  }

  getAllFlagList(comment: any) {
    this.commentSvc.fetchAllFlags().subscribe((res: any) => {
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
            this.reportComment(result)
          }
        })
      }
    })
  }
  openDeleteDialogue(comment: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '600px',
      panelClass: 'flag-dialog',
      backdropClass: 'flag-dialog-backdrop',
      data: {
        comment,
        flagSelectionList: this.flagSelectionList
      },
    })
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteCommentMethod(comment)
      }
    })

  }
  deleteCommentMethod(comment: any) {
    this.commentSvc.deleteComment(comment.commentId, this.commentSvc.entityType, this.commentSvc.entityId, this.commentSvc.workflow).subscribe((_res: any) => {
      comment.status = 'inactive'
      this._snackBar.open('Comment deleted successfully')
    }, (_err: any)=> {
      this._snackBar.open('Something went wrong! please try again later.')
    })
  }

  toggelEdit(commentData:any) {
    this.editCommentData = {}
    this.editCommentData = {...commentData}
    this.isEditMode = true
    this.replayCommentsCount = this.replayCommentsCount + 10
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }
  onFocus() {
    this.showEmojiPicker = false
  }
  addEmoji(event: any) {
    const text = `${this.editCommentData.comment}${event.emoji.native}`
    this.editCommentData['comment'] = text
  }

  updateComment(){
    let requestData = {
      "commentTreeId": this.commentSvc.commentTreeId,
      "commentId": this.comment.commentId,
      "commentData": {
        "comment":this.editCommentData.comment,
        "commentResolved":this.editCommentData.commentResolved,
        "commentSource":this.editCommentData.commentSource,
        "taggedUsers":this.editCommentData.taggedUsers
      } 
    }
    this.commentSvc.updateComment(requestData).subscribe((_res: any)=> {
      this.isEditMode = false
      this.comment['lastUpdatedDate'] = new Date().toISOString()
      this.comment['commentData'] = this.editCommentData
      this._snackBar.open('Comment Updated successfully.')
    },()=>{
      this._snackBar.open('Comment Updated failed.')
    })
  }

  cancelComment() {
    this.isEditMode = false
    this.editCommentData
  }

  updateRepliesData(eventData: any) {
    console.log(eventData)
    this.replyDataCopy = eventData.replyDataCopy
    this.fetchedReplyData = [...eventData.replyData]
    return this.fetchedReplyData 
  }
  loadMoreComments() {
    this.replayCommentsCount = this.replayCommentsCount + 10
    this.loadMoreReplies()
  }

  loadMoreReplies() {
    let start: number = this.replayCommentsCount - 10
    let reveseReplayDataCopy = [...this.replyDataCopy]
    reveseReplayDataCopy.reverse()
    let ids:any = reveseReplayDataCopy.slice(start,this.replayCommentsCount)
    debugger
    this.commentSvc.getListOfCommentsById(ids).subscribe(res => {
      if (res.result && res.result.comments.length) {
        let taggedUsersList = res.result.taggedUsers
        this.tagUserData = {...this.tagUserData,..._.keyBy(taggedUsersList, 'user_id')}
        const reply = res.result.comments
        // parrent comment id is user for sencond level comments only
        const replayModified = reply.map((replayData: any) => ({...replayData, parentCommentId: this.comment.commentId}))
        this.fetchedReplyData = [ ...this.fetchedReplyData,...replayModified]
        this.newReply.emit({ response: [], type: 'reply', replyDataCopy:this.replyDataCopy, replyData: this.fetchedReplyData })
        
        this.loading = false
      }
    },
      () => {
        this.loading = false
      })
  }
  getCommentMsg(taggedUsers: any, commentText: any){
    let users: any = ''
    let replayData = ``
    if(taggedUsers && taggedUsers.length){
      taggedUsers.forEach((tagUser: any) => {
        users = users + this.tagUserData[tagUser]?.first_name
      });
    }
    if(users) {
      replayData = `<span class="mr-2 font-semibold ws-mat-default-text">Replying to ${users}</span>`
    }
    return replayData + commentText
  }
}
