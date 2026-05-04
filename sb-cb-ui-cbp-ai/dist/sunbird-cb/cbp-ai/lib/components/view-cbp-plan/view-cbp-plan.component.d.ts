import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ViewCbpPlanComponent {
    dialogRef: MatDialogRef<ViewCbpPlanComponent>;
    data: any;
    private dialog;
    pdfContent: ElementRef;
    selectedValue: string;
    searchText: string;
    planData: any;
    competenciesCount: {
        total: number;
        behavioral: number;
        functional: number;
        domain: number;
    };
    constructor(dialogRef: MatDialogRef<ViewCbpPlanComponent>, data: any, dialog: MatDialog);
    searchData(): void;
    applyFilter(): void;
    getCompetenciesByType(competencies: any[], type: string): any[];
    closeDialog(): void;
    editCBPPlan(): void;
    generateCourseRecommendation(): void;
    downloadPDF(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewCbpPlanComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewCbpPlanComponent, "app-view-cbp-plan", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=view-cbp-plan.component.d.ts.map