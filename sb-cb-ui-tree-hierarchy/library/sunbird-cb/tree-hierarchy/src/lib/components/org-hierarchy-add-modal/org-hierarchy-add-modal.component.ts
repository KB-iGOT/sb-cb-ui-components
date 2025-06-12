import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreeHierarchyService } from '../../tree-hierarchy.service';

@Component({
  selector: 'sb-cb-tree-org-hierarchy-add-modal',
  templateUrl: './org-hierarchy-add-modal.component.html',
  styleUrls: ['./org-hierarchy-add-modal.component.scss']
})
export class OrgHierarchyAddModalComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  selectedOrgsControl = new FormControl<(string | number)[]>([]);
  
  // Example options - replace with your actual data
  orgOptions: any[] = [];
  filteredOptions: any[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<OrgHierarchyAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private treeHierarchySvc: TreeHierarchyService, 
  ) {}

  ngOnInit() {
    this.getSelectedStateOrg()
    
    // Listen for search changes
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.filterOptions(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterOptions(searchValue: string) {
    if (!searchValue) {
      this.filteredOptions = [...this.orgOptions];
      return;
    }
    
    const filterValue = searchValue.toLowerCase();
    this.filteredOptions = this.orgOptions.filter(option => 
      option.orgName.toLowerCase().includes(filterValue)
    );
    
    // Ensure selected items are preserved in the filtered list
    const selectedIds = this.selectedOrgsControl.value || [];
    if (selectedIds.length > 0) {
      // Find any selected items that were filtered out
      const missingSelectedOptions = this.orgOptions.filter((option:any) => 
        selectedIds.includes(option.identifier) && 
        !this.filteredOptions.some(filtered => filtered.identifier === option.identifier)
      );
      // Add missing selected items back to filteredOptions
      if (missingSelectedOptions.length > 0) {
        this.filteredOptions = [...this.filteredOptions, ...missingSelectedOptions];
      }
    }
    this.sortOptionsWithSelectedFirst();
  }

  private sortOptionsWithSelectedFirst() {
    const selectedIds = this.selectedOrgsControl.value || [];
    
    this.filteredOptions.sort((a, b) => {
      const aIsSelected = selectedIds.includes(a.identifier);
      const bIsSelected = selectedIds.includes(b.identifier);
      
      if (aIsSelected && !bIsSelected) {
        return -1; // a comes first (selected items first)
      }
      if (!aIsSelected && bIsSelected) {
        return 1; // b comes first (selected items first)
      }
      
      // If both are selected or both are not selected, sort alphabetically
      return a.orgName.localeCompare(b.orgName);
    });
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchControl.setValue('');
  }

  toggleSelectAll(event: Event) {
    event.stopPropagation();
    if (this.isAllSelected()) {
      this.selectedOrgsControl.setValue([]);
    } else {
      const allValues:any = this.filteredOptions.map(option => option.identifier);
      this.selectedOrgsControl.setValue(allValues);
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selectedOrgsControl.value?.length || 0;
    const numFiltered = this.filteredOptions.length;
    return numSelected > 0 && numSelected === numFiltered;
  }

  getSelectedOptions() {
    const selectedIds: any = this.selectedOrgsControl.value || [];
    return this.orgOptions.filter((option: any) => selectedIds.includes(option.identifier));
  }

  removeSelected(id: string | number) {
    const currentSelection = this.selectedOrgsControl.value || [];
    this.selectedOrgsControl.setValue(
      currentSelection.filter((value: any) => value !== id)
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    const selectedOrgs = this.getSelectedOptions();
    this.dialogRef.close(selectedOrgs);
  }

  async getSelectedStateOrg() {
    const requestBody = {
      request: {
        filters: {
            status: 1,
            ministryOrStateType: (this.data && this.data.selectedOrgData) ?
             this.data.selectedOrgData.sbOrgType : '',
            ministryOrStateId: (this.data && this.data.selectedOrgData) ? 
            this.data.selectedOrgData.identifier : ''
        },
        sort_by: {
            createdDate: "desc"
        },
        limit: 100,
        offset: 0,
        fields: [
            'identifier',
            'orgName',
            'description',
            'parentOrgName',
            'ministryOrStateId',
            'ministryOrStateType',
            'ministryOrStateName'
        ]
      }
    }
    const orgListData = await this.treeHierarchySvc.orgSerachApi(requestBody).toPromise().catch(err => {
      console.error('Error fetching organization data:', err);
    });
    if (orgListData && orgListData.result && 
      orgListData.result.response && orgListData.result.response.content) {
        this.orgOptions = orgListData.result.response.content || [];
        this.filteredOptions = [...this.orgOptions];
    }
  }
}
