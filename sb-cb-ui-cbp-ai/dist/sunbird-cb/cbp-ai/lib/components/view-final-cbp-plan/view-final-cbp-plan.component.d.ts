import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class ViewFinalCbpPlanComponent {
    dialogRef: MatDialogRef<ViewFinalCbpPlanComponent>;
    data: any;
    private dialog;
    private cdr;
    sharedService: SharedService;
    private snackBar;
    private fb;
    constructor(dialogRef: MatDialogRef<ViewFinalCbpPlanComponent>, data: any, dialog: MatDialog, cdr: ChangeDetectorRef, sharedService: SharedService, snackBar: MatSnackBar, fb: FormBuilder);
    filterForm: FormGroup;
    languages: {
        code: string;
        label: string;
    }[];
    filteredLanguages: {
        code: string;
        label: string;
    }[];
    pdfContent: ElementRef;
    loading: boolean;
    designationData: any;
    totalCompetencieObj: {
        total: number;
        behavioral: number;
        functional: number;
        domain: number;
    };
    pdfTrigger: boolean;
    jsonData: any[];
    filterdCourses: any[];
    planData: any;
    recommended_course_id: string;
    expandedCompetencies: any;
    competenciesCount: {
        total: number;
        public_courses: number;
        igot: number;
    };
    openedFrom: string;
    dialogContent: ElementRef;
    closeDialog(): void;
    cancelForm(): void;
    saveRoleMapping(): void;
    ngAfterViewInit(): void;
    getMappingData(): void;
    getCompetenciesByType(type: string, course: any): any[];
    getDisplayedCompetencies(type: string, index: number): any[];
    toggleCompetencies(type: string, index: number): void;
    isExpanded(type: string, index: number): boolean;
    hasMoreThanTwo(type: string, index: number): boolean;
    getRemainingCount(type: string, index: number): number;
    updateCompetencyCounts(): void;
    confirmDeleteCourse(item: any, index: number): void;
    deleteCard(item: any, index: number): void;
    scrollToTop(): void;
    downloadPDF(): void;
    downloadPDFNew(): void;
    generateExcel(jsonArray: any[], filename?: string): void;
    downloadCSV(): void;
    downloadPdfFromBE(context: string): void;
    getSelectedCourses(department: any): any[];
    applyFilters(): void;
    filterList(value: string, type: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewFinalCbpPlanComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewFinalCbpPlanComponent, "app-view-final-cbp-plan", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=view-final-cbp-plan.component.d.ts.map