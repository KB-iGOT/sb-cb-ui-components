import { Component, Input, OnInit } from '@angular/core'
import { WidgetContentService, ConfigurationsService } from '@sunbird-cb/utils'
import { IContentRating } from './contentRating.model'

@Component({
  selector: 'ws-widget-user-content-detailed-rating',
  templateUrl: './user-content-detailed-rating.component.html',
  styleUrls: ['./user-content-detailed-rating.component.scss'],
})
export class UserContentDetailedRatingComponent implements OnInit {
  @Input() contentId!: string
  @Input() isDisabled = true
  isRequesting = true
  userRating!: IContentRating
  @Input() forPreview = false
  averageRatings = 0

  constructor(
    // private events: EventService,
    private contentSvc: WidgetContentService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (!this.forPreview) {
      this.contentSvc.fetchContentRatingsV2(this.contentId).subscribe(
        result => {
          this.isRequesting = false
          this.userRating = result
        },
        _err => {
          this.isRequesting = false
        },
      )
    }
  }

  // addRating(index: number) {
  //   if (!this.forPreview && !this.isDisabled) {
  //     this.isRequesting = true
  //     const previousRating = this.userRating
  //     if (this.userRating !== index + 1) {
  //       this.userRating = index + 1
  //       this.events.raiseInteractTelemetry('rating', 'content', {
  //         contentId: this.contentId,
  //         rating: this.userRating,
  //       })
  //       this.contentSvc.addContentRating(this.contentId, { rating: this.userRating }).subscribe(
  //         _ => {
  //           this.isRequesting = false
  //         },
  //         _ => {
  //           this.isRequesting = false
  //           this.userRating = previousRating
  //         },
  //       )
  //     } else {
  //       this.contentSvc.deleteContentRating(this.contentId).subscribe(
  //         _ => {
  //           this.userRating = 0
  //           this.isRequesting = false
  //         },
  //         _ => {
  //           this.isRequesting = false
  //           this.userRating = previousRating
  //         },
  //       )
  //     }
  //   } else {
  //     this.userRating = index + 1
  //   }
  // }

  public get enableFeature(): boolean {
    switch (this.configSvc.rootOrg) {
      default:
        return true
    }
  }
}
