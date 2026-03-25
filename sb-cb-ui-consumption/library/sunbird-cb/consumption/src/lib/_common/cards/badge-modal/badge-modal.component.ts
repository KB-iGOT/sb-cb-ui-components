import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core'
import { PipePublicURLModule } from '@sunbird-cb/utils-v2'
import { BadgeService } from '../../../_services/badge.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-app-badge-modal',
  templateUrl: './badge-modal.component.html',
  styleUrls: ['./badge-modal.component.scss'],
  standalone: true,
  imports: [PipePublicURLModule]
})
export class BadgeModalComponent implements OnInit {
  @Input() badgeData: any
  ngOnInit(): void {
  }
  @Output() close = new EventEmitter<void>()

  constructor(private badgeService: BadgeService, private configSvc: ConfigurationsService) {}

 
  downloadBadge(badgeData: any) {
    console.log("downloadBadge")
    const payload = {
      request: {
        userId: this.configSvc?.userProfile?.userId,
        courseId: this.badgeData?.courseId,
        badgeId: this.badgeData?.badgeId,
      },
    }
   console.log('payload========', payload, badgeData, this.configSvc)
    this.badgeService.generateBadge(payload).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'badge.pdf'
        a.click()

        window.URL.revokeObjectURL(url)
      },
      error: (err) => {
        console.error('Download failed', err)
      },
    })
  }
getUserId(): string {
  return this.configSvc?.userProfile?.userId || ''
}
  closeModal() {
    this.close.emit()
  }
}