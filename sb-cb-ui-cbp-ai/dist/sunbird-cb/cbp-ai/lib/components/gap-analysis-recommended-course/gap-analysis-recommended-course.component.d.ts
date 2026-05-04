import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class GapAnalysisRecommendedCourseComponent {
    private sharedService;
    private dialog;
    private snackBar;
    planData: any;
    loading: boolean;
    recommended_course_id: string;
    cbpPlanData: any;
    constructor(sharedService: SharedService, dialog: MatDialog, snackBar: MatSnackBar);
    searchText: string;
    filterdCourses: any;
    selectFilterCourses: any;
    competenciesCount: {
        total: number;
        public_courses: number;
        igot: number;
    };
    expandedCompetencies: any;
    ngOnInit(): void;
    updateCompetencyCounts(): void;
    getUserCourse(): void;
    getCompetenciesByType(type: string, index: any): any[];
    getDisplayedCompetencies(type: string, index: number): any[];
    toggleCompetencies(type: string, index: number): void;
    isExpanded(type: string, index: number): boolean;
    hasMoreThanTwo(type: string, index: number): boolean;
    getRemainingCount(type: string, index: number): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<GapAnalysisRecommendedCourseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GapAnalysisRecommendedCourseComponent, "app-gap-analysis-recommended-course", never, { "planData": { "alias": "planData"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=gap-analysis-recommended-course.component.d.ts.map