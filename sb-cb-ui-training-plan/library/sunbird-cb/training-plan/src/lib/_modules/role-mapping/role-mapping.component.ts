import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleMappingService } from './services/role-mapping.service';
import { RoleMapping, Ministry, Sector } from './models/role-mapping.model';

@Component({
  selector: 'sb-tp-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.scss']
})
export class RoleMappingComponent implements OnInit, OnDestroy {
  roleMappingForm: FormGroup;
  ministries: Ministry[] = [];
  sectors: Sector[] = [];
  roleMappings: RoleMapping[] = [];
  isLoading = false;
  isGenerating = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private roleMappingService: RoleMappingService,
    private snackBar: MatSnackBar
  ) {
    this.roleMappingForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMinistries();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      type: ['Centre', Validators.required], // Default to Centre as shown in image
      ministry: ['', Validators.required],
      sector: ['', Validators.required],
      additionalDetails: [''] // New field for additional details
    });
  }

  private setupFormSubscriptions(): void {
    // Watch for ministry changes to update sectors
    this.roleMappingForm.get('ministry')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(ministryId => {
        if (ministryId) {
          this.loadSectors(ministryId);
          this.roleMappingForm.patchValue({ sector: '' });
        }
      });
  }

  private loadMinistries(): void {
    this.isLoading = true;
    this.roleMappingService.getMinistries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ministries) => {
          this.ministries = ministries;
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError('Failed to load ministries');
          this.isLoading = false;
        }
      });
  }

  private loadSectors(ministryId?: string): void {
    this.roleMappingService.getSectors(ministryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sectors) => {
          this.sectors = sectors;
        },
        error: (error) => {
          this.handleError('Failed to load sectors');
        }
      });
  }

  onGenerateRoleMapping(): void {
    if (this.roleMappingForm.valid) {
      this.isGenerating = true;
      const formValue = this.roleMappingForm.value;
      
      const selectedMinistry = this.ministries.find(m => m.id === formValue.ministry);
      const selectedSector = this.sectors.find(s => s.id === formValue.sector);

      const roleMapping: RoleMapping = {
        type: formValue.type,
        ministry: selectedMinistry?.name,
        sector: selectedSector?.name,
        additionalDetails: formValue.additionalDetails
      };

      this.roleMappingService.generateRoleMapping(roleMapping)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.showSuccess('Role mapping generated successfully!');
            this.isGenerating = false;
          },
          error: (error) => {
            this.handleError('Failed to generate role mapping');
            this.isGenerating = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.roleMappingForm.controls).forEach(key => {
      const control = this.roleMappingForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private handleError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  // Getter methods for template
  get typeControl() { return this.roleMappingForm.get('type'); }
  get ministryControl() { return this.roleMappingForm.get('ministry'); }
  get sectorControl() { return this.roleMappingForm.get('sector'); }
}