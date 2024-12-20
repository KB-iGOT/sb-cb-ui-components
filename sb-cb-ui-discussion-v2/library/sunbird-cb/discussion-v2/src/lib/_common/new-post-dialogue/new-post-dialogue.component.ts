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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewPostDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private discussV2Svc: DiscussionV2Service,
  ) {
    this.uploadForm = this.fb.group({
      community: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      tags: [[]],
      files: [[]]
    });
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
      // Add new files to uploadedFiles array
      this.uploadedFiles.push(...Array.from(files as FileList));
      // Update form control
      this.uploadForm.patchValue({
        files: this.uploadedFiles
      });
    }
  }

  removeFile(index: number) {
    // Remove file from array
    this.uploadedFiles.splice(index, 1);
    
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
        tags: this.selectedTags,
        files: this.selectedFiles
      };
      console.log('Form submitted:', formData);

      switch (this.data.type) {
        case NsDiscussionV2.EPostType.QUESTION:
          this.createPost();
          break;
        case NsDiscussionV2.EPostType.ANSWER_POST:
          this.createAnswerPost();
          break;
        default:
          this.data.type = NsDiscussionV2.EPostType.QUESTION;
          break;
      }
      
      
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
      ...(this.data.parentDiscussionId? {parentDiscussionId: this.data.parentDiscussionId}: null),
      ...this.uploadForm.value,
      targetTopic: 'testing',
      tags: formData.tags,
      mediaUrls: ['https://picsum.photos/id/11/500/300', 'https://picsum.photos/id/12/500/300']
    }
    return req
  }
}
