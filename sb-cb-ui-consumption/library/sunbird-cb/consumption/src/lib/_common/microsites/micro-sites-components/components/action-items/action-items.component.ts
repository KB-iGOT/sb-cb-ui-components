import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss']
})
export class ActionItemsComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() isStateLearningWeekEnabled: boolean = false;
  @Input() hasUnsavedChanges: boolean = false;
  @Input() slwConfiguration: any;
  
  @Output() toggleSLW = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<void>();
  @Output() publishChanges = new EventEmitter<void>();
  @Output() configureSLW = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log('Action Items Component initialized:', {
      isEdit: this.isEdit,
      isStateLearningWeekEnabled: this.isStateLearningWeekEnabled,
      slwConfiguration: this.slwConfiguration
    });
  }

  onToggleStateLearningWeek(event: any) {
    console.log('Toggle clicked:', event.target.checked);
    
    if (event.target.checked) {
      // If enabling SLW, open configuration dialog
      console.log('Opening SLW configuration dialog');
      this.configureSLW.emit(this.slwConfiguration);
    } else {
      // If disabling, just toggle
      console.log('Disabling SLW');
      this.toggleSLW.emit();
    }
  }

  onSaveChanges() {
    console.log('Save changes clicked');
    this.saveChanges.emit();
  }

  onPublishChanges() {
    console.log('Publish changes clicked');
    this.publishChanges.emit();
  }

  onConfigureSLW() {
    this.configureSLW.emit(this.slwConfiguration);
  }
}