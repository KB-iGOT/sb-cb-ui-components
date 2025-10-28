import { Component, OnInit, Inject } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

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
    public configSvc: ConfigurationsService
  ) { }

  ngOnInit() {
    // Initialization logicd
    debugger
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
    this.stripSections.push({
      id: Date.now(),
      name: 'Add Section Name',
      visible: true
    })
    this.eventCallback({
      action: 'add-section',
      source: 'mainContent',
      id: 'add-new-section'
    })
  }

  removeSection(index: number) {
    this.stripSections.splice(index, 1)
  }
}
