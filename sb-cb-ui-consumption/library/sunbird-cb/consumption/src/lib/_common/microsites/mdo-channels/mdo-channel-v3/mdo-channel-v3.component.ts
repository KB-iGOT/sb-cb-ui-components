import { Component, OnInit, Input, Injector, Type, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2'
import { UtilityService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import * as _ from 'lodash'
import { MatDialog } from '@angular/material/dialog'
import { EditorDialogComponent } from '../../micro-sites-components/components/editor-dialog/editor-dialog.component'
import { SlwConfigDialogComponent } from '../../micro-sites-components/components/slw-config-dialog/slw-config-dialog.component'
import { cloneDeep } from 'lodash'
import { HttpClient } from '@angular/common/http' // Add this import

// Import component types
import { TopSectionComponent } from '../../micro-sites-components/components/top-section/top-section.component'
import { LookerSectionComponent } from '../../micro-sites-components/components/looker-section/looker-section.component'
import { TopLearnersComponent } from '../../micro-sites-components/components/top-learners/top-learners.component'
import { MainContentComponent } from '../../micro-sites-components/components/main-content/main-content.component'
import { SupportSectionComponent } from '../../micro-sites-components/components/support-section/support-section.component'
import { HighlightsOfWeekComponent } from '../../../highlights-of-week/highlights-of-week.component'
import { UserProgressComponent } from '../../../user-progress/user-progress.component'
import { SpeakersComponent } from '../../../speakers/speakers.component'
import { MicrositeV3Service } from '../../../../_services/microsite-v3.service'

@Component({
  selector: 'sb-uic-mdo-channel-v3',
  templateUrl: './mdo-channel-v3.component.html',
  styleUrls: ['./mdo-channel-v3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdoChannelV3Component implements OnInit, OnChanges {
  @Input() sectionList: any[] = [];
  @Input() slwConfiguration: any
  @Input() userRedirectionData: any
  @Input() isEdit: boolean = false;
  activeSections: any[] = [];
  @Input() providerId: string = '123456789';
  @Input() channelName: string
  @Input() orgId: string
  @Input() defaultMicrosite: boolean = false;

  isMobile: boolean = false;
  isStateLearningWeekEnabled: boolean = false;
  hasUnsavedChanges: boolean = false;
  userRedirectionEnabled: any
  isLoading: boolean = false;

  navigationTitles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: 'MDO Channels', url: '/app/learn/mdo-channels/all-channels', icon: '', disableTranslate: true }
  ];

  private componentRegistry: { [key: string]: Type<any> } = {
    'topSection': TopSectionComponent,
    'lookerSection': LookerSectionComponent,
    'topLearners': TopLearnersComponent,
    'mainContent': MainContentComponent,
    'supportSection': SupportSectionComponent,
    'weekHighlights': HighlightsOfWeekComponent,
    'userProgress': UserProgressComponent,
    'speakers': SpeakersComponent
  };

  private _eventCallbackFn: (event: any) => void
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
    private dialog: MatDialog,
    public microSiteV3Service: MicrositeV3Service,
  ) {
    this.isMobile = this.utilsSvc.isMobile;

    // Make component globally accessible for direct access
    (window as any).mdoChannelComponent = this
  }

  ngOnInit() {
    // Create a callback function for child components
    this._eventCallbackFn = (event: any) => this.handleSectionEvent(event);

    // Set global injector data for components that can't use Angular's DI properly
    (window as any).__INJECTOR_DATA = {
      isEditable: true, // Force this to true for now to enable editing
      eventCallback: this._eventCallbackFn
    };

    // Set up global callbacks
    (window as any).INJECTED_CALLBACKS = {
      ...(window as any).INJECTED_CALLBACKS || {},
      highlightsOfWeek: this._eventCallbackFn
    }

    // Get active sections
    this.activeSections = this.sectionList?.filter(section => section.enabled)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || []

    // Get channel info from route
    this.route.params.subscribe(params => {
      if (params.channelId) {
        this.channelName = params.channelName || ''
        this.orgId = params.channelId
        this.cdr.markForCheck()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.sectionList && !changes.sectionList.firstChange) ||
      (changes.slwConfiguration && !changes.slwConfiguration.firstChange)) {
      this.injectorCache.clear()
      this.hasUnsavedChanges = true // Enable Save button only after first change
    }
  }

  handleSectionEvent(event: any) {
    // Handle events from child components
    console.log('Section event received in MdoChannelV3Component:', event)

    // Check for undefined or null event
    if (!event) {
      console.error('Received null/undefined event')
      return
    }

    // Raise telemetry for the event
    if (event.action) {
      console.log(`Raising telemetry for ${event.source}-${event.id || 'unknown'}`)
      this.raiseTelemetry(`${event.source}-${event.id || 'unknown'}`)
    }

    // Handle specific events
    if (event.action === 'view-all' && event.data?.viewMoreUrl) {
      console.log(`Navigating to ${event.data.viewMoreUrl}`)
      this.router.navigateByUrl(event.data.viewMoreUrl)
    }

    // Handle edit events
    if (event.action === 'edit') {
      console.log('Opening editor dialog for', event.source)
      this.openEditorDialog(event)
    }

    // Handle playlist updates
    if (event.action === 'playlist-updated') {
      console.log('Playlist updated, clearing cache and enabling save button')
      this.injectorCache.clear()
      this.hasUnsavedChanges = true
      this.cdr.detectChanges()
    }

    // Handle playlist created
    if (event.action === 'playlist-created') {
      console.log('Playlist created, enabling save button')
      this.injectorCache.clear()
      this.hasUnsavedChanges = true
      this.cdr.detectChanges()
    }

    // Handle section visibility toggled
    if (event.action === 'section-visibility-toggled') {
      console.log('Section visibility toggled, enabling save button')
      this.hasUnsavedChanges = true
      // this.updateStripSections(event.data?.stripSections)
    }



    // Handle strip sections updates (only from notifyStripSectionsChange)
    if (event.action === 'update-strip-sections') {
      console.log('Updating strip sections:', event.data?.stripSections)
      this.updateStripSections(event.data?.stripSections)
    }
  }

  updateStripSections(stripSections: any[]) {
    // Find the mainContent section and update its stripsArray data
    const mainContentSection = this.sectionList?.find(section => section.key === 'sectionMain')

    if (mainContentSection) {
      // Check if columns exist and find mainContent column
      if (mainContentSection.column && Array.isArray(mainContentSection.column)) {
        const mainContentColumn = mainContentSection.column.find(col => col.key === 'mainContent')
        if (mainContentColumn && mainContentColumn.data) {
          // Update stripsArray in the column's data
          if (!mainContentColumn.data.stripsArray) {
            mainContentColumn.data.stripsArray = []
          }
          mainContentColumn.data.stripsArray = [...mainContentColumn.data.stripsArray, ...stripSections]
          this.hasUnsavedChanges = true
          this.cdr.markForCheck()
          console.log('Strip sections updated in column data.stripsArray:', mainContentColumn.data.stripsArray)
          return
        }
      }

      // If no columns or mainContent column not found, update directly in section data
      if (!mainContentSection.data) {
        mainContentSection.data = {}
      }
      if (!mainContentSection.data.stripsArray) {
        mainContentSection.data.stripsArray = []
      }
      mainContentSection.data.stripsArray = stripSections
      this.hasUnsavedChanges = true
      this.cdr.markForCheck()
      console.log('Strip sections updated in section data.stripsArray:', mainContentSection.data.stripsArray)
    }
  }

  getSectionComponent(key: string): Type<any> {
    return this.componentRegistry[key] || null
  }

  createInjector(section: any, column: any): Injector {
    // Create a stable reference to the callback function if not already created
    if (!this._eventCallbackFn) {
      this._eventCallbackFn = (event: any) => this.handleSectionEvent(event)
    }

    // Create a cache key based on section and column keys
    const cacheKey = `${section.key}-${column.key}`

    // Return cached injector if available
    if (this.injectorCache.has(cacheKey)) {
      return this.injectorCache.get(cacheKey)!
    }

    // Update global injector data
    (window as any).__INJECTOR_DATA = {
      isEditable: (column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit,
      isEdit: (column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit,
      eventCallback: this._eventCallbackFn,
      sectionData: column.data,
      channelName: this.channelName,
      orgId: this.orgId
    }

    // Create new injector
    const injector = Injector.create({
      providers: [
        { provide: 'sectionData', useValue: (column.key === 'topLearners') ? column : column.data },
        { provide: 'channelName', useValue: this.channelName },
        { provide: 'orgId', useValue: this.orgId },
        { provide: 'isMobile', useValue: this.isMobile },
        // Always set isEdit and isEditable to true for userProgress and speakers components
        { provide: 'isEdit', useValue: (column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit },
        { provide: 'slwConfiguration', useValue: this.slwConfiguration },
        { provide: 'providerId', useValue: this.orgId },
        { provide: 'eventCallback', useValue: this._eventCallbackFn },
        // Set isEditable to true for userProgress, speakers or when in edit mode
        { provide: 'isEditable', useValue: (column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit }
      ],
      parent: this.injector
    })

    // Cache the injector
    this.injectorCache.set(cacheKey, injector)

    return injector
  }

  trackByFn(index: number, item: any): any {
    return item.version || item.key || index
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
    )
  }

  // Add new method to handle edit dialog
  openEditorDialog(event: any) {
    const dialogWidth = this.getDialogWidth(event.data.fieldType)

    // Debug logs for all configurations
    console.log('MdoChannelV3 - openEditorDialog - received event:', event)
    console.log('MdoChannelV3 - openEditorDialog - field type:', event.data.fieldType)
    console.log('MdoChannelV3 - openEditorDialog - value:', event.data.value)

    // Get the actual value to pass to the dialog
    let dialogValue = event.data.value

    // Special handling for weekHighlights - retrieve from nested structure
    if (event.data.fieldType === 'weekHighlights') {
      console.log('MdoChannelV3 - weekHighlights - current sectionList:', this.sectionList)
      // Find the mainContent section and log its current weekHighlights data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.weekHighlights) {
            console.log('MdoChannelV3 - weekHighlights - current stored data:',
              column.data.stateLearningWeekSection.weekHighlights.data)
            console.log('MdoChannelV3 - weekHighlights - stored list length:',
              column.data.stateLearningWeekSection.weekHighlights.data?.list?.length)
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.weekHighlights.data
          }
        }
      }
    }

    // Special handling for userProgressConfig - retrieve from nested structure
    if (event.data.fieldType === 'userProgressConfig') {
      console.log('MdoChannelV3 - userProgressConfig - current sectionList:', this.sectionList)
      // Find the mainContent section and get its myprogress data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.myprogress) {
            console.log('MdoChannelV3 - userProgressConfig - current stored data:',
              column.data.stateLearningWeekSection.myprogress)
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.myprogress
          }
        }
      }
    }
    // Special handling for eventsConfig - retrieve from nested structure
    if (event.data.fieldType === 'eventsConfig') {
      console.log('MdoChannelV3 - eventsConfig - current sectionList:', this.sectionList)
      // Find the mainContent section and get its events data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.events) {
            console.log('MdoChannelV3 - eventsConfig - current stored data:',
              column.data.stateLearningWeekSection.events)
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.events
          }
        }
      }
    }

    // Special handling for mdoLeaderboardConfig - retrieve from nested structure
    if (event.data.fieldType === 'mdoLeaderboardConfig') {
      console.log('MdoChannelV3 - mdoLeaderboardConfig - current sectionList:', this.sectionList)
      // Find the mainContent section and get its mdoLeaderboard data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.mdoLeaderboard) {
            console.log('MdoChannelV3 - mdoLeaderboardConfig - current stored data:',
              column.data.stateLearningWeekSection.mdoLeaderboard)
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.mdoLeaderboard
          }
        }
      }
    }

    // Special handling for cbpPlanConfig - retrieve from nested structure
    if (event.data.fieldType === 'cbpPlanConfig') {
      console.log('MdoChannelV3 - cbpPlanConfig - current sectionList:', this.sectionList)
      // Find the mainContent section and get its cbpPlan data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.cbpPlanSection) {
            console.log('MdoChannelV3 - cbpPlanConfig - current stored data:',
              column.data.cbpPlanSection?.data)
            // Use the nested data for the dialog
            dialogValue = column.data.cbpPlanSection?.data
          }
        }
      }
    }
    // Special handling for speakersConfig - retrieve from nested structure
    if (event.data.fieldType === 'speakersConfig') {
      console.log('MdoChannelV3 - speakersConfig - current sectionList:', this.sectionList)
      // Find the mainContent section and get its speakers data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.speakerOftheDay) {
            console.log('MdoChannelV3 - speakersConfig - current stored data:',
              column.data.stateLearningWeekSection.speakerOftheDay)
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.speakerOftheDay
          }
        }
      }
    }
    const dialogRef = this.dialog.open(EditorDialogComponent, {
      width: dialogWidth,
      data: {
        fieldName: event.data.fieldName,
        displayName: event.data.displayName,
        value: dialogValue,  // Use the retrieved value
        fieldType: event.data.fieldType,
        section: event.source
      }, autoFocus: false
    })

    // After dialog close
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true
        // Use updateSectionData method to update section data
        this.updateSectionData(event.source, event.data.fieldName, result)

        this.isLoading = false
      }
    })
  }

  // Helper method to determine dialog width based on field type
  private getDialogWidth(fieldType: string): string {
    switch (fieldType) {
      case 'textarea':
      case 'slider':
      case 'metrics':
      case 'weekHighlights':
      case 'userProgressConfig':
      case 'speakersConfig':
      case 'eventsConfig':
      case 'mdoLeaderboardConfig':
      case 'cbpPlanConfig':
      case 'keyHighlights':
        return '800px'
      case 'announcementsConfig':
      case 'image':
        return '600px'
      default:
        return '400px'
    }
  }

  // Method to update section data
  private updateSectionData(sectionType: string, fieldName: string, newValue: any) {
    console.log('updateSectionData called with:', { sectionType, fieldName, newValue })

    // Make a deep copy to avoid modifying the original reference
    const updatedSections = cloneDeep(this.sectionList)
    let updated = false

    // Special handling for speakersConfig
    if (fieldName === 'speakersConfig' && sectionType === 'speakers') {
      console.log('Handling speakersConfig special case')
      // Find the section with speakers
      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'mainContent') {
            console.log('Found speakers column:', column)

            // Ensure nested objects exist before assignment (avoid optional-chaining on LHS)
            if (!column.data) {
              column.data = {}
            }
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.speakerOftheDay) {
              column.data.stateLearningWeekSection.speakerOftheDay = {}
            }
            column.data.stateLearningWeekSection.speakerOftheDay = newValue?.speakerOftheDay

            console.log('Updated speakers data:', column.data)
            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for announcementsConfig
    if (fieldName === 'announcementsConfig' && sectionType === 'announcements') {
      console.log('Handling announcementsConfig special case')
      // Find the section with speakers
      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'mainContent') {
            console.log('Found speakers column:', column)

            // Ensure nested objects exist before assignment (avoid optional-chaining on LHS)
            if (!column.data) {
              column.data = {}
            }
            if (!column.data.announcementSection) {
              column.data.announcementSection = {}
            }
            column.data.announcementSection.data = newValue

            console.log('Updated announcement data:', column.data)
            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for weekHighlights
    else if (fieldName === 'weekHighlights' && sectionType === 'weekHighlights') {
      console.log('Handling weekHighlights special case')
      console.log('newValue received:', newValue)
      console.log('newValue.list length:', newValue.list?.length)
      console.log('newValue.list contents:', newValue.list)

      // weekHighlights is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.weekHighlights.data
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the weekHighlights
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.weekHighlights) {
            console.log('Found column with weekHighlights nested data. Column key:', column.key)
            console.log('Column data before update:', JSON.stringify(column.data, null, 2))

            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.weekHighlights) {
              column.data.stateLearningWeekSection.weekHighlights = { enabled: true }
            }
            if (!column.data.stateLearningWeekSection.weekHighlights.data) {
              column.data.stateLearningWeekSection.weekHighlights.data = {}
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.stateLearningWeekSection.weekHighlights.data.title = newValue.title
            column.data.stateLearningWeekSection.weekHighlights.data.list = JSON.parse(JSON.stringify(newValue.list))

            console.log('Column data after update:', JSON.stringify(column.data, null, 2))
            console.log('Updated list length:', column.data.stateLearningWeekSection.weekHighlights.data.list?.length)
            updated = true
            break
          }
        }
        if (updated) break
      }

      // Log the entire sectionList to verify the update
      if (updated) {
        console.log('Entire sectionList after weekHighlights update - checking all sections...')
        updatedSections.forEach((section, idx) => {
          section.column.forEach((col, colIdx) => {
            if (col.data?.stateLearningWeekSection?.weekHighlights?.data?.list) {
              console.log(`Section[${idx}].column[${colIdx}] weekHighlights list length:`,
                col.data.stateLearningWeekSection.weekHighlights.data.list.length)
            }
          })
        })
      }
    }

    // Special handling for userProgressConfig (myprogress)
    else if (fieldName === 'userProgressConfig' && sectionType === 'userProgress') {
      console.log('Handling userProgressConfig (myprogress) special case')
      console.log('newValue received:', newValue)

      // myprogress is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.myprogress
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the myprogress
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.myprogress) {
            console.log('Found column with myprogress nested data. Column key:', column.key)
            console.log('Column data before update:', JSON.stringify(column.data, null, 2))

            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.myprogress) {
              column.data.stateLearningWeekSection.myprogress = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            // The newValue contains the full userProgress config, we store it under myprogress
            column.data.stateLearningWeekSection.myprogress = JSON.parse(JSON.stringify(newValue))

            console.log('Column data after update:', JSON.stringify(column.data, null, 2))
            console.log('Updated myprogress data:', column.data.stateLearningWeekSection.myprogress)
            updated = true
            break
          }
        }
        if (updated) break
      }

      if (updated) {
        console.log('Successfully updated myprogress configuration')
      }
    }

    // Also handle if it comes as 'myprogress' directly
    else if ((fieldName === 'myprogress' || fieldName === 'userProgressConfig') &&
      (sectionType === 'mainContent' || sectionType === 'myprogress' || sectionType === 'userProgress')) {
      console.log('Handling myprogress/userProgressConfig special case (alternate path)')
      console.log('newValue received:', newValue)

      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.myprogress) {
            console.log('Found column with myprogress nested data. Column key:', column.key)
            console.log('Column data before update:', JSON.stringify(column.data, null, 2))

            if (!column.data) {
              column.data = {}
            }

            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.myprogress) {
              column.data.stateLearningWeekSection.myprogress = { enabled: true }
            }

            column.data.stateLearningWeekSection.myprogress = JSON.parse(JSON.stringify(newValue))

            console.log('Column data after update:', JSON.stringify(column.data, null, 2))
            console.log('Updated myprogress data:', column.data.stateLearningWeekSection.myprogress)
            updated = true
            break
          }
        }
        if (updated) break
      }

      if (updated) {
        console.log('Successfully updated myprogress configuration (alternate path)')
      }
    }

    // Special handling for eventsConfig
    else if (fieldName === 'eventsConfig' && sectionType === 'events') {
      console.log('Handling eventsConfig special case')
      console.log('newValue received:', newValue)

      // events is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.events
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the events
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.events) {
            console.log('Found column with events nested data. Column key:', column.key)
            console.log('Column data before update:', JSON.stringify(column.data, null, 2))

            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.events) {
              column.data.stateLearningWeekSection.events = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.stateLearningWeekSection.events = JSON.parse(JSON.stringify(newValue))

            console.log('Column data after update:', JSON.stringify(column.data, null, 2))
            console.log('Updated events data:', column.data.stateLearningWeekSection.events)
            updated = true
            break
          }
        }
        if (updated) break
      }

      if (updated) {
        console.log('Successfully updated events configuration')
      }
    }

    // Special handling for mdoLeaderboardConfig
    else if (fieldName === 'mdoLeaderboardConfig' && sectionType === 'mdoLeaderboard') {
      console.log('Handling mdoLeaderboardConfig special case')
      console.log('newValue received:', newValue)

      // mdoLeaderboard is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.mdoLeaderboard
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the mdoLeaderboard
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.mdoLeaderboard) {
            console.log('Found column with mdoLeaderboard nested data. Column key:', column.key)
            console.log('Column data before update:', JSON.stringify(column.data, null, 2))

            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.mdoLeaderboard) {
              column.data.stateLearningWeekSection.mdoLeaderboard = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.stateLearningWeekSection.mdoLeaderboard = JSON.parse(JSON.stringify(newValue))

            console.log('Column data after update:', JSON.stringify(column.data, null, 2))
            console.log('Updated mdoLeaderboard data:', column.data.stateLearningWeekSection.mdoLeaderboard)
            updated = true
            break
          }
        }
        if (updated) break
      }

      if (updated) {
        console.log('Successfully updated mdoLeaderboard configuration')
      }
    }

    // Special handling for cbpPlanConfig
    else if (fieldName === 'cbpPlanConfig' && sectionType === 'cbpPlan') {
      console.log('Handling cbpPlanConfig special case')
      console.log('newValue received:', newValue)

      // cbpPlan is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.cbpPlan
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the cbpPlan
          if (column.key === 'mainContent' || column.data?.cbpPlanSection) {
            console.log('Found column with cbpPlan nested data. Column key:', column.key)
            console.log('Column data before update:', JSON.stringify(column.data, null, 2))

            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.cbpPlanSection) {
              column.data.cbpPlanSection = {}
            }
            if (!column.data.cbpPlanSection.data) {
              column.data.cbpPlanSection.data = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.cbpPlanSection.data = JSON.parse(JSON.stringify(newValue))

            console.log('Column data after update:', JSON.stringify(column.data, null, 2))
            console.log('Updated cbpPlan data:', column.data.cbpPlanSection.data)
            updated = true
            break
          }
        }
        if (updated) break
      }

      if (updated) {
        console.log('Successfully updated cbpPlan configuration')
      }
    }

    // Regular handling for other field types
    if (!updated) {
      // Find the relevant section and column
      for (const section of updatedSections) {
        if (!section.enabled) continue

        for (const column of section.column) {
          if (column.key === sectionType && column.data) {
            console.log('Found matching column:', column)

            // Special handling for keyHighlights which is nested under stateLearningWeekSection
            if (fieldName === 'keyHighlights' && column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection.keyHighlights = newValue
              updated = true
            } else {
              // Update other fields using the nested field helper
              this.updateNestedField(column.data, fieldName, newValue)
              updated = true
            }
            break
          }
        }
        if (updated) break
      }
    }

    // Clear the injector cache to force component recreation
    this.injectorCache.clear()

    // Update the sectionList with new reference (this will trigger change detection)
    this.sectionList = updatedSections
    console.log('Updated sectionList:', this.sectionList)

    // Update active sections with new reference
    this.activeSections = this.sectionList.filter(section => section.enabled)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    // Mark for change detection
    this.hasUnsavedChanges = true

    // Force change detection to ensure UI updates
    this.cdr.detectChanges()
  }

  // Helper method to update nested fields
  private updateNestedField(obj: any, path: string, value: any) {
    // Handle nested paths (e.g., "sliderData.styleData.borderRadius")
    const parts = path.split('.')
    let current = obj

    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {}
      }
      current = current[parts[i]]
    }

    // Update the final property
    current[parts[parts.length - 1]] = value
  }

  // Action handlers
  toggleStateLearningWeek() {
    this.isStateLearningWeekEnabled = !this.isStateLearningWeekEnabled
    this.hasUnsavedChanges = true
    this.cdr.markForCheck()

    // Raise telemetry
    this.raiseTelemetry('toggle-state-learning-week')
  }

  saveChanges(type?: string) {
    // Prepare payload
    const payload = {
      request: {
        type: 'mdo-channel',
        subType: (type === 'publish') ? 'microsite-v3' : 'microsite-v3-preview',
        action: 'page-configuration',
        component: 'portal',
        framework: '*',
        data: {
          stateLearningWeekConfig: this.slwConfiguration || {},
          sectionList: this.sectionList || [],
          userRedirectionData: {
            enabled: this.userRedirectionEnabled || false,
            orgId: this.orgId || '',
            channelName: this.channelName || ''
          }
        },
        rootOrgId: this.orgId || ''
      }
    }
    if (this.defaultMicrosite) {
      console.log('Payload:', payload)
      // Call the API
      this.microSiteV3Service.createMicrosite(payload).subscribe({
        next: (res) => {
          console.log('Form update success:', res)
          this.hasUnsavedChanges = false
          this.cdr.markForCheck()
        },
        error: (err) => {
          console.error('Form update failed:', err)
        }
      })
      // Raise telemetry
      this.raiseTelemetry('update-changes')
    } else {
      console.log('Payload:', payload)
      // Call the API
      this.microSiteV3Service.updateMicrosite(payload).subscribe({
        next: (res) => {
          console.log('Form update success:', res)
          this.hasUnsavedChanges = false
          this.cdr.markForCheck()
        },
        error: (err) => {
          console.error('Form update failed:', err)
        }
      })
      // Raise telemetry
      this.raiseTelemetry('update-changes')
    }
  }

  publishChanges() {
    if (this.hasUnsavedChanges) {
      this.saveChanges('publish')
    }

    // Implement publish logic here
    console.log('Publishing changes...')

    // Raise telemetry
    this.raiseTelemetry('publish-changes')

    // You can emit an event or call a service to publish the data
  }

  // Add method to open SLW configuration dialog
  openSLWConfigDialog(currentConfig: any) {
    console.log('Opening SLW config dialog')
    const dialogRef = this.dialog.open(SlwConfigDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false,
      data: currentConfig || {
        enabled: true,
        startDate: '',
        endDate: '',
        title: 'State Learning Week',
        description: '',
        titleHi: '',
        descriptionHi: '',
        buttonText: 'View More',
        width: '30px',
        orgId: this.orgId,
        orgName: ''
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result)
      if (result) {
        // Update SLW configuration
        this.slwConfiguration = result
        this.isStateLearningWeekEnabled = result.enabled
        this.hasUnsavedChanges = true
        this.cdr.detectChanges()
      } else {
        // If dialog was cancelled, disable SLW
        this.isStateLearningWeekEnabled = false
        if (this.slwConfiguration) {
          this.slwConfiguration.enabled = false
        }
        this.hasUnsavedChanges = true
        this.cdr.detectChanges()
      }
    })
  }

  handleToggleSLW() {
    if (this.slwConfiguration) {
      this.slwConfiguration.enabled = !this.slwConfiguration.enabled
      this.hasUnsavedChanges = true
      this.cdr.markForCheck()
    }
  }

  handleConfigureSLW(currentConfig: any) {
    console.log('Configure SLW called with:', currentConfig)
    this.openSLWConfigDialog(currentConfig)
  }

  handleUserRedirectionToggle(enabled: boolean) {
    console.log('User Redirection toggled:', enabled)
    this.userRedirectionEnabled = enabled
    this.hasUnsavedChanges = true
    this.cdr.markForCheck()
  }


}