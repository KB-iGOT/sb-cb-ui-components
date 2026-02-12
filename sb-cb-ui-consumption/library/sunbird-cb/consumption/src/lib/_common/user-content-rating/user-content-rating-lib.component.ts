import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { RatingService } from '../../_services/rating.service';
import { ScrollableItemDirective } from './../../_directives/scrollable-item/scrollable-item.directive';
import { UserContentRatingLibService } from './user-content-rating-lib.service';

@Component({
    selector: 'sb-uic-user-content-rating',
    templateUrl: './user-content-rating-lib.component.html',
    styleUrls: ['./user-content-rating-lib.component.scss'],
    standalone: false
})
export class UserContentRatingLibComponent implements OnInit {
  currentIndex: any =0
  @Input() providerId : any = ''
  @Input() formData : any = ''
  @Output() emptyResponse = new EventEmitter<any>()
  styleData: any = {}  
  contentdata: any = []


  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  constructor(public ratingService: RatingService,
    public userRatingSvc: UserContentRatingLibService
  ) { }

  ngOnInit() {
    this.styleData = this.formData && this.formData.sliderData && this.formData.sliderData.styleData
    this.getTopReviews();
  }

  getTopReviews() {
    this.contentdata = []
    this.userRatingSvc.fetchTopReviews(this.providerId).subscribe((response: any) => {
        if(response && response.result && response.result.content.length) {
            response.result.content.forEach((contentEle: any) => {
                let localData = {}
                localData['content'] = contentEle.contentInfo
                localData['rating'] = contentEle.rating
                localData['review'] = contentEle.review
                localData['userDetails'] = contentEle.userDetails
                localData['cardSubType'] =  "card-wide-lib"
                localData['cardCustomeClass'] = ""
                this.contentdata.push(localData)
            });
        } else {
            this.emptyResponse.emit(true)
        }
    },(_error: any)=> {
      this.emptyResponse.emit(true)
    })
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    return this.ratingService.getRatingIcon(ratingIndex, avg)
  }
  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    return this.ratingService.getRatingIconClass(ratingIndex, avg)
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
    this.handleScrollClick(indexValue)
  }

  handleScrollClick(dataValue: string) {
    const item = this.scrollableItems.find(x => x.key === dataValue)
    item.scrollIntoView("nearest");
  }

}
