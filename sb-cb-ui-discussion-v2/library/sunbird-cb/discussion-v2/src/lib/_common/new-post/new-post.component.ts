import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogueComponent } from '../new-post-dialogue/new-post-dialogue.component';

@Component({
  selector: 'd-v2-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  @Input() config!: NsDiscussionV2.INewPostConfig
  @Input() hierarchyPath = []
  @Input() taggedUsers = []
  @Input() type = 'question'
  @Output() newComment = new EventEmitter<any>()
  @Input() disableActions: boolean = false

  loogedInUserProfile: any = {}
  loggedInUserData: any = {}
  searchControl = new UntypedFormControl('')
  showEmojiPicker = false

  constructor(
    private configSvc: ConfigurationsService,
    // private discussV2Svc: DiscussionV2Service,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.loggedInUserData = this.configSvc.unMappedUser
  }

  submitComment() {

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

  toggleDisable() {
    // if (this.commentSvc && this.commentSvc.enrolledContent) {
    //   this.searchControl.enable()
    // } else {
    //   this.searchControl.disable()
    // }
  }

  openNewPostDialog() {
    const newPostDialog = this.dialog.open(NewPostDialogueComponent, {
      width: '600px',
      maxHeight: '90vh', // Add maximum height (90% of viewport height)
      data: {
        type: this.type,
        panelClass: ['post-dialog', 'scrollable-dialog'], // Add scrollable class
        backdropClass: 'post-dialog-backdrop',
        parentDiscussionId: this.hierarchyPath.length ? this.hierarchyPath[0] : '',
      } 
    });
    newPostDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        this.newComment.emit({result: result.result, type: result.type})
      }
    })
  }

}
