import { Component } from '@angular/core';

@Component({
  selector: 'd-v2-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  sortData: any
  filterData: any

  constructor() {
    this.sortData = [
      {
        key: "Members",
        value:"Members",
        checked: false
      },
      {
        key: "Name",
        value:"Name",
        checked: false
      },
      {
        key: "Activity",
        value:"Activity",
        checked: false
      } 
    ]
    this.filterData = [
      {
        label:"MDO’s",
        placeholder:"Search MDO's"
      },
      {
        label:"Topics",
        placeholder:"Search Topics"
      },
      {
        label:"Competency Area",
        placeholder:"Search Competency Area"
      },
      {
        label:"Competency Theme",
        placeholder:"Search Competency Theme"
      },
      {
        label:"Competency Sub Theme",
        placeholder:"Search Competency Sub Theme"
      }
    ]
  }
  
  handleGetFilterType(event: any, type: any, filterType: any) {
    console.log(event,type,filterType)
  }
}
