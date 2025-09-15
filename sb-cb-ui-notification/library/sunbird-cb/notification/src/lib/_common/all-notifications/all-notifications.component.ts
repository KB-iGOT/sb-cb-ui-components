import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import * as _ from 'lodash'
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'sb-uin-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss']
})
export class AllNotificationsComponent implements OnInit {

  @Output() reCountNotifications = new EventEmitter<any>()
  @Output() redirectTo = new EventEmitter<any>()
  @Input() showIcon: boolean = false
  @Input() showMarkAllAsRead: boolean = true
  @Input() fragment: string = ''

  notifications: any[] = []
  dynamicTabIndex: number = 0
  currentTab: any = 'all'
  loading: boolean = false
  response: any[] = []
  pageSize: number = 10
  pageNumber: number = 0
  hasNextPage: boolean = false
  unreadCount: number = 0
  tabs: any[] = [
    { id: "all", name: 'all' },
  ]
  private scrollNotificationsSubject = new Subject<Event>()

  constructor(readonly route: ActivatedRoute,
    private libNotificationService: LibNotificationsService,
    private snackBar: MatSnackBar
  ) {
    this.scrollNotificationsSubject.pipe(debounceTime(500)).subscribe((event: any) => {
      this.pageNumber = this.pageNumber + 1
      console.log("event ", event)
      this.loadNotifications()
    })

  }
  @HostListener('window:scroll', ['$event'])

  onScroll(event: Event): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && this.hasNextPage && !this.loading
    ) {
      console.log("onScroll event", event)
      // Emit the scroll event to the subject
      this.scrollNotificationsSubject.next(event)
    }
  }

  onDebouncedScroll() {
    this.pageNumber = this.pageNumber + 1
    console.log("pageNumber", this.pageNumber)
    this.loadNotifications()
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.currentTab = params.get('tab')
    })
    this.loadNotifications()
  }



  redirectToNotification(notification: any) {
    if (!notification.read) {
      this.markAsRead(notification)
    } else {
      this.redirectTo.emit(notification)
    }
  }

  markAsRead(notification: any) {
    let request: any = {
      request: {
        type: "individual",
        ids: [notification.notification_id]
      }
    }
    if (['COURSE_PUBLISHED', 'PROGRAM_PUBLISHED', 'EVENT_PUBLISHED'].includes(notification.sub_category)) {
      request.request.action = 'global'
    }
    this.libNotificationService.markAsRead(request).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        notification.read = true
        this.libNotificationService.updateUnreadCount()
        this.redirectTo.emit(notification)
      }
    })
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }

  getTimeAgo(dateString: string): string {
    const givenDate = new Date(dateString);
    const now = new Date()

    const diffInSeconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000)

    const seconds = diffInSeconds
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `${years}y`
    if (months > 0) return `${months}m`
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }

  getIconPath(category: string) {
    switch (category) {
      case 'LEARN':
        return 'assets/icons/notifications-engine/learn.svg'
      case 'NETWORK':
        return 'assets/icons/notifications-engine/network.svg'
      case 'EVENT':
        return 'assets/icons/notifications-engine/event.svg'
      case 'DISCUSSION':
        return 'assets/icons/notifications-engine/discuss.svg'
      default:
        return 'assets/icons/notifications-engine/learn.svg'
    }
  }

  onTabChange(type: number) {
    console.log('type', type)
    //this.currentTab = type
    this.dynamicTabIndex = type
    this.currentTab = this.tabs[this.dynamicTabIndex].name
    console.log('currentTab', this.currentTab)
    this.notifications = []
    this.pageNumber = 0
    this.hasNextPage = false
    this.loadNotifications()
  }

  loadNotifications() {
    this.loading = true
    this.libNotificationService.getNotifications(this.pageNumber, this.pageSize, this.currentTab).subscribe((res: any) => {
      this.response = _.get(res, 'result.notifications', [])
      this.response = this.response.map(notification => ({
        ...notification,
        isExpanded: this.fragment && this.fragment === notification.notification_id,
        content: []
      }))
      const tabs = _.get(res, 'result.subtypeStats', [])
      this.tabs = [{ id: "all", name: 'all' }]
      tabs.forEach((tab: any) => {
        this.tabs.push(tab)
        if (tab.unread) {
          this.unreadCount += tab.unread
        }
      })
      if (this.currentTab) {
        const index = this.tabs.findIndex(tab => tab.name === this.currentTab)
        if (index !== -1) {
          this.dynamicTabIndex = index
        }
      }
      this.notifications = [...this.notifications, ...this.response]
      this.hasNextPage = res.result && res.result.hasNextPage ? res.result.hasNextPage : false
      this.loading = false
    }, error => {
      console.error('Error loading notifications:', error)
      this.loading = false
    })
  }

  action(notification: any) {
    if (notification.isExpanded) {
      notification.isExpanded = false
    } else {
      notification.isExpanded = true
    }
  }

  getCount(read: any, unread: any) {
    return (+read || +unread) ? `(${+read + +unread})` : ''
  }

  markAllAsRead(event: MouseEvent) {
    const userRequestsPayload = {
      request: {
        type: 'all',
      }
    }
    const globalRequestPayload = {
      request: {
        type: 'all',
        action: 'global'
      }
    }
    this.libNotificationService.markAllAsRead(userRequestsPayload).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        this.notifications = this.notifications.map((notification: any) => ({
          ...notification, read: true
        }))
        this.unreadCount = 0
      }
      this.libNotificationService.updateUnreadCount()
    })
    this.libNotificationService.markAllAsRead(globalRequestPayload).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        this.notifications = this.notifications.map((notification: any) => ({
          ...notification, read: true
        }))
        this.unreadCount = 0
        this.snackBar.open('Marked as read.')
      }
      this.libNotificationService.updateUnreadCount()
    })
    event.stopPropagation()
  }
}
