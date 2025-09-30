import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-top-learners',
  templateUrl: './top-learners.component.html',
  styleUrls: ['./top-learners.component.scss']
})
export class TopLearnersComponent {
  constructor(
    @Inject('sectionData') public data: any,
    @Inject('channelName') public channelName: string,
    @Inject('orgId') public orgId: string,
    @Inject('slwConfiguration') public slwConfig: any,
    @Inject('eventCallback') private eventCallback: (event: any) => void
  ) {}
  
  onEventFromLeaders(event: any) {
    this.eventCallback({
      action: 'top-learners',
      source: 'topLearners',
      id: event.id || 'learner-event',
      data: event
    });
  }
}