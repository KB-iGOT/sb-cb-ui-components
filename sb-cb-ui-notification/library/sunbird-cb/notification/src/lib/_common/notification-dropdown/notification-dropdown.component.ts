import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import * as _ from 'lodash'
@Component({
  selector: 'sb-uin-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit {
  @Input() childData: any;
  @Output() viewAllClick = new EventEmitter<string>()
  currentTab = 'all'
  response: any
  notifications: any[] = []
  alerts: any
  isLoading = false

  constructor(private libNotificationService: LibNotificationsService,
  ) {

  }

  ngOnInit() {
    this.getUserNotifications()
  }

  getUserNotifications() {
    this.isLoading = true
    this.libNotificationService.getNotifications(0, 5, this.currentTab).subscribe((res: any) => {
      this.notifications = _.get(res, 'result.notifications', [])
      const _alerts = _.get(res, 'result.categoryStats', [])
      this.alerts = _alerts.find(notification => notification.category === 'alert')
      this.isLoading = false
    }, error => {
      console.error("Error fetching notifications", error)
      this.isLoading = false
    })
  }

  markAllAsRead(event: MouseEvent) {
    const request = {
      request: {
        type: "all",
      }
    }
    this.libNotificationService.markAllAsRead(request).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        this.getUserNotifications()
        this.libNotificationService.updateUnreadCount()
      }
    })
    event.stopPropagation()
  }


  loadNotifications(type: string, event: MouseEvent) {
    this.currentTab = type
    console.log("currentTab", this.currentTab)
    this.getUserNotifications()
    event.stopPropagation()
  }

  redirectToAll() {
    this.viewAllClick.emit(this.currentTab)
  }

  redirectToNotification(notification: any) {
    if (!notification.read) {
      this.markAsRead(notification)
    }
    this.viewAllClick.emit(notification)
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
      }
    })
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
}
