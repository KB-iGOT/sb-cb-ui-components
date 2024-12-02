import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { UntypedFormControl } from '@angular/forms'
import { NsDiscussionV2 } from '../../_model/discussion-v2.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { CommentsService } from '../../_services/comments.service'

@Component({
  selector: 'd-v2-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
})
export class NewCommentComponent implements OnInit, OnDestroy {
  @Input() config!: NsDiscussionV2.INewCommentConfig
  @Input() hierarchyPath = []
  @Input() taggedUsers = []
  @Output() newComment = new EventEmitter<any>()
  @Input() disableActions: boolean = false

  addNewCommentBool : Boolean  = false
  searchControl = new UntypedFormControl('')
  loogedInUserProfile: any = {}
  loggedInUserData: any = {}
  showEmojiPicker = false

  constructor(
    private configSvc: ConfigurationsService,
    public commentSvc: CommentsService
  ) { }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.loggedInUserData = this.configSvc.unMappedUser
  }

  submitComment() {
    
    const req = this.createReq(this.searchControl.value, [])
    console.log(req, this.loggedInUserData)
    if(!this.addNewCommentBool){
      this.addNewCommentBool = true
      if (this.config.commentTreeData && this.config.commentTreeData.isFirstComment) {
        this.commentSvc.addFirstComment(req).subscribe(res => {
          this.addNewCommentBool = false
          this.performSuccessEvents(res)
        }, (err: any) => {
          // tslint:disable-next-line: no-console
          console.error('Error in posting, please try again later!', err)
          this.addNewCommentBool = false
        })
      } else {
        this.commentSvc.addNewComment(req).subscribe(res => {
          this.addNewCommentBool = false
          this.performSuccessEvents(res)
        }, (err: any) => {
          // tslint:disable-next-line: no-console
          console.error('Error in posting, please try again later!', err)
          this.addNewCommentBool = false
        })
      }
    }

  }

  createReq(comment: string, files: string[]) {
    let commentData = {}
    let commentTreeData = {}
    let commentTreeId = ''
    let hierarchyPath: any = []
    let designation = []
    let profileStatus = ''
    if (this.loggedInUserData
      && this.loggedInUserData.profileDetails) {
      let profileDetails: any = this.loggedInUserData.profileDetails
      if (profileDetails
        && profileDetails.professionalDetails
        && profileDetails.professionalDetails.length) {
        designation = profileDetails.professionalDetails[0].designation
      }
      profileStatus = profileDetails.profileStatus
      console.log(profileDetails)
      // if (profileDetails)

    }
    if (this.loogedInUserProfile) {
      commentData = {
        comment,
        file: files,
        commentSource: {
          userId: this.loogedInUserProfile.userId,
          userPic: this.loogedInUserProfile.profileImageUrl || this.loogedInUserProfile.firstName.substring(0, 2),
          userName: this.loogedInUserProfile.firstName,
          profileStatus: profileStatus,
          designation: designation,
          userRole: 'public', // TODO: replace original roles array
        },
        taggedUsers:this.taggedUsers
      }
    }

    if (this.config.commentTreeData && this.config.commentTreeData.isFirstComment) {
      commentTreeData = {
        entityType: this.config.commentTreeData.entityType,
        entityId: this.config.commentTreeData.entityId,
        workflow: this.config.commentTreeData.workflow,
      }
    } else {
      commentTreeId = this.config.commentTreeData.commentTreeId || this.commentSvc.commentTreeId
      hierarchyPath = this.hierarchyPath
    }
    return {
      ...(commentTreeId ? { commentTreeId } : null),
      ...(hierarchyPath && hierarchyPath.length > 0 ? { hierarchyPath } : null),
      ...(Object.keys(commentTreeData).length > 0 ? { commentTreeData } : null),
      commentData,
    }
  }

  performSuccessEvents(res: any) {
    this.newComment.emit({ response: res, type: 'comment' })
    this.searchControl.setValue('')
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }
  addEmoji(event: any) {
    const text = `${this.searchControl.value}${event.emoji.native}`
    this.searchControl.patchValue(text)
  }
  onFocus() {
    this.showEmojiPicker = false
  }

  ngOnDestroy(): void {
    this.config.commentTreeData.commentTreeId = ''
  }

  toggleDisable() {
    if (this.commentSvc && this.commentSvc.enrolledContent) {
      this.searchControl.enable()
    } else {
      this.searchControl.disable()
    }
  }

  
}
