import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class DeleteRoleMappingPopupComponent {
    dialogRef: MatDialogRef<DeleteRoleMappingPopupComponent>;
    data: any;
    sharedService: SharedService;
    planData: any;
    isViewCourse: boolean;
    constructor(dialogRef: MatDialogRef<DeleteRoleMappingPopupComponent>, data: any, sharedService: SharedService);
    confirmDelete(): void;
    regenerateRoleMapping(): void;
    cancel(event: any): void;
    cancelCourse(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteRoleMappingPopupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteRoleMappingPopupComponent, "app-delete-role-mapping-popup", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=delete-role-mapping-popup.component.d.ts.map