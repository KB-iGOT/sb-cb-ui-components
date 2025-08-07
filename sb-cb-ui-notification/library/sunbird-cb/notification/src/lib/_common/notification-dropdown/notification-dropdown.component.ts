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
  @Input() unRead: number = 0
  @Input() showIcon: boolean = false
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
    // let dummy = {
    //   "read": true,
    //   "role": null,
    //   "sub_category": "COURSE_PUBLISHED",
    //   "sub_type": "ALERT",
    //   "created_at": "2025-07-09T07:12:30.596Z",
    //   "notification_id": "9c270d13-6e10-4205-b8b6-5c4844a6e75d",
    //   "source": "USER_CREATED",
    //   "type": "IN_APP",
    //   "message": {
    //     "data": {
    //       "id": "do_113540184895873024146",
    //       "count": 6
    //     },
    //     "body": "Your content 'ADV ' has been published successfully."
    //   },
    //   "category": "LEARN"
    // }
    this.libNotificationService.getNotifications(0, 5, this.currentTab).subscribe((res: any) => {
      this.notifications = _.get(res, 'result.notifications', [])
      //this.notifications.push(dummy)
      const _alerts = _.get(res, 'result.subtypeStats', [])
      this.alerts = _alerts.find(notification => notification.name === 'ALERT')
      this.isLoading = false
    }, error => {
      console.error("Error fetching notifications", error)
      this.isLoading = false
    })
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
