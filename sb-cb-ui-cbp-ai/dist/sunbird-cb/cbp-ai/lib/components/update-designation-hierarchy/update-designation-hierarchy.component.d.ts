import { EventEmitter, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as i0 from "@angular/core";
export interface Designation {
    id: string;
    name: string;
    sort_order: number;
}
export declare class UpdateDesignationHierarchyComponent implements OnInit {
    private http;
    sharedService: SharedService;
    private snackBar;
    openDropdownId: string | null;
    isOpen: boolean;
    state_center_id: string;
    department_id: string;
    designations: any[];
    role_mapping_generation: any;
    loading: boolean;
    closeDrawer: EventEmitter<void>;
    submitted: EventEmitter<any>;
    numbers: number[];
    constructor(http: HttpClient, sharedService: SharedService, snackBar: MatSnackBar);
    ngOnInit(): void;
    drop(event: CdkDragDrop<Designation[]>): void;
    private updateSortOrderByIndex;
    submit(): void;
    cancel(): void;
    refreshRoleMappingData(): void;
    toggleDropdown(item: any, event: Event): void;
    selectNumber(item: any, num: number, event: Event): void;
    filterNumbers(item: any): void;
    onOrderChange(item: any): void;
    trackById(index: number, item: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<UpdateDesignationHierarchyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UpdateDesignationHierarchyComponent, "app-update-designation-hierarchy", never, {}, { "closeDrawer": "closeDrawer"; "submitted": "submitted"; }, never, never, false, never>;
}
//# sourceMappingURL=update-designation-hierarchy.component.d.ts.map