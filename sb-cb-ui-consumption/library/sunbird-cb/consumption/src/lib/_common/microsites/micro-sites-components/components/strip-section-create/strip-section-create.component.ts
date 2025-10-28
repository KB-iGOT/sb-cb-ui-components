import { Component, Input, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { StripAddContentComponent } from '../strip-add-content/strip-add-content.component'

@Component({
  selector: 'sb-uic-strip-section-create',
  templateUrl: './strip-section-create.component.html',
  styleUrls: ['./strip-section-create.component.scss']
})
export class StripSectionCreateComponent {
  @Input() sectionData: any
  @Input() sectionIndex: number = 0;
  @Output() removeSection = new EventEmitter<void>();

  isEditingTitle = false;
  tempTitle = '';

  constructor(private dialog: MatDialog) { }

  onRemoveSection() {
    this.removeSection.emit()
  }

  startEditTitle() {
    this.isEditingTitle = true
    this.tempTitle = this.sectionData?.name || 'Add Section Name'
  }

  saveTitle() {
    if (this.tempTitle.trim()) {
      this.sectionData.name = this.tempTitle.trim()
    }
    this.isEditingTitle = false
  }

  cancelEdit() {
    this.isEditingTitle = false
    this.tempTitle = ''
  }

  onTitleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveTitle()
    } else if (event.key === 'Escape') {
      this.cancelEdit()
    }
  }

  openAddContentDialog() {
    const dialogRef = this.dialog.open(StripAddContentComponent, {
      width: '1000px',
      data: {
        sectionIndex: this.sectionIndex,
        sectionData: this.sectionData
      },
      position: { top: '50px' },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog
        console.log('Content added:', result)
      }
    })
  }
}
