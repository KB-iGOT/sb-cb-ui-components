import { HttpClient } from '@angular/common/http';
import { InitService } from './init.service';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class RoleMappingService {
    private http;
    private initSvc;
    baseUrl: string;
    configDetails: any;
    screenWidth: number;
    headers: any;
    onResize(event: any): void;
    constructor(http: HttpClient, initSvc: InitService);
    setConfiDetails(configDetails?: any): void;
    getConfig(): any;
    getConfigDetails(): Observable<any>;
    generateRoleMapping(reqBody: any, files: File | File[] | null, onChunk: (chunk: string) => void, onStart?: () => void, onEnd?: () => void, onError?: (error: any) => void): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoleMappingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RoleMappingService>;
}
//# sourceMappingURL=role-mapping.service.d.ts.map