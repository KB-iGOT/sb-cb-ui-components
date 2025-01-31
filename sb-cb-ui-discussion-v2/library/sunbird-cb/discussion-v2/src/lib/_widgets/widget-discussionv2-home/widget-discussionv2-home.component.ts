import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
export interface Community {
  id: number;
  name: string;
  members: string;
  posts: string;
  status: 'open' | 'closed';
  image: string;
  category: string;
}

@Component({
  selector: 'd-v2-widget-discussionv2-home',
  templateUrl: './widget-discussionv2-home.component.html',
  styleUrls: ['./widget-discussionv2-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WidgetDiscussionv2HomeComponent implements OnInit {







 








  @Output() searchText = new EventEmitter<any>();
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();
  userEnrollDetailsData: any;

 
  constructor(private userEnrollSvc: UserEnrollCommunityService) { }
  async ngOnInit() {
      let data = await this.userEnrollSvc.getEnrollData()
      this.userEnrollDetailsData = this.userEnrollSvc.userEnrolledCommunityDetailList
      console.log(data)
  }

  onSearch(event: any): void {
    const searchValue = event.target.value;
    this.searchText.emit(searchValue);
    console.log('Search text:', searchValue);
    // Add your search logic here
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }

  onCardClick(cardData: any){
    
    console.log(cardData)
    this.cardClick.emit(cardData);
  }

}
