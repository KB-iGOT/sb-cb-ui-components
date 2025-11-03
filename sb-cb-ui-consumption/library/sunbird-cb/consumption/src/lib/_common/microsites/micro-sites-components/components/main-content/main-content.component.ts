import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MicrositeV3Service } from '../../../../../_services/microsite-v3.service'
import { v4 as uuid } from 'uuid'
import { MatDialog } from '@angular/material/dialog'
import { StripAddContentComponent } from '../strip-add-content/strip-add-content.component'

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  selectedIndex = 0;
  hideCompetencyBlock = false;
  contentTabEmptyResponseCount = 0;
  showModal = false;
  stripSections: any[] = [];

  constructor(
    @Inject('sectionData') public data: any,
    @Inject('channelName') public channelName: string,
    @Inject('orgId') public orgId: string,
    @Inject('isMobile') public isMobile: boolean,
    @Inject('providerId') public providerId: string,
    @Inject('slwConfiguration') public slwConfig: any,
    @Inject('isEdit') public isEdit: boolean,
    @Inject('eventCallback') private eventCallback: (event: any) => void,
    public configSvc: ConfigurationsService,
    public microSiteV3Service: MicrositeV3Service,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Initialization logic
    // Initialize stripSections from existing data if available
    if (this.data?.stripSections && Array.isArray(this.data.stripSections)) {
      this.stripSections = [...this.data.stripSections]
    }
  }

  tabClicked(event: MatTabChangeEvent) {
    this.selectedIndex = event.index
    this.eventCallback({
      action: 'tab-click',
      source: 'mainContent',
      id: `${event.tab.textLabel}-tab`
    })
  }

  raiseTabClick(event: any) {
    this.eventCallback({
      action: 'mdo-leaderboard',
      source: 'mainContent',
      id: `${event}-tab`
    })
  }

  hideKeyHightlight(event: any, data: any) {
    if (event) {
      data.enabled = false
      this.eventCallback({
        action: 'hide-highlight',
        source: 'mainContent',
        id: 'key-highlight'
      })
    }
  }

  triggerOpenDialog(event: boolean) {
    if (event) {
      this.showModal = true
      document.body.style.overflow = 'hidden'
    }
    this.eventCallback({
      action: 'open-dialog',
      source: 'mainContent',
      id: 'key-announcements'
    })
  }

  onClose() {
    this.showModal = false
    document.body.style.overflow = 'auto'
    this.eventCallback({
      action: 'close-dialog',
      source: 'mainContent',
      id: 'key-announcements'
    })
  }

  raiseTelemetryInteratEvent(event: any) {
    this.eventCallback({
      action: 'telemetry',
      source: 'mainContent',
      id: event.id || 'content-interaction',
      data: event
    })
  }

  showAllContent(event: any, data: any) {
    this.eventCallback({
      action: 'view-all',
      source: 'mainContent',
      id: data?.sectionKey || 'content-section',
      data: event
    })
  }

  hideCompetency(event: any) {
    if (event) {
      this.hideCompetencyBlock = true
      this.eventCallback({
        action: 'hide-competency',
        source: 'mainContent',
        id: 'competency-block'
      })
    }
  }

  raiseCompetencyTelemetry(name: string) {
    this.eventCallback({
      action: 'competency-click',
      source: 'mainContent',
      id: `${name}-core-expertise`
    })
  }

  openEditor(fieldName: string, displayName: string, value: any) {
    this.eventCallback({
      action: 'edit',
      source: 'mainContent',
      id: fieldName,
      data: {
        fieldName,
        displayName,
        value,
        fieldType: this.getFieldType(fieldName, value),
        parentData: this.data
      }
    })
  }

  getFieldType(fieldName: string, value: any): string {
    if (fieldName === 'keyHighlights') return 'keyHighlights'
    // Add other field type logic as needed
    return typeof value
  }

  addNewSection() {
    let sectionNumber = 1
    let sectionName = 'Section One'
    let sectionKey = 'sectionOne'

    if (this.stripSections && this.stripSections.length > 0) {
      // Increment section number based on existing sections count
      sectionNumber = this.stripSections.length + 1
      const numberWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

      if (sectionNumber <= numberWords.length) {
        const numberWord = numberWords[sectionNumber - 1]
        sectionName = `Section ${numberWord}`
        sectionKey = `section${numberWord}`
      } else {
        // For numbers beyond ten, use numeric format
        sectionName = `Section ${sectionNumber}`
        sectionKey = `mdo_section`
      }
    }
    this.stripSections.push(this.microSiteV3Service.getCreateSectionReq(sectionName, `${sectionKey}_${uuid()}`, true))
  }

  removeSection(index: number) {
    this.stripSections.splice(index, 1)

    // Force change detection
    this.cdr.detectChanges()

    console.log('Section removed. Remaining sections:', this.stripSections.length)
  }

  notifyStripSectionsChange() {
    // Notify parent component about stripSections changes
    this.eventCallback({
      action: 'update-strip-sections',
      source: 'mainContent',
      id: 'strip-sections-updated',
      data: { stripSections: this.stripSections }
    })
  }

  onEditStripContent(event: any) {
    const { stripKey, stripData } = event

    const dialogRef = this.dialog.open(StripAddContentComponent, {
      width: '1000px',
      height: '80vh',
      maxHeight: '800px',
      data: {
        sectionIndex: 0,
        sectionData: {
          enabled: true,
          strips: [stripData]
        }
      },
      position: { top: '50px' },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.selectedItems && result.selectedItems.length > 0) {
        console.log('Content added to existing section:', result.selectedItems)
        const contentIds: string[] = []
        result.selectedItems.forEach((item: any) => {
          if (!contentIds.includes(item.identifier)) {
            contentIds.push(item.identifier)
          }
        })
        this.updatePlaylist(stripData, result.requestData.playlistRead.type, contentIds, result.allOrgContent)
      }
    })
  }

  updatePlaylist(stripData: any, playlistReadType: any, contentIds: string[], allOrgContent: boolean) {
    const requestBody = {
      type: playlistReadType,
      orgId: this.configSvc.userProfile?.rootOrgId || '',
      ownerId: this.configSvc.userProfile?.userId,
      children: contentIds
    }

    this.microSiteV3Service.updatePlaylistApi(requestBody).subscribe(
      (response) => {
        if (response?.result?.status?.toLowerCase() === 'updated') {
          console.log('Playlist updated successfully')

          // Trigger a refresh or notify parent to clear injector cache
          this.eventCallback({
            action: 'playlist-updated',
            source: 'mainContent',
            id: 'strip-content-updated',
            data: { stripData },
            clearCache: true  // Request parent to clear injector cache
          })
        }
      },
      (error) => {
        console.error('Error updating playlist:', error)
      }
    )
  }

  onToggleSectionVisibility(event: any) {
    const { stripKey, stripSections, enabled } = event
    console.log('Toggle section visibility:', { stripKey, enabled })

    // Find the matching strip in stripsArray and update its enabled state
    if (this.data?.stripsArray && Array.isArray(this.data.stripsArray)) {
      const matchingStrip = this.data.stripsArray.find((stripItem: any) => {
        return stripItem?.strips?.[0]?.key === stripKey
      })
      if (matchingStrip) {
        matchingStrip.enabled = enabled
        console.log('Updated stripsArray enabled state:', matchingStrip)
      }
    }

    // Update the section's enabled state
    if (stripSections) {
      stripSections.enabled = enabled
    }

    // Force change detection to refresh the view
    this.cdr.detectChanges()

    // Notify parent component about the change
    this.eventCallback({
      action: 'section-visibility-toggled',
      source: 'mainContent',
      id: 'strip-visibility-changed',
      data: { stripKey, stripSections, enabled }
    })
  }

  trackByIndex(index: number, item: any): number {
    return index
  }

  onPlaylistCreated(event: any) {
    console.log('Playlist created in strip-section-create:', event)

    // Add the new section to data.stripsArray if it doesn't exist
    if (!this.data.stripsArray) {
      this.data.stripsArray = []
    }

    // Update or add the section data
    const existingIndex = this.data.stripsArray.findIndex((item: any) =>
      item?.strips?.[0]?.key === event.sectionData?.strips?.[0]?.key
    )

    if (existingIndex === -1) {
      // Add new section to stripsArray
      this.data.stripsArray.push(event.sectionData)
    } else {
      // Update existing section
      this.data.stripsArray[existingIndex] = event.sectionData
    }

    // Remove the section from stripSections array after playlist is created
    const stripSectionIndex = event.sectionIndex
    if (stripSectionIndex !== undefined && this.stripSections[stripSectionIndex]) {
      this.stripSections.splice(stripSectionIndex, 1)
      console.log('Removed section from stripSections. Remaining:', this.stripSections.length)
    }

    // Force change detection
    this.cdr.detectChanges()

    // Notify parent component
    this.eventCallback({
      action: 'playlist-created',
      source: 'mainContent',
      id: 'new-playlist-created',
      data: event
    })
  }
}
