import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatSnackBar } from '@angular/material/snack-bar'
// tslint:disable-next-line
import _ from 'lodash'

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

  reportPending = false

  data = {
    replyToggle: false,
  }
  replyDataCopy: any[] = []
  fetchedReplyData: any = []
  loogedInUserProfile: any = {}
  loading = false

  constructor(
    private discussV2Svc: DiscussionV2Service,
    private configSvc: ConfigurationsService,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef
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

  newComment(event: any) {
    if (event.response && event.response.comment && event.response.comment.commentId) {
      this.loading = true
      this.replyDataCopy.push(event.response.comment.commentId)
      this.replyDataCopy = this.replyDataCopy.slice()
      this.ref.markForCheck()
      this.getListOfReplies()
      this.newReply.emit({ response: event.response, type: 'reply', replyData: this.replyData })
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
    this.discussV2Svc.getListOfCommentsById(this.replyDataCopy).subscribe(res => {
      if (res.result && res.result.comments.length) {
        const reply = res.result.comments
        this.fetchedReplyData = [...reply]
        this.loading = false
      }
    },
                                                                          () => {
      this.loading = false
    })
  }

  reportComment() {
    this.reportPending = true
    this.discussV2Svc.reportComment(this.comment.commentId).subscribe(res => {
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

    this.discussV2Svc.checkIfUserlikedUnlikedComment(event.commentId, event.commentId).subscribe(res => {
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
    this.discussV2Svc.likeUnlikeComment(payload).subscribe(res => {
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

}
