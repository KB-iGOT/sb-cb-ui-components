import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ConfirmationDialogComponent } from '../../../../dialog-components/confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss']
})
export class ActionItemsComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() isStateLearningWeekEnabled: boolean = false;
  @Input() hasUnsavedChanges: boolean = false;
  @Input() slwConfiguration: any
  @Input() userRedirectionEnabled: boolean = false

  @Output() toggleSLW = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<void>();
  @Output() publishChanges = new EventEmitter<void>();
  @Output() configureSLW = new EventEmitter<any>();
  @Output() userRedirectionToggle = new EventEmitter<boolean>()

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('Action Items Component initialized:', {
      isEdit: this.isEdit,
      isStateLearningWeekEnabled: this.isStateLearningWeekEnabled,
      slwConfiguration: this.slwConfiguration
    })
  }

  onToggleStateLearningWeek(event: any) {
    console.log('Toggle clicked:', event.target.checked)

    if (event.target.checked) {
      // If enabling SLW, open configuration dialog
      console.log('Opening SLW configuration dialog')
      this.configureSLW.emit(this.slwConfiguration)
    } else {
      // If disabling, just toggle
      console.log('Disabling SLW')
      this.toggleSLW.emit()
    }
  }

  onSaveChanges() {
    console.log('Save changes clicked')
    this.saveChanges.emit()
  }

  onPublishChanges() {
    console.log('Publish changes clicked')

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Publish Changes',
        description: 'Are you sure you want to publish all changes? This will make the changes live for all users.',
        iconName: 'publish',
        type: 'warning',
        buttonsPositionClass: 'justify-end',
        buttons: [
          {
            text: 'Cancel',
            classes: 'btn-common btn-secondary',
            response: false
          },
          {
            text: 'Publish',
            classes: 'btn-common btn-primary',
            response: true
          }
        ],
      },
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('Publish confirmed')
        this.publishChanges.emit()
      } else {
        console.log('Publish cancelled')
      }
    })
  }

  onConfigureSLW() {
    this.configureSLW.emit(this.slwConfiguration)
  }

  onUserRedirectionToggle(event: any) {
    console.log('User Redirection toggled:', event.checked)
    this.userRedirectionToggle.emit(event.checked)
  }
}