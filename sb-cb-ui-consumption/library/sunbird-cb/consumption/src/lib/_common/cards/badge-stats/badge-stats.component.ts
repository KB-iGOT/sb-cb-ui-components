import { Component, Input } from '@angular/core'

@Component({
  selector: 'sb-uic-app-badge-stats',
  templateUrl: './badge-stats.component.html',
  styleUrls: ['./badge-stats.component.scss']
})
export class BadgeStatsComponent {

  @Input() stats: any[] = [];

}