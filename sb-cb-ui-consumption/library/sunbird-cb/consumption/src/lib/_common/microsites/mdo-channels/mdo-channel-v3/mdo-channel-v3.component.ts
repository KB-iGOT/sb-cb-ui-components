import { Component, OnInit, Input, Injector, Type, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2';
import { UtilityService } from '@sunbird-cb/utils-v2';
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { EditorDialogComponent } from '../components/editor-dialog/editor-dialog.component';
import { cloneDeep } from 'lodash';

// Import component types
import { TopSectionComponent } from '../components/top-section/top-section.component';
import { LookerSectionComponent } from '../components/looker-section/looker-section.component';
import { TopLearnersComponent } from '../components/top-learners/top-learners.component';
import { MainContentComponent } from '../components/main-content/main-content.component';
import { SupportSectionComponent } from '../components/support-section/support-section.component';

@Component({
  selector: 'sb-uic-mdo-channel-v3',
  templateUrl: './mdo-channel-v3.component.html',
  styleUrls: ['./mdo-channel-v3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdoChannelV3Component implements OnInit, OnChanges {
  @Input() sectionList: any[] = [];
  @Input() slwConfiguration: any;
  @Input() isEdit: boolean = false;
  activeSections: any[] = [];
  @Input() providerId: string = '123456789';
  @Input() channelName: string;
  @Input() orgId: string;
  
  isMobile: boolean = false;
  
  navigationTitles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: 'MDO Channels', url: '/app/learn/mdo-channels/all-channels', icon: '', disableTranslate: true }
  ];
  
  private componentRegistry: {[key: string]: Type<any>} = {
    'topSection': TopSectionComponent,
    'lookerSection': LookerSectionComponent,
    'topLearners': TopLearnersComponent,
    'mainContent': MainContentComponent,
    'supportSection': SupportSectionComponent
  };
  
  private _eventCallbackFn: (event: any) => void;
  private injectorCache: Map<string, Injector> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langTranslations: MultilingualTranslationsService,
    public configSvc: ConfigurationsService,
    private sanitizer: DomSanitizer,
    private utilsSvc: UtilityService,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog // Add this
  ) {
    this.isMobile = this.utilsSvc.isMobile;
  }
  
  ngOnInit() {
    // Get active sections
    this.activeSections = this.sectionList?.filter(section => section.enabled)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
    
    // Get channel info from route
    this.route.params.subscribe(params => {
      debugger
      if (params.channelId) {
        
        this.channelName = params.channelName || '';
        this.orgId = params.channelId;
        this.cdr.markForCheck();
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.sectionList || changes.slwConfiguration) {
      // Clear injector cache when inputs change
      this.injectorCache.clear();
    }
  }
  
  handleSectionEvent(event: any) {
    // Handle events from child components
    console.log('Section event:', event);
    
    // Raise telemetry for the event
    if (event.action) {
      this.raiseTelemetry(`${event.source}-${event.id}`);
    }
    
    // Handle specific events
    if (event.action === 'view-all' && event.data?.viewMoreUrl) {
      this.router.navigateByUrl(event.data.viewMoreUrl);
    }
    
    // Handle edit events
    if (event.action === 'edit') {
      this.openEditorDialog(event);
    }
  }
  
  getSectionComponent(key: string): Type<any> {
    return this.componentRegistry[key] || null;
  }
  
  createInjector(section: any, column: any): Injector {
    // Create a stable reference to the callback function
    if (!this._eventCallbackFn) {
      this._eventCallbackFn = (event: any) => this.handleSectionEvent(event);
    }

    // Create a cache key based on section and column keys
    const cacheKey = `${section.key}-${column.key}`;
    
    // Return cached injector if available
    if (this.injectorCache.has(cacheKey)) {
      return this.injectorCache.get(cacheKey)!;
    }

    // Create new injector
    const injector = Injector.create({
      providers: [
        { provide: 'sectionData', useValue: column.data },
        { provide: 'channelName', useValue: this.channelName },
        { provide: 'orgId', useValue: this.orgId },
        { provide: 'isMobile', useValue: this.isMobile },
        ...(this.isEdit ? [{ provide: 'isEdit', useValue: this.isEdit }] : [{ provide: 'isEdit', useValue: this.isEdit }]),
        { provide: 'slwConfiguration', useValue: this.slwConfiguration },
        { provide: 'providerId', useValue: this.orgId },
        { provide: 'eventCallback', useValue: this._eventCallbackFn }
      ],
      parent: this.injector
    });
    
    // Cache the injector
    this.injectorCache.set(cacheKey, injector);
    
    return injector;
  }
  
  trackByFn(index: number, item: any): any {
    return item.key || index;
  }
  
  raiseTelemetry(name: string) {
    this.eventSvc.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-channel',
        id: `${_.kebabCase(name).toLowerCase()}`
      },
      {},
      { module: 'LEARN' }
    );
  }

  // Add new method to handle edit dialog
  openEditorDialog(event: any) {
    const dialogRef = this.dialog.open(EditorDialogComponent, {
      width: this.getDialogWidth(event.data.fieldType),
      data: {
        fieldName: event.data.fieldName,
        displayName: event.data.displayName,
        value: event.data.currentValue,
        fieldType: event.data.fieldType,
        section: event.source
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the section data
        this.updateSectionData(event.source, event.data.fieldName, result);
      }
    });
  }

  // Helper method to determine dialog width based on field type
  private getDialogWidth(fieldType: string): string {
    switch (fieldType) {
      case 'textarea':
      case 'slider':
      case 'metrics':
        return '800px';
      case 'image':
        return '600px';
      default:
        return '400px';
    }
  }

  // Method to update section data
  private updateSectionData(sectionType: string, fieldName: string, newValue: any) {
    // Make a deep copy to avoid modifying the original reference
    const updatedSections = cloneDeep(this.sectionList);
    
    // Find the relevant section and column
    for (const section of updatedSections) {
      if (!section.enabled) continue;
      
      for (const column of section.column) {
        if (column.key === sectionType && column.data) {
          // Update the specific field
          this.updateNestedField(column.data, fieldName, newValue);
          break;
        }
      }
    }
    
    // Clear the injector cache to force component recreation
    this.injectorCache.clear();
    
    // Update the sectionList (this will trigger change detection)
    this.sectionList = updatedSections;
    console.log('Updated sectionList:', this.sectionList);
    
    // Update active sections
    this.activeSections = this.sectionList.filter(section => section.enabled)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Force change detection to ensure UI updates
    this.cdr.detectChanges(); // Use detectChanges instead of markForCheck
  }

  // Helper method to update nested fields
  private updateNestedField(obj: any, path: string, value: any) {
    // Handle nested paths (e.g., "sliderData.styleData.borderRadius")
    const parts = path.split('.');
    let current = obj;
    
    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    // Update the final property
    current[parts[parts.length - 1]] = value;
  }
}