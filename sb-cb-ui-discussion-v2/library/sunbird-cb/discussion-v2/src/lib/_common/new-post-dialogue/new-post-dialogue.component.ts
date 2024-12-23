import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { NsDiscussionV2 } from '../../_model/discussion-v2.model';

@Component({
  selector: 'd-v2-new-post-dialogue',
  templateUrl: './new-post-dialogue.component.html',
  styleUrls: ['./new-post-dialogue.component.scss']
})
export class NewPostDialogueComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  selectedTags: string[] = [];
  showFileUpload = false;
  mediaUrls: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  uploadedFiles: File[] = [];
  // public Editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'link',
        '|',
        'undo',
        'redo'
      ]
    },
    placeholder: 'Type the description here...'
  };
  environment: any

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewPostDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private discussV2Svc: DiscussionV2Service,
    @Inject('environment') environment: any
  ) {
    this.uploadForm = this.fb.group({
      community: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      tags: [[]],
      files: [[]]
    });
    this.environment = environment
  }

  ngOnInit(): void {}

  createPoll(): void {
    // Implement poll creation logic
  }

  addMedia(): void {
    this.showFileUpload = true;
  }

  addFile(): void {
    this.showFileUpload = true;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      // Add new files to both arrays
      this.uploadedFiles.push(...Array.from(files as FileList));
      this.selectedFiles.push(...Array.from(files as FileList));
      // Update form control
      this.uploadForm.patchValue({
        files: this.uploadedFiles
      });
    }
  }

  removeFile(index: number) {
    // Remove file from both arrays
    this.uploadedFiles.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    
    // Update form control with new array
    this.uploadForm.patchValue({
      files: this.uploadedFiles
    });

    // If no files left and you want to reset the input
    if (this.uploadedFiles.length === 0) {
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
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      const formData = {
        ...this.uploadForm.value,
        tags: this.selectedTags
      };
      console.log('Form submitted:', formData);
      this.uploadImages();
    }
  }

  uploadImages() {
    if (this.selectedFiles.length === 0) {
      this.handlePostCreation();
      return;
    }

    console.log('selectedFiles:', this.selectedFiles)

    const uploadPromises = this.selectedFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        // Create FormData object to properly send the file
        const formData = new FormData();
        formData.append('file', file);
        
        this.discussV2Svc.uploadFile(formData).subscribe({
          next: (res: any) => {
            if (res && res.result && res.result.url) {
              const mainUrl = res.result.url.split(`discussionhub/`).pop() || ''
              // const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
              const finalURL = `${this.environment.contentHost}/content-store/discussionhub/${mainUrl}`
              
              console.log('finalURL: ',finalURL)
              resolve(finalURL);
            } else {
              reject('No URL in response');
            }
          },
          error: (error) => reject(error)
        });
      });
    });

    Promise.all(uploadPromises)
      .then(uploadedUrls => {
        this.mediaUrls = uploadedUrls;
        console.log('this.mediaUrls', this.mediaUrls)
        this.handlePostCreation();
      })
      .catch(error => {
        console.error('Error uploading files:', error);
        // Handle error appropriately
      });
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

  // create question post
  createPost() {
    const req = this.createReq(this.uploadForm, this.data.type)
    console.log('req:', req);
    this.discussV2Svc.createPost(req).subscribe(res => {
      if(res && res.result){
        this.dialogRef.close({result: res.result, type: this.data.type})
      }
    }, (err: any) => {
      console.log('Create post failed', err)
    })
  }

  // create answer post
  createAnswerPost() {
    const req = this.createReq(this.uploadForm, this.data.type)
    console.log('req:', req);
    this.discussV2Svc.createAnswerPost(req).subscribe(res => {
      if(res && res.result){
        this.dialogRef.close({result: res.result, type: this.data.type})
      }
    }, (err: any) => {
      console.log('Create post failed', err)
    })
  }

  createReq(formData: any, type: string) {
    const req = {
      type,
      ...(this.data.parentDiscussionId ? {parentDiscussionId: this.data.parentDiscussionId} : null),
      community: formData.value.community,
      title: formData.value.title,
      description: formData.value.description,
      targetTopic: 'testing',
      tags: this.selectedTags,
      mediaUrls: this.mediaUrls || []
    }
    return req;
  }
}
