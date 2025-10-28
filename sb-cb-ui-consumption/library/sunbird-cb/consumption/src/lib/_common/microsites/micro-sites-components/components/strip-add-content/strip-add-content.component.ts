import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'sb-uic-strip-add-content',
  templateUrl: './strip-add-content.component.html',
  styleUrls: ['./strip-add-content.component.scss']
})
export class StripAddContentComponent {
  searchText = '';
  selectedContents = 'all';

  contents = [
    { value: 'allContent', label: 'All Content' },
    { value: 'Course', label: 'Course' },
    { value: 'Moderated Course', label: 'Moderated Course' },
    { value: 'Program', label: 'Program' },
    { value: 'Curated Program', label: 'Curated Program' },
    { value: 'Blended Program', label: 'Blended Program' },
    { value: 'invite-only program', label: 'Invite Only Program' },
    { value: 'Moderated Program', label: 'Moderated Program' },
    { value: 'Standalone Assessment', label: 'Standalone Assessment' },
    { value: 'invite-only assessment', label: 'Invite Only Assessment' },
    { value: 'Moderated Assessment', label: 'Moderated Assessment' }
  ];

  constructor(
    public dialogRef: MatDialogRef<StripAddContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close()
  }

  onAdd(): void {
    // Add logic here
    this.dialogRef.close({ action: 'add' })
  }

  onPreview(): void {
    // Preview logic here
    console.log('Preview clicked')
  }

  onSearch(): void {
    console.log('Searching for:', this.searchText, 'in program:', this.selectedContents)
    // Add search logic here
  }
}
