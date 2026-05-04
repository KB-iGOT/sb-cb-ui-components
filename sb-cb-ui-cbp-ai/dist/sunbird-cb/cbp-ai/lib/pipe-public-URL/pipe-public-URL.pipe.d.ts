import { PipeTransform } from '@angular/core';
import { SharedService } from '../modules/shared/services/shared.service';
import * as i0 from "@angular/core";
export declare class PipePublicURL implements PipeTransform {
    private sharedSvc;
    constructor(sharedSvc: SharedService);
    transform(value: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<PipePublicURL, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<PipePublicURL, "pipePublicURL", false>;
}
//# sourceMappingURL=pipe-public-URL.pipe.d.ts.map