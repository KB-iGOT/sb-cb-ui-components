import { Component, Input, OnInit, QueryList, ViewChildren, Output, EventEmitter, Inject, Optional, OnChanges, SimpleChanges } from '@angular/core'
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive'

@Component({
  selector: 'sb-uic-highlights-of-week',
  templateUrl: './highlights-of-week.component.html',
  styleUrls: ['./highlights-of-week.component.scss']
})
export class HighlightsOfWeekComponent implements OnInit, OnChanges {

  @Input() objectData: any
  @Input() isEditable: boolean = true; // Default to true
  @Output() editEvent = new EventEmitter<any>();

  currentIndex = 0;
  contentdata: any = [];
  styleData: any = {};
  expand: boolean = true;

  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>

  private eventCallback: ((event: any) => void) | null = null;

  constructor() {
    console.log('HighlightsOfWeekComponent constructor')

    // Always set isEditable to true for testing
    this.isEditable = true

    // Manual property check from window.__INJECTOR__ (which will be set by MdoChannelV3Component)
    try {
      const injectorData = (window as any).__INJECTOR_DATA || {}

      // Try to find the eventCallback
      if (typeof injectorData.eventCallback === 'function') {
        console.log('Found eventCallback in __INJECTOR_DATA')
        this.eventCallback = injectorData.eventCallback
      } else if ((window as any).INJECTED_CALLBACKS?.highlightsOfWeek) {
        console.log('Found eventCallback in INJECTED_CALLBACKS')
        this.eventCallback = (window as any).INJECTED_CALLBACKS.highlightsOfWeek
      } else if ((window as any).mdoChannelComponent?.handleSectionEvent) {
        console.log('Using direct mdoChannelComponent reference')
        this.eventCallback = (event: any) => (window as any).mdoChannelComponent.handleSectionEvent(event)
      }
    } catch (e) {
      console.error('Error accessing injector data:', e)
    }
  }

  ngOnInit() {
    console.log('HighlightsOfWeekComponent initialized')

    // Check if we're injected with an eventCallback (from parent MDO component)
    try {
      // Try multiple methods to get the callback
      this.eventCallback = (window as any).INJECTED_CALLBACKS?.['highlightsOfWeek'] ||
        (window as any).__INJECTOR_DATA?.eventCallback ||
        null

      console.log('Found eventCallback:', !!this.eventCallback)

      // Force isEditable to true for testing
      this.isEditable = true
      console.log('isEditable set to:', this.isEditable)
    } catch (e) {
      console.error('Error finding event callback:', e)
    }

    this.styleData = this.objectData && this.objectData.sliderData && this.objectData.sliderData.styleData
    this.loadContentData()
  }

  // Helper method to load content data from objectData
  ngOnChanges(changes: SimpleChanges) {
    // Reload content data when objectData changes
    if (changes.objectData && !changes.objectData.firstChange) {
      this.loadContentData()
    }
  }

  loadContentData() {
    this.contentdata = []

    // Handle the case when list is provided directly
    if (this.objectData && this.objectData.list && Array.isArray(this.objectData.list)) {
      this.objectData.list.forEach((contentEle: any) => {
        const localData = {
          title: contentEle.title || '',
          videoUrl: contentEle.videoUrl || '',
          cardSubType: "card-wide-lib",
          description: contentEle.description || ''
        }
        this.contentdata.push(localData)
      })
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  onEditClick() {
    console.log('Edit clicked on HighlightsOfWeekComponent')

    // Prepare the data structure with the list of highlights
    const highlightsData = {
      title: this.objectData?.title || 'Week Highlights',
      list: this.contentdata.map(item => ({
        title: item.title || '',
        description: item.description || '',
        videoUrl: item.videoUrl || ''
      }))
    }

    console.log('Highlights data:', highlightsData)
    console.log('isEditable:', this.isEditable)
    console.log('eventCallback exists:', !!this.eventCallback)

    // Option 1: Use EventEmitter if the component is used with a direct parent-child relationship
    const eventData = {
      source: 'weekHighlights',
      action: 'edit',
      data: {
        fieldName: 'weekHighlights',
        displayName: 'Week Highlights',
        value: highlightsData,
        fieldType: 'weekHighlights',
        section: 'weekHighlights'
      }
    }

    console.log('Emitting event data:', eventData)
    this.editEvent.emit(eventData)

    // Option 2: Use the eventCallback if the component is used with the injector pattern
    if (this.eventCallback) {
      console.log('Using eventCallback')
      this.eventCallback(eventData)
    } else {
      console.log('No eventCallback available')

      // Fallback to using window.__INJECTOR_DATA if it exists
      if ((window as any).__INJECTOR_DATA && typeof (window as any).__INJECTOR_DATA.eventCallback === 'function') {
        console.log('Using window.__INJECTOR_DATA.eventCallback as fallback');
        (window as any).__INJECTOR_DATA.eventCallback(eventData)
      } else {
        console.log('No fallback available either')

        // Direct call to MdoChannelV3Component if it exists in window
        if ((window as any).mdoChannelComponent && typeof (window as any).mdoChannelComponent.handleSectionEvent === 'function') {
          console.log('Using direct reference to mdoChannelComponent');
          (window as any).mdoChannelComponent.handleSectionEvent(eventData)
        } else {
          console.error('No way to handle edit event! Edit functionality will not work.')
          alert('Unable to open editor. Please try again or contact support.')
        }
      }
    }
  }
}
