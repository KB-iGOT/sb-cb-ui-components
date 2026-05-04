import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class InitService {
    constructor(http) {
        this.http = http;
    }
    async init() {
        await this.setConfiDetails();
    }
    async setConfiDetails(configDetails = null) {
        if (configDetails) {
            this.configDetails = configDetails;
            this.baseUrl = configDetails.portalURL;
        }
        else {
            try {
                if (this.configDetails) {
                    return this.configDetails;
                }
                const response = await this.http.get('assets/jsonfiles/configurations.json').toPromise();
                if (response) {
                    this.configDetails = response;
                    this.baseUrl = response.portalURL;
                }
            }
            catch (e) {
                throw new Error('could not fetch configurations');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: InitService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: InitService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: InitService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicmFyeS9zdW5iaXJkLWNiL2NicC1haS9zcmMvbGliL21vZHVsZXMvc2hhcmVkL3NlcnZpY2VzL2luaXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQVUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFBOzs7QUFVbEQsTUFBTSxPQUFPLFdBQVc7SUFLdEIsWUFDVSxJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBRzFCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFTyxLQUFLLENBQUMsZUFBZSxDQUFDLGdCQUFxQixJQUFJO1FBQ3JELElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFBO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQTtTQUN2QzthQUFNO1lBQ0wsSUFBSTtnQkFFRixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3RCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtpQkFDMUI7Z0JBQ0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBTSxzQ0FBc0MsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUM3RixJQUFJLFFBQVEsRUFBRTtvQkFDWixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQTtvQkFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFBO2lCQUNsQzthQUNGO1lBQ0QsT0FBTSxDQUFDLEVBQUU7Z0JBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO2FBQ2xEO1NBQ0Y7SUFDSCxDQUFDOytHQW5DVSxXQUFXO21IQUFYLFdBQVcsY0FGVixNQUFNOzs0RkFFUCxXQUFXO2tCQUh2QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQUF9CQVNFX0hSRUYgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG4vLyBpbXBvcnQgeyByZXRyeSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCdcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJ1xuXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBJbml0U2VydmljZSB7XG5cbiAgYmFzZVVybDogc3RyaW5nXG4gIGNvbmZpZ0RldGFpbHM6IGFueVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgKSB7XG5cbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5zZXRDb25maURldGFpbHMoKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXRDb25maURldGFpbHMoY29uZmlnRGV0YWlsczogYW55ID0gbnVsbCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKGNvbmZpZ0RldGFpbHMpIHtcbiAgICAgIHRoaXMuY29uZmlnRGV0YWlscyA9IGNvbmZpZ0RldGFpbHNcbiAgICAgIHRoaXMuYmFzZVVybCA9IGNvbmZpZ0RldGFpbHMucG9ydGFsVVJMXG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnRGV0YWlscykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RldGFpbHNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaHR0cC5nZXQ8YW55PignYXNzZXRzL2pzb25maWxlcy9jb25maWd1cmF0aW9ucy5qc29uJykudG9Qcm9taXNlKClcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdGhpcy5jb25maWdEZXRhaWxzID0gcmVzcG9uc2VcbiAgICAgICAgICB0aGlzLmJhc2VVcmwgPSByZXNwb25zZS5wb3J0YWxVUkxcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgZmV0Y2ggY29uZmlndXJhdGlvbnMnKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19