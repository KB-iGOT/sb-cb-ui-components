import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class AddPersonalisationComponent {
    dialogRef: MatDialogRef<AddPersonalisationComponent>;
    data: any;
    private sharedService;
    private dialog;
    constructor(dialogRef: MatDialogRef<AddPersonalisationComponent>, data: any, sharedService: SharedService, dialog: MatDialog);
    saveRoleMapping(): void;
    closeDialog(): void;
    cancelForm(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AddPersonalisationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AddPersonalisationComponent, "app-add-personalisation", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=add-personalisation.component.d.ts.map