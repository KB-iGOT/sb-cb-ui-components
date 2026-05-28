import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Designation {
  id: string;
  name: string;
  sort_order: number;
}

@Component({
  selector: 'app-update-designation-hierarchy',
  templateUrl: './update-designation-hierarchy.component.html',
  styleUrls: ['./update-designation-hierarchy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateDesignationHierarchyComponent implements OnInit {
  openDropdownId: string | null = null;
  isOpen = true;
  state_center_id!: string;
  department_id!: string;
  designations: any[] = [];
  role_mapping_generation: any
  loading = false
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  numbers: number[] = [];

  constructor(private http: HttpClient, public sharedService: SharedService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {


    this.refreshRoleMappingData()



    console.log('this.designations--', this.designations)

  }

  drop(event: CdkDragDrop<Designation[]>) {
    moveItemInArray(this.designations, event.previousIndex, event.currentIndex);

    // Update sort_order based on the new array index
    this.designations.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }

  // onOrderChange(item: any) {
  //   const selectedOrder = item.sort_order;
  //   const currentIndex = this.designations.findIndex(d => d.id === item.id);

  //   this.designations.splice(currentIndex, 1);
  //   this.designations.splice(selectedOrder - 1, 0, item);

  //   this.designations.forEach((d, index) => d.sort_order = index + 1);
  // }

  private updateSortOrderByIndex() {
    this.designations.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }

  submit() {
    let payload = {
      designations: this.designations.map(d => ({
        id: d.id,
        sort_order: d.sort_order
      }))
    };

    if (typeof this.department_id === 'string' && this.department_id) {
      payload['department_id'] = this.department_id
    }
    if (this.state_center_id) {
      payload['state_center_id'] = this.state_center_id
    }

    console.log('payload--', payload)
    this.loading = true
    // Example API call
    this.sharedService.updateDesignationHierarchy(payload)
      .subscribe(() => {
        this.sharedService.updateDesignationHierarchySubject.next(true)
        this.submitted.emit(payload);
        this.closeDrawer.emit();
      });

    this.sharedService.updateDesignationHierarchy(payload).subscribe({
      next: (res) => {
        // Success handling
        console.log('Success:', res);
        this.loading = false
        this.sharedService.updateDesignationHierarchySubject.next(true)
        this.submitted.emit(payload);
        this.closeDrawer.emit();
        this.snackBar.open('Designation Hierarchy Saved Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        // Handle 409 Conflict here
        // alert('Conflict detected: The resource already exists or action conflicts.');
        //this.get
        // Or you can set a UI error message variable
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.loading = false
        //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }
    });
  }

  cancel() {
    this.isOpen = false
    this.closeDrawer.emit();
  }

  refreshRoleMappingData() {
    console.log('Refreshing role mapping data...');
    if (this.sharedService.cbpPlanFinalObj && this.sharedService.cbpPlanFinalObj.ministry && this.sharedService.cbpPlanFinalObj.ministry.identifier) {
      const ministryType = this.sharedService.cbpPlanFinalObj.ministry.sbOrgType;
      const ministryId = this.sharedService.cbpPlanFinalObj.ministry.identifier;

      this.loading = true;

      if (ministryType === 'ministry') {
        if (this.sharedService.cbpPlanFinalObj.departments) {
          const departmentId = this.sharedService.cbpPlanFinalObj.departments;
          this.sharedService.getRoleMappingByStateCenterAndDepartment(ministryId, departmentId).subscribe({
            next: (res) => {
              this.loading = false;
              console.log('State role mapping data refreshed:', res);
            },
            error: (error) => {
              this.loading = false;
              console.error('Error refreshing state role mapping data:', error);
            }
          });
        } else {
          this.sharedService.getRoleMappingByStateCenter(ministryId).subscribe({
            next: (res) => {
              this.loading = false;
              console.log('Center role mapping data refreshed:', res);
            },
            error: (error) => {
              this.loading = false;
              console.error('Error refreshing center role mapping data:', error);
            }
          });
        }

      } else if (ministryType === 'state') {
        const departmentId = this.sharedService.cbpPlanFinalObj.departments;
        this.sharedService.getRoleMappingByStateCenterAndDepartment(ministryId, departmentId).subscribe({
          next: (res) => {
            this.loading = false;
            console.log('State role mapping data refreshed:', res);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error refreshing state role mapping data:', error);
          }
        });
      }
    }
    let cbpPlanFinalObj = this.sharedService.cbpPlanFinalObj
    console.log('cbpPlanFinalObj--', cbpPlanFinalObj)
    if (cbpPlanFinalObj?.departments) {
      this.department_id = cbpPlanFinalObj?.departments
    }
    if (cbpPlanFinalObj?.ministry && cbpPlanFinalObj?.ministry.identifier) {
      this.state_center_id = cbpPlanFinalObj?.ministry.identifier
    }

    this.role_mapping_generation = cbpPlanFinalObj?.role_mapping_generation || '[]';
    // Map role_mapping_generation to internal designations array
    this.numbers = Array.from({ length: this.role_mapping_generation.length }, (_, i) => i + 1);
    this.designations = this.role_mapping_generation.map((r: any, index: number) => ({
      id: r.id,
      name: r.designation_name,
      sort_order: r.sort_order || index + 1,
      searchFilter: '',              // Search input value
      filteredNumbers: [...this.numbers] // Numbers to display in select
    }));


    this.loading = false
    this.numbers = Array.from({ length: this.designations.length }, (_, i) => i + 1);
    // Sort by sort_order
    this.designations.sort((a, b) => a.sort_order - b.sort_order);
    this.updateSortOrderByIndex();
  }

toggleDropdown(item: any, event: Event) {
  event.stopPropagation();
  this.openDropdownId = this.openDropdownId === item.id ? null : item.id;

  setTimeout(() => {
    const dropdownEl = document.getElementById('dropdown-' + item.id);
    if (!dropdownEl) return;

    const rect = dropdownEl.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If dropdown bottom exceeds viewport, open upward
    if (rect.bottom > windowHeight) {
      dropdownEl.style.top = `-${rect.height}px`;  // open above
    } else {
      dropdownEl.style.top = `100%`;  // open below
    }
  });
}


// Select number from dropdown
selectNumber(item: any, num: number, event: Event) {
  event.stopPropagation(); // IMPORTANT: prevents parent toggle

  // Set the selected value
  item.sort_order = num;

  // Close dropdown
  this.openDropdownId = null;

  // Reset search
  item.searchFilter = '';
  item.filteredNumbers = [...this.numbers];

  // Reorder array
  this.onOrderChange(item);
}

filterNumbers(item: any) {
  if (!item.searchFilter) {
    item.filteredNumbers = [...this.numbers];
  } else {
    const filterValue = item.searchFilter.toString().toLowerCase();
    item.filteredNumbers = this.numbers.filter(num =>
      num.toString().toLowerCase().includes(filterValue)
    );
  }
}

onOrderChange(item: any) {
  const selectedOrder = item.sort_order;
  const currentIndex = this.designations.findIndex(d => d.id === item.id);

  this.designations.splice(currentIndex, 1);
  this.designations.splice(selectedOrder - 1, 0, item);

  this.designations.forEach((d, index) => (d.sort_order = index + 1));
}

trackById(index: number, item: any) {
  return item.id;
}


}
