import { Component, Input, OnInit, Output, EventEmitter, Injector } from '@angular/core'
import { InsiteDataService } from '../../_services/insite-data.service'
import moment from 'moment'


@Component({
    selector: 'sb-uic-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    standalone: false
})
export class EventsComponent implements OnInit {

  @Input() object: any
  @Input() nwlEventsConfig: any
  @Input() eventsApiConfig: any
  @Input() isEdit: boolean = false;
  @Input() isEditable: boolean = false;
  @Output() editClicked = new EventEmitter<any>();
  daysBetween: any = []
  events: any = []
  requestBody: any
  currentDay: any
  loader: boolean = false
  showAllEvents = false

  toggleShowAll(): void { this.showAllEvents = !this.showAllEvents }

  // Will store the event callback function from the parent
  private eventCallback: Function | undefined

  constructor(
    public insightSvc: InsiteDataService,
    private injector: Injector
  ) {
    try {
      // Get values from injector
      const isEditInput = this.injector.get('isEdit', false)
      const isEditableInput = this.injector.get('isEditable', false)
      const eventCallbackInput = this.injector.get('eventCallback', null)

      // Set edit flags from injector
      if (typeof isEditInput === 'boolean') {
        this.isEdit = isEditInput
      }
      if (typeof isEditableInput === 'boolean') {
        this.isEditable = isEditableInput
      }

      // Store the event callback function
      if (eventCallbackInput && typeof eventCallbackInput === 'function') {
        this.eventCallback = eventCallbackInput
      }
    } catch (e) {
      console.error('Error getting values from injector', e)
    }
  }

  ngOnInit() {
    /* Use requestBody from eventsApiConfig if provided, else use default */
    const cfgBody = this.eventsApiConfig?.requestBody
    this.requestBody = cfgBody
      ? JSON.parse(JSON.stringify(cfgBody))
      : {
          locale: ['en'],
          query: '',
          request: {
            query: '',
            filters: {
              status: ['Live'],
              contentType: 'Event',
              category: 'Event',
              startDate: { '>=': '', '<': '' },
            },
            sort_by: { startDate: 'desc' },
          },
        }

    /* Ensure startDate filter object exists when not using eventsApiConfig */
    if (!this.eventsApiConfig && !this.requestBody.request.filters.startDate) {
      this.requestBody.request.filters.startDate = { '>=': '', '<': '' }
    }

    this.getEventsList()
  }
  getDaysBetweenDates() {
    if (!this.nwlEventsConfig?.startDate) return
    let currentDate = moment(this.nwlEventsConfig.startDate, 'DD-MM-YYYY')
    /* If endDate not provided, default to startDate + 16 weeks */
    const endDate = this.nwlEventsConfig.endDate
      ? moment(this.nwlEventsConfig.endDate, 'DD-MM-YYYY')
      : moment(this.nwlEventsConfig.startDate, 'DD-MM-YYYY').add(16, 'weeks')
    while (currentDate.isSameOrBefore(endDate)) {
      const localObj: { [key: string]: string } = {}
      localObj['startDate'] = currentDate.format('YYYY-MM-DD')
      localObj['diplayFormat'] = currentDate.format('MMM DD, YYYY')
      if (currentDate.isSame(moment(), 'day')) {
        this.currentDay = currentDate.format('YYYY-MM-DD')
      }
      currentDate.add(1, 'days').format('YYYY-MM-DD')
      this.daysBetween.push(localObj)
    }
  }

  getEvents(slectedDate: any) {
    this.currentDay = slectedDate.target.value
    let nextDay = moment(slectedDate.target.value, 'YYYY-MM-DD')
    nextDay.add(1, 'days')
    let requestData: any = {}
    if (this.object && this.object.request && Object.keys(this.object.request).length > 0) {
      requestData = this.object.request
      requestData.request.filters.startDate = {
        ">=": this.currentDay,
        "<": nextDay.format('YYYY-MM-DD')
      }
    } else {
      /* Ensure startDate object exists before assigning */
      if (!this.requestBody.request.filters.startDate) {
        this.requestBody.request.filters.startDate = {}
      }
      this.requestBody.request.filters.startDate[">="] = this.currentDay
      this.requestBody.request.filters.startDate["<"] = nextDay.format('YYYY-MM-DD')
      requestData = this.requestBody
    }
    this.loader = true
    this.insightSvc.fetchTrainingDetails(requestData, this.eventsApiConfig?.url).subscribe((res: any) => {
      this.events = []
      if (res && res.result && res.result.count > 0) {
        res.result.Event.forEach((eveEle: any) => {
          eveEle['eventDate'] = this.customDateFormat(eveEle.startDate, eveEle.startTime)
          eveEle['eventendDate'] = this.customDateFormat(eveEle.endDate, eveEle.endTime)
        })
        this.events = this.sortItemByTime(res.result.Event)
        this.loader = false
      } else {
        this.loader = false
      }
    }, (_error: any) => {
      this.loader = false
    })
  }

