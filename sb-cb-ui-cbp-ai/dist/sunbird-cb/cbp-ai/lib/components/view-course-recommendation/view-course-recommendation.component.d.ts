import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class ViewCourseRecommendationComponent {
    dialogRef: MatDialogRef<ViewCourseRecommendationComponent>;
    data: any;
    private sharedService;
    private dialog;
    private snackBar;
    pdfContent: ElementRef;
    planData: any;
    loading: boolean;
    recommended_course_id: string;
    cbpPlanData: any;
    suggestedCourses: any;
    constructor(dialogRef: MatDialogRef<ViewCourseRecommendationComponent>, data: any, sharedService: SharedService, dialog: MatDialog, snackBar: MatSnackBar);
    searchText: string;
    filterdCourses: any;
    selectFilterCourses: any;
    competenciesCount: {
        total: number;
        public_courses: number;
        igot: number;
    };
    expandedCompetencies: any;
    isPDFDownload: boolean;
    ngOnInit(): void;
    updateCompetencyCounts(): void;
    closeDialog(): void;
    addMoreCourses(): void;
    addPersonilisation(): void;
    getSuggestedCourse(): void;
    getUserCourse(): void;
    getCompetenciesByType(type: string, index: any): any[];
    getDisplayedCompetencies(type: string, index: number): any[];
    toggleCompetencies(type: string, index: number): void;
    isExpanded(type: string, index: number): boolean;
    hasMoreThanTwo(type: string, index: number): boolean;
    getRemainingCount(type: string, index: number): number;
    downloadPDF(): void;
    downloadPdfFromBE(): void;
    confirmDeleteCourse(item: any, index: number): void;
    deleteCard(item: any, index: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewCourseRecommendationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewCourseRecommendationComponent, "app-view-course-recommendation", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=view-course-recommendation.component.d.ts.map