import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-v2-similar-community-card',
  templateUrl: './similar-community-card.component.html',
  styleUrls: ['./similar-community-card.component.scss']
})
export class SimilarCommunityCardComponent {
  hideCardBody:boolean | undefined
  @Input() expandCard: boolean= true
  @Input() communityData: any = []
}
