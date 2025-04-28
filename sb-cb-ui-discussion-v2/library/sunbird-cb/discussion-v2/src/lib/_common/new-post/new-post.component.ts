import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Input() isGlobal: boolean = false
  @Input() post: any
  @Input() parentPost!: any
  @Output() editEvents = new EventEmitter<any>()
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('description') description!: ElementRef;

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
  showEmojiPicker = false

  isMultiLine = false;
  commentMaxLength: any =1000
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  private readonly MAX_DOC_SIZE = 50 * 1024 * 1024;   // 50MB in bytes
  public readonly MAX_TOTAL_FILES = 10;


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
      description: ['', [Validators.required, Validators.maxLength(this.commentMaxLength)]],
      tags: [[]],
      files: [[]]
    });
    this.environment = environment
  }

  ngOnInit() {
    this.loogedInUserProfile = this.configSvc.userProfile
    this.loggedInUserData = this.configSvc.unMappedUser

    if(this.editMode) {
      this.uploadForm.patchValue({
        // title: this.post.title,
        description: this.post.description,
        files: this.post.mediaUrls
      })

      // this.selectedFiles = this.editData.post.mediaUrls.map((url: string) => ({
      //   name: url.split('/').slice(-1)[0],
      //   uploaded: true
      // }))
      if (this.post.mediaCategory && this.post.categoryType) {
        // this.mediaCategory = {...this.post.mediaCategory}
        this.categoryType = [...this.post.categoryType]
        this.categoryType.map((cat) => {
          if (this.post.mediaCategory[cat]) {
            this.selectedFilesFinal[cat] = this.selectedFilesFinal[cat] || []
            this.selectedFilesFinal[cat] = _.map(this.post.mediaCategory[cat] || [], function (url) {
              return {
                name: url.split('/').slice(-1)[0],
                uploaded: true,
                category: cat,
                previewUrl: url,
              }
            })
          }
        })
      }
      this.checkMultiline(this.post.description)
    }
      
  }

  ngOnDestroy() {
  }


  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }
  addEmoji(event: any) {
    const text = `${this.uploadForm.controls.description.value}${event.emoji.native}`
    this.uploadForm.patchValue({
      description: text
    })
    this.checkMultiline(this.uploadForm.controls.description.value)
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
        currentUser: {...this.loggedInUserData, ...this.loogedInUserProfile},
        isGlobal: this.isGlobal,
        parentPost: this.parentPost
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
      if(this.description && this.description.nativeElement) {
        this.description.nativeElement.style.minHeight = 'auto'
      }
    }
  }
  
  getNewAndOldMerged(newMedia: any, _oldMedia: any) {
    // Merge values from both objects
    let mergedVal: any = {}
    for(let cat of this.categoryType) {
      const oldUploaded = this.selectedFilesFinal[cat]
        .filter((x: any) => x.uploaded)
        .map((x: any) => x.previewUrl);
      // if(oldMedia[cat].uploaded) {
      mergedVal[cat] = []
      mergedVal[cat] = [...oldUploaded, ...newMedia[cat]]
      // }
    }
    return mergedVal
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

      // Calculate total files across all categories
      const totalFiles = (Object.values(this.selectedFilesFinal) as any[][])
        .reduce((sum: number, files: any[]) => sum + files.length, 0);

      // Check if adding new files would exceed the total limit
      if (totalFiles + files.length > this.MAX_TOTAL_FILES) {
        this._snackBar.open(`You can only upload up to ${this.MAX_TOTAL_FILES} files in total`, '', { duration: 3000 });
        return;
      }

      Array.from(files as FileList).forEach(file => {
        // Check file size
        const maxSize = category === 'image' ? this.MAX_IMAGE_SIZE : this.MAX_DOC_SIZE;
        if (file.size > maxSize) {
          const sizeInMB = maxSize / (1024 * 1024);
          this._snackBar.open(`${file.name} exceeds maximum ${category} size of ${sizeInMB}MB`, '', { duration: 3000 });
          return;
        }
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

  get getTotalFilesCount(): number {
    return (Object.values(this.selectedFilesFinal) as any[][])
      .reduce((sum: number, files: any[]) => sum + files.length, 0);
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
        if(this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
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
    if (this.uploadForm.valid || Object.keys(this.selectedFilesFinal).length > 0) {
      this.showEmojiPicker = false;
      if (this.editMode) {
      this.handleEditFlow();
      } else {
      this.handlePostCreation();
      }
    } else {
      this._snackBar.open('Please provide a description or select a file to proceed.', '', { duration: 3000 });
    }
  }
  onCancel() {
    this.editEvents.emit({
      cancelEdit : true
    })
  }

  private handlePostCreation(): void {
    // For identifying initial update at BE
    const isInitialUpload: boolean = true
    switch (this.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.createPost(isInitialUpload);
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.createAnswerPost(isInitialUpload);
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST_REPLY:
        this.createAnswerPostReply(isInitialUpload);
        break;
    }
  }

  createPost(isInitialUpload: boolean) {
    const req = this.createReq(this.uploadForm, this.type)
    this.discussV2Svc.createPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result, isInitialUpload);
          } else {
            this._snackBar.open('Post created successfully!')
            this.resetFormAndImages()
          }
        }
      },
      error: (err: any) => {
        console.log('Create post failed', err);
      }
    });
  }

  resetFormAndImages() {
    this.uploadForm.reset();
    this.selectedFilesFinal = {};
    this.categoryType = [];
    this.isMultiLine = false;
  }

  createAnswerPost(isInitialUpload: boolean) {
    const req = this.createReq(this.uploadForm, this.type)
    this.discussV2Svc.createAnswerPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result, isInitialUpload);
          } else {
            this._snackBar.open('Post created successfully!')
            this.uploadForm.controls.description.setValue('')
            this.newComment.emit({result: res.result, type: res.result.type})
            if(this.uploadForm && this.uploadForm.controls && this.uploadForm.controls.description){
              this.checkMultiline(this.uploadForm.controls.description.value)
            }
          }

        }
      },
      error: (err: any) => {
        console.log('Create post failed', err);
      }
    });
  }
  createAnswerPostReply(isInitialUpload: boolean) {
    const req = this.createReq(this.uploadForm, this.type)
    console.log('req: ', req, isInitialUpload)
    this.discussV2Svc.createAnswerPostReply(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result, isInitialUpload);
          } else {
            this._snackBar.open('Post created successfully!')
            this.uploadForm.controls.description.setValue('')
            this.newComment.emit({result: res.result, type: res.result.type})
            if(this.uploadForm && this.uploadForm.controls && this.uploadForm.controls.description){
              this.checkMultiline(this.uploadForm.controls.description.value)
            }
          }

        }
      },
      error: (err: any) => {
        console.log('Create post failed', err);
      }
    });
  }

  async uploadHandler(discussionId: string, postResult: any, isInitialUpload: boolean) {
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
                    const communityId = (this.community && this.community.communityId) || 
                    (this.post && this.post.communityId) || ''
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
      this.handlePostUpdation(discussionId, postResult, isInitialUpload);
    } catch (error) {
      console.error('Error in upload handler:', error);
      this._snackBar.open('Error in upload handler')
    }
  }

  private handlePostUpdation(discussionId: string, postResult: any, isInitialUpload: boolean): void {
    switch (this.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.updatePostWithMediaUrls(discussionId, postResult, isInitialUpload);
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.updateAnswerPostWithMediaUrls(discussionId, postResult, isInitialUpload);
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST_REPLY:
        this.updateAnswerPostReplyWithMediaUrls(discussionId, postResult, isInitialUpload);
        break;
    }
  }

  updatePostWithMediaUrls(discussionId: string, postResult: any, isInitialUpload: boolean) {
    const communityId = postResult.communityId
    const updateReq = {
      discussionId,
      communityId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory,
      ...(isInitialUpload ? { isInitialUpload: true } : null),
    };
    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post created successfully!')
          this.newComment.emit({result: res.result, type: res.result.type})
          this.resetFormAndImages()
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err);
        // Even if update fails, the post was created
        this._snackBar.open('Error updating post with media URLs')
      }
    });
  }

  updateAnswerPostWithMediaUrls(discussionId: string, _postResult: any, isInitialUpload: boolean) {
    const updateReq = {
      answerPostId: discussionId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory,
      ...(isInitialUpload ? { isInitialUpload: true } : null),
    };

    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post created successfully!')
          this.resetFormAndImages()
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

  updateAnswerPostReplyWithMediaUrls(discussionId: string, _postResult: any, isInitialUpload: boolean) {
    const updateReq = {
      answerPostReplyId: discussionId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory,
      ...(isInitialUpload ? { isInitialUpload: true } : null),
    };

    this.discussV2Svc.updateAnswerPostReply(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this._snackBar.open('Post created successfully!')
          this.resetFormAndImages()
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
      ...(parentDiscussionId && (type !== NsDiscussionV2.EPostType.ANSWER_POST_REPLY) ?
         { parentDiscussionId: parentDiscussionId } : null),
      ...(parentDiscussionId && (type === NsDiscussionV2.EPostType.ANSWER_POST_REPLY) ?
          { parentAnswerPostId: parentDiscussionId, parentDiscussionId: this.parentPost.discussionId || '' } : null),
      communityId: (this.community && this.community.communityId) || 
      (this.post && this.post.communityId) || '',
      // title: formData.value.title,
      description: formData.value.description || '',
      // categoryType: [...this.categoryType],
      // mediaCategory: this.mediaCategory,
      // targetTopic: 'testing',
      // tags: this.selectedTags,
      // mediaUrls: this.mediaUrls || []
      ...((this.taggedUsers && this.taggedUsers.length)  ? { taggedUser: this.taggedUsers.map((x: any)=>x.user_id) } : null),
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
      case NsDiscussionV2.EPostType.ANSWER_POST_REPLY:
        this.editAnswerPostReply();
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
                  const communityId = (this.community && this.community.communityId) || 
                    (this.post && this.post.communityId) || ''
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
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.post.mediaCategory )
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
          this.editEvents.emit({
            cancelEdit : false,
            edit: true,
            post: res.result
          })
        }
      },
      error: (err) => {
        console.error('Error updating post:', err);
      }
    });
  }

  async editAnswerPostReply() {
    const newMedia = await this.editUploadHandler(this.post.discussionId);
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.post.mediaCategory)
    const updateReq = {
      answerPostReplyId: this.post.discussionId,
      // communityId: this.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
    };
    this.discussV2Svc.updateAnswerPostReply(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this._snackBar.open('Post updated successfully!')
          this.editEvents.emit({
            cancelEdit : false,
            edit: true,
            post: res.result
          })
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
