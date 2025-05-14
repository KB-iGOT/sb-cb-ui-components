import { Component } from '@angular/core';

@Component({
  selector: 'sb-uin-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent {
  currentTab = 'all'
  allNotifications: any[] = [
    {
      type: 'learn',
      title: '3 Courses recommended by Neha Agarwal.',
      description: 'You have a new message from your mentor.',
      timestamp: '2023-10-01T10:00:00Z',
      read: false
    },
    {
      type: 'network',
      title: 'Anil and 5 others requested to connect.',
      description: 'View all connection request',
      timestamp: '2023-10-01T10:00:00Z',
      read: false
    },
    {
      type: 'event',
      title: '2 New events are now live on the platform.',
      description: 'Upcoming event: Digital Learning Week. Save your spot!',
      timestamp: '2023-10-01T10:00:00Z',
      read: false
    },
    {
      type: "discuss",
      title: "Anil and 7 others liked your post.",
      description: "View all likes on your post.",
      timestamp: '2023-10-01T10:00:00Z',
      read: false
    }
  ]

  constructor() {

  }

  loadNotifications(type: string) {
    this.currentTab = type
  }

  redirectToNotifications() {

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
}
