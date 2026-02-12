import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'sb-uic-pills',
    templateUrl: './pills.component.html',
    styleUrls: ['./pills.component.scss'],
    standalone: false
})
export class PillsComponent implements OnInit {

  @Input() pillsData: any
  @Input() selectedValue: any
  @Input() isLoading: boolean = false
  @Output() pillClick = new EventEmitter<any>()
  @Input() dynamicClass: any = ''
  @Input() dynamicColor: any = ''
  @Input() requiredTitlecase: boolean = true

  constructor() { }

  ngOnInit() {
  }
  selectedPill(pillData: any) {
    this.pillClick.emit(pillData)
  }


}
