import { SharedService } from '../../modules/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as i0 from "@angular/core";
export declare class ReviewRequestComponent {
    sharedService: SharedService;
    private snackBar;
    private route;
    private router;
    request: any;
    searchText: string;
    expandedResponsibilityRows: {
        [id: string]: boolean;
    };
    expandedActivityRows: {
        [id: string]: boolean;
    };
    paginator: MatPaginator;
    loading: boolean;
    activeTab: string;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any, import("@angular/material/table").MatTableDataSourcePaginator>;
    constructor(sharedService: SharedService, snackBar: MatSnackBar, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    getRequestDetails(requestId: any): void;
    toggleResponsibilityExpand(id: string): void;
    isResponisbilityExpanded(id: string): boolean;
    toggleActivityExpand(id: string): void;
    isActivityExpanded(id: string): boolean;
    getCompetenciesByType(competencies: any[], type: string): any[];
    backToApprovalRequest(): void;
    applyFilter(): void;
    clearSearch(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReviewRequestComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ReviewRequestComponent, "app-review-request", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=review-request.component.d.ts.map