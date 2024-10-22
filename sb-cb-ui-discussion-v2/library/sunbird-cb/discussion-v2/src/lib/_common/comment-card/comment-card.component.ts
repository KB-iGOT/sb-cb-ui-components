import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { DiscussionV2Service } from '../../_services/discussion-v2.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'd-v2-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input() cardType = 'topLevel'
  @Input() cardConfig!: NsDiscussionV2.ICommentCardConfig
  @Input() comment!: any
  @Input() replyData: any[] = []
  @Input() hierarchyPath = []
  @Output() newReply = new EventEmitter<any>()
  @Output() likeUnlikeData = new EventEmitter<any>()

  data = {
    replyToggle: false,
  }

  fetchedReplyData: any = []
  loogedInUserProfile: any = {}
  loading = false

  constructor(
    private discussV2Svc: DiscussionV2Service, private configSvc: ConfigurationsService, private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
  }

  get getHierarchyPath() {
    return [...this.hierarchyPath, this.comment.commentId]
  }

  newComment(event: any) {
    this.newReply.emit({ response: event.response, type: 'reply' })
  }

  expandReplyComment() {
    this.data.replyToggle = !this.data.replyToggle
    if (this.data.replyToggle && this.replyData.length) {
      this.loading = true
      this.discussV2Svc.getListOfCommentsById(this.replyData).subscribe(res => {
        if (res.result && res.result.comments.length) {
          const reply = res.result.comments
          this.fetchedReplyData = [...reply]
          this.loading = false
        }
      })
    }
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
