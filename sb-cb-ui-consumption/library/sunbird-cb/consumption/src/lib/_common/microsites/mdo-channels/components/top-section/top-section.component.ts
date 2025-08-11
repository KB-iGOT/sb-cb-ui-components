import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.scss']
})
export class TopSectionComponent implements OnInit {
  descriptionMaxLength = 500;
  stripWidth: string;
  // data
  // channelName
  // orgId
  // isMobile
  // slwConfig
  // isEdit
  // eventCallback
  constructor(
    @Inject('sectionData') 
    private data: any,
    @Inject('channelName') 
    private channelName: string,
    @Inject('orgId') 
    private orgId: string,
    @Inject('isMobile') 
    private isMobile: boolean,
    @Inject('slwConfiguration') 
    private slwConfig: any,
    @Inject('isEdit') 
    private isEdit: boolean,
    @Inject('eventCallback') 
    private eventCallback: (event: any) => void,
    private sanitizer: DomSanitizer
  ) {
    // Remove console logs in production
    if (this.isEdit) {
      console.log('Edit mode active for top section');
    }
  }

  ngOnInit() {
    this.stripWidth = `${(window.innerWidth - 1200 + 135)/2}px`;
  }
  
  emitEvent(action: string, id: string, data?: any) {
    this.eventCallback({
      action,
      source: 'topSection',
      id,
      data: data || this.data
    });
  }

  /**
   * Open editor for a specific field
   * @param fieldName Name of the field to edit
   * @param displayName Display name for the field
   * @param currentValue Current value of the field
   */
  openEditor(fieldName: string, displayName: string, currentValue: any) {
    this.eventCallback({
      action: 'edit',
      source: 'topSection',
      id: fieldName,
      data: {
        fieldName,
        displayName,
        currentValue,
        path: fieldName, // Path in the data object
        fieldType: this.getFieldType(fieldName, currentValue),
        parentData: this.data
      }
    });
  }

  /**
   * Determine the field type based on field name and value
   */
  private getFieldType(fieldName: string, value: any): string {
    if (fieldName === 'logo' || fieldName === 'logoMobile' || fieldName.includes('banner')) {
      return 'image';
    } else if (fieldName === 'sliderData') {
      return 'slider';
    } else if (fieldName === 'metrics') {
      return 'metrics';
    } else if (typeof value === 'string' && value.startsWith('#')) {
      return 'color';
    } else if (typeof value === 'boolean') {
      return 'boolean';
    } else if (fieldName.includes('description')) {
      return 'textarea';
    } else {
      return 'text';
    }
  }
}