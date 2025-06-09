import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sb-cb-tree-org-hierarchy-add-modal',
  templateUrl: './org-hierarchy-add-modal.component.html',
  styleUrls: ['./org-hierarchy-add-modal.component.scss']
})
export class OrgHierarchyAddModalComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  selectedOrgsControl = new FormControl([]);
  
  // Example options - replace with your actual data
  orgOptions: any[] = [];
  filteredOptions: any[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<OrgHierarchyAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Initialize options from data if available
    this.orgOptions = this.data?.currentData?.options || [];
    this.filteredOptions = [...this.orgOptions];
    
    // Listen for search changes
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.filterOptions(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterOptions(searchValue: string): void {
    if (!searchValue) {
      this.filteredOptions = [...this.orgOptions];
      return;
    }
    
    const filterValue = searchValue.toLowerCase();
    this.filteredOptions = this.orgOptions.filter(option => 
      option.name.toLowerCase().includes(filterValue)
    );
  }

  clearSearch(event: Event): void {
    event.stopPropagation();
    this.searchControl.setValue('');
  }

  toggleSelectAll(event: Event): void {
    event.stopPropagation();
    if (this.isAllSelected()) {
      this.selectedOrgsControl.setValue([]);
    } else {
      const allValues:any = this.filteredOptions.map(option => option.id);
      this.selectedOrgsControl.setValue(allValues);
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selectedOrgsControl.value?.length || 0;
    const numFiltered = this.filteredOptions.length;
    return numSelected > 0 && numSelected === numFiltered;
  }

  getSelectedOptions(): any[] {
    const selectedIds: any = this.selectedOrgsControl.value || [];
    return this.orgOptions.filter((option: any) => selectedIds.includes(option.id));
  }

  removeSelected(id: string | number): void {
    const currentSelection = this.selectedOrgsControl.value || [];
    this.selectedOrgsControl.setValue(
      currentSelection.filter((value: any) => value !== id)
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const selectedOrgs = this.getSelectedOptions();
    this.dialogRef.close({ selected: selectedOrgs });
  }
}
