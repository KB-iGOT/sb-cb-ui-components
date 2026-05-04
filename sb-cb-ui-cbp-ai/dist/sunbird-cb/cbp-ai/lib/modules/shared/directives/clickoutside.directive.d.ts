import { ElementRef, EventEmitter, OnInit } from "@angular/core";
import * as i0 from "@angular/core";
export declare class ClickOutsideDirective implements OnInit {
    private elRef;
    clickOutside: EventEmitter<any>;
    captured: boolean;
    constructor(elRef: ElementRef);
    onClick(target: any): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClickOutsideDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClickOutsideDirective, "[clickOutside]", never, {}, { "clickOutside": "clickOutside"; }, never, never, false, never>;
}
//# sourceMappingURL=clickoutside.directive.d.ts.map