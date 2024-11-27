import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { CommentsService } from '../../_services/comments.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

// tslint:disable-next-line
import _ from 'lodash'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FlagDialogueComponent } from '../flag-dialogue/flag-dialogue.component'
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
      this.getListOfReplies()
    }
  }

  getListOfReplies() {
    this.commentSvc.getListOfCommentsById(this.replyDataCopy).subscribe(res => {
      console.log(this.comment)
      
      if (res.result && res.result.comments.length) {
        let taggedUsersList = res.result.taggedUsers
        this.tagUserData = {...this.tagUserData,..._.keyBy(taggedUsersList, 'user_id')}
        const reply = res.result.comments
        // parrent comment id is user for sencond level comments only
        const replayModified = reply.map((replayData: any) => ({...replayData, parentCommentId: this.comment.commentId}))
        this.fetchedReplyData = [...replayModified]
        this.newReply.emit({ response: [], type: 'reply', replyData: this.fetchedReplyData })
        
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

    this.commentSvc.checkIfUserlikedUnlikedComment(event.commentId, event.commentId).subscribe(res => {
      if (res.result && Object.keys(res.result).length > 0) {
        this.likeUnlikeCommentApi('unlike', event.commentId)
      } else {
        this.likeUnlikeCommentApi('like', event.commentId)
      }
    })

  }

  likeUnlikeCommentApi(flag: string, commentId: string) {
    const payload = {
      flag,
      commentId,
      userId: this.loogedInUserProfile.userId,
    }
    this.commentSvc.likeUnlikeComment(payload).subscribe(res => {
      if (res.responseCode === 'OK') {
        this._snackBar.open(flag === 'like' ? 'Liked' : 'Unliked')
        const comment = this.fetchedReplyData.find((comm: any) => comm.commentId === commentId)
        if (flag === 'like') {
          comment.commentData.like = comment.commentData.like ? comment.commentData.like + 1 : 1
        } else {
          comment.commentData.like = comment.commentData.like - 1
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
    })
  }

  toggelEdit(commentData:any) {
    this.editCommentData = commentData
    this.isEditMode = !this.isEditMode
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
      "commentData": this.editCommentData
    }
    this.commentSvc.updateComment(requestData).subscribe((_res: any)=> {
      this.isEditMode = false
      this._snackBar.open('Comment Updated successfully.')
    },()=>{
      this._snackBar.open('Comment Updated failed.')
    })
  }

  updateRepliesData(eventData: any) {
    
    console.log(eventData)
    return this.fetchedReplyData = [...eventData.replyData]
  }
}
