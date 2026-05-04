// role-mapping.service.ts
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./init.service";
const API_END_POINTS = {
    GET_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping/generate_stream',
};
export class RoleMappingService {
    onResize(event) {
        this.screenWidth = event.target.innerWidth;
    }
    constructor(http, initSvc) {
        this.http = http;
        this.initSvc = initSvc;
        if (initSvc && this.initSvc.baseUrl && this.initSvc.configDetails) {
            this.baseUrl = this.initSvc.baseUrl;
            this.configDetails = this.initSvc.configDetails;
        }
        else {
            this.setConfiDetails();
        }
        this.screenWidth = window.innerWidth;
        // const storageData:any = JSON.parse(localStorage.getItem('loginData'))
        // console.log('storageData--', storageData)
        // this.headers = new HttpHeaders({
        //   'Authorization': `Bearer ${storageData?.access_token}`
        // });
    }
    setConfiDetails(configDetails = null) {
        if (configDetails) {
            this.configDetails = configDetails;
            this.baseUrl = configDetails.portalURL;
        }
        else {
            this.getConfigDetails().subscribe((response) => {
                this.configDetails = response;
                this.baseUrl = response.portalURL;
            });
        }
    }
    getConfig() {
        if (this.configDetails) {
            return this.configDetails;
        }
        return null;
    }
    getConfigDetails() {
        return this.http.get('assets/jsonfiles/configurations.json');
    }
    // async generateRoleMapping(
    //   reqBody: any,
    //   file: File[] | null,
    //   onChunk: (chunk: string) => void,
    //   onStart?: () => void,
    //   onEnd?: () => void,
    //   onError?: (error: any) => void
    // ): Promise<void> {
    //   const storageData:any = JSON.parse(localStorage.getItem('loginData'))
    //   console.log('storageData--', storageData)
    //   this.headers = new HttpHeaders({
    //     'Authorization': `Bearer ${storageData?.access_token}`
    //   });
    //   const headersObj: Record<string, string> = {};
    //   this.headers.keys().forEach(key => {
    //     const value = this.headers.get(key);
    //     if (value !== null) {
    //       headersObj[key] = value;
    //     }
    //   });
    //   const formData = new FormData();
    //   if (reqBody.state_center_id) {
    //     formData.append('state_center_id', reqBody.state_center_id);
    //   }
    //   if (reqBody.department_id) {
    //     formData.append('department_id', reqBody.department_id);
    //   }
    //   if (reqBody.instruction) {
    //     formData.append('instruction', reqBody.instruction);
    //   }
    //   // Add sector_name parameter as required by the API
    //   formData.append('sector_name', 'Government');
    //   if (file) {
    //     formData.append('additional_document', file);
    //   }
    //   try {
    //     const response = await fetch(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, {
    //       method: 'POST',
    //       body: formData,
    //       headers: headersObj
    //     });
    //     if (!response.ok) {
    //       const errorText = await response.text();
    //       let errorDetail = '';
    //       try {
    //         const errorJson = JSON.parse(errorText);
    //         errorDetail = errorJson.detail || `HTTP error! status: ${response.status}`;
    //       } catch {
    //         errorDetail = errorText || `HTTP error! status: ${response.status}`;
    //       }
    //       // Pass specific error details to onError callback
    //       if (onError) onError({ 
    //         status: response.status, 
    //         detail: errorDetail,
    //         isExistingRoleMapping: errorDetail.includes('Role mapping already exists')
    //       });
    //       return;
    //     }
    //     if (!response.body) {
    //       throw new Error(`Server responded with ${response.status}`);
    //     }
    //     const reader = response.body.getReader();
    //     const decoder = new TextDecoder('utf-8');
    //     let buffer = '';
    //     while (true) {
    //       const { value, done } = await reader.read();
    //       if (done) break;
    //       buffer += decoder.decode(value, { stream: true });
    //       const events = buffer.split('\n\n');
    //       buffer = events.pop() || ''; // Save incomplete event
    //       for (const rawEvent of events) {
    //         const lines = rawEvent.split('\n');
    //         let eventType = 'message';
    //         let data = '';
    //         for (const line of lines) {
    //           if (line.startsWith('event:')) {
    //             eventType = line.slice(6).trim();
    //           } else if (line.startsWith('data:')) {
    //             data += line.slice(5).trim();
    //           }
    //         }
    //         if (eventType === 'start' && onStart) onStart();
    //         else if (eventType === 'chunk') onChunk(JSON.parse(data).chunk);
    //         else if (eventType === 'end' && onEnd) onEnd();
    //       }
    //     }
    //     if (onEnd) onEnd();
    //   } catch (err) {
    //     console.error('Streaming error:', err);
    //     if (onError) onError(err);
    //   }
    // }
    async generateRoleMapping(reqBody, files, onChunk, onStart, onEnd, onError) {
        const storageData = JSON.parse(localStorage.getItem('loginData'));
        console.log('storageData--', storageData);
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${storageData?.access_token}`
        });
        const headersObj = {};
        this.headers.keys().forEach(key => {
            const value = this.headers.get(key);
            if (value !== null) {
                headersObj[key] = value;
            }
        });
        const formData = new FormData();
        if (reqBody.state_center_id)
            formData.append('state_center_id', reqBody.state_center_id);
        if (reqBody.department_id)
            formData.append('department_id', reqBody.department_id);
        if (reqBody.instruction)
            formData.append('instruction', reqBody.instruction);
        // Add sector_name parameter as required by the API
        formData.append('sector_name', 'Government');
        console.log('files------------', files);
        // Handle single or multiple files
        if (files) {
            if (Array.isArray(files)) {
                files.forEach((file, index) => {
                    formData.append('additional_document', file, file.name);
                });
            }
            else {
                formData.append('additional_document', files, files.name);
            }
        }
        try {
            // After appending files and other fields
            console.log('FormData contents:');
            formData.forEach((value, key) => {
                if (value instanceof File) {
                    console.log(`${key}: ${value.name} (${value.size} bytes)`);
                }
                else {
                    console.log(`${key}: ${value}`);
                }
            });
            const response = await fetch(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, {
                method: 'POST',
                body: formData,
                headers: headersObj
            });
            if (!response.ok) {
                const errorText = await response.text();
                let errorDetail = '';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorDetail = errorJson.detail || `HTTP error! status: ${response.status}`;
                }
                catch {
                    errorDetail = errorText || `HTTP error! status: ${response.status}`;
                }
                if (onError)
                    onError({
                        status: response.status,
                        detail: errorDetail,
                        isExistingRoleMapping: errorDetail.includes('Role mapping already exists')
                    });
                return;
            }
            if (!response.body) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split('\n\n');
                buffer = events.pop() || ''; // Save incomplete event
                for (const rawEvent of events) {
                    const lines = rawEvent.split('\n');
                    let eventType = 'message';
                    let data = '';
                    for (const line of lines) {
                        if (line.startsWith('event:'))
                            eventType = line.slice(6).trim();
                        else if (line.startsWith('data:'))
                            data += line.slice(5).trim();
                    }
                    if (eventType === 'start' && onStart)
                        onStart();
                    else if (eventType === 'chunk')
                        onChunk(JSON.parse(data).chunk);
                    else if (eventType === 'end' && onEnd)
                        onEnd();
                }
            }
            if (onEnd)
                onEnd();
        }
        catch (err) {
            console.error('Streaming error:', err);
            if (onError)
                onError(err);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: RoleMappingService, deps: [{ token: i1.HttpClient }, { token: i2.InitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: RoleMappingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: RoleMappingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.InitService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS1tYXBwaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9saWJyYXJ5L3N1bmJpcmQtY2IvY2JwLWFpL3NyYy9saWIvbW9kdWxlcy9zaGFyZWQvc2VydmljZXMvcm9sZS1tYXBwaW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCO0FBQzFCLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBSTNDLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLGdCQUFnQixFQUFFLGdEQUFnRDtDQUNuRSxDQUFBO0FBS0QsTUFBTSxPQUFPLGtCQUFrQjtJQUs3QixRQUFRLENBQUMsS0FBSztRQUNaLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDN0MsQ0FBQztJQUNELFlBQ1UsSUFBZ0IsRUFDaEIsT0FBb0I7UUFEcEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixZQUFPLEdBQVAsT0FBTyxDQUFhO1FBRTVCLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQ2pFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUE7WUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQTtTQUNoRDthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO1NBQ3ZCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3JDLHdFQUF3RTtRQUN4RSw0Q0FBNEM7UUFDNUMsbUNBQW1DO1FBQ25DLDJEQUEyRDtRQUMzRCxNQUFNO0lB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QWxCLGtCQUFrQixjQUZqQixNQUFNOzs0RkFFUCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gcm9sZS1tYXBwaW5nLnNlcnZpY2UudHNcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5pdFNlcnZpY2UgfSBmcm9tICcuL2luaXQuc2VydmljZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmNvbnN0IEFQSV9FTkRfUE9JTlRTID0ge1xuICBHRVRfUk9MRV9NQVBQSU5HOiAnY2JwLXRwYy1haS9hcGkvdjEvcm9sZS1tYXBwaW5nL2dlbmVyYXRlX3N0cmVhbScsXG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJvbGVNYXBwaW5nU2VydmljZSB7XG4gIGJhc2VVcmw6IHN0cmluZ1xuICBjb25maWdEZXRhaWxzOiBhbnlcbiAgc2NyZWVuV2lkdGg6IG51bWJlcjtcbiAgaGVhZGVyczphbnlcbiAgb25SZXNpemUoZXZlbnQpIHtcbiAgICB0aGlzLnNjcmVlbldpZHRoID0gZXZlbnQudGFyZ2V0LmlubmVyV2lkdGg7XG4gIH1cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgaW5pdFN2YzogSW5pdFNlcnZpY2UsXG4gICkge1xuICAgIGlmIChpbml0U3ZjICYmIHRoaXMuaW5pdFN2Yy5iYXNlVXJsICYmIHRoaXMuaW5pdFN2Yy5jb25maWdEZXRhaWxzKSB7XG4gICAgICB0aGlzLmJhc2VVcmwgPSB0aGlzLmluaXRTdmMuYmFzZVVybFxuICAgICAgdGhpcy5jb25maWdEZXRhaWxzID0gdGhpcy5pbml0U3ZjLmNvbmZpZ0RldGFpbHNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRDb25maURldGFpbHMoKVxuICAgIH1cbiAgICB0aGlzLnNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgLy8gY29uc3Qgc3RvcmFnZURhdGE6YW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9naW5EYXRhJykpXG4gICAgLy8gY29uc29sZS5sb2coJ3N0b3JhZ2VEYXRhLS0nLCBzdG9yYWdlRGF0YSlcbiAgICAvLyB0aGlzLmhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgIC8vICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7c3RvcmFnZURhdGE/LmFjY2Vzc190b2tlbn1gXG4gICAgLy8gfSk7XG4gIH1cblxuICBzZXRDb25maURldGFpbHMoY29uZmlnRGV0YWlsczogYW55ID0gbnVsbCkge1xuICAgIGlmIChjb25maWdEZXRhaWxzKSB7XG4gICAgICB0aGlzLmNvbmZpZ0RldGFpbHMgPSBjb25maWdEZXRhaWxzXG4gICAgICB0aGlzLmJhc2VVcmwgPSBjb25maWdEZXRhaWxzLnBvcnRhbFVSTFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdldENvbmZpZ0RldGFpbHMoKS5zdWJzY3JpYmUoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWdEZXRhaWxzID0gcmVzcG9uc2VcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gcmVzcG9uc2UucG9ydGFsVVJMXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBnZXRDb25maWcoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnRGV0YWlscykge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnRGV0YWlscztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZ2V0Q29uZmlnRGV0YWlscygpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PignYXNzZXRzL2pzb25maWxlcy9jb25maWd1cmF0aW9ucy5qc29uJyk7XG4gIH1cblxuICAvLyBhc3luYyBnZW5lcmF0ZVJvbGVNYXBwaW5nKFxuICAvLyAgIHJlcUJvZHk6IGFueSxcbiAgLy8gICBmaWxlOiBGaWxlW10gfCBudWxsLFxuICAvLyAgIG9uQ2h1bms6IChjaHVuazogc3RyaW5nKSA9PiB2b2lkLFxuICAvLyAgIG9uU3RhcnQ/OiAoKSA9PiB2b2lkLFxuICAvLyAgIG9uRW5kPzogKCkgPT4gdm9pZCxcbiAgLy8gICBvbkVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWRcbiAgLy8gKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vICAgY29uc3Qgc3RvcmFnZURhdGE6YW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9naW5EYXRhJykpXG4gIC8vICAgY29uc29sZS5sb2coJ3N0b3JhZ2VEYXRhLS0nLCBzdG9yYWdlRGF0YSlcbiAgLy8gICB0aGlzLmhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAvLyAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7c3RvcmFnZURhdGE/LmFjY2Vzc190b2tlbn1gXG4gIC8vICAgfSk7XG5cbiAgLy8gICBjb25zdCBoZWFkZXJzT2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgLy8gICB0aGlzLmhlYWRlcnMua2V5cygpLmZvckVhY2goa2V5ID0+IHtcbiAgLy8gICAgIGNvbnN0IHZhbHVlID0gdGhpcy5oZWFkZXJzLmdldChrZXkpO1xuICAvLyAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gIC8vICAgICAgIGhlYWRlcnNPYmpba2V5XSA9IHZhbHVlO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgLy8gICBpZiAocmVxQm9keS5zdGF0ZV9jZW50ZXJfaWQpIHtcbiAgLy8gICAgIGZvcm1EYXRhLmFwcGVuZCgnc3RhdGVfY2VudGVyX2lkJywgcmVxQm9keS5zdGF0ZV9jZW50ZXJfaWQpO1xuICAvLyAgIH1cblxuICAvLyAgIGlmIChyZXFCb2R5LmRlcGFydG1lbnRfaWQpIHtcbiAgLy8gICAgIGZvcm1EYXRhLmFwcGVuZCgnZGVwYXJ0bWVudF9pZCcsIHJlcUJvZHkuZGVwYXJ0bWVudF9pZCk7XG4gIC8vICAgfVxuXG4gIC8vICAgaWYgKHJlcUJvZHkuaW5zdHJ1Y3Rpb24pIHtcbiAgLy8gICAgIGZvcm1EYXRhLmFwcGVuZCgnaW5zdHJ1Y3Rpb24nLCByZXFCb2R5Lmluc3RydWN0aW9uKTtcbiAgLy8gICB9XG5cbiAgLy8gICAvLyBBZGQgc2VjdG9yX25hbWUgcGFyYW1ldGVyIGFzIHJlcXVpcmVkIGJ5IHRoZSBBUElcbiAgLy8gICBmb3JtRGF0YS5hcHBlbmQoJ3NlY3Rvcl9uYW1lJywgJ0dvdmVybm1lbnQnKTtcblxuICAvLyAgIGlmIChmaWxlKSB7XG4gIC8vICAgICBmb3JtRGF0YS5hcHBlbmQoJ2FkZGl0aW9uYWxfZG9jdW1lbnQnLCBmaWxlKTtcbiAgLy8gICB9XG5cbiAgLy8gICB0cnkge1xuICAvLyAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HRVRfUk9MRV9NQVBQSU5HfWAsIHtcbiAgLy8gICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gIC8vICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAvLyAgICAgICBoZWFkZXJzOiBoZWFkZXJzT2JqXG4gIC8vICAgICB9KTtcblxuICAvLyAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAvLyAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIC8vICAgICAgIGxldCBlcnJvckRldGFpbCA9ICcnO1xuICAgICAgICBcbiAgLy8gICAgICAgdHJ5IHtcbiAgLy8gICAgICAgICBjb25zdCBlcnJvckpzb24gPSBKU09OLnBhcnNlKGVycm9yVGV4dCk7XG4gIC8vICAgICAgICAgZXJyb3JEZXRhaWwgPSBlcnJvckpzb24uZGV0YWlsIHx8IGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gIC8vICAgICAgIH0gY2F0Y2gge1xuICAvLyAgICAgICAgIGVycm9yRGV0YWlsID0gZXJyb3JUZXh0IHx8IGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWA7XG4gIC8vICAgICAgIH1cbiAgICAgICAgXG4gIC8vICAgICAgIC8vIFBhc3Mgc3BlY2lmaWMgZXJyb3IgZGV0YWlscyB0byBvbkVycm9yIGNhbGxiYWNrXG4gIC8vICAgICAgIGlmIChvbkVycm9yKSBvbkVycm9yKHsgXG4gIC8vICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsIFxuICAvLyAgICAgICAgIGRldGFpbDogZXJyb3JEZXRhaWwsXG4gIC8vICAgICAgICAgaXNFeGlzdGluZ1JvbGVNYXBwaW5nOiBlcnJvckRldGFpbC5pbmNsdWRlcygnUm9sZSBtYXBwaW5nIGFscmVhZHkgZXhpc3RzJylcbiAgLy8gICAgICAgfSk7XG4gIC8vICAgICAgIHJldHVybjtcbiAgLy8gICAgIH1cblxuICAvLyAgICAgaWYgKCFyZXNwb25zZS5ib2R5KSB7XG4gIC8vICAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmVyIHJlc3BvbmRlZCB3aXRoICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAvLyAgICAgfVxuXG4gIC8vICAgICBjb25zdCByZWFkZXIgPSByZXNwb25zZS5ib2R5LmdldFJlYWRlcigpO1xuICAvLyAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKTtcbiAgLy8gICAgIGxldCBidWZmZXIgPSAnJztcblxuICAvLyAgICAgd2hpbGUgKHRydWUpIHtcbiAgLy8gICAgICAgY29uc3QgeyB2YWx1ZSwgZG9uZSB9ID0gYXdhaXQgcmVhZGVyLnJlYWQoKTtcbiAgLy8gICAgICAgaWYgKGRvbmUpIGJyZWFrO1xuXG4gIC8vICAgICAgIGJ1ZmZlciArPSBkZWNvZGVyLmRlY29kZSh2YWx1ZSwgeyBzdHJlYW06IHRydWUgfSk7XG5cbiAgLy8gICAgICAgY29uc3QgZXZlbnRzID0gYnVmZmVyLnNwbGl0KCdcXG5cXG4nKTtcbiAgLy8gICAgICAgYnVmZmVyID0gZXZlbnRzLnBvcCgpIHx8ICcnOyAvLyBTYXZlIGluY29tcGxldGUgZXZlbnRcblxuICAvLyAgICAgICBmb3IgKGNvbnN0IHJhd0V2ZW50IG9mIGV2ZW50cykge1xuICAvLyAgICAgICAgIGNvbnN0IGxpbmVzID0gcmF3RXZlbnQuc3BsaXQoJ1xcbicpO1xuICAvLyAgICAgICAgIGxldCBldmVudFR5cGUgPSAnbWVzc2FnZSc7XG4gIC8vICAgICAgICAgbGV0IGRhdGEgPSAnJztcblxuICAvLyAgICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAvLyAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnZXZlbnQ6JykpIHtcbiAgLy8gICAgICAgICAgICAgZXZlbnRUeXBlID0gbGluZS5zbGljZSg2KS50cmltKCk7XG4gIC8vICAgICAgICAgICB9IGVsc2UgaWYgKGxpbmUuc3RhcnRzV2l0aCgnZGF0YTonKSkge1xuICAvLyAgICAgICAgICAgICBkYXRhICs9IGxpbmUuc2xpY2UoNSkudHJpbSgpO1xuICAvLyAgICAgICAgICAgfVxuICAvLyAgICAgICAgIH1cblxuICAvLyAgICAgICAgIGlmIChldmVudFR5cGUgPT09ICdzdGFydCcgJiYgb25TdGFydCkgb25TdGFydCgpO1xuICAvLyAgICAgICAgIGVsc2UgaWYgKGV2ZW50VHlwZSA9PT0gJ2NodW5rJykgb25DaHVuayhKU09OLnBhcnNlKGRhdGEpLmNodW5rKTtcbiAgLy8gICAgICAgICBlbHNlIGlmIChldmVudFR5cGUgPT09ICdlbmQnICYmIG9uRW5kKSBvbkVuZCgpO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIGlmIChvbkVuZCkgb25FbmQoKTtcbiAgLy8gICB9IGNhdGNoIChlcnIpIHtcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoJ1N0cmVhbWluZyBlcnJvcjonLCBlcnIpO1xuICAvLyAgICAgaWYgKG9uRXJyb3IpIG9uRXJyb3IoZXJyKTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICBhc3luYyBnZW5lcmF0ZVJvbGVNYXBwaW5nKFxuICAgIHJlcUJvZHk6IGFueSxcbiAgICBmaWxlczogRmlsZSB8IEZpbGVbXSB8IG51bGwsXG4gICAgb25DaHVuazogKGNodW5rOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgb25TdGFydD86ICgpID0+IHZvaWQsXG4gICAgb25FbmQ/OiAoKSA9PiB2b2lkLFxuICAgIG9uRXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdG9yYWdlRGF0YTogYW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9naW5EYXRhJykpO1xuICAgIGNvbnNvbGUubG9nKCdzdG9yYWdlRGF0YS0tJywgc3RvcmFnZURhdGEpO1xuICBcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7c3RvcmFnZURhdGE/LmFjY2Vzc190b2tlbn1gXG4gICAgfSk7XG4gIFxuICAgIGNvbnN0IGhlYWRlcnNPYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICB0aGlzLmhlYWRlcnMua2V5cygpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5oZWFkZXJzLmdldChrZXkpO1xuICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgIGhlYWRlcnNPYmpba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBcbiAgICBpZiAocmVxQm9keS5zdGF0ZV9jZW50ZXJfaWQpIGZvcm1EYXRhLmFwcGVuZCgnc3RhdGVfY2VudGVyX2lkJywgcmVxQm9keS5zdGF0ZV9jZW50ZXJfaWQpO1xuICAgIGlmIChyZXFCb2R5LmRlcGFydG1lbnRfaWQpIGZvcm1EYXRhLmFwcGVuZCgnZGVwYXJ0bWVudF9pZCcsIHJlcUJvZHkuZGVwYXJ0bWVudF9pZCk7XG4gICAgaWYgKHJlcUJvZHkuaW5zdHJ1Y3Rpb24pIGZvcm1EYXRhLmFwcGVuZCgnaW5zdHJ1Y3Rpb24nLCByZXFCb2R5Lmluc3RydWN0aW9uKTtcbiAgXG4gICAgLy8gQWRkIHNlY3Rvcl9uYW1lIHBhcmFtZXRlciBhcyByZXF1aXJlZCBieSB0aGUgQVBJXG4gICAgZm9ybURhdGEuYXBwZW5kKCdzZWN0b3JfbmFtZScsICdHb3Zlcm5tZW50Jyk7XG4gICAgY29uc29sZS5sb2coJ2ZpbGVzLS0tLS0tLS0tLS0tJywgZmlsZXMpXG4gICAgLy8gSGFuZGxlIHNpbmdsZSBvciBtdWx0aXBsZSBmaWxlc1xuICAgIGlmIChmaWxlcykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsZXMpKSB7XG4gICAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdhZGRpdGlvbmFsX2RvY3VtZW50JywgZmlsZSwgZmlsZS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2FkZGl0aW9uYWxfZG9jdW1lbnQnLCBmaWxlcywgZmlsZXMubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICB0cnkge1xuICAgICAgLy8gQWZ0ZXIgYXBwZW5kaW5nIGZpbGVzIGFuZCBvdGhlciBmaWVsZHNcbiAgICAgIGNvbnNvbGUubG9nKCdGb3JtRGF0YSBjb250ZW50czonKTtcbiAgICAgIGZvcm1EYXRhLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2tleX06ICR7dmFsdWUubmFtZX0gKCR7dmFsdWUuc2l6ZX0gYnl0ZXMpYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7a2V5fTogJHt2YWx1ZX1gKTtcbiAgICAgICAgfVxuICAgICAgfSk7IFxuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdFVF9ST0xFX01BUFBJTkd9YCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnNPYmpcbiAgICAgIH0pO1xuICBcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICBsZXQgZXJyb3JEZXRhaWwgPSAnJztcbiAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JKc29uID0gSlNPTi5wYXJzZShlcnJvclRleHQpO1xuICAgICAgICAgIGVycm9yRGV0YWlsID0gZXJyb3JKc29uLmRldGFpbCB8fCBgSFRUUCBlcnJvciEgc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICBlcnJvckRldGFpbCA9IGVycm9yVGV4dCB8fCBgSFRUUCBlcnJvciEgc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAob25FcnJvcikgb25FcnJvcih7IFxuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLCBcbiAgICAgICAgICBkZXRhaWw6IGVycm9yRGV0YWlsLFxuICAgICAgICAgIGlzRXhpc3RpbmdSb2xlTWFwcGluZzogZXJyb3JEZXRhaWwuaW5jbHVkZXMoJ1JvbGUgbWFwcGluZyBhbHJlYWR5IGV4aXN0cycpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gIFxuICAgICAgaWYgKCFyZXNwb25zZS5ib2R5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmVyIHJlc3BvbmRlZCB3aXRoICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICBcbiAgICAgIGNvbnN0IHJlYWRlciA9IHJlc3BvbnNlLmJvZHkuZ2V0UmVhZGVyKCk7XG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpO1xuICAgICAgbGV0IGJ1ZmZlciA9ICcnO1xuICBcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IHsgdmFsdWUsIGRvbmUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG4gICAgICAgIGlmIChkb25lKSBicmVhaztcbiAgXG4gICAgICAgIGJ1ZmZlciArPSBkZWNvZGVyLmRlY29kZSh2YWx1ZSwgeyBzdHJlYW06IHRydWUgfSk7XG4gIFxuICAgICAgICBjb25zdCBldmVudHMgPSBidWZmZXIuc3BsaXQoJ1xcblxcbicpO1xuICAgICAgICBidWZmZXIgPSBldmVudHMucG9wKCkgfHwgJyc7IC8vIFNhdmUgaW5jb21wbGV0ZSBldmVudFxuICBcbiAgICAgICAgZm9yIChjb25zdCByYXdFdmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgICBjb25zdCBsaW5lcyA9IHJhd0V2ZW50LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICBsZXQgZXZlbnRUeXBlID0gJ21lc3NhZ2UnO1xuICAgICAgICAgIGxldCBkYXRhID0gJyc7XG4gIFxuICAgICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnZXZlbnQ6JykpIGV2ZW50VHlwZSA9IGxpbmUuc2xpY2UoNikudHJpbSgpO1xuICAgICAgICAgICAgZWxzZSBpZiAobGluZS5zdGFydHNXaXRoKCdkYXRhOicpKSBkYXRhICs9IGxpbmUuc2xpY2UoNSkudHJpbSgpO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgaWYgKGV2ZW50VHlwZSA9PT0gJ3N0YXJ0JyAmJiBvblN0YXJ0KSBvblN0YXJ0KCk7XG4gICAgICAgICAgZWxzZSBpZiAoZXZlbnRUeXBlID09PSAnY2h1bmsnKSBvbkNodW5rKEpTT04ucGFyc2UoZGF0YSkuY2h1bmspO1xuICAgICAgICAgIGVsc2UgaWYgKGV2ZW50VHlwZSA9PT0gJ2VuZCcgJiYgb25FbmQpIG9uRW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgXG4gICAgICBpZiAob25FbmQpIG9uRW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdTdHJlYW1pbmcgZXJyb3I6JywgZXJyKTtcbiAgICAgIGlmIChvbkVycm9yKSBvbkVycm9yKGVycik7XG4gICAgfVxuICB9XG4gIFxufVxuIl19