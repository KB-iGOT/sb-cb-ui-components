import { Component, EventEmitter, Output, Input } from '@angular/core'

@Component({
  selector: 'sb-uic-app-badge-modal',
  templateUrl: './badge-modal.component.html',
  styleUrls: ['./badge-modal.component.scss'],
})
export class BadgeModalComponent {

  @Input() badgeData: any

  @Output() close = new EventEmitter<void>()

  closeModal() {
    this.close.emit()
  }
}