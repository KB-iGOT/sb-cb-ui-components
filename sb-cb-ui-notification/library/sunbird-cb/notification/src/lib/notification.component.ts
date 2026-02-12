import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'sb-uic-notification',
    template: `
    <p>
      notification works!
    </p>
  `,
    styles: [],
    standalone: false
})
export class NotificationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
