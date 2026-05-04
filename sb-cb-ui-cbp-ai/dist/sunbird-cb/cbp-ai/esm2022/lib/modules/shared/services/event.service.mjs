import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class EventService {
    constructor() {
        this.eventsChatbotSubject = new Subject();
        this.chatbotEvents$ = this.eventsChatbotSubject.asObservable();
        this.eventsSubject = new Subject();
        this.events$ = this.eventsSubject.asObservable();
    }
    dispatchChatbotEvent(event) {
        console.log("event ", event);
        this.eventsChatbotSubject.next(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: EventService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: EventService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: EventService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2xpYnJhcnkvc3VuYmlyZC1jYi9jYnAtYWkvc3JjL2xpYi9tb2R1bGVzL3NoYXJlZC9zZXJ2aWNlcy9ldmVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQTs7QUFPOUIsTUFBTSxPQUFPLFlBQVk7SUFIekI7UUFJVSx5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBMkIsQ0FBQTtRQUM5RCxtQkFBYyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUN4RCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUEyQixDQUFBO1FBQ3ZELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFBO0tBTW5EO0lBSkMsb0JBQW9CLENBQUksS0FBNEI7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDNUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN2QyxDQUFDOytHQVRVLFlBQVk7bUhBQVosWUFBWSxjQUZYLE1BQU07OzRGQUVQLFlBQVk7a0JBSHhCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcydcbmltcG9ydCB7IFdzRXZlbnRzIH0gZnJvbSAnLi9ldmVudHMnXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBFdmVudFNlcnZpY2Uge1xuICBwcml2YXRlIGV2ZW50c0NoYXRib3RTdWJqZWN0ID0gbmV3IFN1YmplY3Q8V3NFdmVudHMuSVdzRXZlbnRzPGFueT4+KClcbiAgcHVibGljIGNoYXRib3RFdmVudHMkID0gdGhpcy5ldmVudHNDaGF0Ym90U3ViamVjdC5hc09ic2VydmFibGUoKVxuICBwcml2YXRlIGV2ZW50c1N1YmplY3QgPSBuZXcgU3ViamVjdDxXc0V2ZW50cy5JV3NFdmVudHM8YW55Pj4oKVxuICBwdWJsaWMgZXZlbnRzJCA9IHRoaXMuZXZlbnRzU3ViamVjdC5hc09ic2VydmFibGUoKVxuXG4gIGRpc3BhdGNoQ2hhdGJvdEV2ZW50PFQ+KGV2ZW50OiBXc0V2ZW50cy5JV3NFdmVudHM8VD4pIHtcbiAgICBjb25zb2xlLmxvZyhcImV2ZW50IFwiLCBldmVudClcbiAgICB0aGlzLmV2ZW50c0NoYXRib3RTdWJqZWN0Lm5leHQoZXZlbnQpXG4gIH1cbn1cbiJdfQ==