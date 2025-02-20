import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, Inject } from '@angular/core';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { NewPostDialogueComponent } from '../new-post-dialogue/new-post-dialogue.component';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line
import _ from 'lodash'

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
  @Input() editMode: boolean = false
  @Input() post: any


  selectedFilesFinal: any = {}
  categoryType: any[] = []
  mediaCategory: any = {}
  environment: any
  uploadForm: FormGroup
  uploadControlVisibility: any = {
    document: false,
    image: false,
    link: false
  }

  loogedInUserProfile: any = {}
  loggedInUserData: any = {}
  searchControl = new UntypedFormControl('')
  showEmojiPicker = false

  selectedImage: File | null = null;
  selectedImagePreview: string | null = null;

  isMultiLine = false;


  constructor(
    private fb: FormBuilder,
    private discussV2Svc: DiscussionV2Service,
    @Inject('environment') environment: any,
    private configSvc: ConfigurationsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.uploadForm = this.fb.group({
      // title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      tags: [[]],
      files: [[]]
    });
    this.environment = environment
  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.loggedInUserData = this.configSvc.unMappedUser
  }

  ngOnDestroy() {
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

  openNewPostDialog() {
    const newPostDialog = this.dialog.open(NewPostDialogueComponent, {
      width: '996px',
      maxHeight: '90vh', // Add maximum height (90% of viewport height)
      disableClose: true,
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
        this.newComment.emit({result: result.result, type: result.type})
      }
    })
  }

  autoGrow(event: any): void {
    const element = event.target;
    element.style.minHeight = 'auto'; // Reset minHeight to auto to get the correct scrollHeight
    element.style.minHeight = element.scrollHeight + 'px';

    if (element.scrollHeight > 200) {
      element.style.minHeight = '200px';
    }
    this.checkMultiline(event.target.value)
  }

  checkMultiline(val: string) {
    if (val || (this.categoryType && this.categoryType.length)) {
      this.isMultiLine = true;
    } else {
      this.isMultiLine = false;
    }
  }
  
  getNewAndOldMerged(newMedia: any, oldMedia: any) {
    // Merge values from both objects
    for(let cat of this.categoryType) {
      oldMedia[cat] = [...oldMedia[cat], ...newMedia[cat]]
    }
    return oldMedia
  }

  createPoll(): void {
    // Implement poll creation logic
  }

  addMedia(): void {
    this.uploadControlVisibility['image'] = true
    this.uploadControlVisibility['document'] = false
    this.uploadControlVisibility['link'] = false
  }

  addFile(): void {
    this.uploadControlVisibility['image'] = false
    this.uploadControlVisibility['document'] = true
    this.uploadControlVisibility['link'] = false
  }

  createLink(): void {
    this.uploadControlVisibility['image'] = false
    this.uploadControlVisibility['document'] = false
    this.uploadControlVisibility['link'] = true
  }

  onFileInputChange(event: any, category: string) {
    const files = event.target.files;
    if (files) {
      this.selectedFilesFinal[category] = this.selectedFilesFinal[category] || [];

      Array.from(files as FileList).forEach(file => {
        // Add to selectedFilesFinal
        const previewUrl = URL.createObjectURL(file as Blob);

        this.selectedFilesFinal[category].push({
          file: file,
          name: file.name,
          category: category,
          previewUrl: previewUrl,
          uploaded: false
        });

      });

      this.uploadForm.patchValue({
        files: this.selectedFilesFinal
      });

      this.updateCategory(category);
      if(this.categoryType && this.categoryType.length) {
        this.isMultiLine = true
      }
    }
  }

  updateCategory(type: string) {
    if (this.categoryType.indexOf(type) === -1) {
      this.categoryType.push(type)
    }
  }

  removeFileNew(index: number, category: string) {
    if (category) {
      if (this.selectedFilesFinal[category]) {
        this.selectedFilesFinal[category].splice(index, 1);
      }
    }

    this.uploadForm.patchValue({
      files: this.selectedFilesFinal
    });

    this.removeCategoryType(category)
  }

  removeCategoryType(category: string) {
    if(this.selectedFilesFinal[category] && this.selectedFilesFinal[category].length <= 0) {
      _.remove(this.categoryType, (cat) => cat === category);
    }
    if(this.categoryType && this.categoryType.length) {
      this.isMultiLine = true
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      // const formData = {
      //   ...this.uploadForm.value,
      //   // tags: this.selectedTags
      // };
      if (this.editMode) {
        this.handleEditFlow();
      } else {
        this.handlePostCreation();
      }
    }
  }

  private handlePostCreation(): void {
    switch (this.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.createPost();
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.createAnswerPost();
        break;
    }
  }

  createPost() {
    const req = this.createReq(this.uploadForm, this.type)
    this.discussV2Svc.createPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result);
          } else {
            this._snackBar.open('Post created successfully!')
            this.uploadForm.controls.description.setValue('')
          }
        }
      },
      error: (err: any) => {
        console.log('Create post failed', err);
      }
    });
  }

  createAnswerPost() {
    const req = this.createReq(this.uploadForm, this.type)
    this.discussV2Svc.createAnswerPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result);
          } else {
            this._snackBar.open('Post created successfully!')
            this.uploadForm.controls.description.setValue('')
            this.newComment.emit({result: res.result, type: res.result.type})
          }

        }
      },
      error: (err: any) => {
        console.log('Create post failed', err);
      }
    });
  }

  async uploadHandler(discussionId: string, postResult: any) {
    try {
      let temp: any = {}
      // Convert forEach to for...of for sequential processing
      for (const cat of this.categoryType) {
        // except link, for all follow below steps to upload and process URL
        if(cat !== 'link') {
          if (this.selectedFilesFinal[cat] && this.selectedFilesFinal[cat].length) {
            // Wait for all file uploads in this category to complete
            const uploadedUrls = await Promise.all(
              this.selectedFilesFinal[cat].map((fileObj: any) => {
                return new Promise<string>((resolve, reject) => {
                  if (fileObj.file) {
                    const formData = new FormData();
                    formData.append('file', fileObj.file);
                    const communityId = this.community.communityId || ''
                    this.discussV2Svc.uploadFile(formData, communityId, discussionId).subscribe({
                      next: (res: any) => {
                        if (res && res.result && res.result.url) {
                          const mainUrl = res.result.url.split(`discussionhub/`).pop() || ''
                          const finalURL = `${this.environment.contentHost}/${this.environment.dicussV2Bucket}/${mainUrl}`
                          resolve(finalURL);
                        } else {
                          reject('No URL in response');
                        }
                      },
                      error: (error) => reject(error)
                    });
                  } else {
                    resolve(fileObj.name);
                  }
                });
              })
            );
  
            temp[cat] = uploadedUrls;
          }
        } else{
          if(this.selectedFilesFinal['link'] && this.selectedFilesFinal['link'].length){
            temp['link'] = temp['link'] || []
            temp['link'] = this.selectedFilesFinal['link'].map((link:any) => {return link.previewUrl})
          }
        }
      }

      // After all categories are processed, update mediaCategory and call update
      this.mediaCategory = temp;
      this.handlePostUpdation(discussionId, postResult);
    } catch (error) {
      console.error('Error in upload handler:', error);
      this._snackBar.open('Error in upload handler')
    }
  }

  private handlePostUpdation(discussionId: string, postResult: any): void {
    switch (this.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.updatePostWithMediaUrls(discussionId, postResult);
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.updateAnswerPostWithMediaUrls(discussionId, postResult);
        break;
    }
  }

  updatePostWithMediaUrls(discussionId: string, postResult: any) {
    const communityId = postResult.communityId
    const updateReq = {
      discussionId,
      communityId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory
    };
    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post created successfully!')
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err);
        // Even if update fails, the post was created
        this._snackBar.open('Error updating post with media URLs')
      }
    });
  }

  updateAnswerPostWithMediaUrls(discussionId: string, _postResult: any) {
    const updateReq = {
      answerPostId: discussionId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory
    };

    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post created successfully!')
          this.newComment.emit({result: res.result, type: res.result.type})
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err);
        // Even if update fails, the post was created
        this._snackBar.open('Error updating post with media URLs')
      }
    });
  }

  createReq(formData: any, type: string) {
    const parentDiscussionId = this.hierarchyPath.length ? this.hierarchyPath[0] : ''
    const req = {
      type,
      ...(parentDiscussionId ? { parentDiscussionId: parentDiscussionId } : null),
      communityId: this.community.communityId || '',
      // title: formData.value.title,
      description: formData.value.description,
      // categoryType: [...this.categoryType],
      // mediaCategory: this.mediaCategory,
      // targetTopic: 'testing',
      // tags: this.selectedTags,
      // mediaUrls: this.mediaUrls || []
    }
    return req;
  }

  handleEditFlow() {
    switch (this.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.editPost();
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.editAnswerPost();
        break;
    }
  }

  private async editUploadHandler(discussionId: string) {
    try{
    const temp: any = {}
    for(const cat in this.selectedFilesFinal) {
      if(cat !== 'link'){
        if (this.selectedFilesFinal[cat] && this.selectedFilesFinal[cat].length) {
          const newFiles = this.selectedFilesFinal[cat].filter( (x: any) => !x.uploaded)
          // Wait for all file uploads in this category to complete
          const uploadedUrls = await Promise.all(
            newFiles.map((fileObj: any) => {
              return new Promise<string>((resolve, reject) => {
                if (fileObj.file) {
                  const formData = new FormData();
                  formData.append('file', fileObj.file);
                  const communityId = this.community.communityId || ''
                  this.discussV2Svc.uploadFile(formData, communityId, discussionId).subscribe({
                    next: (res: any) => {
                      if (res && res.result && res.result.url) {
                        const mainUrl = res.result.url.split(`discussionhub/`).pop() || ''
                        const finalURL = `${this.environment.contentHost}/${this.environment.dicussV2Bucket}/${mainUrl}`
                        resolve(finalURL);
                      } else {
                        reject('No URL in response');
                      }
                    },
                    error: (error) => reject(error)
                  });
                } else {
                  resolve(fileObj.name);
                }
              });
            })
          );
          temp[cat] = uploadedUrls;
        }
      } else {
        if(this.selectedFilesFinal['link'] && this.selectedFilesFinal['link'].length){
          temp['link'] = temp['link'] || []
          temp['link'] = this.selectedFilesFinal['link'].filter((l:any) => !l.uploaded).map((link:any) => {return link.previewUrl})
        }
      }
    }
    return temp
    } catch (error) {
      console.error('Error in edit  upload handler:', error);
    }


  }
  

  async editPost() {
    const newMedia = await this.editUploadHandler(this.post.discussionId);
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.post.mediaCategory)
    const updateReq = {
      discussionId: this.post.discussionId,
      communityId: this.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
    };

    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this._snackBar.open('Post updated successfully!')
        }
      },
      error: (err) => {
        console.error('Error updating post:', err);
        this._snackBar.open('Error updating post!')
      }
    });
  }

  async editAnswerPost() {
    const newMedia = await this.editUploadHandler(this.post.discussionId);
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.post.mediaCategory)
    const updateReq = {
      answerPostId: this.post.discussionId,
      // communityId: this.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
    };
    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this._snackBar.open('Post updated successfully!')
        }
      },
      error: (err) => {
        console.error('Error updating post:', err);
      }
    });
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

}
