import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import * as _ from 'lodash'
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'sb-uin-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss']
})
export class AllNotificationsComponent implements OnInit {

  @Output() reCountNotifications = new EventEmitter<any>()
  @Output() redirectTo = new EventEmitter<any>()


  notifications: any[] = []
  dynamicTabIndex: number = 0
  currentTab: any = 'all'
  loading: boolean = false
  response: any[] = []
  pageSize: number = 5
  pageNumber: number = 0
  hasNextPage: boolean = false
  unreadCount: number = 0
  tabs: any[] = [
    { id: "all", category: 'all' },
  ]
  private scrollNotificationsSubject = new Subject<Event>()

  constructor(readonly route: ActivatedRoute,
    private libNotificationService: LibNotificationsService
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
    const request = {
      request: {
        type: "individual",
        ids: [notification.notification_id]
      }
    }

    this.libNotificationService.markAsRead(request).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        notification.read = true
        this.libNotificationService.updateUnreadCount()
        this.redirectTo.emit(notification)
      }
    })
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

  getIconPath(type: string) {
    switch (type) {
      case 'learn':
        return 'assets/icons/notifications-engine/learn.svg'
      case 'network':
        return 'assets/icons/notifications-engine/network.svg'
      case 'event':
        return 'assets/icons/notifications-engine/event.svg'
      case 'discussion':
        return 'assets/icons/notifications-engine/discuss.svg'
      default:
        return 'assets/icons/notifications-engine/learn.svg'
    }
  }

  onTabChange(type: number) {
    console.log('type', type)
    //this.currentTab = type
    this.dynamicTabIndex = type
    this.currentTab = this.tabs[this.dynamicTabIndex].category.toLowerCase()
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
      const tabs = _.get(res, 'result.categoryStats', [])
      this.tabs = [{ id: "all", category: 'all' }]
      tabs.forEach((tab: any) => {
        this.tabs.push(tab)
        if (tab.unread) {
          this.unreadCount += tab.unread
        }
      })
      if (this.currentTab) {
        const index = this.tabs.findIndex(tab => tab.category === this.currentTab)
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
    notification.isExpanded = !notification.isExpanded
  }

  getCount(read: any, unread: any) {
    return (+read || +unread) ? `(${+read + +unread})` : ''
  }

  markAllAsRead(event: MouseEvent) {
    const request = {
      request: {
        type: "all",
      }
    }
    this.libNotificationService.markAllAsRead(request).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        this.notifications = this.notifications.map((notification: any) => ({
          ...notification, read: true
        }))
        this.unreadCount = 0
      }
      this.libNotificationService.updateUnreadCount()
    })
    event.stopPropagation()
  }
}
