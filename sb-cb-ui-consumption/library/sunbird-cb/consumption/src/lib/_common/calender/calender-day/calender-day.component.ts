import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'sb-uic-calender-day',
    templateUrl: './calender-day.component.html',
    styleUrls: ['./calender-day.component.scss'],
    standalone: false
})
export class CalenderDayComponent implements OnInit {

  @Input() objectData: any
  @Input() layoutType: any
  @Input() day: any
  @Input() dataLoading: boolean
  @Input() rowId: any
  @Input() eventDate: any
  webDisplayDate: string = ""
  mobileDisplayDate: string = ""
  currentDate: any = new Date()

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.currentDate = this.datePipe.transform(this.currentDate, 'y-MM-dd')
  }

  openLink(link: string) {
    window.open(link, "_blank")
  }

  formatDate(date: any, type: string) {
    let fDate = new Date(date)
    if (type === 'web') {
      return this.datePipe.transform(fDate, 'E, dd LLL')
    }
    if (type === 'mob') {
      return this.datePipe.transform(fDate, 'E dd LLL')
    }
  }
}
