import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class GenerateCourseRecommendationComponent {
    dialogRef: MatDialogRef<GenerateCourseRecommendationComponent>;
    data: any;
    sharedService: SharedService;
    private snackBar;
    dialog: MatDialog;
    private fb;
    pdfContent: ElementRef;
    planData: any;
    loading: boolean;
    dataLoaded: boolean;
    isRegeneratingWithProgress: boolean;
    recommended_course_id: string;
    currentProcessingStage: string;
    progressPercentage: number;
    processingStages: string[];
    stageStartTime: number;
    constructor(dialogRef: MatDialogRef<GenerateCourseRecommendationComponent>, data: any, sharedService: SharedService, snackBar: MatSnackBar, dialog: MatDialog, fb: FormBuilder);
    searchText: string;
    filterdCourses: any;
    originalData: any;
    selectFilterCourses: any;
    suggestedCourses: any;
    userAddedCourses: any;
    mode: string;
    cbp_plan_id: string;
    expandedCompetencies: any;
    outerTabActiveIndex: number;
    innerTabActiveIndex: number;
    outerTabActiveText: string;
    innerTabActiveText: string;
    selectedCategory: string;
    competencyCoveredCount: number;
    overallCoverage: any;
    behavioralCompetencyCoveredCount: number;
    behavioralTotalCompetencies: number;
    behavioralCoverage: any;
    functionalCompetencyCoveredCount: number;
    functionalTotalCompetencies: number;
    functionalCoverage: any;
    domainCompetencyCoveredCount: number;
    domainTotalCompetencies: number;
    domainCoverage: any;
    competencyNotMatchedByCategory: any[];
    competencyMatchedByCategory: any[];
    menuItems: {
        key: string;
        label: string;
    }[];
    behaviouralNotMatched: any[];
    functionalNotMatched: any[];
    domainNotMatched: any[];
    selectedThemeFilter: string;
    originalFilteredCourses: any[];
    isRegenerating: boolean;
    isPDFDownload: boolean;
    behaviouralMatched: any[];
    functionalMatched: any[];
    domainMatched: any[];
    filterForm: FormGroup;
    competenciesType: string[];
    ratings: string[];
    languages: string[];
    durations: string[];
    providers: any[];
    filteredCompetency: string[];
    filteredRatings: string[];
    filteredLanguages: string[];
    filteredDurations: string[];
    filteredProviders: any[];
    fullCourseList: any[];
    selectedCompetency: string;
    selectedRating: string | null;
    selectedLanguage: string | null;
    selectedDuration: string | null;
    selectedProvider: string | null;
    selectCategory(category: string): void;
    ngOnInit(): void;
    applyFilter(value: any): void;
    searchData(): void;
    selectedFilterCourses(event: any, item: any): void;
    closeDialog(): void;
    saveCourses(): void;
    getCourses(): void;
    getSuggestedCourse(): void;
    getUserCourse(): void;
    checkIfCourseExists(item: any): boolean;
    selectAllCourses(event: any): void;
    getSectors(sector: any): string;
    filterData(searchText: string): any[];
    flattenObjectToString(obj: any): string;
    suggestMoreCourses(): void;
    generateCourseRecommendation(element: any): void;
    getCompetenciesByType(type: string, index: any): any[];
    getCompetenciesByBehviouralType(index: any): string;
    getDisplayedCompetencies(type: string, index: number): any[];
    toggleCompetencies(type: string, index: number): void;
    isExpanded(type: string, index: number): boolean;
    hasMoreThanTwo(type: string, index: number): boolean;
    getRemainingCount(type: string, index: number): number;
    onOuterTabChange(event: MatTabChangeEvent): void;
    onInnerTabChange(event: MatTabChangeEvent): void;
    getAllAvailableCourses(): any[];
    /**
     * Rebuild filterdCourses array with all available course types
     * This ensures consistency across the application
     */
    rebuildFilteredCourses(): void;
    behavioralFilter(data: any[]): any[];
    behavioralCompetencyFilter(data: any[]): string[];
    functionalCompetencyFilter(data: any[]): any;
    domainCompetencyFilter(data: any[]): any;
    functionalFilter(data: any[]): any[];
    domainFilter(data: any[]): any[];
    gapAnalysisStats(): void;
    getMatchedCompetencyStats(primaryArray: any[], secondaryArray: any[]): any;
    getCompetencyByCategoryNotMatching(categoryType: any): string[];
    compareStringArrays(arr1: string[], arr2: string[]): string[];
    addCourse(missingCompetency?: string, competencyType?: string): void;
    filterOnCompetencyTheme(themeItem: any): void;
    clearThemeFilter(): void;
    isThemeSelected(theme: string): boolean;
    /**
     * Add course for the currently selected theme filter with prefilled competency data
     */
    addCourseForSelectedTheme(): void;
    getDuration(time: any): string;
    getBehaviouralMatched(): void;
    getFunctionalMatched(): any[];
    getDomainMatched(): void;
    downloadPDF(): void;
    redirectToToc(item: any): void;
    /**
     * Initialize gap analysis stats after initial data load
     */
    initializeGapAnalysisStats(): void;
    /**
     * Update gap analysis stats after courses are updated (like suggested courses added)
     */
    updateGapAnalysisAfterCoursesUpdate(): void;
    /**
     * Regenerate course recommendations by deleting existing recommendations and generating new ones
     */
    regenerateCourseRecommendations(): Promise<void>;
    /**
     * Show confirmation dialog for regenerate action
     */
    private showConfirmationDialog;
    /**
     * Delete existing course recommendations for the current role mapping
     */
    private deleteCourseRecommendations;
    /**
     * Generate new course recommendations during regeneration
     */
    private generateNewCourseRecommendations;
    /**
     * Enhanced course generation specifically for regeneration with progressive loading
     */
    private getRecommendedCourseForRegeneration;
    startRegenerativeProgressiveLoading(): void;
    simulateRegenerativeProgressiveStages(): void;
    /**
     * Refresh the component data after regeneration
     */
    private refreshComponent;
    /**
     * Load component data (separated from ngOnInit for reuse)
     */
    private loadComponentData;
    startProgressiveLoading(): void;
    simulateProgressiveStages(): void;
    getRecommendedCourseWithProgress(role_mapping_id: string): Promise<any>;
    resetFilters(): void;
    filterList(value: string, type: string): void;
    normalizeCompetency(value: string): string;
    applyFilters(): void;
    matchRating(course: any, selectedRatings: string[]): boolean;
    matchDuration(durationInSeconds: number | string, selectedRanges: string[]): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<GenerateCourseRecommendationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GenerateCourseRecommendationComponent, "app-generate-course-recommendation", never, {}, {}, never, never, false, never>;
}
export declare class RegenerateConfirmationDialog {
    dialogRef: MatDialogRef<RegenerateConfirmationDialog>;
    constructor(dialogRef: MatDialogRef<RegenerateConfirmationDialog>);
    onCancel(): void;
    onConfirm(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RegenerateConfirmationDialog, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RegenerateConfirmationDialog, "regenerate-confirmation-dialog", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=generate-course-recommendation.component.d.ts.map