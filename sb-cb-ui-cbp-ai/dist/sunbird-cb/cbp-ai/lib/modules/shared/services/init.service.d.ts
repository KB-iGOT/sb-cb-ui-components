import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class InitService {
    private http;
    baseUrl: string;
    configDetails: any;
    constructor(http: HttpClient);
    init(): Promise<void>;
    private setConfiDetails;
    static ɵfac: i0.ɵɵFactoryDeclaration<InitService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InitService>;
}
//# sourceMappingURL=init.service.d.ts.map