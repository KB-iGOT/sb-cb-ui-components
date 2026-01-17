import { Component, Input } from '@angular/core';

@Component({
    selector: 'd-v2-topic-card',
    templateUrl: './topic-card.component.html',
    styleUrls: ['./topic-card.component.scss'],
    standalone: false
})
export class TopicCardComponent {
  @Input() topicTitle: any;
  @Input() topicCommunityCount: any;
  @Input() isLoading: boolean = false;
  constructor() { 
    
  }
}
