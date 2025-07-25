import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-uin-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.scss']
})
export class ViewContentComponent {
  @Input() notification: any
}
