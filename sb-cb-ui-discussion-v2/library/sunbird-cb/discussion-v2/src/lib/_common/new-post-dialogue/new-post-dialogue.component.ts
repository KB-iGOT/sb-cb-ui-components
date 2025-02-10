import { Component, Inject, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';

interface UploadFile {
  file?: File;
  uploaded?: boolean;
  name: string;
}

@Component({
  selector: 'd-v2-new-post-dialogue',
  templateUrl: './new-post-dialogue.component.html',
  styleUrls: ['./new-post-dialogue.component.scss']
})
export class NewPostDialogueComponent implements OnInit, OnDestroy {
  widgetData!: NsDiscussionV2.IPostDetailsWidget | null
  uploadForm: FormGroup;
  selectedFiles: UploadFile[] = [];
  selectedTags: string[] = [];
  showFileUpload = false;
  showMediaUpload = false
  showDocumentUpload = false
  showLinkCreate = false
  mediaUrls: string[] = [];
  previewUrls: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  postPreview: any = {
    // title: '',
    description: '',
    createdOn: new Date(),
    files: [],
    mediaUrls: [],
    tags: [],
    createdBy: {}
  }
  public Editor = ClassicEditor;
  public editorConfig = {
    plugins: [...ClassicEditor.builtinPlugins, ],
    placeholder: 'What you want to say?',
    toolbar: {
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

    if(this.data && this.data.editMode && this.data.post) {
      this.uploadForm.patchValue({
        // title: this.data.post.title,
        description: this.data.post.description,
        files: this.data.post.mediaUrls
      })
      this.selectedFiles = this.data.post.mediaUrls.map((url: string) => ({
        name: url.split('/').slice(-1)[0],
        uploaded: true
      }))
      if (this.selectedFiles.length) {
        this.showMediaUpload = true
        this.previewUrls = [...this.data.post.mediaUrls]
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
      files: this.selectedFiles,
      mediaUrls: [...this.previewUrls, ...this.mediaUrls],
      updatedOn: new Date()
    };
  }

  createPoll(): void {
    // Implement poll creation logic
  }

  addMedia(): void {
    this.showMediaUpload = true;
    this.showDocumentUpload = false;
    this.showLinkCreate = false;
  }

  addFile(): void {
    this.showDocumentUpload = true;
    this.showMediaUpload = false;
    this.showLinkCreate = false;
  }

  createLink(): void {
    this.showLinkCreate = true;
    this.showDocumentUpload = false;
    this.showMediaUpload = false;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles.push(...Array.from(files as FileList).map(file => ({
        file: file,  // Store the original File object
        name: file.name,
        uploaded: false
      })));
      
      Array.from(files as FileList).forEach(file => {
        const previewUrl = URL.createObjectURL(file as Blob);
        this.previewUrls.push(previewUrl);
      });
  
      this.uploadForm.patchValue({
        files: this.selectedFiles
      });
      
      this.updatePostPreview(this.uploadForm.value);
    }
  }

  onDocSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles.push(...Array.from(files as FileList).map(file => ({
        file: file,  // Store the original File object
        name: file.name,
        uploaded: false
      })));
      
      Array.from(files as FileList).forEach(file => {
        const previewUrl = URL.createObjectURL(file as Blob);
        this.previewUrls.push(previewUrl);
      });
  
      this.uploadForm.patchValue({
        files: this.selectedFiles
      });
      
      this.updatePostPreview(this.uploadForm.value);
    }
  }

  removeFile(index: number) {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(this.previewUrls[index]);
    
    // Remove from both arrays
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);

    this.uploadForm.patchValue({
      files: this.selectedFiles
    });
    
    this.updatePostPreview(this.uploadForm.value);

    if (this.selectedFiles.length === 0) {
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  removeDoc(index: number) {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(this.previewUrls[index]);
    
    // Remove from both arrays
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);

    this.uploadForm.patchValue({
      files: this.selectedFiles
    });
    
    this.updatePostPreview(this.uploadForm.value);

    if (this.selectedFiles.length === 0) {
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
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

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = {
        ...this.uploadForm.value,
        // tags: this.selectedTags
      };
      console.log('Form submitted:', formData);
      if(this.data.editMode){
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
          if (this.selectedFiles.length > 0) {
            this.uploadImages(discussionId, res.result);
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
          if (this.selectedFiles.length > 0) {
            this.uploadImages(discussionId, res.result);
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

  uploadImages(discussionId: string, postResult: any) {
    if (this.selectedFiles.length === 0) {
      return;
    }

    console.log('selectedFiles:', this.selectedFiles)

    const uploadPromises = this.selectedFiles.map(fileObj => {
      return new Promise<string>((resolve, reject) => {
        // Create FormData object to properly send the file
        const formData = new FormData();
        // Append file with a specific field name that API expects
        if (fileObj.file) {
          formData.append('file', fileObj.file);
          const communityId = this.data.community.communityId || ''
          this.discussV2Svc.uploadFile(formData, communityId, discussionId).subscribe({
          next: (res: any) => {
            if (res && res.result && res.result.url) {
              const mainUrl = res.result.url.split(`discussionhub/`).pop() || ''
              // const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
              const finalURL = `${this.environment.contentHost}/${this.environment.dicussV2Bucket}/${mainUrl}`
              console.log('finalURL: ', finalURL)
              resolve(finalURL);
            } else {
              reject('No URL in response');
            }
          },
          error: (error) => reject(error)
          });
        } else {
          // If it's an already uploaded file, resolve with the name
          resolve(fileObj.name);
        }
      });
    });

    Promise.all(uploadPromises)
      .then(uploadedUrls => {
        this.mediaUrls = uploadedUrls;
        console.log('this.mediaUrls', this.mediaUrls);
        this.handlePostUpdation(discussionId, postResult);
      })
      .catch(error => {
        console.error('Error uploading files:', error);
        // Even if image upload fails, the post was created
        this.dialogRef.close({ result: postResult, type: this.data.type });
      });
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
      mediaUrls: this.mediaUrls
    };
    
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
      mediaUrls: this.mediaUrls
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
      targetTopic: 'testing',
      tags: this.selectedTags,
      // mediaUrls: this.mediaUrls || []
    }
    return req;
  }

  handleEditFlow(){
    switch (this.data.type) {
      case NsDiscussionV2.EPostType.QUESTION:
        this.editPost();
        break;
      case NsDiscussionV2.EPostType.ANSWER_POST:
        this.editAnswerPost();
        break;
    }
  }

  private async handleEditWithFiles(): Promise<string[]> {
    const newFiles = this.selectedFiles.filter(file => !file.uploaded);
    
    if (newFiles.length > 0) {
      try {
        const uploadPromises = newFiles.map(fileObj => {
          const formData = new FormData();
          if (fileObj.file) {
            formData.append('file', fileObj.file);
            const communityId = this.data.community.communityId || '';
            return new Promise<string>((resolve, reject) => {
              this.discussV2Svc.uploadFile(formData, communityId, this.data.post.discussionId).subscribe({
                next: (res: any) => {
                  if (res?.result?.url) {
                    const mainUrl = res.result.url.split(`discussionhub/`).pop() || '';
                    const finalURL = `${this.environment.contentHost}/${this.environment.dicussV2Bucket}/${mainUrl}`;
                    resolve(finalURL);
                  } else {
                    reject('No URL in response');
                  }
                },
                error: (error) => reject(error)
              });
            });
          } else {
            return Promise.resolve(fileObj.name);
          }
        });

        const newUrls = await Promise.all(uploadPromises);
        // Keep the full URLs for existing files instead of just names
        const existingUrls = this.selectedFiles
          .filter(file => file.uploaded)
          .map(file => this.data.post.mediaUrls.find((url: string) => url.includes(file.name)) || file.name);
        return [...existingUrls, ...newUrls];
      } catch (error) {
        console.error('Error uploading new files:', error);
        return [];
      }
    }
    
    // If no new files, return the existing full URLs
    return this.selectedFiles
      .filter(file => file.uploaded)
      .map(file => this.data.post.mediaUrls.find((url: string) => url.includes(file.name)) || file.name);
  }

  async editPost() {
    const mediaUrls = await this.handleEditWithFiles();
    const updateReq = {
      discussionId: this.data.post.discussionId,
      communityId: this.data.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      mediaUrls,
      tags: this.selectedTags
    };

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
    const mediaUrls = await this.handleEditWithFiles();
    const updateReq = {
      discussionId: this.data.post.discussionId,
      communityId: this.data.post.communityId,
      // title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      mediaUrls,
      tags: this.selectedTags
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

  // Clean up URLs when component is destroyed
  ngOnDestroy() {
    // Revoke all object URLs to prevent memory leaks
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }
}
