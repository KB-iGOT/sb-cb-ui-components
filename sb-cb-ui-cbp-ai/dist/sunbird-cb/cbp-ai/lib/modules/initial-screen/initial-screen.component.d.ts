import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EventService } from '../shared/services/event.service';
import { SharedService } from '../shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class InitialScreenComponent {
    private eventSvc;
    sharedService: SharedService;
    snackBar: MatSnackBar;
    private router;
    headerData: {
        welcome: {
            welcomeText: string;
            imageUrl: string;
        };
        karmayogiBtn: {
            text: string;
            link: string;
            display: boolean;
        };
        donloadBtn: {
            text: string;
            link: string;
            display: boolean;
        };
        btns: {
            text: string;
            link: string;
            type: string;
            language: string;
        }[];
        navHeader: {
            karmayogiBharath: {
                imgSrc: string;
                link: string;
            };
            navButtons: {
                text: string;
                link: string;
                fragment: string;
            }[];
            loginBtn: {
                text: string;
                link: string;
            };
            registerBtn: {
                text: string;
                link: string;
            };
            contactLink: {
                text: string;
                link: string;
                fragment: string;
            };
        };
    };
    title: string;
    isMaintenancePage: any;
    selectedValue: string;
    searchText: string;
    dataSource: any;
    displayedColumns: string[];
    selectedMinistryType: string;
    ministryData: any;
    ministryFullData: any;
    sectorData: {
        value: string;
    }[];
    formData: {};
    nextStep: string;
    loginSuccess: boolean;
    cbpFinalObj: any;
    userEmail: string;
    constructor(eventSvc: EventService, sharedService: SharedService, snackBar: MatSnackBar, router: Router);
    ngOnInit(): void;
    successRoleMapping(event: any): void;
    alreadyAvailableRoleMapping(event: any): void;
    moveToInitialScreen(event: any): void;
    loginSuccessStatus(event: any): void;
    logout(): void;
    goToUploadDocument(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InitialScreenComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InitialScreenComponent, "initial-screen", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=initial-screen.component.d.ts.map