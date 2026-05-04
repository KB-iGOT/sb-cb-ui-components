import { EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedService } from '../../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class RoleMappingListComponent {
    sharedService: SharedService;
    private dialog;
    formData: any;
    searchText: string;
    selectedValue: string;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any, import("@angular/material/table").MatTableDataSourcePaginator>;
    originalDataSource: MatTableDataSource<any, import("@angular/material/table").MatTableDataSourcePaginator>;
    filteredData: any[];
    originalData: any[];
    searchResults: any[];
    paginator: MatPaginator;
    expandedResponsibilityRows: {
        [id: string]: boolean;
    };
    expandedActivityRows: {
        [id: string]: boolean;
    };
    activeRowElement: any;
    cbpFinalObj: any;
    loading: boolean;
    selection: SelectionModel<any>;
    matchedRoleMapping: number;
    unMatchedRoleMapping: number;
    matchedRoleMappingIds: any[];
    matchedDesignationNames: string[];
    moveToInitialScreen: EventEmitter<any>;
    activeTab: 'matched' | 'unmatched';
    matchedDesignationSet: Set<string>;
    masterData: any[];
    tabFilteredData: any[];
    constructor(sharedService: SharedService, dialog: MatDialog);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    getCompetenciesByType(competencies: any[], type: string): any[];
    viewDetails(element: any): void;
    deleteItem(element: any): void;
    searchData(): void;
    applyFilter(): void;
    clearSearch(): void;
    refreshRoleMappingData(): void;
    private updateDataSource;
    editRoleMapping(element: any): void;
    viewCBPPlan(element: any): void;
    generateCourseRecommendation(element: any): void;
    viewCourseRecommendation(element: any): void;
    /**
     * Filter data by designation name only
     * Supports single and multiple word searches
     */
    filterByDesignationName(searchText: string): any[];
    flattenObjectToString(obj: any): string;
    getSectors(sector: any): string;
    toggleResponsibilityExpand(id: string): void;
    isResponisbilityExpanded(id: string): boolean;
    toggleActivityExpand(id: string): void;
    isActivityExpanded(id: string): boolean;
    addMoreDesignation(): void;
    deleteRoleMapping(element: any): void;
    viewFinalCBPPlan(context: string): void;
    moveToInitialScreenLayout(event: any): void;
    openFullList(element: any, type: 'role_responsibilities' | 'activities'): void;
    loadRoleMappingList(): void;
    toggleRow(row: any): void;
    isAllSelected(): boolean;
    isSomeSelected(): boolean;
    toggleAllRows(event: any): void;
    setDataSoure(tab?: 'matched' | 'unmatched'): void;
    applyAllFilters(): void;
    sendForApprovalForm(): void;
    hasSelectableRows(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoleMappingListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RoleMappingListComponent, "app-role-mapping-list", never, { "formData": { "alias": "formData"; "required": false; }; }, { "moveToInitialScreen": "moveToInitialScreen"; }, never, never, false, never>;
}
//# sourceMappingURL=role-mapping-list.component.d.ts.map