import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'd-v2-card-toggle',
  templateUrl: './card-toggle.component.html',
  styleUrls: ['./card-toggle.component.scss']
})
export class CardToggleComponent {
  toggleViewBoolean: boolean = false;
  
  @Output() hideCardBody = new EventEmitter<Boolean>()
  toggleViewMethod(){
    this.toggleViewBoolean = !this.toggleViewBoolean
    this.hideCardBody.emit(this.toggleViewBoolean)
  }
}
