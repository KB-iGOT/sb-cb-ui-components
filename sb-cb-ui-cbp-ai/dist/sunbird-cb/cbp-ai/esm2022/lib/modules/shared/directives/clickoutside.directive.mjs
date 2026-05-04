import { Directive, Output, EventEmitter, HostListener } from "@angular/core";
import { fromEvent } from "rxjs";
import { take } from "rxjs/operators";
import * as i0 from "@angular/core";
export class ClickOutsideDirective {
    constructor(elRef) {
        this.elRef = elRef;
        this.clickOutside = new EventEmitter();
        this.captured = false;
    }
    onClick(target) {
        if (!this.captured) {
            return;
        }
        if (!this.elRef.nativeElement.contains(target)) {
            this.clickOutside.emit();
        }
    }
    ngOnInit() {
        fromEvent(document, "click", { capture: true })
            .pipe(take(1))
            .subscribe(() => (this.captured = true));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ClickOutsideDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: ClickOutsideDirective, selector: "[clickOutside]", outputs: { clickOutside: "clickOutside" }, host: { listeners: { "document:click": "onClick($event.target)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ClickOutsideDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[clickOutside]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { clickOutside: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ["document:click", ["$event.target"]]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tvdXRzaWRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2xpYnJhcnkvc3VuYmlyZC1jYi9jYnAtYWkvc3JjL2xpYi9tb2R1bGVzL3NoYXJlZC9kaXJlY3RpdmVzL2NsaWNrb3V0c2lkZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFFVCxNQUFNLEVBQ04sWUFBWSxFQUNaLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFLdEMsTUFBTSxPQUFPLHFCQUFxQjtJQUtoQyxZQUFvQixLQUFpQjtRQUFqQixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBSjNCLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU1QyxhQUFRLEdBQUcsS0FBSyxDQUFDO0lBRXVCLENBQUM7SUFHekMsT0FBTyxDQUFDLE1BQVc7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2IsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7K0dBdEJVLHFCQUFxQjttR0FBckIscUJBQXFCOzs0RkFBckIscUJBQXFCO2tCQUhqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzNCO2lHQUVXLFlBQVk7c0JBQXJCLE1BQU07Z0JBT1AsT0FBTztzQkFETixZQUFZO3VCQUFDLGdCQUFnQixFQUFFLENBQUMsZUFBZSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBPbkluaXRcbiAgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuICBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tIFwicnhqc1wiO1xuICBpbXBvcnQgeyB0YWtlIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG4gIFxuICBARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJbY2xpY2tPdXRzaWRlXVwiXG4gIH0pXG4gIGV4cG9ydCBjbGFzcyBDbGlja091dHNpZGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBPdXRwdXQoKSBjbGlja091dHNpZGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIFxuICAgIGNhcHR1cmVkID0gZmFsc2U7XG4gIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxSZWY6IEVsZW1lbnRSZWYpIHt9XG4gIFxuICAgIEBIb3N0TGlzdGVuZXIoXCJkb2N1bWVudDpjbGlja1wiLCBbXCIkZXZlbnQudGFyZ2V0XCJdKVxuICAgIG9uQ2xpY2sodGFyZ2V0OiBhbnkpIHtcbiAgICAgIGlmICghdGhpcy5jYXB0dXJlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gIFxuICAgICAgaWYgKCF0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICB0aGlzLmNsaWNrT3V0c2lkZS5lbWl0KCk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgIGZyb21FdmVudChkb2N1bWVudCwgXCJjbGlja1wiLCB7IGNhcHR1cmU6IHRydWUgfSlcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiAodGhpcy5jYXB0dXJlZCA9IHRydWUpKTtcbiAgICB9XG4gIH1cbiAgIl19