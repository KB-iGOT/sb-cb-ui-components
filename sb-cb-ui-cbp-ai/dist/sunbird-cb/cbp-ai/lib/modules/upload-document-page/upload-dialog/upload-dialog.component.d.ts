import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class UploadDialogComponent {
    dialogRef: MatDialogRef<UploadDialogComponent>;
    sharedService: SharedService;
    snackBar: MatSnackBar;
    dialog: MatDialog;
    readonly MAX_FILES = 10;
    documentName: string;
    selectedFiles: File[];
    cbpFinalObj: any;
    loading: boolean;
    uploadedFileData: any;
    constructor(dialogRef: MatDialogRef<UploadDialogComponent>, sharedService: SharedService, snackBar: MatSnackBar, dialog: MatDialog);
    /** Already uploaded files count */
    get uploadedCount(): number;
    /** Uploaded + newly selected */
    get totalFileCount(): number;
    onFileSelected(event: Event): void;
    removeFile(index: number): void;
    upload(): void;
    triggerFileSummary(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UploadDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UploadDialogComponent, "app-upload-dialog", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=upload-dialog.component.d.ts.map