import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-v2-trending-discussions',
  templateUrl: './trending-discussions.component.html',
  styleUrls: ['./trending-discussions.component.scss']
})
export class TrendingDiscussionsComponent {
 @Input() data: any = []
}
