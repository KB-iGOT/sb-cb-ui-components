import { Component, EventEmitter, Input, Output } from '@angular/core';
import { communityConstants } from '../../_model/filter-constants.model'

@Component({
  selector: 'd-v2-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() filterObjectList: any = {}
  @Input() filterKeys: any = {}
  @Output() filterOptionSelected = new EventEmitter<any>();

  selectedOptions: any = {}
  constants: any = communityConstants




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

    this.selectedOptions = {
      [this.constants.orgId] : [],
      [this.constants.topicName] : [],
      [this.constants.competencyArea] : [],
      [this.constants.competencyTheme] : [],
      [this.constants.competencySubTheme] : []
    }
  }
  
  handleGetFilterType(event: any, selectedOption: any, filterType: any) {
    selectedOption['checked']= event.checked
    if(event.checked){
      selectedOption['checked']= event.checked
    } else {

    }

    if(this.selectedOptions[filterType] && this.selectedOptions[filterType].includes(selectedOption.value)){
      const index = this.selectedOptions[filterType].findIndex((x: any) => x === selectedOption.value)
      this.selectedOptions[filterType].splice(index, 1)
    } else {
      this.selectedOptions[filterType].push(selectedOption.value)
    }
    
    console.log(event,selectedOption,filterType)
    console.log(this.selectedOptions)
    this.filterOptionSelected.emit(this.selectedOptions)
  }
}
