import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InsiteDataService } from '../../_services/insite-data.service';

@Component({
  selector: 'sb-uic-mdo-leaderboard',
  templateUrl: './mdo-leaderboard.component.html',
  styleUrls: ['./mdo-leaderboard.component.scss']
})
export class MdoLeaderboardComponent implements OnInit {

  currentTab: any = 'XL'
  result: any = []
  filteredData: any
  searchTerm: string = ''
  expand: boolean = true
  disableLeft: boolean = true
  disableRight: boolean = false
  @Input() orgId:any = ''

  @Input() object: any
  @Input() slwConfig: any = {}
  @Output() tabClicked = new EventEmitter<any>()
  @ViewChild('scrollableContent', { static: false }) scrollableContent: ElementRef;
  constructor(private insiteDataService: InsiteDataService) { }

  ngOnInit() {
    this.currentTab = this.object.currentTab || this.currentTab
    if(this.slwConfig && this.slwConfig.enabled) {
      this.getSlwData()
    } else {
      this.getData()
    }
  }

  getSlwData() {
    let request = {
      "request": {
        "mdoId": this.orgId
    }
    }
    this.insiteDataService.fetchSlwLeaderboard(request).subscribe((res: any) => {
      if (res && res.result ) {
          this.result = res.result
          this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
      }
      
  }, error => {
      console.log(error)
  })
  }

  getData() {
    this.insiteDataService.fetchLeaderboard().subscribe((res: any) => {
        if (res && res.result) {
            this.result = res.result
            this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
        }
        
    }, error => {
        console.log(error)
    })
  }

  getFilteredData(response: any) {
    if(response && response.length > 0) {
     return  response.filter((user: any) => user.size === this.currentTab) 
            .map(user => ({ ...user, children: [], selected: false })).slice(0, 5)
    }
    return []
  }
  getTabData(name: any) {
    this.currentTab = name
    this.searchTerm = ''
    this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
    let nameStr: any = ''
    if(this.object&& this.object.options && this.object.options.length > 0) {
      nameStr = this.object.options.find((option: any) => option.value === name).label
    } else {
    switch (name) {
      case 'XL':
        nameStr = 'greater-than-50K'
        break
      case 'L':
        nameStr =  '10K-50K'
        break
      case 'M':
        nameStr =  '1K-10K'
        break
        case 'S':
          nameStr = '500-1K'
          break
      default:
        nameStr = 'less-than-500'
        break
    }
  }
    this.tabClicked.emit(nameStr)
  }

  getRank(rank: number) {
    return [1,2,3].includes(rank) ? `rank${rank}` : 'rank0'
  }

  getMedal(rank: number) {
    if (rank === 1) {
        return 'assets/images/national-learning/Medal1.svg'
    } else if(rank === 2) {
        return 'assets/images/national-learning/Medal2.svg'
    } else {
        return 'assets/images/national-learning/Medal3.svg'
    }
  }

  handleSearchQuery(e: any) {
    if (e.target.value && e.target.value.length > 0) {
        this.searchTerm = e.target.value
        this.filteredData = this.result.mdoLeaderBoard
            .filter(user => user.size === this.currentTab && user.org_name.toLowerCase().includes(e.target.value))
            .map(user => ({ ...user, children: []})).slice(0, 5)
    } else {
        this.filteredData = this.result.mdoLeaderBoard
            .filter(user => user.size === this.currentTab)
            .map(user => ({ ...user, children: []})).slice(0, 5)
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  scrollToRight() {
    this.scrollableContent.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    })
    this.disableLeft = false
    this.disableRight = true
  }


  scrollToLeft() {
    this.scrollableContent.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    })
    this.disableLeft = true
    this.disableRight = false
  }

}
