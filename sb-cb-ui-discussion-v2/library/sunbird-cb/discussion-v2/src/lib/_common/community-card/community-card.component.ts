import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-v2-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent {
  @Input() community: any;

}
