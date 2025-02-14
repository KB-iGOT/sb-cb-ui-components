import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogueComponent } from '../new-post-dialogue/new-post-dialogue.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'd-v2-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit, OnDestroy {
  @Input() config!: NsDiscussionV2.INewPostConfig
  @Input() postsListconfig!: NsDiscussionV2.IPostCardConfig
  @Input() hierarchyPath = []
  @Input() taggedUsers = []
  @Input() type = 'question'
  @Output() newComment = new EventEmitter<any>()
  @Input() userJoinedCommunity: boolean = false
  @Input() community: any

  loogedInUserProfile: any = {}
  loggedInUserData: any = {}
  searchControl = new UntypedFormControl('')
  showEmojiPicker = false

  selectedImage: File | null = null;
  selectedImagePreview: string | null = null;

  isMultiLine = false;

  private heightCheckSubject = new Subject<any>();
  private readonly LINE_HEIGHT = 40;
  private readonly HEIGHT_BUFFER = 20; // Buffer to prevent flickering

  constructor(
    private configSvc: ConfigurationsService,
    // private discussV2Svc: DiscussionV2Service,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.loggedInUserData = this.configSvc.unMappedUser

    // Debounce height checks
    this.heightCheckSubject.pipe(
      debounceTime(100) // Wait 100ms before processing height changes
    ).subscribe((event: any) => {
      this.processHeightChange(event);
    });
  }

  ngOnDestroy() {
    this.heightCheckSubject.complete();
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
      width: '996px',
      maxHeight: '90vh', // Add maximum height (90% of viewport height)
      data: {
        type: this.type,
        panelClass: ['post-dialog', 'scrollable-dialog'], // Add scrollable class
        backdropClass: 'post-dialog-backdrop',
        parentDiscussionId: this.hierarchyPath.length ? this.hierarchyPath[0] : '',
        community: this.community,
        config: {postsList: this.postsListconfig},
        currentUser: {...this.loggedInUserData, ...this.loogedInUserProfile}
      } 
    });
    newPostDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        this.newComment.emit({result: result.result, type: result.type})
      }
    })
  }

  autoGrow(event: any): void {
    const element = event.target;
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
    this.heightCheckSubject.next(element);
  }

  private processHeightChange(element: HTMLElement): void {
    const wrapper = element.closest('.input-wrapper');
    const shouldBeMultiLine = element.scrollHeight > (this.LINE_HEIGHT + this.HEIGHT_BUFFER);
    
    if (shouldBeMultiLine !== this.isMultiLine) {
      this.isMultiLine = shouldBeMultiLine;
      if (this.isMultiLine) {
        wrapper?.classList.add('expanded');
      } else {
        wrapper?.classList.remove('expanded');
      }
    }
  }
  
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeImage(): void {
    this.selectedImage = null;
    this.selectedImagePreview = null;
  }

}
