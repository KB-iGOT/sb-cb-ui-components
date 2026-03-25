import { Component, EventEmitter, Output, Input } from '@angular/core'
import { PipePublicURLModule } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-app-badge-modal',
  templateUrl: './badge-modal.component.html',
  styleUrls: ['./badge-modal.component.scss'],
  standalone: true,
  imports: [PipePublicURLModule]
})
export class BadgeModalComponent {

  @Input() badgeData: any
  ngOnInit(): void {
  }
  @Output() close = new EventEmitter<void>()

  closeModal() {
    this.close.emit()
  }
}