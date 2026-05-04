import { OnInit } from '@angular/core';
import { SharedService } from '../../modules/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class DashboardComponent implements OnInit {
    private fb;
    private sharedService;
    private snackBar;
    router: Router;
    userProfile: any;
    isSuperAdmin: boolean;
    selected: any;
    filtersForm: FormGroup;
    ministriesList: {
        id: number;
        name: string;
    }[];
    departmentsList: {
        id: number;
        name: string;
    }[];
    selectedMinistryType: string;
    selectedMinistryId: string;
    panelOpen: boolean;
    departmentPanelOpen: boolean;
    filteredList: any[];
    filteredDepartmentList: any[];
    ministryData: any;
    ministryFullData: any;
    departmentData: any[];
    selectedMinistryObj: {};
    apiLoading: boolean;
    loginUserOrgIds: any[];
    dashboardData: any;
    gapAnalysisData: any;
    dashboardResponseObj: {};
    cbpFinalObj: any;
    constructor(fb: FormBuilder, sharedService: SharedService, snackBar: MatSnackBar, router: Router);
    ngOnInit(): void;
    getDashboardData(val: any): void;
    onOpened(opened: boolean): void;
    onOpenedDepartment(opened: boolean): void;
    filterData(event: any): void;
    filterDepartmentData(event: any): void;
    onMinistryChange(event: any): void;
    onDepartmentChange(): void;
    onMinistryTypeChange(event: any): Promise<void>;
    getMinistryData(): void;
    routeToInitial(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardComponent, "app-dashboard", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=dashboard.component.d.ts.map