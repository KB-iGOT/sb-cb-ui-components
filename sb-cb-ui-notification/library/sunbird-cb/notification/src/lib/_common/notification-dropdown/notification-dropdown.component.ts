import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibNotificationsService } from '../../_services/lib-notifications.service';
import { PeerReadOverlayService } from '../../_services/peer-read-overlay.service';
import * as _ from 'lodash'
@Component({
    selector: 'sb-uin-notification-dropdown',
    templateUrl: './notification-dropdown.component.html',
    styleUrls: ['./notification-dropdown.component.scss'],
    standalone: false
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  @Input() childData: any;
  @Input() unRead: number = 0
  @Input() showIcon: boolean = false
  @Output() viewAllClick = new EventEmitter<any>()
  currentTab = 'all'
  response: any
  notifications: any[] = []
  alerts: any
  mandatoryNotifications: any[] = []
  mandatoryNotificationsCount: number = 0
  isLoading = false
  peerValidations: any[] = []
  peerValidationsCount: number = 0
  constructor(
    private libNotificationService: LibNotificationsService,
    private snackBar: MatSnackBar,
    private overlayService: PeerReadOverlayService
  ) {}

  ngOnDestroy(): void {
    this.overlayService.hide()
  }

  ngOnInit() {
    this.getUserNotifications()
    this.getMandatoryNotifications()
    this.getPeerValidationNotifications()
  }

  getMandatoryNotifications() {
    this.libNotificationService.getMandatoryNotifications(0, 5).subscribe((res: any) => {
      let notifications = _.get(res, 'result.notifications', [])
      this.mandatoryNotifications = notifications
      this.mandatoryNotificationsCount = notifications.length
    }, error => {
      console.error("Error fetching mandatory notifications", error)
    })
  }

  getPeerValidationNotifications() {
    this.libNotificationService.getNotifications(0, 5, 'PEER_VALIDATION').subscribe((res: any) => {
      const notifications = _.get(res, 'result.notifications', [])
      this.peerValidations = notifications
      this.peerValidationsCount = notifications.length
    }, error => {
      console.error('Error fetching peer validation notifications', error)
    })
  }

  getUserNotifications() {
    this.isLoading = true
    this.libNotificationService.getNotifications(0, 5, this.currentTab).subscribe((res: any) => {
      this.notifications = _.get(res, 'result.notifications', [])
      const _alerts = _.get(res, 'result.subtypeStats', [])
      this.alerts = _alerts.find((notification: any) => notification.name === 'ALERT')
      this.isLoading = false
    }, error => {
      console.error("Error fetching notifications", error)
      this.isLoading = false
    })
  }

  loadNotifications(type: string, event: MouseEvent) {
    this.currentTab = type
    if (type === 'MANDATORY') {
      this.notifications = this.mandatoryNotifications
    }  
    else if (type === 'PEER_VALIDATION') {
      this.notifications = this.peerValidations
    } 
    else {
      this.getUserNotifications()
    }
    event.stopPropagation()
  }

  redirectToAll() {
    this.viewAllClick.emit(this.currentTab)
  }

  redirectToNotification(notification: any, event: MouseEvent) {
    if (!notification.read) {
      if (this.currentTab === 'MANDATORY') {
        this.markMandatoryAsRead(notification)
      } else if (this.currentTab === 'PEER_VALIDATION' || notification.category === 'PEER_VALIDATION' || notification.sub_type === 'PEER_VALIDATION') {
        event.stopPropagation()
        this.markPeerValidationAsRead(notification)
      } else {
        this.markAsRead(notification)
        this.viewAllClick.emit(notification)
      }
    } else {
      this.viewAllClick.emit(notification)
    }
  }

  markMandatoryAsRead(notification: any) {
    let request: any = {
        request: {
            id: notification.notification_id,
            created_at: notification.created_at,
            type : notification.type
        }
    }
    this.libNotificationService.markMandatoryAsRead(request).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        notification.read = true
        this.libNotificationService.updateUnreadCount()
        this.viewAllClick.emit(notification)
      }
    })
  }

  markPeerValidationAsRead(notification: any) {
    const request: any = {
      request: {
        type: 'individual',
        ids: [notification.notification_id],
        created_at: notification.created_at,
      }
    }
    this.overlayService.show()
    this.libNotificationService.markAsRead(request).subscribe((res: any) => {
      this.overlayService.hide()
      if (res.responseCode === 'OK') {
        notification.read = true
        this.libNotificationService.updateUnreadCount()

        const matMenuPanel = document.querySelector('.mat-mdc-menu-panel, .mat-menu-panel') as HTMLElement | null
        if (matMenuPanel) {
          matMenuPanel.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
        }
        this.viewAllClick.emit(notification)
      }
    }, (_error: any) => {
      this.overlayService.hide()
      this.snackBar.open('Notification read failed', 'Close', { duration: 3000 })
    })
  }

  markAsRead(notification: any) {
    let request: any = {
      request: {
        type: 'individual',
        ids: [notification.notification_id],
        created_at: notification.created_at
      }
    }
    if (['COURSE_PUBLISHED', 'PROGRAM_PUBLISHED', 'EVENT_PUBLISHED'].includes(notification.sub_category)) {
      request.request.action = 'global'
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
      case 'PEER_VALIDATION':
        return 'assets/icons/notifications-engine/how_to_reg 1.svg'
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
