import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'd-v2-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss']
})
export class SortByComponent {
  @Input() sortData: any
  @Output() sortOptionSelection = new EventEmitter<any>();
  constructor() {
    this.sortData = [
      {
        key: "members",
        value:"Members",
        orderDirection: "desc",
        orderByKey:"countOfPeopleJoined",
        checked: false
      },
      {
        key: "name",
        value:"Name",
        orderDirection: "asc",
        orderByKey:"communityName",
        checked: false
      },
      {
        key: "activity",
        value:"Activity",
        orderDirection: "desc",
        orderByKey:"updatedOn",
        checked: false
      } ,
      {
        key: "date",
        value:"Date",
        orderDirection: "asc",
        orderByKey:"createdOn",
        checked: false
      } 
    ]
  }

  handleGetFilterType(event: any, type: any, filterType: any) {
    console.log(event,type,filterType)
    type.checked = !type.checked 
    this.sortOptionSelection.emit(type)
  }
}
