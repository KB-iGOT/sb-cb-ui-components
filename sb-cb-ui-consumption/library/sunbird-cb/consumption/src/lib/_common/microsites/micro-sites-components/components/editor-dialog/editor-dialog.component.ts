import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface SliderItem {
  active: boolean;
  banners: {
    l: string;
    m: string;
    s: string;
    xl: string;
    xs: string;
    xxl: string;
  };
  redirectUrl: string;
  queryParams: any;
  title: string;
}

interface SliderData {
  sliders: SliderItem[];
  styleData: any;
}

@Component({
  selector: 'app-editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.scss']
})
export class EditorDialogComponent implements OnInit {
  editorForm: FormGroup;
  formType: string;
  uploadStatus: string = '';
  isUploading: boolean = false;
  
  // Slider specific properties
  sliderData: SliderData = { 
    sliders: [], 
    styleData: { 
      dots: true, 
      infinite: true, 
      speed: 500, 
      slidesToShow: 1, 
      slidesToScroll: 1 
    } 
  };
  sliderItemForm: FormGroup;
  isEditingSlider: boolean = false;
  editingIndex: number = -1;
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formType = data.fieldType || 'text';
  }
  
  ngOnInit() {
    this.initForm();
    this.initSliderItemForm();
  }
  
  initForm() {
    // Create form based on field type
    switch (this.formType) {
      case 'textarea':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        });
        break;
      case 'color':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]]
        });
        break;
      case 'image':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        });
        break;
      case 'boolean':
        this.editorForm = this.fb.group({
          value: [!!this.data.value]
        });
        break;
      case 'metrics':
        this.editorForm = this.fb.group({
          value: [this.data.value]
        });
        break;
      case 'slider':
        // Initialize slider data from the input or use defaults
        if (this.data.value && this.data.value.sliders && this.data.value.styleData) {
          this.sliderData = this.data.value;
        } else if (this.data.sliderData) {
          this.sliderData = this.data.sliderData;
        }
        
        this.editorForm = this.fb.group({
          value: [this.sliderData]
        });
        break;
      default:
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        });
    }
  }
  
  initSliderItemForm(item?: SliderItem) {
    this.sliderItemForm = this.fb.group({
      active: [item?.active !== undefined ? item.active : true],
      banners: this.fb.group({
        l: [item?.banners?.l || '', [Validators.required]],
        m: [item?.banners?.m || ''],
        s: [item?.banners?.s || ''],
        xl: [item?.banners?.xl || ''],
        xs: [item?.banners?.xs || ''],
        xxl: [item?.banners?.xxl || '']
      }),
      redirectUrl: [item?.redirectUrl || ''],
      queryParams: [item?.queryParams || {}],
      title: [item?.title || '']
    });
  }
  
  // General image upload methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }
  
  uploadImage(file: File) {
    this.isUploading = true;
    this.uploadStatus = 'Uploading...';
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Headers as specified in the curl command
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'locale': 'en',
      'org': 'dopt',
      'rootOrg': 'igot'
    });
    
    this.http.post<any>('http://localhost:3000/apis/proxies/v8/storage/orgStoreUpload', formData, { headers })
      .subscribe({
        next: (response) => {
          this.isUploading = false;
          
          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            const transformedUrl = this.transformImageUrl(response.result.url);
            
            // Update the form with the new URL
            this.editorForm.get('value')?.setValue(transformedUrl);
            this.uploadStatus = 'Upload successful!';
            
            // Clear status after 3 seconds
            setTimeout(() => {
              this.uploadStatus = '';
            }, 3000);
          } else {
            this.uploadStatus = 'Upload failed. Invalid response.';
          }
        },
        error: (error) => {
          this.isUploading = false;
          this.uploadStatus = 'Upload failed. Please try again.';
          console.error('Upload error:', error);
        }
      });
  }
  
  // Slider specific methods
  onSliderClick(event: any) {
    console.log('Slider click:', event);
  }
  
  onSliderImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadSliderImage(file);
    }
  }
  
  uploadSliderImage(file: File) {
    this.uploadStatus = 'Uploading...';
    
    const formData = new FormData();
    formData.append('file', file);
    
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'locale': 'en',
      'org': 'dopt',
      'rootOrg': 'igot'
    });
    
    this.http.post<any>('http://localhost:3000/apis/proxies/v8/storage/orgStoreUpload', formData, { headers })
      .subscribe({
        next: (response) => {
          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            const transformedUrl = this.transformImageUrl(response.result.url);
            
            // Update all banner sizes with the same URL
            const bannersControl = this.sliderItemForm.get('banners');
            if (bannersControl) {
              bannersControl.get('l')?.setValue(transformedUrl);
              bannersControl.get('m')?.setValue(transformedUrl);
              bannersControl.get('s')?.setValue(transformedUrl);
              bannersControl.get('xl')?.setValue(transformedUrl);
              bannersControl.get('xs')?.setValue(transformedUrl);
              bannersControl.get('xxl')?.setValue(transformedUrl);
            }
            
            this.uploadStatus = 'Upload successful!';
            
            // Clear status after 3 seconds
            setTimeout(() => {
              this.uploadStatus = '';
            }, 3000);
          } else {
            this.uploadStatus = 'Upload failed. Invalid response.';
          }
        },
        error: (error) => {
          this.uploadStatus = 'Upload failed. Please try again.';
          console.error('Upload error:', error);
        }
      });
  }
  
  addSliderItem() {
    this.isEditingSlider = true;
    this.editingIndex = -1;
    this.initSliderItemForm();
  }
  
  editSliderItem(index: number) {
    this.isEditingSlider = true;
    this.editingIndex = index;
    this.initSliderItemForm(this.sliderData.sliders[index]);
  }
  
  removeSliderItem(index: number) {
    this.sliderData.sliders.splice(index, 1);
    this.updateEditorFormValue();
  }
  
  saveSliderItem() {
    if (this.sliderItemForm.valid) {
      const item: SliderItem = this.sliderItemForm.value;
      
      // Ensure all banner sizes have the same URL if not already set
      const mainImageUrl = item.banners.l;
      if (mainImageUrl) {
        item.banners.m = item.banners.m || mainImageUrl;
        item.banners.s = item.banners.s || mainImageUrl;
        item.banners.xl = item.banners.xl || mainImageUrl;
        item.banners.xs = item.banners.xs || mainImageUrl;
        item.banners.xxl = item.banners.xxl || mainImageUrl;
      }
      
      // Ensure queryParams is an object
      if (!item.queryParams || typeof item.queryParams !== 'object') {
        item.queryParams = {};
      }
      
      if (this.editingIndex === -1) {
        // Add new item
        this.sliderData.sliders.push(item);
      } else {
        // Update existing item
        this.sliderData.sliders[this.editingIndex] = item;
      }
      
      this.updateEditorFormValue();
      this.cancelSliderItemEdit();
    }
  }
  
  cancelSliderItemEdit() {
    this.isEditingSlider = false;
    this.editingIndex = -1;
  }
  
  updateEditorFormValue() {
    // Update the main form with the new slider data
    this.editorForm.get('value')?.setValue({...this.sliderData});
  }
  
  transformImageUrl(originalUrl: string): string {
    // Replace 'https://storage.googleapis.com/igotqa/' with 'https://portal.qa.karmayogibharat.net/content-store/'
    return originalUrl.replace('https://storage.googleapis.com/igotqa/', 'https://portal.qa.karmayogibharat.net/content-store/');
  }
  
  onSubmit() {
    if (this.editorForm.valid) {
      this.dialogRef.close(this.editorForm.value.value);
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }
  
  dropSliderItem(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sliderData.sliders, event.previousIndex, event.currentIndex);
    this.updateEditorFormValue();
  }
}