import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import * as _ from 'lodash'
@Component({
  selector: 'sb-uin-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit, OnChanges {
  @Input() childData: any;
  @Output() viewAllClick = new EventEmitter<string>()
  currentTab = 'all'
  response: any
  notifications: any[] = []
  alerts: any[] = []



  constructor(private libNotificationService: LibNotificationsService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("change", changes)
  }

  ngOnInit() {
    this.libNotificationService.getNotifications().subscribe((res: any) => {
      this.response = _.get(res, 'result.notifications', [])
      console.log("response", this.response)
      this.getNotificationsObject()
      this.alerts = this.response.filter((notification: any) => notification.category === 'alert')
    })

  }

  getNotificationsObject() {
    this.notifications = this.currentTab === 'all' ? this.response : this.response.filter((notification: any) => notification.category === this.currentTab)
  }

  loadNotifications(type: string, event: MouseEvent) {
    this.currentTab = type
    console.log("currentTab", this.currentTab)
    this.getNotificationsObject()
    event.stopPropagation()
  }

  redirectToNotifications() {
    this.viewAllClick.emit(this.currentTab)
  }

  redirectToNotification(notification: any) {
    this.markAsRead(notification)
  }

  markAsRead(notification: any) {
    const request = {
      request: {
        ids: [notification.notification_id]
      }
    }
    this.libNotificationService.markAsRead(request).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        notification.read = true
      }
    })
  }

  getIconPath(type: string) {
    switch (type) {
      case 'learn':
        return 'assets/icons/notifications-engine/learn.svg';
      case 'network':
        return 'assets/icons/notifications-engine/network.svg';
      case 'event':
        return 'assets/icons/notifications-engine/event.svg';
      case 'comment':
        return 'assets/icons/notifications-engine/discuss.svg';
      default:
        return 'assets/icons/notifications-engine/learn.svg';
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
