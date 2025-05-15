import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sb-uin-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss']
})
export class AllNotificationsComponent implements OnInit {

  notifications: any[] = []
  currentTab: number = 0

  tabs: any[] = [
    { id: 'all', title: 'All', count: 123 },
    { id: 'alerts', title: 'Alerts', count: 10 },
    { id: 'updates', title: 'Updates', count: 23 },
    { id: 'engagement', title: 'Engagement', count: 5 },
    { id: 'promotions', title: 'Promotions', count: 19 },
  ]

  allNotifications: any[] = [
    {
      type: 'learn',
      title: '3 Courses recommended by Neha Agarwal.',
      description: 'You have a new message from your mentor.',
      timestamp: this.getTimeAgo('2025-05-15T04:51:00Z'),
      isRead: false
    },
    {
      type: 'network',
      title: 'Anil and 5 others requested to connect.',
      description: 'View all connection request',
      timestamp: this.getTimeAgo('2025-05-15T03:00:00Z'),
      isRead: false
    },
    {
      type: 'event',
      title: '2 New events are now live on the platform.',
      description: 'Upcoming event: Digital Learning Week. Save your spot!',
      timestamp: this.getTimeAgo('2025-05-12T04:00:00Z'),
      isRead: true
    },
    {
      type: "discuss",
      title: "Anil and 7 others liked your post.",
      description: "View all likes on your post.",
      timestamp: this.getTimeAgo('2025-02-15T04:00:00Z'),
      isRead: false
    }
  ]

  alerts: any[] = [
    {
      type: 'learn',
      title: '3 Courses recommended by Neha Agarwal.',
      description: 'You have a new message from your mentor.',
      timestamp: this.getTimeAgo('2025-05-15T04:51:00Z'),
      isRead: false
    },
    {
      type: 'network',
      title: 'Anil and 5 others requested to connect.',
      description: 'View all connection request',
      timestamp: this.getTimeAgo('2025-05-15T04:00:00Z'),
      isRead: true
    },
    {
      type: 'event',
      title: '2 New events are now live on the platform.',
      description: 'Upcoming event: Digital Learning Week. Save your spot!',
      timestamp: this.getTimeAgo('2025-01-15T04:00:00Z'),
      isRead: false
    },
    {
      type: "discuss",
      title: "Anil and 7 others liked your post.",
      description: "View all likes on your post.",
      timestamp: this.getTimeAgo('2025-05-13T04:00:00Z'),
      isRead: true
    },
    {
      type: 'event',
      title: '8 New events are now live on the platform.',
      description: 'Upcoming event: Digital Learning Week. Save your spot!',
      timestamp: this.getTimeAgo('2024-05-15T04:00:00Z'),
      isRead: false
    },
  ]

  constructor() {

  }

  ngOnInit() {
    this.getNotificationsObject()
  }

  getNotificationsObject() {
    this.notifications = this.currentTab === 0 ? this.allNotifications : this.alerts
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
        return 'assets/icons/notifications-engine/learn.svg';
      case 'network':
        return 'assets/icons/notifications-engine/network.svg';
      case 'event':
        return 'assets/icons/notifications-engine/event.svg';
      case 'discuss':
        return 'assets/icons/notifications-engine/discuss.svg';
      default:
        return 'assets/icons/notifications-engine/learn.svg';
    }
  }

  onTabChange(type: any) {
    this.currentTab = type
    console.log('currentTab', this.currentTab)
    this.getNotificationsObject()
  }
}
