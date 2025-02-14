import { Component, Inject, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'd-v2-new-post-dialogue',
  templateUrl: './new-post-dialogue.component.html',
  styleUrls: ['./new-post-dialogue.component.scss']
})
export class NewPostDialogueComponent implements OnInit, OnDestroy {
  widgetData!: NsDiscussionV2.IPostDetailsWidget | null
  uploadForm: FormGroup;
  selectedFilesFinal: any = {}
  links: string[] = [];
  selectedTags: string[] = [];
  linkInput: any
  uploadControlVisibility: any = {
    document: false,
    image: false,
    link: false
  }
  // mediaUrls: string[] = [];
  categoryType: string[] = []
  mediaCategory: any = {}
  previewCategory: any = {}
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  postPreview: any = {
    // title: '',
    description: '',
    createdOn: new Date(),
    files: [],
    tags: [],
    createdBy: {},
    categoryType: [],
    mediaCategory: {},
    previewCategory: {}
  }
  public Editor = ClassicEditor;
  public editorConfig = {
    plugins: [...ClassicEditor.builtinPlugins,],
    placeholder: 'What you want to say?',
    toolbarLocation: 'bottom',
    toolbar: {
      toolbarLocation: 'bottom',
      items: [
        'undo', 'redo',
        '|', 'heading',
        '|', 'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
        '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
        '|', 'alignment',
        'link', 'blockQuote', 'codeBlock',
        '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
      ],
      shouldNotGroupWhenFull: true
    },
    fontFamily: {
      supportAllValues: true,
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true
    },
  };
  environment: any


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewPostDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private discussV2Svc: DiscussionV2Service,
    @Inject('environment') environment: any
  ) {

    this.widgetData = this.data.config
    this.uploadForm = this.fb.group({
      community: [''],
      // title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      tags: [[]],
      files: [[]]
    });
    this.environment = environment

    if (this.data && this.data.editMode && this.data.post) {
      this.uploadForm.patchValue({
        // title: this.data.post.title,
        description: this.data.post.description,
        files: this.data.post.mediaUrls
      })

      // this.selectedFiles = this.data.post.mediaUrls.map((url: string) => ({
      //   name: url.split('/').slice(-1)[0],
      //   uploaded: true
      // }))
      if (this.data.post.mediaCategory && this.data.post.categoryType) {
        this.previewCategory = JSON.parse(JSON.stringify(this.data.post.mediaCategory))
        // this.mediaCategory = {...this.data.post.mediaCategory}
        this.categoryType = [...this.data.post.categoryType]
        this.categoryType.map((cat) => {
          if (this.data.post.mediaCategory[cat]) {
            this.selectedFilesFinal[cat] = this.selectedFilesFinal[cat] || []
            this.selectedFilesFinal[cat] = _.map(this.data.post.mediaCategory[cat] || [], function (url) {
              return {
                name: url.split('/').slice(-1)[0],
                uploaded: true,
                category: cat,
                previewUrl: url,
              }
            })
          }
        })
        this.selectedFilesFinal
      }
      this.updatePostPreview(this.uploadForm.value)
    }

    // Subscribe to form value changes
    this.uploadForm.valueChanges.subscribe(formValue => {
      this.updatePostPreview(formValue);
    });


  }

  ngOnInit(): void {
    // Set initial user data
    this.postPreview.user = {
      name: this.data.community?.currentUser?.name || '',
      photoUrl: this.data.community?.currentUser?.photoUrl || '',
      // Add other user properties you need
    };

  }

  private updatePostPreview(formValue: any): void {
    this.postPreview = {
      ...this.postPreview,
      // title: formValue.title,
      description: formValue.description,
      tags: this.selectedTags,
      files: formValue.files,
      categoryType: this.categoryType,
      mediaCategory: this.getLocalAndUploadedMerged(),
      updatedOn: new Date()
    };
    console.log('postPreview :', this.postPreview)
  }

  getLocalAndUploadedMerged() {
    const mergedCategory: { [key: string]: any[] } = {};
    // Merge values from both objects
    // for (const key in this.mediaCategory) {
    //   if (this.mediaCategory.hasOwnProperty(key)) {
    //     mergedCategory[key] = [...(this.mediaCategory[key] || []), ...(this.previewCategory[key] || [])];
    //   }
    // }

    // for (const key in this.previewCategory) {
    //   if (this.previewCategory.hasOwnProperty(key) && !mergedCategory.hasOwnProperty(key)) {
    //     mergedCategory[key] = [...(this.previewCategory[key] || [])];
    //   }
    // }

    for(const key of this.categoryType) {
      mergedCategory[key] = [...(this.mediaCategory[key] || []), ...(this.previewCategory[key] || [])]
    }
    return mergedCategory
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
      this.previewCategory[category] = this.previewCategory[category] || [];

      Array.from(files as FileList).forEach(file => {
        // Add to selectedFilesFinal
        const previewUrl = URL.createObjectURL(file as Blob);
        this.previewCategory[category].push(previewUrl);

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
      this.updatePostPreview(this.uploadForm.value);
    }
  }

  removeFileNew(index: number, category: string) {
    if (index && category) {
      if (this.selectedFilesFinal[category]) {
        this.selectedFilesFinal[category].splice(index, 1);
        this.previewCategory[category].splice(index, 1);
      }
    }

    this.uploadForm.patchValue({
      files: this.selectedFilesFinal
    });

    this.updatePostPreview(this.uploadForm.value);
    this.removeCategoryType(category)
  }

  removeCategoryType(category: string) {
    // if(this.mediaCategory && this.mediaCategory[category] && (this.mediaCategory[category].length === 0)) {
    //   delete this.mediaCategory[category]
    // }
    if(this.previewCategory[category] && this.previewCategory[category].length <= 0) {
      _.remove(this.categoryType, category);
    }
  }


  addNewUrl() {
    this.updateCategory('link')
    this.selectedFilesFinal['link'] = this.selectedFilesFinal['link'] || [];
    const value = (this.linkInput || '').trim();
    if (value) {
      this.selectedFilesFinal['link'] .push(value);
      // Update preview
      this.updatePostPreview(this.uploadForm.value);
    }
    // clearInput
  }

  removeUrl(index: number) {
    this.selectedFilesFinal['link'].splice(index, 1);
    // If all URLs are removed, add one empty field
    if (this.selectedFilesFinal['link'].length === 0) {
      _.remove(this.categoryType, 'link');
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedTags.push(value);
      // Update preview
      this.updatePostPreview(this.uploadForm.value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      // Update preview
      this.updatePostPreview(this.uploadForm.value);
    }
  }

  updateCategory(type: string) {
    if (this.categoryType.indexOf(type) === -1) {
      this.categoryType.push(type)
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = {
        ...this.uploadForm.value,
        // tags: this.selectedTags
      };
      console.log('Form submitted:', formData);
      if (this.data.editMode) {
        this.handleEditFlow();
      } else {
        this.handlePostCreation();
      }
    }
  }

  private handlePostCreation(): void {
    switch (this.data.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.createPost();
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.createAnswerPost();
        break;
    }
  }

  createPost() {
    const req = this.createReq(this.uploadForm, this.data.type)
    console.log('req:', req);
    this.discussV2Svc.createPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result);
          } else {
            this.dialogRef.close({ result: res.result, type: this.data.type });
          }
        }
      },
      error: (err: any) => {
        console.log('Create post failed', err);
      }
    });
  }

  createAnswerPost() {
    const req = this.createReq(this.uploadForm, this.data.type)
    console.log('req:', req);
    this.discussV2Svc.createAnswerPost(req).subscribe({
      next: (res) => {
        if (res && res.result) {
          const discussionId = res.result.discussionId; // Get the discussion ID
          if (this.categoryType.length) {
            this.uploadHandler(discussionId, res.result);
          } else {
            this.dialogRef.close({ result: res.result, type: this.data.type });
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
        if (this.selectedFilesFinal[cat] && this.selectedFilesFinal[cat].length) {
          // Wait for all file uploads in this category to complete
          const uploadedUrls = await Promise.all(
            this.selectedFilesFinal[cat].map((fileObj: any) => {
              return new Promise<string>((resolve, reject) => {
                if (fileObj.file) {
                  const formData = new FormData();
                  formData.append('file', fileObj.file);
                  const communityId = this.data.community.communityId || ''
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
          console.log('temp - ', temp);
        }
      }

      // After all categories are processed, update mediaCategory and call update
      this.mediaCategory = temp;
      this.handlePostUpdation(discussionId, postResult);
    } catch (error) {
      console.error('Error in upload handler:', error);
      this.dialogRef.close({ result: postResult, type: this.data.type });
    }
  }

  private handlePostUpdation(discussionId: string, postResult: any): void {
    console.log('discussionId', discussionId)
    console.log('postResult', postResult)
    switch (this.data.type) {
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
    console.log('updateReq', updateReq)
    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this.dialogRef.close({ result: res.result, type: this.data.type });
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err);
        // Even if update fails, the post was created
        this.dialogRef.close({ result: postResult, type: this.data.type });
      }
    });
  }

  updateAnswerPostWithMediaUrls(discussionId: string, postResult: any) {
    const updateReq = {
      answerPostId: discussionId,
      categoryType: this.categoryType,
      mediaCategory: this.mediaCategory
    };

    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res && res.result) {
          this.dialogRef.close({ result: res.result, type: this.data.type });
        }
      },
      error: (err) => {
        console.error('Error updating post with media URLs:', err);
        // Even if update fails, the post was created
        this.dialogRef.close({ result: postResult, type: this.data.type });
      }
    });
  }

  createReq(formData: any, type: string) {
    const req = {
      type,
      ...(this.data.parentDiscussionId ? { parentDiscussionId: this.data.parentDiscussionId } : null),
      communityId: this.data.community.communityId || '',
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
    switch (this.data.type) {
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
      if (this.selectedFilesFinal[cat] && this.selectedFilesFinal[cat].length) {
        const newFiles = this.selectedFilesFinal[cat].filter( (x: any) => !x.uploaded)
        // Wait for all file uploads in this category to complete
        const uploadedUrls = await Promise.all(
          newFiles.map((fileObj: any) => {
            return new Promise<string>((resolve, reject) => {
              if (fileObj.file) {
                const formData = new FormData();
                formData.append('file', fileObj.file);
                const communityId = this.data.community.communityId || ''
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
        console.log('temp - ', temp);
      }
    }
    return temp
    } catch (error) {
      console.error('Error in edit  upload handler:', error);
    }


  }
  

  async editPost() {
    const newMedia = await this.editUploadHandler(this.data.post.discussionId);
    console.log('newMedia', newMedia)
    console.log('this.mediaCategory', this.mediaCategory)
    console.log('this.slected final', this.selectedFilesFinal)
    console.log('this.slected final', this.data.post.mediaCategory)
    const mergedMediaCategory = this.getNewAndOldMerged(newMedia, this.data.post.mediaCategory)
    const updateReq = {
      discussionId: this.data.post.discussionId,
      communityId: this.data.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      categoryType: [...this.categoryType],
      mediaCategory: mergedMediaCategory,
      // tags: this.selectedTags
    };
    console.log('updateReq :', updateReq)

    this.discussV2Svc.updatePost(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this.dialogRef.close({ result: res.result, type: this.data.type });
        }
      },
      error: (err) => {
        console.error('Error updating post:', err);
      }
    });
  }

  async editAnswerPost() {
    // const mediaUrls = await this.handleEditWithFiles();
    const updateReq = {
      discussionId: this.data.post.discussionId,
      communityId: this.data.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      // mediaUrls,
      // tags: this.selectedTags
    };

    this.discussV2Svc.updateAnswerPost(updateReq).subscribe({
      next: (res) => {
        if (res?.result) {
          this.dialogRef.close({ result: res.result, type: this.data.type });
        }
      },
      error: (err) => {
        console.error('Error updating post:', err);
      }
    });
  }

  onReady(editor: any) {
    // You can customize the editor instance here
    editor.editing.view.change((writer: any) => {
      writer.setStyle(
        'min-height',
        '150px',
        editor.editing.view.document.getRoot()
      );
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


  // Clean up URLs when component is destroyed
  ngOnDestroy() {
    // Revoke all object URLs to prevent memory leaks
    for (const key in this.previewCategory) {
      if (this.previewCategory.hasOwnProperty(key)) {
        this.previewCategory[key].forEach((url: any) => URL.revokeObjectURL(url));
      }
    }
  }
}
