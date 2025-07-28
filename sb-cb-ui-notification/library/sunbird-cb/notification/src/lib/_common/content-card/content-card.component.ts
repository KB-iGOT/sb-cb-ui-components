import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-uin-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {
  @Input() skeletonLoader: boolean
  @Input() content: any

  defaultThumbnail: any
  defaultSLogo: any

  ngOnInit() {
    console.log("content", this.content)
    this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
    this.defaultSLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
  }


  getRedirectUrlData(event: any) {
    console.log("event", event)
  }
}
