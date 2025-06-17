import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'sb-cb-tree-category-edit-module',
  templateUrl: './category-edit-module.component.html',
  styleUrls: ['./category-edit-module.component.scss']
})
export class CategoryEditModuleComponent implements OnInit {

  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryEditModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log('Category Edit Module Data:', this.data);
    this.initForm()
  }

  initForm() {    
    this.categoryForm = this.fb.group({
      categoryName: [this.data?.columnInfo?.name || '', Validators.required],
      categoryDescription: [this.data?.columnInfo?.description || '', Validators.maxLength(500)]
    });
  }

  /**
   * Close the dialog without saving changes
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Save the updated category name and close the dialog
   */
  saveCategoryName() {
    if (this.categoryForm.valid) {
      const updatedCategory = {
        ...this.data.column,
        config: {
          ...this.data.column.config,
          categoryDisplayName: this.categoryForm.get('categoryName')?.value || ''
        }
      };
      
      this.dialogRef.close({
        updated: true,
        column: updatedCategory,
        index: this.data.index
      });
    }
  }

}