  getEventsList() {
    this.getDaysBetweenDates()
    this.loader = true
    let requestData: any = {}

    if (this.eventsApiConfig) {
      if (!this.requestBody.request.filters.startDate) {
        this.requestBody.request.filters.startDate = {}
      }
      if (this.currentDay) {
        const nextDay = moment(this.currentDay, 'YYYY-MM-DD').add(1, 'days')
        this.requestBody.request.filters.startDate['>='] = this.currentDay
        this.requestBody.request.filters.startDate['<'] = nextDay.format('YYYY-MM-DD')
      } else if (this.nwlEventsConfig?.startDate || this.nwlEventsConfig?.endDate) {
        if (this.nwlEventsConfig?.startDate) {
          this.requestBody.request.filters.startDate['>='] =
            moment(this.nwlEventsConfig.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        }
        if (this.nwlEventsConfig?.endDate) {
          this.requestBody.request.filters.startDate['<'] =
            moment(this.nwlEventsConfig.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        }
      }
      requestData = this.requestBody
    } else if (this.object && this.object.request && Object.keys(this.object.request).length > 0) {
      requestData = this.object.request
      let nextDay = this.currentDay ? moment(this.currentDay, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD')
      nextDay.add(1, 'days')
      requestData.request.filters.startDate = { ">=": this.currentDay, "<": nextDay.format('YYYY-MM-DD') }
    } else {
      let nextDay = this.currentDay ? moment(this.currentDay, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD')
      nextDay.add(1, 'days')
      this.requestBody.request.filters.startDate[">="] = this.currentDay
      this.requestBody.request.filters.startDate["<"] = nextDay.format('YYYY-MM-DD')
      requestData = this.requestBody
    }

    this.insightSvc.fetchTrainingDetails(requestData, this.eventsApiConfig?.url).subscribe((res: any) => {
      this.events = []
      if (res && res.result && res.result.count > 0) {
        res.result.Event.forEach((eveEle: any) => {
          if (eveEle.startDate && eveEle.startTime) {
            eveEle['eventDate'] = this.customDateFormat(eveEle.startDate, eveEle.startTime)
          }
          if (eveEle.endDate && eveEle.endTime) {
            eveEle['eventendDate'] = this.customDateFormat(eveEle.endDate, eveEle.endTime)
          }
        })
        this.events = this.sortItemByTime(res.result.Event)
        this.loader = false
      } else {
        this.loader = false
      }
    }, () => {
      this.loader = false
    })
  }

  sortItemByTime(eventsdata: any) {
    return eventsdata.sort((a: any, b: any) => {
      const firstDate: any = new Date(a.eventDate)
      const secondDate: any = new Date(b.eventDate)
      return secondDate < firstDate ? 1 : -1
    })
  }
  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

  /**
   * Handle edit button click
   * Emits an event to be handled by parent component (mdo-channel-v3)
   */
  onEdit() {
    const eventData = {
      source: 'events',
      action: 'edit',
      data: {
        fieldName: 'eventsConfig',
        displayName: 'Events Configuration',
        value: this.object,
        fieldType: 'eventsConfig'
      }
    }

    // Use only the callback from injector which is the most reliable method
    if (this.eventCallback && typeof this.eventCallback === 'function') {
      this.eventCallback(eventData)
      return
    }

    // Fallback to global injector if direct callback isn't available
    if ((window as any).__INJECTOR_DATA?.eventCallback) {
      (window as any).__INJECTOR_DATA.eventCallback(eventData)
    }
  }
}

