import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../modules/shared/services/shared.service";
export class PipePublicURL {
    constructor(sharedSvc) {
        this.sharedSvc = sharedSvc;
    }
    transform(value) {
        let configDetails = this.sharedSvc.getConfig();
        const mainUrl = value && value.split('/content').pop() || '';
        const finalURL = `${configDetails.portalURL}/${configDetails.contentBucket}/content${mainUrl}`;
        return value ? finalURL : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PipePublicURL, deps: [{ token: i1.SharedService }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: PipePublicURL, name: "pipePublicURL" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PipePublicURL, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pipePublicURL',
                }]
        }], ctorParameters: function () { return [{ type: i1.SharedService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS1wdWJsaWMtVVJMLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJyYXJ5L3N1bmJpcmQtY2IvY2JwLWFpL3NyYy9saWIvcGlwZS1wdWJsaWMtVVJML3BpcGUtcHVibGljLVVSTC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWtCLE1BQU0sZUFBZSxDQUFBOzs7QUFNcEQsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFBc0IsU0FBd0I7UUFBeEIsY0FBUyxHQUFULFNBQVMsQ0FBZTtJQUU5QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQWE7UUFDckIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMvQyxNQUFNLE9BQU8sR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUE7UUFDNUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxhQUFhLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxhQUFhLFdBQVcsT0FBTyxFQUFFLENBQUE7UUFDOUYsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQzlCLENBQUM7K0dBVFUsYUFBYTs2R0FBYixhQUFhOzs0RkFBYixhQUFhO2tCQUh6QixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxlQUFlO2lCQUN0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsICBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuaW1wb3J0IHsgU2hhcmVkU2VydmljZSB9IGZyb20gJy4uL21vZHVsZXMvc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC5zZXJ2aWNlJztcbkBQaXBlKHtcbiAgbmFtZTogJ3BpcGVQdWJsaWNVUkwnLFxufSlcbmV4cG9ydCBjbGFzcyBQaXBlUHVibGljVVJMIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCAgcHJpdmF0ZSBzaGFyZWRTdmM6IFNoYXJlZFNlcnZpY2UsICkge1xuXG4gIH1cbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcpOiBhbnkge1xuICAgIGxldCBjb25maWdEZXRhaWxzID0gdGhpcy5zaGFyZWRTdmMuZ2V0Q29uZmlnKCk7XG4gICAgY29uc3QgbWFpblVybCA9IHZhbHVlICYmIHZhbHVlLnNwbGl0KCcvY29udGVudCcpLnBvcCgpIHx8ICcnXG4gICAgY29uc3QgZmluYWxVUkwgPSBgJHtjb25maWdEZXRhaWxzLnBvcnRhbFVSTH0vJHtjb25maWdEZXRhaWxzLmNvbnRlbnRCdWNrZXR9L2NvbnRlbnQke21haW5Vcmx9YFxuICAgIHJldHVybiB2YWx1ZSA/IGZpbmFsVVJMIDogJydcbiAgfVxuXG59XG4iXX0=