import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class DeleteRoleMappingComponent {
    dialogRef: MatDialogRef<DeleteRoleMappingComponent>;
    data: any;
    private sharedService;
    private snackBar;
    loading: boolean;
    planData: any;
    constructor(dialogRef: MatDialogRef<DeleteRoleMappingComponent>, data: any, sharedService: SharedService, snackBar: MatSnackBar);
    deleteRoleMapping(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteRoleMappingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteRoleMappingComponent, "app-delete-role-mapping", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=delete-role-mapping.component.d.ts.map