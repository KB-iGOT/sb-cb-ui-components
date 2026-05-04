import { Component } from '@angular/core';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';
import { interval, forkJoin } from 'rxjs';
import { startWith, switchMap, takeWhile, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "../../shared/services/shared.service";
import * as i3 from "@angular/material/snack-bar";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/legacy-button";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/progress-spinner";
import * as i8 from "@angular/material/tooltip";
export class UploadDialogComponent {
    constructor(dialogRef, sharedService, snackBar, dialog) {
        this.dialogRef = dialogRef;
        this.sharedService = sharedService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.MAX_FILES = 10;
        this.documentName = '';
        this.selectedFiles = [];
        this.cbpFinalObj = {};
        this.loading = false;
        this.uploadedFileData = {};
        this.cbpFinalObj = this.sharedService.getCBPPlanLocalStorage();
    }
    /** Already uploaded files count */
    get uploadedCount() {
        return this.cbpFinalObj?.documents?.length || 0;
    }
    /** Uploaded + newly selected */
    get totalFileCount() {
        return this.uploadedCount + this.selectedFiles.length;
    }
    onFileSelected(event) {
        const input = event.target;
        if (!input.files)
            return;
        const files = Array.from(input.files);
        const allowedExtensions = ['pdf', 'doc', 'docx'];
        for (const file of files) {
            if (this.totalFileCount >= this.MAX_FILES) {
                this.snackBar.open('You can upload a maximum of 10 documents.', 'X', {
                    duration: 3000,
                    panelClass: ['snackbar-error']
                });
                break;
            }
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!ext || !allowedExtensions.includes(ext)) {
                this.snackBar.open(`Invalid file type: ${file.name}`, 'X', { duration: 3000, panelClass: ['snackbar-error'] });
                continue;
            }
            // Prevent duplicate selection
            if (this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                continue;
            }
            this.selectedFiles.push(file);
        }
        // Reset input so same file can be re-selected
        input.value = '';
    }
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
    }
    // upload(): void {
    //   if (!this.documentName || this.selectedFiles.length === 0) {
    //     return;
    //   }
    //   if (this.totalFileCount > this.MAX_FILES) {
    //     this.snackBar.open('Maximum 10 documents allowed.', 'X', {
    //       duration: 3000,
    //       panelClass: ['snackbar-error']
    //     });
    //     return;
    //   }
    //   this.loading = true;
    //   const uploadNext = (index: number) => {
    //     if (index >= this.selectedFiles.length) {
    //       this.loading = false;
    //       this.dialogRef.close('close');
    //       return;
    //     }
    //     const file = this.selectedFiles[index];
    //     const reqBody = {
    //       state_center_id: this.cbpFinalObj?.ministry?.identifier,
    //       department_id: this.cbpFinalObj?.departments,
    //       documentName: this.documentName
    //     };
    //     this.sharedService.uploadDocument(reqBody, file).subscribe({
    //       next: (res) => {
    //         this.uploadedFileData = res;
    //         this.triggerFileSummary();
    //         uploadNext(index + 1);
    //       },
    //       error: (err) => {
    //         this.loading = false;
    //         this.snackBar.open(
    //           err?.error?.detail || 'Upload failed',
    //           'X',
    //           { duration: 3000, panelClass: ['snackbar-error'] }
    //         );
    //       }
    //     });
    //   };
    //   uploadNext(0);
    // }
    upload() {
        if (this.selectedFiles.length === 0) {
            return;
        }
        if (this.totalFileCount > this.MAX_FILES) {
            this.snackBar.open('Maximum 10 documents allowed.', 'X', {
                duration: 3000,
                panelClass: ['snackbar-error']
            });
            return;
        }
        const formData = new FormData();
        // Required fields
        formData.append('state_center_id', this.cbpFinalObj?.ministry?.identifier || '');
        formData.append('department_id', this.cbpFinalObj?.departments || '');
        // Append multiple files with SAME key "files"
        this.selectedFiles.forEach((file) => {
            formData.append('files', file, file.name);
        });
        this.loading = true;
        this.sharedService.uploadDocument(formData).subscribe({
            next: (res) => {
                this.loading = false;
                this.uploadedFileData = res;
                this.triggerFileSummary();
                this.snackBar.open(res?.message, 'X', {
                    duration: 3000,
                    panelClass: ['snackbar-success']
                });
            },
            error: (error) => {
                this.loading = false;
                this.snackBar.open(error?.error?.detail || 'Upload failed', 'X', { duration: 3000, panelClass: ['snackbar-error'] });
            }
        });
    }
    triggerFileSummary() {
        if (!this.uploadedFileData?.successful_uploads?.length)
            return;
        const files = this.uploadedFileData.successful_uploads;
        const totalFiles = files.length;
        const dialogRefForProgress = this.dialog.open(ProgressDialogComponent, {
            disableClose: true,
            data: { progress: 0, message: `Processing 0 of ${totalFiles} summaries...` }
        });
        let completedFiles = 0;
        const pollingRequests = files.map(file => interval(5000).pipe(startWith(0), // trigger immediately
        switchMap(() => this.sharedService.triggerFileSummary(file.file_id)), // must return { summary_status }
        tap((res) => {
            if (res.summary_status === 'COMPLETED') {
                completedFiles++;
                dialogRefForProgress.componentInstance.data.progress = Math.floor((completedFiles / totalFiles) * 100);
                dialogRefForProgress.componentInstance.data.message = `Processing ${completedFiles} of ${totalFiles} summaries...`;
            }
        }), takeWhile((res) => res.summary_status !== 'COMPLETED', true)));
        forkJoin(pollingRequests).subscribe({
            complete: () => {
                dialogRefForProgress.componentInstance.data.progress = 100;
                dialogRefForProgress.componentInstance.data.message = `All ${totalFiles} summaries completed!`;
                setTimeout(() => {
                    dialogRefForProgress.close();
                    this.dialogRef.close('close');
                }, 500);
            },
            error: () => {
                dialogRefForProgress.close();
                this.dialogRef.close('close');
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UploadDialogComponent, deps: [{ token: i1.MatDialogRef }, { token: i2.SharedService }, { token: i3.MatSnackBar }, { token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: UploadDialogComponent, selector: "app-upload-dialog", ngImport: i0, template: "<h2 mat-dialog-title>Upload Document</h2>\n\n<mat-dialog-content>\n\n  <!-- <mat-form-field appearance=\"fill\" style=\"width: 100%; border: 1px solid #000;\">\n    <input\n      matInput\n      [(ngModel)]=\"documentName\"\n      placeholder=\"Document Name\"\n      [disabled]=\"totalFileCount >= MAX_FILES\"\n    >\n  </mat-form-field> -->\n\n  <!-- Upload Box -->\n  <div\n    class=\"file-upload-box\"\n    style=\"margin-top: 30px;\"\n    [class.disabled]=\"totalFileCount >= MAX_FILES\"\n    (click)=\"totalFileCount < MAX_FILES && fileInput.click()\"\n  >\n    <input\n      type=\"file\"\n      #fileInput\n      hidden\n      multiple\n      accept=\".pdf,.doc,.docx\"\n      (change)=\"onFileSelected($event)\"\n    >\n\n    <p *ngIf=\"totalFileCount < MAX_FILES\">\n      Click to select files\n    </p>\n\n    <p *ngIf=\"totalFileCount >= MAX_FILES\" class=\"error-text\">\n      Maximum 10 documents allowed\n    </p>\n\n    <p><strong>Note:</strong> <small>PDF Files Only (Max:25 MB)</small></p>\n  </div>\n\n  <!-- Selected Files List -->\n  <div *ngIf=\"selectedFiles.length > 0\" class=\"file-list\" style=\"margin-top:10px\">\n    <p><strong>Selected Files</strong></p>\n\n    <div class=\"file-item\" *ngFor=\"let file of selectedFiles; let i = index\">\n      <span>{{ file.name }}</span>\n      <span (click)=\"removeFile(i)\">\n        <mat-icon class=\"file-cross-icon\" matTooltip=\"Remove\" matTooltipPosition=\"above\">close</mat-icon>\n      </span>\n    </div>\n  </div>\n\n</mat-dialog-content>\n\n<div class=\"disclaimer-text\">\n  <p>Disclaimer: Please do not upload any confidential documents.</p>\n</div>\n\n<mat-dialog-actions align=\"center\" style=\"margin: 20px 0;\">\n  <button mat-button mat-dialog-close>Cancel</button>\n\n  <button class=\"primary-btn cursor-pointer\"\n    mat-raised-button\n    color=\"primary\"\n    (click)=\"upload()\"\n    [disabled]=\"selectedFiles.length === 0\"\n  >\n    Upload\n  </button>\n</mat-dialog-actions>\n\n<div class=\"overlay-loader\" *ngIf=\"loading\">\n  <mat-spinner diameter=\"50\"></mat-spinner>\n</div>\n", styles: [".file-upload-box{border:2px dashed #ccc;padding:20px;text-align:center;cursor:pointer;margin-top:10px}.primary-btn{background-color:#1b4ca1;color:#fff}.disclaimer-text p{font-size:16px;font-family:Lato;font-weight:400;margin-left:24px}.file-cross-icon{height:24px;width:24px;vertical-align:middle;background:#d3d3d3;margin-left:10px;border-radius:25px}:host .mat-mdc-dialog-content{max-height:100vh!important}.cursor-pointer{cursor:pointer}\n"], dependencies: [{ kind: "directive", type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i5.MatLegacyButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i6.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: i1.MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }, { kind: "directive", type: i1.MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: i1.MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: i1.MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: i7.MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "directive", type: i8.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UploadDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-upload-dialog', template: "<h2 mat-dialog-title>Upload Document</h2>\n\n<mat-dialog-content>\n\n  <!-- <mat-form-field appearance=\"fill\" style=\"width: 100%; border: 1px solid #000;\">\n    <input\n      matInput\n      [(ngModel)]=\"documentName\"\n      placeholder=\"Document Name\"\n      [disabled]=\"totalFileCount >= MAX_FILES\"\n    >\n  </mat-form-field> -->\n\n  <!-- Upload Box -->\n  <div\n    class=\"file-upload-box\"\n    style=\"margin-top: 30px;\"\n    [class.disabled]=\"totalFileCount >= MAX_FILES\"\n    (click)=\"totalFileCount < MAX_FILES && fileInput.click()\"\n  >\n    <input\n      type=\"file\"\n      #fileInput\n      hidden\n      multiple\n      accept=\".pdf,.doc,.docx\"\n      (change)=\"onFileSelected($event)\"\n    >\n\n    <p *ngIf=\"totalFileCount < MAX_FILES\">\n      Click to select files\n    </p>\n\n    <p *ngIf=\"totalFileCount >= MAX_FILES\" class=\"error-text\">\n      Maximum 10 documents allowed\n    </p>\n\n    <p><strong>Note:</strong> <small>PDF Files Only (Max:25 MB)</small></p>\n  </div>\n\n  <!-- Selected Files List -->\n  <div *ngIf=\"selectedFiles.length > 0\" class=\"file-list\" style=\"margin-top:10px\">\n    <p><strong>Selected Files</strong></p>\n\n    <div class=\"file-item\" *ngFor=\"let file of selectedFiles; let i = index\">\n      <span>{{ file.name }}</span>\n      <span (click)=\"removeFile(i)\">\n        <mat-icon class=\"file-cross-icon\" matTooltip=\"Remove\" matTooltipPosition=\"above\">close</mat-icon>\n      </span>\n    </div>\n  </div>\n\n</mat-dialog-content>\n\n<div class=\"disclaimer-text\">\n  <p>Disclaimer: Please do not upload any confidential documents.</p>\n</div>\n\n<mat-dialog-actions align=\"center\" style=\"margin: 20px 0;\">\n  <button mat-button mat-dialog-close>Cancel</button>\n\n  <button class=\"primary-btn cursor-pointer\"\n    mat-raised-button\n    color=\"primary\"\n    (click)=\"upload()\"\n    [disabled]=\"selectedFiles.length === 0\"\n  >\n    Upload\n  </button>\n</mat-dialog-actions>\n\n<div class=\"overlay-loader\" *ngIf=\"loading\">\n  <mat-spinner diameter=\"50\"></mat-spinner>\n</div>\n", styles: [".file-upload-box{border:2px dashed #ccc;padding:20px;text-align:center;cursor:pointer;margin-top:10px}.primary-btn{background-color:#1b4ca1;color:#fff}.disclaimer-text p{font-size:16px;font-family:Lato;font-weight:400;margin-left:24px}.file-cross-icon{height:24px;width:24px;vertical-align:middle;background:#d3d3d3;margin-left:10px;border-radius:25px}:host .mat-mdc-dialog-content{max-height:100vh!important}.cursor-pointer{cursor:pointer}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatDialogRef }, { type: i2.SharedService }, { type: i3.MatSnackBar }, { type: i1.MatDialog }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9saWJyYXJ5L3N1bmJpcmQtY2IvY2JwLWFpL3NyYy9saWIvbW9kdWxlcy91cGxvYWQtZG9jdW1lbnQtcGFnZS91cGxvYWQtZGlhbG9nL3VwbG9hZC1kaWFsb2cuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicmFyeS9zdW5iaXJkLWNiL2NicC1haS9zcmMvbGliL21vZHVsZXMvdXBsb2FkLWRvY3VtZW50LXBhZ2UvdXBsb2FkLWRpYWxvZy91cGxvYWQtZGlhbG9nLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLMUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFPLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7O0FBTTNFLE1BQU0sT0FBTyxxQkFBcUI7SUFVaEMsWUFDUyxTQUE4QyxFQUM5QyxhQUE0QixFQUM1QixRQUFxQixFQUNyQixNQUFpQjtRQUhqQixjQUFTLEdBQVQsU0FBUyxDQUFxQztRQUM5QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVc7UUFaakIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUV4QixpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUNsQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixnQkFBVyxHQUFRLEVBQUUsQ0FBQztRQUN0QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hC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QUF1QixDQUFDO2dCQUMvRixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFDO29CQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsQ0FBQztZQUNELEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ1Ysb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLENBQUM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDOytHQTlOVSxxQkFBcUI7bUdBQXJCLHFCQUFxQix5RENibEMsNmlFQTBFQTs7NEZEN0RhLHFCQUFxQjtrQkFMakMsU0FBUzsrQkFDRSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQgeyBTaGFyZWRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC5zZXJ2aWNlJztcbmltcG9ydCB7IE1hdFNuYWNrQmFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJztcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQgeyBQcm9ncmVzc0RpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL3Byb2dyZXNzLWRpYWxvZy9wcm9ncmVzcy1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IGludGVydmFsLCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVdoaWxlLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtdXBsb2FkLWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnLi91cGxvYWQtZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdXBsb2FkLWRpYWxvZy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFVwbG9hZERpYWxvZ0NvbXBvbmVudCB7XG5cbiAgcmVhZG9ubHkgTUFYX0ZJTEVTID0gMTA7XG5cbiAgZG9jdW1lbnROYW1lID0gJyc7XG4gIHNlbGVjdGVkRmlsZXM6IEZpbGVbXSA9IFtdO1xuICBjYnBGaW5hbE9iajogYW55ID0ge307XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgdXBsb2FkZWRGaWxlRGF0YTogYW55ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPFVwbG9hZERpYWxvZ0NvbXBvbmVudD4sXG4gICAgcHVibGljIHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UsXG4gICAgcHVibGljIHNuYWNrQmFyOiBNYXRTbmFja0JhcixcbiAgICBwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2dcbiAgKSB7XG4gICAgdGhpcy5jYnBGaW5hbE9iaiA9IHRoaXMuc2hhcmVkU2VydmljZS5nZXRDQlBQbGFuTG9jYWxTdG9yYWdlKCk7XG4gIH1cblxuICAvKiogQWxyZWFkeSB1cGxvYWRlZCBmaWxlcyBjb3VudCAqL1xuICBnZXQgdXBsb2FkZWRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNicEZpbmFsT2JqPy5kb2N1bWVudHM/Lmxlbmd0aCB8fCAwO1xuICB9XG5cbiAgLyoqIFVwbG9hZGVkICsgbmV3bHkgc2VsZWN0ZWQgKi9cbiAgZ2V0IHRvdGFsRmlsZUNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMudXBsb2FkZWRDb3VudCArIHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGg7XG4gIH1cblxuICBvbkZpbGVTZWxlY3RlZChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGlmICghaW5wdXQuZmlsZXMpIHJldHVybjtcblxuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShpbnB1dC5maWxlcyk7XG4gICAgY29uc3QgYWxsb3dlZEV4dGVuc2lvbnMgPSBbJ3BkZicsICdkb2MnLCAnZG9jeCddO1xuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBpZiAodGhpcy50b3RhbEZpbGVDb3VudCA+PSB0aGlzLk1BWF9GSUxFUykge1xuICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oJ1lvdSBjYW4gdXBsb2FkIGEgbWF4aW11bSBvZiAxMCBkb2N1bWVudHMuJywgJ1gnLCB7XG4gICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgcGFuZWxDbGFzczogWydzbmFja2Jhci1lcnJvciddXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXh0ID0gZmlsZS5uYW1lLnNwbGl0KCcuJykucG9wKCk/LnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIWV4dCB8fCAhYWxsb3dlZEV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oXG4gICAgICAgICAgYEludmFsaWQgZmlsZSB0eXBlOiAke2ZpbGUubmFtZX1gLFxuICAgICAgICAgICdYJyxcbiAgICAgICAgICB7IGR1cmF0aW9uOiAzMDAwLCBwYW5lbENsYXNzOiBbJ3NuYWNrYmFyLWVycm9yJ10gfVxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmVudCBkdXBsaWNhdGUgc2VsZWN0aW9uXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLnNvbWUoZiA9PiBmLm5hbWUgPT09IGZpbGUubmFtZSAmJiBmLnNpemUgPT09IGZpbGUuc2l6ZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5wdXNoKGZpbGUpO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IGlucHV0IHNvIHNhbWUgZmlsZSBjYW4gYmUgcmUtc2VsZWN0ZWRcbiAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICB9XG5cbiAgcmVtb3ZlRmlsZShpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RlZEZpbGVzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cblxuICAvLyB1cGxvYWQoKTogdm9pZCB7XG4gIC8vICAgaWYgKCF0aGlzLmRvY3VtZW50TmFtZSB8fCB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoID09PSAwKSB7XG4gIC8vICAgICByZXR1cm47XG4gIC8vICAgfVxuXG4gIC8vICAgaWYgKHRoaXMudG90YWxGaWxlQ291bnQgPiB0aGlzLk1BWF9GSUxFUykge1xuICAvLyAgICAgdGhpcy5zbmFja0Jhci5vcGVuKCdNYXhpbXVtIDEwIGRvY3VtZW50cyBhbGxvd2VkLicsICdYJywge1xuICAvLyAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgLy8gICAgICAgcGFuZWxDbGFzczogWydzbmFja2Jhci1lcnJvciddXG4gIC8vICAgICB9KTtcbiAgLy8gICAgIHJldHVybjtcbiAgLy8gICB9XG5cbiAgLy8gICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gIC8vICAgY29uc3QgdXBsb2FkTmV4dCA9IChpbmRleDogbnVtYmVyKSA9PiB7XG4gIC8vICAgICBpZiAoaW5kZXggPj0gdGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCkge1xuICAvLyAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgLy8gICAgICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UoJ2Nsb3NlJyk7XG4gIC8vICAgICAgIHJldHVybjtcbiAgLy8gICAgIH1cblxuICAvLyAgICAgY29uc3QgZmlsZSA9IHRoaXMuc2VsZWN0ZWRGaWxlc1tpbmRleF07XG5cbiAgLy8gICAgIGNvbnN0IHJlcUJvZHkgPSB7XG4gIC8vICAgICAgIHN0YXRlX2NlbnRlcl9pZDogdGhpcy5jYnBGaW5hbE9iaj8ubWluaXN0cnk/LmlkZW50aWZpZXIsXG4gIC8vICAgICAgIGRlcGFydG1lbnRfaWQ6IHRoaXMuY2JwRmluYWxPYmo/LmRlcGFydG1lbnRzLFxuICAvLyAgICAgICBkb2N1bWVudE5hbWU6IHRoaXMuZG9jdW1lbnROYW1lXG4gIC8vICAgICB9O1xuXG4gIC8vICAgICB0aGlzLnNoYXJlZFNlcnZpY2UudXBsb2FkRG9jdW1lbnQocmVxQm9keSwgZmlsZSkuc3Vic2NyaWJlKHtcbiAgLy8gICAgICAgbmV4dDogKHJlcykgPT4ge1xuICAvLyAgICAgICAgIHRoaXMudXBsb2FkZWRGaWxlRGF0YSA9IHJlcztcbiAgLy8gICAgICAgICB0aGlzLnRyaWdnZXJGaWxlU3VtbWFyeSgpO1xuICAvLyAgICAgICAgIHVwbG9hZE5leHQoaW5kZXggKyAxKTtcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgLy8gICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgLy8gICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oXG4gIC8vICAgICAgICAgICBlcnI/LmVycm9yPy5kZXRhaWwgfHwgJ1VwbG9hZCBmYWlsZWQnLFxuICAvLyAgICAgICAgICAgJ1gnLFxuICAvLyAgICAgICAgICAgeyBkdXJhdGlvbjogMzAwMCwgcGFuZWxDbGFzczogWydzbmFja2Jhci1lcnJvciddIH1cbiAgLy8gICAgICAgICApO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9KTtcbiAgLy8gICB9O1xuXG4gIC8vICAgdXBsb2FkTmV4dCgwKTtcbiAgLy8gfVxuXG4gIHVwbG9hZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgXG4gICAgaWYgKHRoaXMudG90YWxGaWxlQ291bnQgPiB0aGlzLk1BWF9GSUxFUykge1xuICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKCdNYXhpbXVtIDEwIGRvY3VtZW50cyBhbGxvd2VkLicsICdYJywge1xuICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgcGFuZWxDbGFzczogWydzbmFja2Jhci1lcnJvciddXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIFxuICAgIC8vIFJlcXVpcmVkIGZpZWxkc1xuICAgIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICdzdGF0ZV9jZW50ZXJfaWQnLFxuICAgICAgdGhpcy5jYnBGaW5hbE9iaj8ubWluaXN0cnk/LmlkZW50aWZpZXIgfHwgJydcbiAgICApO1xuICBcbiAgICBmb3JtRGF0YS5hcHBlbmQoXG4gICAgICAnZGVwYXJ0bWVudF9pZCcsXG4gICAgICB0aGlzLmNicEZpbmFsT2JqPy5kZXBhcnRtZW50cyB8fCAnJ1xuICAgICk7XG4gIFxuICAgIC8vIEFwcGVuZCBtdWx0aXBsZSBmaWxlcyB3aXRoIFNBTUUga2V5IFwiZmlsZXNcIlxuICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5mb3JFYWNoKChmaWxlOiBGaWxlKSA9PiB7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGVzJywgZmlsZSwgZmlsZS5uYW1lKTtcbiAgICB9KTtcbiAgXG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgXG4gICAgdGhpcy5zaGFyZWRTZXJ2aWNlLnVwbG9hZERvY3VtZW50KGZvcm1EYXRhKS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKHJlcykgPT4ge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGxvYWRlZEZpbGVEYXRhID0gcmVzO1xuICAgICAgICB0aGlzLnRyaWdnZXJGaWxlU3VtbWFyeSgpO1xuICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4ocmVzPy5tZXNzYWdlLCAnWCcsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICBwYW5lbENsYXNzOiBbJ3NuYWNrYmFyLXN1Y2Nlc3MnXVxuICAgICAgICB9KTtcbiAgXG4gICAgICAgIFxuICAgICAgfSxcbiAgICAgIGVycm9yOiAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIFxuICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oXG4gICAgICAgICAgZXJyb3I/LmVycm9yPy5kZXRhaWwgfHwgJ1VwbG9hZCBmYWlsZWQnLFxuICAgICAgICAgICdYJyxcbiAgICAgICAgICB7IGR1cmF0aW9uOiAzMDAwLCBwYW5lbENsYXNzOiBbJ3NuYWNrYmFyLWVycm9yJ10gfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuXG5cbiAgdHJpZ2dlckZpbGVTdW1tYXJ5KCkge1xuICAgIGlmICghdGhpcy51cGxvYWRlZEZpbGVEYXRhPy5zdWNjZXNzZnVsX3VwbG9hZHM/Lmxlbmd0aCkgcmV0dXJuO1xuICBcbiAgICBjb25zdCBmaWxlcyA9IHRoaXMudXBsb2FkZWRGaWxlRGF0YS5zdWNjZXNzZnVsX3VwbG9hZHM7XG4gICAgY29uc3QgdG90YWxGaWxlcyA9IGZpbGVzLmxlbmd0aDtcbiAgXG4gICAgY29uc3QgZGlhbG9nUmVmRm9yUHJvZ3Jlc3MgPSB0aGlzLmRpYWxvZy5vcGVuKFByb2dyZXNzRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBkYXRhOiB7IHByb2dyZXNzOiAwLCBtZXNzYWdlOiBgUHJvY2Vzc2luZyAwIG9mICR7dG90YWxGaWxlc30gc3VtbWFyaWVzLi4uYCB9XG4gICAgfSk7XG4gIFxuICAgIGxldCBjb21wbGV0ZWRGaWxlcyA9IDA7XG4gIFxuICAgIGNvbnN0IHBvbGxpbmdSZXF1ZXN0cyA9IGZpbGVzLm1hcChmaWxlID0+XG4gICAgICBpbnRlcnZhbCg1MDAwKS5waXBlKFxuICAgICAgICBzdGFydFdpdGgoMCksIC8vIHRyaWdnZXIgaW1tZWRpYXRlbHlcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMuc2hhcmVkU2VydmljZS50cmlnZ2VyRmlsZVN1bW1hcnkoZmlsZS5maWxlX2lkKSksIC8vIG11c3QgcmV0dXJuIHsgc3VtbWFyeV9zdGF0dXMgfVxuICAgICAgICB0YXAoKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKHJlcy5zdW1tYXJ5X3N0YXR1cyA9PT0gJ0NPTVBMRVRFRCcpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlZEZpbGVzKys7XG4gICAgICAgICAgICBkaWFsb2dSZWZGb3JQcm9ncmVzcy5jb21wb25lbnRJbnN0YW5jZS5kYXRhLnByb2dyZXNzID0gTWF0aC5mbG9vcigoY29tcGxldGVkRmlsZXMgLyB0b3RhbEZpbGVzKSAqIDEwMCk7XG4gICAgICAgICAgICBkaWFsb2dSZWZGb3JQcm9ncmVzcy5jb21wb25lbnRJbnN0YW5jZS5kYXRhLm1lc3NhZ2UgPSBgUHJvY2Vzc2luZyAke2NvbXBsZXRlZEZpbGVzfSBvZiAke3RvdGFsRmlsZXN9IHN1bW1hcmllcy4uLmA7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgdGFrZVdoaWxlKChyZXM6IGFueSkgPT4gcmVzLnN1bW1hcnlfc3RhdHVzICE9PSAnQ09NUExFVEVEJywgdHJ1ZSlcbiAgICAgIClcbiAgICApO1xuICBcbiAgICBmb3JrSm9pbihwb2xsaW5nUmVxdWVzdHMpLnN1YnNjcmliZSh7XG4gICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICBkaWFsb2dSZWZGb3JQcm9ncmVzcy5jb21wb25lbnRJbnN0YW5jZS5kYXRhLnByb2dyZXNzID0gMTAwO1xuICAgICAgICBkaWFsb2dSZWZGb3JQcm9ncmVzcy5jb21wb25lbnRJbnN0YW5jZS5kYXRhLm1lc3NhZ2UgPSBgQWxsICR7dG90YWxGaWxlc30gc3VtbWFyaWVzIGNvbXBsZXRlZCFgO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBkaWFsb2dSZWZGb3JQcm9ncmVzcy5jbG9zZSgpO1xuICAgICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKCdjbG9zZScpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgIGRpYWxvZ1JlZkZvclByb2dyZXNzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKCdjbG9zZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuXG5cbn1cbiIsIjxoMiBtYXQtZGlhbG9nLXRpdGxlPlVwbG9hZCBEb2N1bWVudDwvaDI+XG5cbjxtYXQtZGlhbG9nLWNvbnRlbnQ+XG5cbiAgPCEtLSA8bWF0LWZvcm0tZmllbGQgYXBwZWFyYW5jZT1cImZpbGxcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1wiPlxuICAgIDxpbnB1dFxuICAgICAgbWF0SW5wdXRcbiAgICAgIFsobmdNb2RlbCldPVwiZG9jdW1lbnROYW1lXCJcbiAgICAgIHBsYWNlaG9sZGVyPVwiRG9jdW1lbnQgTmFtZVwiXG4gICAgICBbZGlzYWJsZWRdPVwidG90YWxGaWxlQ291bnQgPj0gTUFYX0ZJTEVTXCJcbiAgICA+XG4gIDwvbWF0LWZvcm0tZmllbGQ+IC0tPlxuXG4gIDwhLS0gVXBsb2FkIEJveCAtLT5cbiAgPGRpdlxuICAgIGNsYXNzPVwiZmlsZS11cGxvYWQtYm94XCJcbiAgICBzdHlsZT1cIm1hcmdpbi10b3A6IDMwcHg7XCJcbiAgICBbY2xhc3MuZGlzYWJsZWRdPVwidG90YWxGaWxlQ291bnQgPj0gTUFYX0ZJTEVTXCJcbiAgICAoY2xpY2spPVwidG90YWxGaWxlQ291bnQgPCBNQVhfRklMRVMgJiYgZmlsZUlucHV0LmNsaWNrKClcIlxuICA+XG4gICAgPGlucHV0XG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAjZmlsZUlucHV0XG4gICAgICBoaWRkZW5cbiAgICAgIG11bHRpcGxlXG4gICAgICBhY2NlcHQ9XCIucGRmLC5kb2MsLmRvY3hcIlxuICAgICAgKGNoYW5nZSk9XCJvbkZpbGVTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICA+XG5cbiAgICA8cCAqbmdJZj1cInRvdGFsRmlsZUNvdW50IDwgTUFYX0ZJTEVTXCI+XG4gICAgICBDbGljayB0byBzZWxlY3QgZmlsZXNcbiAgICA8L3A+XG5cbiAgICA8cCAqbmdJZj1cInRvdGFsRmlsZUNvdW50ID49IE1BWF9GSUxFU1wiIGNsYXNzPVwiZXJyb3ItdGV4dFwiPlxuICAgICAgTWF4aW11bSAxMCBkb2N1bWVudHMgYWxsb3dlZFxuICAgIDwvcD5cblxuICAgIDxwPjxzdHJvbmc+Tm90ZTo8L3N0cm9uZz4gPHNtYWxsPlBERiBGaWxlcyBPbmx5IChNYXg6MjUgTUIpPC9zbWFsbD48L3A+XG4gIDwvZGl2PlxuXG4gIDwhLS0gU2VsZWN0ZWQgRmlsZXMgTGlzdCAtLT5cbiAgPGRpdiAqbmdJZj1cInNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMFwiIGNsYXNzPVwiZmlsZS1saXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj5cbiAgICA8cD48c3Ryb25nPlNlbGVjdGVkIEZpbGVzPC9zdHJvbmc+PC9wPlxuXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtaXRlbVwiICpuZ0Zvcj1cImxldCBmaWxlIG9mIHNlbGVjdGVkRmlsZXM7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgIDxzcGFuPnt7IGZpbGUubmFtZSB9fTwvc3Bhbj5cbiAgICAgIDxzcGFuIChjbGljayk9XCJyZW1vdmVGaWxlKGkpXCI+XG4gICAgICAgIDxtYXQtaWNvbiBjbGFzcz1cImZpbGUtY3Jvc3MtaWNvblwiIG1hdFRvb2x0aXA9XCJSZW1vdmVcIiBtYXRUb29sdGlwUG9zaXRpb249XCJhYm92ZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbjwvbWF0LWRpYWxvZy1jb250ZW50PlxuXG48ZGl2IGNsYXNzPVwiZGlzY2xhaW1lci10ZXh0XCI+XG4gIDxwPkRpc2NsYWltZXI6IFBsZWFzZSBkbyBub3QgdXBsb2FkIGFueSBjb25maWRlbnRpYWwgZG9jdW1lbnRzLjwvcD5cbjwvZGl2PlxuXG48bWF0LWRpYWxvZy1hY3Rpb25zIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJtYXJnaW46IDIwcHggMDtcIj5cbiAgPGJ1dHRvbiBtYXQtYnV0dG9uIG1hdC1kaWFsb2ctY2xvc2U+Q2FuY2VsPC9idXR0b24+XG5cbiAgPGJ1dHRvbiBjbGFzcz1cInByaW1hcnktYnRuIGN1cnNvci1wb2ludGVyXCJcbiAgICBtYXQtcmFpc2VkLWJ1dHRvblxuICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgKGNsaWNrKT1cInVwbG9hZCgpXCJcbiAgICBbZGlzYWJsZWRdPVwic2VsZWN0ZWRGaWxlcy5sZW5ndGggPT09IDBcIlxuICA+XG4gICAgVXBsb2FkXG4gIDwvYnV0dG9uPlxuPC9tYXQtZGlhbG9nLWFjdGlvbnM+XG5cbjxkaXYgY2xhc3M9XCJvdmVybGF5LWxvYWRlclwiICpuZ0lmPVwibG9hZGluZ1wiPlxuICA8bWF0LXNwaW5uZXIgZGlhbWV0ZXI9XCI1MFwiPjwvbWF0LXNwaW5uZXI+XG48L2Rpdj5cbiJdfQ==