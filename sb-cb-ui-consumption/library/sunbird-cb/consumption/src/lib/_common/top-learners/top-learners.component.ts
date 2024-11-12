import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { InsiteDataService } from '../../_services/insite-data.service';
@Component({
  selector: 'sb-uic-top-learners',
  templateUrl: './top-learners.component.html',
  styleUrls: ['./top-learners.component.scss']
})
export class TopLearnersComponent implements OnInit {

  @Input() objectData: any
  @Input() channelId: any
  @Input() channnelName: any
  loading: boolean = false
  month: string = ''
  results: any = []

  colors: any = [
    '#EB7181', // red
    '#306933', // green
    '#000000', // black
    '#3670B2', // blue
    '#4E9E87',
    '#7E4C8D',
    '#EB7181', // red
    '#306933', // green
    '#000000', // black
    '#3670B2', // blue
  ]

  constructor(public insightSvc: InsiteDataService,) { }

  ngOnInit() {
    this.getData()
    this.month = new Date().toLocaleString('default', { month: 'long' })
  }

  getData() {
    this.loading = true
    this.insightSvc.fetchLearner(this.channelId).subscribe((res: any)=> {
      if (res && res.result && res.result.result && res.result.result.length) {
        this.results =  res.result.result
        this.month = moment().month(Number(res.result.result[0].month) - 1).format('MMMM')
      }
      this.loading = false
    }, (_error: any) => {
      // tslint:disable-next-line: align
      this.loading = false
    })
  }

  getRank(rank: number) {
    if (rank === 1) {
      return "1st"
    } 
    if (rank === 2) {
      return "2nd"
    } 
    if (rank === 3) {
      return "3rd"
    } else {
      return `${rank}th`
    }    
  }

  getColor() {
    let circleColor = ''
    const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length))
    circleColor = this.colors[randomIndex]
    return circleColor
  }

  createInititals(name: string) {
    let initials = ''
    const array = name.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < name.length; i += 1) {
        if (name.charAt(i) === ' ') {
          continue
        }
        if (name.charAt(i) === name.charAt(i)) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    return initials.toUpperCase()
  }

}
