import { HttpHeaders, HttpParams } from '@angular/common/http';
//Injectable
import { HostListener, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./init.service";
// import configuration from '../../../../assets/jsonfiles/configurations.json'
const API_END_POINTS = {
    FETCH_COURSES: 'api/v1/course/v2/explore',
    FETCH_POSTAL_COURSES: 'api/v1/content/v1/search',
    FETCH_RAILWAY_COURSES: 'api/v1/content/v1/search',
    FETCH_HALL_OF_FAME: 'api/v1/halloffame/read',
    NLW_FORM_READ: 'apis/v1/static/form/v1/read',
    FETCH_TENDERS: 'api/v1/content/v1/search',
    GET_STATE_CENTER: 'cbp-tpc-ai/api/v1/state-center',
    GET_ROLE_MAPPING: 'cbp-tpc-ai/api/v3/role-mapping/generate',
    DELETE_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping/delete',
    GET_DEPARTMENT: 'cbp-tpc-ai/api/v1/department/state-center',
    GET_ROLE_MAPPING_BY_STATE_CENTER: 'cbp-tpc-ai/api/v1/role-mapping/state-center',
    GET_ROLE_MAPPING_BY_STATE_CENTER_DEPARTMENT: 'cbp-tpc-ai/api/v1/role-mapping/state-center',
    UPDATE_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping',
    GET_RECOMMENDED_COURSE: 'cbp-tpc-ai/api/v1/',
    SAVE_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan/save',
    GET_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan',
    UPDATE_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan',
    IGOT_SUGGESTED_COURSE: 'api/v1/content/v1/search',
    SAVE_COURSE_SUGGESTED_COURSE: 'cbp-tpc-ai/api/v1/course/suggestions/save',
    SUGGESTED_COURSE_LIST: 'cbp-tpc-ai/api/v1/course/suggestions',
    ADD_DESIGNATION: 'cbp-tpc-ai/api/v2/role-mapping/add-designation',
    LOGIN: 'cbp-tpc-ai/api/v1/auth/login',
    LOGOUT: 'cbp-tpc-ai/api/v1/auth/logout',
    DELETE_ROLE_MAPPING_BY_STATE_CENTER: 'cbp-tpc-ai/api/v1/role-mapping',
    ADD_USER_COURSES: 'cbp-tpc-ai/api/v1/user-added-courses',
    GET_USER_COURSES: 'cbp-tpc-ai/api/v1/user-added-courses/role-mapping',
    GET_USER_SELECTED_COURSES: 'cbp-tpc-ai/api/v1/cbp-plan',
    UPLOAD_DOCUMENT: 'cbp-tpc-ai/api/v1/files',
    GET_DOCUMENTS: 'cbp-tpc-ai/api/v1/files',
    DELETE_FILE: 'cbp-tpc-ai/api/v1/files',
    TRIGGER_FILE_SUMMARY: 'cbp-tpc-ai/api/v1/files',
    DOWNLOAD_FILE: 'cbp-tpc-ai/api/v1/files',
    DELETE_SUMMARY: 'cbp-tpc-ai/api/v1/files',
    GET_USER_PROFILE: 'cbp-tpc-ai/api/v1/users/me',
    GET_USER_RECOMMENED_COURSES: 'cbp-tpc-ai/api/v1/course-recommendations',
    DOWNLOAD_PDF: 'cbp-tpc-ai/api/v1/reports/cbp-plan/download',
    DOWNLOAD_PDF_ACBP: 'cbp-tpc-ai/api/v1/reports/acbp-plan/download',
    CENTER_BASED_MINISTRY: 'cbp-tpc-ai/api/v1/department/state-center',
    DOWNLOAD_COURSE_RECOMMENDATION: 'cbp-tpc-ai/api/v1/reports/course-recommendations/download',
    DELETE_COURSE_RECOMMENDATION: 'cbp-tpc-ai/api/v1/cbp-plan',
    UPDATE_DESIGNATION_HIERARCHY: 'cbp-tpc-ai/api/v1/role-mapping/reorder',
    SEARCH_PUBLIC_DESIGNATION: 'apis/public/v8/designation/search',
    DASHBOARD_ADMIN: 'cbp-tpc-ai/api/v1/dashboard/cbp-dashboard-metrics',
    GAP_ANALYSIS_ADMIN: 'cbp-tpc-ai/api/v1/dashboard/gap-analysis',
    DASHBOARD_PUBLIC: 'cbp-tpc-ai/api/v1/dashboard/my-dashboard-metrics',
    GAP_ANALYSIS_PUBLIC: 'cbp-tpc-ai/api/v1/dashboard/my-gap-analysis',
    MATCHED_ROLE_MAPPING: 'cbp-tpc-ai/api/v1/role-mapping/match-designations',
    GET_APPROVAL_REQUESTS: 'cbp-tpc-ai/api/v1/approval-requests/list',
    SEARCH_PUBLIC_MDO: 'cbp-tpc-ai/api/v1/approval-requests/mdo-admins',
    SAVE_APPROVAL_REQUEST: 'cbp-tpc-ai/api/v1/approval-requests/send',
    VIEW_APPROVAL_REQUEST: 'cbp-tpc-ai/api/v1/approval-requests',
    REVOKE_APPROVAL_REQUEST: 'cbp-tpc-ai/api/v1/approval-requests',
};
// @Directive()
export class SharedService {
    onResize(event) {
        this.screenWidth = event.target.innerWidth;
    }
    constructor(http, initSvc) {
        this.http = http;
        this.initSvc = initSvc;
        this.cbpPlanFinalObj = {};
        this.summaryTriggerExecuted = new Subject();
        this.loginSuccess = new Subject();
        this.checkRoleMappingFormValidation = new Subject();
        this.updateDesignationHierarchySubject = new Subject();
        if (initSvc && this.initSvc.baseUrl && this.initSvc.configDetails) {
            this.baseUrl = this.initSvc.baseUrl;
            this.configDetails = this.initSvc.configDetails;
        }
        else {
            this.setConfiDetails();
        }
        this.screenWidth = window.innerWidth;
        const storageData = JSON.parse(localStorage.getItem('loginData'));
        console.log('storageData--', storageData);
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${storageData?.access_token}`
        });
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
    getcourses() {
        return this.http.get(`${this.baseUrl}${API_END_POINTS.FETCH_COURSES}`)
            .pipe(map((response) => {
            return this.formateFeatureCourses(response.result.content);
        }));
    }
    getPostalcourses() {
        return this.http.get(`${this.baseUrl}${API_END_POINTS.FETCH_POSTAL_COURSES}`)
            .pipe(map((response) => {
            return this.formateFeatureCourses(response.result.content);
        }));
    }
    getRailwaycourses() {
        return this.http.get(`${this.baseUrl}${API_END_POINTS.FETCH_RAILWAY_COURSES}`)
            .pipe(map((response) => {
            return this.formateFeatureCourses(response.result.content);
        }));
    }
    getHallOfFame() {
        return this.http.post(`${this.baseUrl}${API_END_POINTS.FETCH_HALL_OF_FAME}`, null)
            .pipe(map((response) => {
            return response;
        }));
    }
    formateFeatureCourses(featureCourses) {
        const formatedFeatureCourses = [];
        const formatedNewsroom = [];
        const formatedPhotogallary = [];
        const formatedTestimonial = [];
        if (featureCourses) {
            featureCourses.forEach(course => {
                if (course.primaryCategory === 'Course') {
                    const formatedCourse = {
                        posterImage: course.posterImage,
                        organisation: course.organisation[0] ? course.organisation[0] : 'Karmayogi Bharat',
                        name: course.name,
                        description: course.description,
                        identifier: course.identifier,
                        alt: course.name,
                        creatorLogo: course.creatorLogo || '',
                        duration: this.timeConvert(course.duration),
                    };
                    formatedFeatureCourses.push(formatedCourse);
                }
                else if (course.resourceCategory === 'Newsroom') {
                    const formatedCourse = {
                        posterImage: course.posterImage,
                        name: course.name,
                        description: course.description,
                        identifier: course.identifier,
                        alt: course.name,
                        cloudStorageKey: `${this.baseUrl}assets/public/${course.cloudStorageKey}`
                    };
                    formatedNewsroom.push(formatedCourse);
                }
                else if (course.resourceCategory === 'Photo Gallery') {
                    const formatedCourse = {
                        name: course.name,
                        description: course.description,
                        identifier: course.identifier,
                        alt: course.name,
                        cloudStorageKey: `${this.baseUrl}assets/public/${course.cloudStorageKey}`
                    };
                    formatedPhotogallary.push(formatedCourse);
                }
                else if (course.resourceCategory === 'Testimonials') {
                    const formatedCourse = {
                        name: course.name,
                        description: course.description,
                        identifier: course.identifier,
                        alt: course.name,
                        cloudStorageKey: `${this.baseUrl}assets/public/${course.cloudStorageKey}`,
                        mimeType: course.mimeType,
                        posterImage: course.posterImage,
                        artifactUrl: course.artifactUrl,
                    };
                    formatedTestimonial.push(formatedCourse);
                }
            });
        }
        return { course: formatedFeatureCourses, newsroom: formatedNewsroom, gallary: formatedPhotogallary, testimonils: formatedTestimonial };
    }
    timeConvert(duration) {
        if (duration) {
            var num = duration;
            var hours = (num / 3600);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            if (rminutes === 0) {
                return rhours + "h";
            }
            else if (rhours === 0) {
                return rminutes + "m";
            }
            return rhours + "h " + rminutes + "m";
        }
        else {
            return 0;
        }
    }
    getClientList() {
        return this.http.get('./assets/jsonfiles/client-list.json');
    }
    getTenders() {
        const body = {
            request: {
                filters: {
                    primaryCategory: ["tender"],
                    status: { "!=": "Retired" }
                },
                facets: ["mimeType"],
                sortBy: { createdOn: "Desc" }
            }
        };
        return this.http.post(`${this.baseUrl}${API_END_POINTS.FETCH_TENDERS}`, body)
            .pipe(map((response) => {
            return response;
        }));
    }
    getNotifications() {
        const body = {
            request: {
                filters: {
                    primaryCategory: ["notification"],
                    status: { "!=": "Retired" }
                },
                facets: ["mimeType"],
                sortBy: { createdOn: "desc" }
            }
        };
        return this.http.post(`${this.baseUrl}${API_END_POINTS.FETCH_TENDERS}`, body)
            .pipe(map((response) => {
            return response;
        }));
    }
    getFormReadData(req) {
        return this.http.post(`${this.baseUrl}${API_END_POINTS.NLW_FORM_READ}`, req)
            .pipe(map((response) => {
            return response;
        }));
    }
    getMinistryData(ministryType) {
        let sub_org_type = '';
        if (ministryType == 'ministry') {
            sub_org_type = 'ministry';
        }
        else {
            sub_org_type = 'state';
        }
        const storageData = JSON.parse(localStorage.getItem('loginData'));
        console.log('storageData--', storageData);
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${storageData?.access_token}`
        });
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_STATE_CENTER}/?sub_org_type=${sub_org_type}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    generateRoleMapping(reqBody, files) {
        console.log('reqBody--', reqBody);
        console.log('files---', files);
        const formData = new FormData();
        // Add required fields
        if (reqBody.state_center_id) {
            formData.append('state_center_id', reqBody.state_center_id);
        }
        if (reqBody.state_center_name) {
            formData.append('state_center_name', reqBody.state_center_name);
        }
        if (reqBody.department_id) {
            formData.append('department_id', reqBody.department_id);
        }
        if (reqBody.department_name) {
            formData.append('department_name', reqBody.department_name);
        }
        if (reqBody.instruction) {
            formData.append('instruction', reqBody.instruction);
        }
        const cbpData = JSON.parse(localStorage.getItem('cbpPlanFinalObj') || '{}');
        const orgType = cbpData?.ministry?.sbOrgType ||
            cbpData?.org_type ||
            '';
        if (orgType) {
            formData.append('org_type', orgType);
        }
        // Handle multiple or single file
        if (files) {
            if (Array.isArray(files)) {
                files.forEach((file) => {
                    formData.append('additional_document', file, file.name);
                });
            }
            else {
                // Single file
                formData.append('additional_document', files, files.name);
            }
        }
        // Debug FormData content
        console.log("FormData contents:");
        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(`${key}: FILE -> ${value.name} (${value.size} bytes)`);
            }
            else {
                console.log(`${key}: ${value}`);
            }
        });
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING}`, formData, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getDepartmentList(ministryId) {
        const storageData = JSON.parse(localStorage.getItem('loginData'));
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${storageData?.access_token}`
        });
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_DEPARTMENT}/${ministryId}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getRoleMappingByStateCenter(state_center_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}?load_cbp_plans=true`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getRoleMappingByStateCenterAndDepartment(state_center_id, department_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_ROLE_MAPPING_BY_STATE_CENTER}/${state_center_id}/department/${department_id}?load_cbp_plans=true`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    updateRoleMapping(role_mapping_id, reqBody) {
        const headers = this.headers;
        return this.http.put(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    deleteRoleMapping(role_mapping_id) {
        const headers = this.headers;
        return this.http.delete(`${this.baseUrl}${API_END_POINTS.UPDATE_ROLE_MAPPING}/${role_mapping_id}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getRecommendedCourse(role_mapping_id) {
        const headers = this.headers;
        let reqBody = {
            role_mapping_id: role_mapping_id
        };
        return this.http.post(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/generate`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    deleteCourseRecommendations(roleMapId) {
        const headers = this.headers;
        return this.http.delete(`${this.baseUrl}${API_END_POINTS.GET_RECOMMENDED_COURSE}/course-recommendations/role-mapping/${roleMapId}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    saveCourse(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.SAVE_COURSES}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    updateCourse(reqBody, cbp_plan_id) {
        const headers = this.headers;
        return this.http.put(`${this.baseUrl}${API_END_POINTS.UPDATE_COURSES}/${cbp_plan_id}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getCourse(role_mapping_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_COURSES}?role_mapping_id=${role_mapping_id}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getIGOTSuggestedCourses(reqBody) {
        // Use the reqBody parameter passed from the component
        // If no reqBody is provided, use default structure
        let req = reqBody || {
            "request": {
                "filters": {
                    "primaryCategory": ["Course"],
                    "status": ["Live"],
                    "courseCategory": ["Course"]
                },
                "fields": ["posterImage", "description", "name"],
                "limit": 12,
                "offset": 0
            }
        };
        console.log('getIGOTSuggestedCourses final request:', JSON.stringify(req, null, 2));
        const headers = this.headers;
        return this.http.post(`https://portal.igotkarmayogi.gov.in/api/content/v1/search`, req, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getSuggestedCourses(role_mapping_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.SUGGESTED_COURSE_LIST}/${role_mapping_id}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    saveSuggestedCourse(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.SAVE_COURSE_SUGGESTED_COURSE}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    addDesignation(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.ADD_DESIGNATION}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    performLogin(reqBody) {
        const body = new HttpParams()
            .set('username', reqBody.username)
            .set('password', reqBody.password);
        console.log('in login uat');
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        });
        return this.http.post(`${this.baseUrl}${API_END_POINTS.LOGIN}`, body.toString(), { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    logout() {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.LOGOUT}`, '', { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    setCBPPlanLocalStorage() {
        localStorage.setItem('cbpPlanFinalObj', JSON.stringify(this.cbpPlanFinalObj));
    }
    getCBPPlanLocalStorage() {
        let cbpPlanFinalObj = JSON.parse(localStorage.getItem('cbpPlanFinalObj'));
        return cbpPlanFinalObj;
    }
    checkIfLogin() {
        let flag = false;
        let loginData = localStorage.getItem('loginData');
        if (loginData && JSON.parse(loginData)['access_token']) {
            flag = true;
        }
        else {
            flag = false;
        }
        return flag;
    }
    deleteRoleMappingByStateAndDepartment(state_center_id, department_id) {
        const headers = this.headers;
        let url = '';
        if (department_id && department_id !== 'null' && department_id !== 'undefined' && department_id !== undefined && department_id !== null) {
            url = `${this.baseUrl}${API_END_POINTS.DELETE_ROLE_MAPPING_BY_STATE_CENTER}?state_center_id=${state_center_id}&department_id=${department_id}`;
        }
        else {
            url = `${this.baseUrl}${API_END_POINTS.DELETE_ROLE_MAPPING_BY_STATE_CENTER}?state_center_id=${state_center_id}`;
        }
        return this.http.delete(url, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    addUserCourse(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.ADD_USER_COURSES}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getUserCourse(role_mapping_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_USER_COURSES}/${role_mapping_id}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getCompetencyJson() {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}/training-pla-ai/assets/jsonfiles/competencies.json`, { headers })
            .pipe(map((response) => {
            return response;
        }));
        // this.http.get<any[]>('/assets/jsonfiles/competencies.json')
    }
    convert(seconds) {
        if (!seconds || seconds <= 0) {
            return 'N/A';
        }
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;
        if (hours > 0) {
            // For durations with hours, show hours and minutes (e.g., "3h 10m")
            if (minutes > 0) {
                return `${hours}h ${minutes}m`;
            }
            else {
                return `${hours}h`;
            }
        }
        else if (minutes > 0) {
            // For durations under an hour, show minutes and seconds (e.g., "58m 3s")
            if (remainingSeconds > 0) {
                return `${minutes}m ${remainingSeconds}s`;
            }
            else {
                return `${minutes}m`;
            }
        }
        else {
            // For durations under a minute, show seconds only
            return `${remainingSeconds}s`;
        }
    }
    getUserProfile() {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_USER_PROFILE}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getUserRecommendationCourse(role_mapping_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_USER_SELECTED_COURSES}?role_mapping_id=${role_mapping_id}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    downloadPdf(state_center_id, context, language) {
        const endpoint = context === 'acbp'
            ? API_END_POINTS.DOWNLOAD_PDF_ACBP
            : API_END_POINTS.DOWNLOAD_PDF;
        const url = `${this.baseUrl}${endpoint}?state_center_id=${state_center_id}*&language=${language}`;
        const headers = this.headers;
        return this.http.get(url, {
            headers,
            observe: 'response',
            responseType: 'blob'
        }).subscribe((res) => {
            const contentDisposition = res.headers.get('content-disposition');
            console.log('contentDisposition', res.headers);
            let filename = `CBP_Report_${state_center_id}.pdf`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
            // Create a blob URL and download
            const blob = new Blob([res.body], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(downloadUrl);
        });
    }
    downloadPdfForDepartment(state_center_id, department_id, context, language) {
        const endpoint = context === 'acbp'
            ? API_END_POINTS.DOWNLOAD_PDF_ACBP
            : API_END_POINTS.DOWNLOAD_PDF;
        const url = `${this.baseUrl}${endpoint}?state_center_id=${state_center_id}&department_id=${department_id}&language=${language}`;
        const headers = this.headers;
        return this.http.get(url, {
            headers,
            observe: 'response',
            responseType: 'blob'
        }).subscribe((res) => {
            const contentDisposition = res.headers.get('content-disposition');
            console.log('contentDisposition', res.headers);
            let filename = `CBP_Report_${state_center_id}_${department_id}.pdf`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
            // Create a blob URL and download
            const blob = new Blob([res.body], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(downloadUrl);
        });
    }
    getCenterBasedDepartment(state_center_id) {
        // let reqBody = { "request": { "filters": { "status": 1, "ministryOrStateType": "ministry", "ministryOrStateId": state_center_id}, "sort_by": { "createdDate": "desc" }, "limit": 9999, "offset": 0, "fields": ["identifier", "orgName", "description", "parentOrgName", "ministryOrStateId", "ministryOrStateType", "ministryOrStateName", "sbOrgSubType"] } }
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.CENTER_BASED_MINISTRY}/${state_center_id}?limit=9999&offset=0&sub_org_type=ministry`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    downloadPdfForCourseRecommendation(state_center_id) {
        const url = `${this.baseUrl}${API_END_POINTS.DOWNLOAD_COURSE_RECOMMENDATION}?role_mapping_id=${state_center_id}`;
        const headers = this.headers;
        return this.http.get(url, {
            headers,
            observe: 'response',
            responseType: 'blob'
        }).subscribe((res) => {
            const contentDisposition = res.headers.get('content-disposition');
            let filename = `COURSE_RECOMMENDATION_Report_${state_center_id}.pdf`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
            // Create a blob URL and download
            const blob = new Blob([res.body], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(downloadUrl);
        });
    }
    uploadDocument(reqBody, file) {
        const storageData = JSON.parse(localStorage.getItem('loginData'));
        //  console.log('storageData--', storageData)
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${storageData?.access_token}`
        });
        const headers = this.headers;
        // Add required fields
        // if (reqBody.state_center_id) {
        //   formData.append('state_center_id', reqBody.state_center_id);
        // }
        // if (reqBody.department_id) {
        //   formData.append('department_id', reqBody.department_id);
        // }
        // if(reqBody.documentName) {
        //   formData.append('document_name', reqBody.documentName);
        // }
        // Add file if provided
        // if (file) {
        //   formData.append('file', file);
        // }
        return this.http.post(`${this.baseUrl}${API_END_POINTS.UPLOAD_DOCUMENT}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getUploadedDocuments(reqBody) {
        const headers = this.headers;
        let params = new HttpParams();
        Object.entries(reqBody).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params = params.set(key, value.toString());
            }
        });
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_DOCUMENTS}`, {
            headers,
            params
        }).pipe(map((response) => {
            return response;
        }));
    }
    deleteFile(fileId) {
        const headers = this.headers;
        return this.http.delete(`${this.baseUrl}${API_END_POINTS.DELETE_FILE}/${fileId}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    triggerFileSummary(fileId) {
        const storageData = JSON.parse(localStorage.getItem('loginData'));
        // console.log('storageData--', storageData)
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${storageData?.access_token}`
        });
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.DELETE_FILE}/${fileId}/summary`, {}, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    downloadFile(fileId) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.DOWNLOAD_FILE}/${fileId}/download`, {
            headers,
            responseType: 'blob'
        });
    }
    deleteSummary(fileId) {
        const headers = this.headers;
        return this.http.delete(`${this.baseUrl}${API_END_POINTS.DELETE_SUMMARY}/${fileId}/summary`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    deleteRecommendedCourse(roleMappingId, courseIdentifier) {
        const headers = this.headers;
        return this.http.delete(`${this.baseUrl}${API_END_POINTS.DELETE_COURSE_RECOMMENDATION}/${roleMappingId}/course/${courseIdentifier}`, { headers });
    }
    getCbpPlansWithSelectedCourses() {
        const source = this.cbpPlanFinalObj;
        return source?.role_mapping_generation
            ?.flatMap((role) => role.cbp_plans || [])
            ?.filter((plan) => Array.isArray(plan.selected_courses) &&
            plan.selected_courses.length > 0) || [];
    }
    getAdditionalParameterforSuggestedCourses(identifiers) {
        const headers = this.headers;
        let reqBody = {
            "request": {
                "filters": {
                    "identifier": identifiers,
                    "status": [
                        "Live"
                    ]
                },
                "fields": [
                    "name",
                    "language",
                    "identifier",
                    "avgRating"
                ],
                "limit": 1000,
                "offset": 0,
                "sort_by": {}
            }
        };
        return this.http.post(`${this.baseUrl}${API_END_POINTS.SUGGESTED_COURSE_LIST}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    updateDesignationHierarchy(reqBody) {
        const headers = this.headers;
        return this.http.put(`${this.baseUrl}${API_END_POINTS.UPDATE_DESIGNATION_HIERARCHY}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    searchPublicDesignation(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.SEARCH_PUBLIC_DESIGNATION}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getDashboardAdmin(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.DASHBOARD_ADMIN}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getDashboardGapAnalysisAdmin(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.GAP_ANALYSIS_ADMIN}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getDashboardPublic(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.DASHBOARD_PUBLIC}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getDashboardGapAnalysisPublic(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.GAP_ANALYSIS_PUBLIC}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getMatchedRoleMapping(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.MATCHED_ROLE_MAPPING}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    getApprovalRequests(reqBody) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.GET_APPROVAL_REQUESTS}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    saveApprovalRequest(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.SAVE_APPROVAL_REQUEST}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    searchPublicmdo(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.SEARCH_PUBLIC_MDO}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    viewApprovalRequests(request_id) {
        const headers = this.headers;
        return this.http.get(`${this.baseUrl}${API_END_POINTS.VIEW_APPROVAL_REQUEST}/${request_id}`, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    revokeApprovalRequest(reqBody) {
        const headers = this.headers;
        return this.http.post(`${this.baseUrl}${API_END_POINTS.REVOKE_APPROVAL_REQUEST}`, reqBody, { headers })
            .pipe(map((response) => {
            return response;
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: SharedService, deps: [{ token: i1.HttpClient }, { token: i2.InitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: SharedService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: SharedService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.InitService }]; }, propDecorators: { onResize: [{
                type: HostListener,
                args: ['window:resize', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9saWJyYXJ5L3N1bmJpcmQtY2IvY2JwLWFpL3NyYy9saWIvbW9kdWxlcy9zaGFyZWQvc2VydmljZXMvc2hhcmVkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxZQUFZO0FBQ1osT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUErQixPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFBOzs7O0FBRXBDLCtFQUErRTtBQUUvRSxNQUFNLGNBQWMsR0FBRztJQUNyQixhQUFhLEVBQUUsMEJBQTBCO0lBQ3pDLG9CQUFvQixFQUFFLDBCQUEwQjtJQUNoRCxxQkFBcUIsRUFBRSwwQkFBMEI7SUFDakQsa0JBQWtCLEVBQUUsd0JBQXdCO0lBQzVDLGFBQWEsRUFBRSw2QkFBNkI7SUFDNUMsYUFBYSxFQUFFLDBCQUEwQjtJQUN6QyxnQkFBZ0IsRUFBRSxnQ0FBZ0M7SUFDbEQsZ0JBQWdCLEVBQUUseUNBQXlDO0lBQzNELG1CQUFtQixFQUFFLHVDQUF1QztJQUM1RCxjQUFjLEVBQUUsMkNBQTJDO0lBQzNELGdDQUFnQyxFQUFFLDZDQUE2QztJQUMvRSwyQ0FBMkMsRUFBRSw2Q0FBNkM7SUFDMUYsbUJBQW1CLEVBQUUsZ0NBQWdDO0lBQ3JELHNCQUFzQixFQUFFLG9CQUFvQjtJQUM1QyxZQUFZLEVBQUUsaUNBQWlDO0lBQy9DLFdBQVcsRUFBRSw0QkFBNEI7SUFDekMsY0FBYyxFQUFFLDRCQUE0QjtJQUM1QyxxQkFBcUIsRUFBRSwwQkFBMEI7SUFDakQsNEJBQTRCLEVBQUUsMkNBQTJDO0lBQ3pFLHFCQUFx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LENBQUE7SUFDUCxDQUFDOytHQWo1QlUsYUFBYTttSEFBYixhQUFhLGNBSFosTUFBTTs7NEZBR1AsYUFBYTtrQkFKekIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7MkhBYUMsUUFBUTtzQkFEUCxZQUFZO3VCQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuLy9JbmplY3RhYmxlXG5pbXBvcnQgeyBIb3N0TGlzdGVuZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5pbXBvcnQgeyBJbml0U2VydmljZSB9IGZyb20gJy4vaW5pdC5zZXJ2aWNlJztcbi8vIGltcG9ydCBjb25maWd1cmF0aW9uIGZyb20gJy4uLy4uLy4uLy4uL2Fzc2V0cy9qc29uZmlsZXMvY29uZmlndXJhdGlvbnMuanNvbidcblxuY29uc3QgQVBJX0VORF9QT0lOVFMgPSB7XG4gIEZFVENIX0NPVVJTRVM6ICdhcGkvdjEvY291cnNlL3YyL2V4cGxvcmUnLFxuICBGRVRDSF9QT1NUQUxfQ09VUlNFUzogJ2FwaS92MS9jb250ZW50L3YxL3NlYXJjaCcsXG4gIEZFVENIX1JBSUxXQVlfQ09VUlNFUzogJ2FwaS92MS9jb250ZW50L3YxL3NlYXJjaCcsXG4gIEZFVENIX0hBTExfT0ZfRkFNRTogJ2FwaS92MS9oYWxsb2ZmYW1lL3JlYWQnLFxuICBOTFdfRk9STV9SRUFEOiAnYXBpcy92MS9zdGF0aWMvZm9ybS92MS9yZWFkJyxcbiAgRkVUQ0hfVEVOREVSUzogJ2FwaS92MS9jb250ZW50L3YxL3NlYXJjaCcsXG4gIEdFVF9TVEFURV9DRU5URVI6ICdjYnAtdHBjLWFpL2FwaS92MS9zdGF0ZS1jZW50ZXInLFxuICBHRVRfUk9MRV9NQVBQSU5HOiAnY2JwLXRwYy1haS9hcGkvdjMvcm9sZS1tYXBwaW5nL2dlbmVyYXRlJyxcbiAgREVMRVRFX1JPTEVfTUFQUElORzogJ2NicC10cGMtYWkvYXBpL3YxL3JvbGUtbWFwcGluZy9kZWxldGUnLFxuICBHRVRfREVQQVJUTUVOVDogJ2NicC10cGMtYWkvYXBpL3YxL2RlcGFydG1lbnQvc3RhdGUtY2VudGVyJyxcbiAgR0VUX1JPTEVfTUFQUElOR19CWV9TVEFURV9DRU5URVI6ICdjYnAtdHBjLWFpL2FwaS92MS9yb2xlLW1hcHBpbmcvc3RhdGUtY2VudGVyJyxcbiAgR0VUX1JPTEVfTUFQUElOR19CWV9TVEFURV9DRU5URVJfREVQQVJUTUVOVDogJ2NicC10cGMtYWkvYXBpL3YxL3JvbGUtbWFwcGluZy9zdGF0ZS1jZW50ZXInLFxuICBVUERBVEVfUk9MRV9NQVBQSU5HOiAnY2JwLXRwYy1haS9hcGkvdjEvcm9sZS1tYXBwaW5nJyxcbiAgR0VUX1JFQ09NTUVOREVEX0NPVVJTRTogJ2NicC10cGMtYWkvYXBpL3YxLycsXG4gIFNBVkVfQ09VUlNFUzogJ2NicC10cGMtYWkvYXBpL3YxL2NicC1wbGFuL3NhdmUnLFxuICBHRVRfQ09VUlNFUzogJ2NicC10cGMtYWkvYXBpL3YxL2NicC1wbGFuJyxcbiAgVVBEQVRFX0NPVVJTRVM6ICdjYnAtdHBjLWFpL2FwaS92MS9jYnAtcGxhbicsXG4gIElHT1RfU1VHR0VTVEVEX0NPVVJTRTogJ2FwaS92MS9jb250ZW50L3YxL3NlYXJjaCcsXG4gIFNBVkVfQ09VUlNFX1NVR0dFU1RFRF9DT1VSU0U6ICdjYnAtdHBjLWFpL2FwaS92MS9jb3Vyc2Uvc3VnZ2VzdGlvbnMvc2F2ZScsXG4gIFNVR0dFU1RFRF9DT1VSU0VfTElTVDogJ2NicC10cGMtYWkvYXBpL3YxL2NvdXJzZS9zdWdnZXN0aW9ucycsXG4gIEFERF9ERVNJR05BVElPTjogJ2NicC10cGMtYWkvYXBpL3YyL3JvbGUtbWFwcGluZy9hZGQtZGVzaWduYXRpb24nLFxuICBMT0dJTjogJ2NicC10cGMtYWkvYXBpL3YxL2F1dGgvbG9naW4nLFxuICBMT0dPVVQ6ICdjYnAtdHBjLWFpL2FwaS92MS9hdXRoL2xvZ291dCcsXG4gIERFTEVURV9ST0xFX01BUFBJTkdfQllfU1RBVEVfQ0VOVEVSOiAnY2JwLXRwYy1haS9hcGkvdjEvcm9sZS1tYXBwaW5nJyxcbiAgQUREX1VTRVJfQ09VUlNFUzogJ2NicC10cGMtYWkvYXBpL3YxL3VzZXItYWRkZWQtY291cnNlcycsXG4gIEdFVF9VU0VSX0NPVVJTRVM6ICdjYnAtdHBjLWFpL2FwaS92MS91c2VyLWFkZGVkLWNvdXJzZXMvcm9sZS1tYXBwaW5nJyxcbiAgR0VUX1VTRVJfU0VMRUNURURfQ09VUlNFUzogJ2NicC10cGMtYWkvYXBpL3YxL2NicC1wbGFuJyxcbiAgVVBMT0FEX0RPQ1VNRU5UOiAnY2JwLXRwYy1haS9hcGkvdjEvZmlsZXMnLFxuICBHRVRfRE9DVU1FTlRTOiAnY2JwLXRwYy1haS9hcGkvdjEvZmlsZXMnLFxuICBERUxFVEVfRklMRTogJ2NicC10cGMtYWkvYXBpL3YxL2ZpbGVzJyxcbiAgVFJJR0dFUl9GSUxFX1NVTU1BUlk6ICdjYnAtdHBjLWFpL2FwaS92MS9maWxlcycsXG4gIERPV05MT0FEX0ZJTEU6ICdjYnAtdHBjLWFpL2FwaS92MS9maWxlcycsXG4gIERFTEVURV9TVU1NQVJZOiAnY2JwLXRwYy1haS9hcGkvdjEvZmlsZXMnLFxuICBHRVRfVVNFUl9QUk9GSUxFOiAnY2JwLXRwYy1haS9hcGkvdjEvdXNlcnMvbWUnLFxuICBHRVRfVVNFUl9SRUNPTU1FTkVEX0NPVVJTRVM6ICdjYnAtdHBjLWFpL2FwaS92MS9jb3Vyc2UtcmVjb21tZW5kYXRpb25zJyxcbiAgRE9XTkxPQURfUERGOiAnY2JwLXRwYy1haS9hcGkvdjEvcmVwb3J0cy9jYnAtcGxhbi9kb3dubG9hZCcsXG4gIERPV05MT0FEX1BERl9BQ0JQOiAnY2JwLXRwYy1haS9hcGkvdjEvcmVwb3J0cy9hY2JwLXBsYW4vZG93bmxvYWQnLFxuICBDRU5URVJfQkFTRURfTUlOSVNUUlk6ICdjYnAtdHBjLWFpL2FwaS92MS9kZXBhcnRtZW50L3N0YXRlLWNlbnRlcicsXG4gIERPV05MT0FEX0NPVVJTRV9SRUNPTU1FTkRBVElPTjogJ2NicC10cGMtYWkvYXBpL3YxL3JlcG9ydHMvY291cnNlLXJlY29tbWVuZGF0aW9ucy9kb3dubG9hZCcsXG4gIERFTEVURV9DT1VSU0VfUkVDT01NRU5EQVRJT046ICdjYnAtdHBjLWFpL2FwaS92MS9jYnAtcGxhbicsXG4gIFVQREFURV9ERVNJR05BVElPTl9ISUVSQVJDSFk6ICdjYnAtdHBjLWFpL2FwaS92MS9yb2xlLW1hcHBpbmcvcmVvcmRlcicsXG4gIFNFQVJDSF9QVUJMSUNfREVTSUdOQVRJT046ICdhcGlzL3B1YmxpYy92OC9kZXNpZ25hdGlvbi9zZWFyY2gnLFxuICBEQVNIQk9BUkRfQURNSU46ICdjYnAtdHBjLWFpL2FwaS92MS9kYXNoYm9hcmQvY2JwLWRhc2hib2FyZC1tZXRyaWNzJyxcbiAgR0FQX0FOQUxZU0lTX0FETUlOOiAnY2JwLXRwYy1haS9hcGkvdjEvZGFzaGJvYXJkL2dhcC1hbmFseXNpcycsXG4gIERBU0hCT0FSRF9QVUJMSUM6ICdjYnAtdHBjLWFpL2FwaS92MS9kYXNoYm9hcmQvbXktZGFzaGJvYXJkLW1ldHJpY3MnLFxuICBHQVBfQU5BTFlTSVNfUFVCTElDOiAnY2JwLXRwYy1haS9hcGkvdjEvZGFzaGJvYXJkL215LWdhcC1hbmFseXNpcycsXG4gIE1BVENIRURfUk9MRV9NQVBQSU5HOiAnY2JwLXRwYy1haS9hcGkvdjEvcm9sZS1tYXBwaW5nL21hdGNoLWRlc2lnbmF0aW9ucycsXG4gIEdFVF9BUFBST1ZBTF9SRVFVRVNUUzogJ2NicC10cGMtYWkvYXBpL3YxL2FwcHJvdmFsLXJlcXVlc3RzL2xpc3QnLFxuICBTRUFSQ0hfUFVCTElDX01ETzogJ2NicC10cGMtYWkvYXBpL3YxL2FwcHJvdmFsLXJlcXVlc3RzL21kby1hZG1pbnMnLFxuICBTQVZFX0FQUFJPVkFMX1JFUVVFU1Q6J2NicC10cGMtYWkvYXBpL3YxL2FwcHJvdmFsLXJlcXVlc3RzL3NlbmQnLFxuICBWSUVXX0FQUFJPVkFMX1JFUVVFU1Q6ICdjYnAtdHBjLWFpL2FwaS92MS9hcHByb3ZhbC1yZXF1ZXN0cycsXG4gIFJFVk9LRV9BUFBST1ZBTF9SRVFVRVNUOiAnY2JwLXRwYy1haS9hcGkvdjEvYXBwcm92YWwtcmVxdWVzdHMnLFxuXG59XG5cblxuXG4vLyBARGlyZWN0aXZlKClcbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuXG5leHBvcnQgY2xhc3MgU2hhcmVkU2VydmljZSB7XG4gIGNicFBsYW5GaW5hbE9iajogYW55ID0ge31cbiAgYmFzZVVybDogc3RyaW5nXG4gIGNvbmZpZ0RldGFpbHM6IGFueVxuICBzY3JlZW5XaWR0aDogbnVtYmVyO1xuICBoZWFkZXJzOiBhbnlcbiAgc3VtbWFyeVRyaWdnZXJFeGVjdXRlZCA9IG5ldyBTdWJqZWN0KClcbiAgbG9naW5TdWNjZXNzID0gbmV3IFN1YmplY3QoKVxuICBjaGVja1JvbGVNYXBwaW5nRm9ybVZhbGlkYXRpb24gPSBuZXcgU3ViamVjdCgpXG4gIHVwZGF0ZURlc2lnbmF0aW9uSGllcmFyY2h5U3ViamVjdCA9IG5ldyBTdWJqZWN0KClcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXG4gIG9uUmVzaXplKGV2ZW50KSB7XG4gICAgdGhpcy5zY3JlZW5XaWR0aCA9IGV2ZW50LnRhcmdldC5pbm5lcldpZHRoO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgaW5pdFN2YzogSW5pdFNlcnZpY2UsXG4gICkge1xuICAgIGlmIChpbml0U3ZjICYmIHRoaXMuaW5pdFN2Yy5iYXNlVXJsICYmIHRoaXMuaW5pdFN2Yy5jb25maWdEZXRhaWxzKSB7XG4gICAgICB0aGlzLmJhc2VVcmwgPSB0aGlzLmluaXRTdmMuYmFzZVVybFxuICAgICAgdGhpcy5jb25maWdEZXRhaWxzID0gdGhpcy5pbml0U3ZjLmNvbmZpZ0RldGFpbHNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRDb25maURldGFpbHMoKVxuICAgIH1cbiAgICB0aGlzLnNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgc3RvcmFnZURhdGE6IGFueSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2luRGF0YScpKVxuICAgIGNvbnNvbGUubG9nKCdzdG9yYWdlRGF0YS0tJywgc3RvcmFnZURhdGEpXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3N0b3JhZ2VEYXRhPy5hY2Nlc3NfdG9rZW59YFxuICAgIH0pO1xuICB9XG5cbiAgc2V0Q29uZmlEZXRhaWxzKGNvbmZpZ0RldGFpbHM6IGFueSA9IG51bGwpIHtcbiAgICBpZiAoY29uZmlnRGV0YWlscykge1xuICAgICAgdGhpcy5jb25maWdEZXRhaWxzID0gY29uZmlnRGV0YWlsc1xuICAgICAgdGhpcy5iYXNlVXJsID0gY29uZmlnRGV0YWlscy5wb3J0YWxVUkxcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXRDb25maWdEZXRhaWxzKCkuc3Vic2NyaWJlKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlnRGV0YWlscyA9IHJlc3BvbnNlXG4gICAgICAgIHRoaXMuYmFzZVVybCA9IHJlc3BvbnNlLnBvcnRhbFVSTFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgZ2V0Q29uZmlnKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZ0RldGFpbHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RldGFpbHM7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGdldENvbmZpZ0RldGFpbHMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oJ2Fzc2V0cy9qc29uZmlsZXMvY29uZmlndXJhdGlvbnMuanNvbicpO1xuICB9XG5cblxuXG4gIGdldGNvdXJzZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5GRVRDSF9DT1VSU0VTfWApXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0ZUZlYXR1cmVDb3Vyc2VzKHJlc3BvbnNlLnJlc3VsdC5jb250ZW50KVxuICAgICAgfSkpXG4gIH1cblxuICBnZXRQb3N0YWxjb3Vyc2VzKCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuRkVUQ0hfUE9TVEFMX0NPVVJTRVN9YClcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRlRmVhdHVyZUNvdXJzZXMocmVzcG9uc2UucmVzdWx0LmNvbnRlbnQpXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldFJhaWx3YXljb3Vyc2VzKCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuRkVUQ0hfUkFJTFdBWV9DT1VSU0VTfWApXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0ZUZlYXR1cmVDb3Vyc2VzKHJlc3BvbnNlLnJlc3VsdC5jb250ZW50KVxuICAgICAgfSkpXG4gIH1cblxuICBnZXRIYWxsT2ZGYW1lKCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkZFVENIX0hBTExfT0ZfRkFNRX1gLCBudWxsKVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBmb3JtYXRlRmVhdHVyZUNvdXJzZXMoZmVhdHVyZUNvdXJzZXM6IGFueSkge1xuICAgIGNvbnN0IGZvcm1hdGVkRmVhdHVyZUNvdXJzZXMgPSBbXTtcbiAgICBjb25zdCBmb3JtYXRlZE5ld3Nyb29tID0gW107XG4gICAgY29uc3QgZm9ybWF0ZWRQaG90b2dhbGxhcnkgPSBbXTtcbiAgICBjb25zdCBmb3JtYXRlZFRlc3RpbW9uaWFsID0gW107XG4gICAgaWYgKGZlYXR1cmVDb3Vyc2VzKSB7XG4gICAgICBmZWF0dXJlQ291cnNlcy5mb3JFYWNoKGNvdXJzZSA9PiB7XG4gICAgICAgIGlmIChjb3Vyc2UucHJpbWFyeUNhdGVnb3J5ID09PSAnQ291cnNlJykge1xuICAgICAgICAgIGNvbnN0IGZvcm1hdGVkQ291cnNlID0ge1xuICAgICAgICAgICAgcG9zdGVySW1hZ2U6IGNvdXJzZS5wb3N0ZXJJbWFnZSxcbiAgICAgICAgICAgIG9yZ2FuaXNhdGlvbjogY291cnNlLm9yZ2FuaXNhdGlvblswXSA/IGNvdXJzZS5vcmdhbmlzYXRpb25bMF0gOiAnS2FybWF5b2dpIEJoYXJhdCcsXG4gICAgICAgICAgICBuYW1lOiBjb3Vyc2UubmFtZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjb3Vyc2UuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBpZGVudGlmaWVyOiBjb3Vyc2UuaWRlbnRpZmllcixcbiAgICAgICAgICAgIGFsdDogY291cnNlLm5hbWUsXG4gICAgICAgICAgICBjcmVhdG9yTG9nbzogY291cnNlLmNyZWF0b3JMb2dvIHx8ICcnLFxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMudGltZUNvbnZlcnQoY291cnNlLmR1cmF0aW9uKSxcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9ybWF0ZWRGZWF0dXJlQ291cnNlcy5wdXNoKGZvcm1hdGVkQ291cnNlKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvdXJzZS5yZXNvdXJjZUNhdGVnb3J5ID09PSAnTmV3c3Jvb20nKSB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0ZWRDb3Vyc2UgPSB7XG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogY291cnNlLnBvc3RlckltYWdlLFxuICAgICAgICAgICAgbmFtZTogY291cnNlLm5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogY291cnNlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogY291cnNlLmlkZW50aWZpZXIsXG4gICAgICAgICAgICBhbHQ6IGNvdXJzZS5uYW1lLFxuICAgICAgICAgICAgY2xvdWRTdG9yYWdlS2V5OiBgJHt0aGlzLmJhc2VVcmx9YXNzZXRzL3B1YmxpYy8ke2NvdXJzZS5jbG91ZFN0b3JhZ2VLZXl9YFxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3JtYXRlZE5ld3Nyb29tLnB1c2goZm9ybWF0ZWRDb3Vyc2UpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY291cnNlLnJlc291cmNlQ2F0ZWdvcnkgPT09ICdQaG90byBHYWxsZXJ5Jykge1xuICAgICAgICAgIGNvbnN0IGZvcm1hdGVkQ291cnNlID0ge1xuICAgICAgICAgICAgbmFtZTogY291cnNlLm5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogY291cnNlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogY291cnNlLmlkZW50aWZpZXIsXG4gICAgICAgICAgICBhbHQ6IGNvdXJzZS5uYW1lLFxuICAgICAgICAgICAgY2xvdWRTdG9yYWdlS2V5OiBgJHt0aGlzLmJhc2VVcmx9YXNzZXRzL3B1YmxpYy8ke2NvdXJzZS5jbG91ZFN0b3JhZ2VLZXl9YFxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3JtYXRlZFBob3RvZ2FsbGFyeS5wdXNoKGZvcm1hdGVkQ291cnNlKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvdXJzZS5yZXNvdXJjZUNhdGVnb3J5ID09PSAnVGVzdGltb25pYWxzJykge1xuICAgICAgICAgIGNvbnN0IGZvcm1hdGVkQ291cnNlID0ge1xuICAgICAgICAgICAgbmFtZTogY291cnNlLm5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogY291cnNlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogY291cnNlLmlkZW50aWZpZXIsXG4gICAgICAgICAgICBhbHQ6IGNvdXJzZS5uYW1lLFxuICAgICAgICAgICAgY2xvdWRTdG9yYWdlS2V5OiBgJHt0aGlzLmJhc2VVcmx9YXNzZXRzL3B1YmxpYy8ke2NvdXJzZS5jbG91ZFN0b3JhZ2VLZXl9YCxcbiAgICAgICAgICAgIG1pbWVUeXBlOiBjb3Vyc2UubWltZVR5cGUsXG4gICAgICAgICAgICBwb3N0ZXJJbWFnZTogY291cnNlLnBvc3RlckltYWdlLFxuICAgICAgICAgICAgYXJ0aWZhY3RVcmw6IGNvdXJzZS5hcnRpZmFjdFVybCxcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9ybWF0ZWRUZXN0aW1vbmlhbC5wdXNoKGZvcm1hdGVkQ291cnNlKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgY291cnNlOiBmb3JtYXRlZEZlYXR1cmVDb3Vyc2VzLCBuZXdzcm9vbTogZm9ybWF0ZWROZXdzcm9vbSwgZ2FsbGFyeTogZm9ybWF0ZWRQaG90b2dhbGxhcnksIHRlc3RpbW9uaWxzOiBmb3JtYXRlZFRlc3RpbW9uaWFsIH1cbiAgfVxuXG4gIHRpbWVDb252ZXJ0KGR1cmF0aW9uOiBudW1iZXIpIHtcbiAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgIHZhciBudW0gPSBkdXJhdGlvbjtcbiAgICAgIHZhciBob3VycyA9IChudW0gLyAzNjAwKTtcbiAgICAgIHZhciByaG91cnMgPSBNYXRoLmZsb29yKGhvdXJzKTtcbiAgICAgIHZhciBtaW51dGVzID0gKGhvdXJzIC0gcmhvdXJzKSAqIDYwO1xuICAgICAgdmFyIHJtaW51dGVzID0gTWF0aC5yb3VuZChtaW51dGVzKTtcbiAgICAgIGlmIChybWludXRlcyA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmhvdXJzICsgXCJoXCI7XG4gICAgICB9IGVsc2UgaWYgKHJob3VycyA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcm1pbnV0ZXMgKyBcIm1cIlxuICAgICAgfVxuICAgICAgcmV0dXJuIHJob3VycyArIFwiaCBcIiArIHJtaW51dGVzICsgXCJtXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGdldENsaWVudExpc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoJy4vYXNzZXRzL2pzb25maWxlcy9jbGllbnQtbGlzdC5qc29uJyk7XG4gIH1cblxuICBnZXRUZW5kZXJzKCkge1xuICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICByZXF1ZXN0OiB7XG4gICAgICAgIGZpbHRlcnM6IHtcbiAgICAgICAgICBwcmltYXJ5Q2F0ZWdvcnk6IFtcInRlbmRlclwiXSxcbiAgICAgICAgICBzdGF0dXM6IHsgXCIhPVwiOiBcIlJldGlyZWRcIiB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhY2V0czogW1wibWltZVR5cGVcIl0sXG4gICAgICAgIHNvcnRCeTogeyBjcmVhdGVkT246IFwiRGVzY1wiIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuRkVUQ0hfVEVOREVSU31gLCBib2R5KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBnZXROb3RpZmljYXRpb25zKCkge1xuICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICByZXF1ZXN0OiB7XG4gICAgICAgIGZpbHRlcnM6IHtcbiAgICAgICAgICBwcmltYXJ5Q2F0ZWdvcnk6IFtcIm5vdGlmaWNhdGlvblwiXSxcbiAgICAgICAgICBzdGF0dXM6IHsgXCIhPVwiOiBcIlJldGlyZWRcIiB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhY2V0czogW1wibWltZVR5cGVcIl0sXG4gICAgICAgIHNvcnRCeTogeyBjcmVhdGVkT246IFwiZGVzY1wiIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuRkVUQ0hfVEVOREVSU31gLCBib2R5KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cbiAgZ2V0Rm9ybVJlYWREYXRhKHJlcTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuTkxXX0ZPUk1fUkVBRH1gLCByZXEpXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG5cbiAgZ2V0TWluaXN0cnlEYXRhKG1pbmlzdHJ5VHlwZSkge1xuICAgIGxldCBzdWJfb3JnX3R5cGUgPSAnJ1xuICAgIGlmIChtaW5pc3RyeVR5cGUgPT0gJ21pbmlzdHJ5Jykge1xuICAgICAgc3ViX29yZ190eXBlID0gJ21pbmlzdHJ5J1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJfb3JnX3R5cGUgPSAnc3RhdGUnXG4gICAgfVxuICAgIGNvbnN0IHN0b3JhZ2VEYXRhOiBhbnkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2dpbkRhdGEnKSlcbiAgICBjb25zb2xlLmxvZygnc3RvcmFnZURhdGEtLScsIHN0b3JhZ2VEYXRhKVxuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHtzdG9yYWdlRGF0YT8uYWNjZXNzX3Rva2VufWBcbiAgICB9KTtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HRVRfU1RBVEVfQ0VOVEVSfS8/c3ViX29yZ190eXBlPSR7c3ViX29yZ190eXBlfWAsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBnZW5lcmF0ZVJvbGVNYXBwaW5nKHJlcUJvZHksIGZpbGVzPzogRmlsZSB8IEZpbGVbXSkge1xuICAgIGNvbnNvbGUubG9nKCdyZXFCb2R5LS0nLCByZXFCb2R5KTtcbiAgICBjb25zb2xlLmxvZygnZmlsZXMtLS0nLCBmaWxlcylcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGZpZWxkc1xuICAgIGlmIChyZXFCb2R5LnN0YXRlX2NlbnRlcl9pZCkge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKCdzdGF0ZV9jZW50ZXJfaWQnLCByZXFCb2R5LnN0YXRlX2NlbnRlcl9pZCk7XG4gICAgfVxuXG4gICAgaWYgKHJlcUJvZHkuc3RhdGVfY2VudGVyX25hbWUpIHtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnc3RhdGVfY2VudGVyX25hbWUnLCByZXFCb2R5LnN0YXRlX2NlbnRlcl9uYW1lKTtcbiAgICB9XG5cbiAgICBpZiAocmVxQm9keS5kZXBhcnRtZW50X2lkKSB7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ2RlcGFydG1lbnRfaWQnLCByZXFCb2R5LmRlcGFydG1lbnRfaWQpO1xuICAgIH1cblxuICAgIGlmIChyZXFCb2R5LmRlcGFydG1lbnRfbmFtZSkge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKCdkZXBhcnRtZW50X25hbWUnLCByZXFCb2R5LmRlcGFydG1lbnRfbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcUJvZHkuaW5zdHJ1Y3Rpb24pIHtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnaW5zdHJ1Y3Rpb24nLCByZXFCb2R5Lmluc3RydWN0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYnBEYXRhOiBhbnkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYnBQbGFuRmluYWxPYmonKSB8fCAne30nKTtcbiAgICBjb25zdCBvcmdUeXBlID1cbiAgICAgIGNicERhdGE/Lm1pbmlzdHJ5Py5zYk9yZ1R5cGUgfHxcbiAgICAgIGNicERhdGE/Lm9yZ190eXBlIHx8XG4gICAgICAnJztcbiAgICBpZiAob3JnVHlwZSkge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKCdvcmdfdHlwZScsIG9yZ1R5cGUpO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBtdWx0aXBsZSBvciBzaW5nbGUgZmlsZVxuICAgIGlmIChmaWxlcykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmlsZXMpKSB7XG4gICAgICAgIGZpbGVzLmZvckVhY2goKGZpbGU6IEZpbGUpID0+IHtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2FkZGl0aW9uYWxfZG9jdW1lbnQnLCBmaWxlLCBmaWxlLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNpbmdsZSBmaWxlXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnYWRkaXRpb25hbF9kb2N1bWVudCcsIGZpbGVzLCBmaWxlcy5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWJ1ZyBGb3JtRGF0YSBjb250ZW50XG4gICAgY29uc29sZS5sb2coXCJGb3JtRGF0YSBjb250ZW50czpcIik7XG4gICAgZm9ybURhdGEuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtrZXl9OiBGSUxFIC0+ICR7dmFsdWUubmFtZX0gKCR7dmFsdWUuc2l6ZX0gYnl0ZXMpYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtrZXl9OiAke3ZhbHVlfWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVycztcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdFVF9ST0xFX01BUFBJTkd9YCwgZm9ybURhdGEsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0pKTtcbiAgfVxuXG5cblxuICBnZXREZXBhcnRtZW50TGlzdChtaW5pc3RyeUlkKSB7XG4gICAgY29uc3Qgc3RvcmFnZURhdGE6IGFueSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2luRGF0YScpKVxuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHtzdG9yYWdlRGF0YT8uYWNjZXNzX3Rva2VufWBcbiAgICB9KTtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HRVRfREVQQVJUTUVOVH0vJHttaW5pc3RyeUlkfWAsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBnZXRSb2xlTWFwcGluZ0J5U3RhdGVDZW50ZXIoc3RhdGVfY2VudGVyX2lkKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuR0VUX1JPTEVfTUFQUElOR19CWV9TVEFURV9DRU5URVJ9LyR7c3RhdGVfY2VudGVyX2lkfT9sb2FkX2NicF9wbGFucz10cnVlYCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldFJvbGVNYXBwaW5nQnlTdGF0ZUNlbnRlckFuZERlcGFydG1lbnQoc3RhdGVfY2VudGVyX2lkLCBkZXBhcnRtZW50X2lkKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuR0VUX1JPTEVfTUFQUElOR19CWV9TVEFURV9DRU5URVJ9LyR7c3RhdGVfY2VudGVyX2lkfS9kZXBhcnRtZW50LyR7ZGVwYXJ0bWVudF9pZH0/bG9hZF9jYnBfcGxhbnM9dHJ1ZWAsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICB1cGRhdGVSb2xlTWFwcGluZyhyb2xlX21hcHBpbmdfaWQsIHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5VUERBVEVfUk9MRV9NQVBQSU5HfS8ke3JvbGVfbWFwcGluZ19pZH1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZGVsZXRlUm9sZU1hcHBpbmcocm9sZV9tYXBwaW5nX2lkKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlPGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuVVBEQVRFX1JPTEVfTUFQUElOR30vJHtyb2xlX21hcHBpbmdfaWR9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldFJlY29tbWVuZGVkQ291cnNlKHJvbGVfbWFwcGluZ19pZCkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICBsZXQgcmVxQm9keSA9IHtcbiAgICAgIHJvbGVfbWFwcGluZ19pZDogcm9sZV9tYXBwaW5nX2lkXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdFVF9SRUNPTU1FTkRFRF9DT1VSU0V9L2NvdXJzZS1yZWNvbW1lbmRhdGlvbnMvZ2VuZXJhdGVgLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZGVsZXRlQ291cnNlUmVjb21tZW5kYXRpb25zKHJvbGVNYXBJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlPGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuR0VUX1JFQ09NTUVOREVEX0NPVVJTRX0vY291cnNlLXJlY29tbWVuZGF0aW9ucy9yb2xlLW1hcHBpbmcvJHtyb2xlTWFwSWR9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIHNhdmVDb3Vyc2UocmVxQm9keSkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5TQVZFX0NPVVJTRVN9YCwgcmVxQm9keSwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuICB1cGRhdGVDb3Vyc2UocmVxQm9keSwgY2JwX3BsYW5faWQpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5VUERBVEVfQ09VUlNFU30vJHtjYnBfcGxhbl9pZH1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZ2V0Q291cnNlKHJvbGVfbWFwcGluZ19pZCkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdFVF9DT1VSU0VTfT9yb2xlX21hcHBpbmdfaWQ9JHtyb2xlX21hcHBpbmdfaWR9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldElHT1RTdWdnZXN0ZWRDb3Vyc2VzKHJlcUJvZHkpIHtcbiAgICAvLyBVc2UgdGhlIHJlcUJvZHkgcGFyYW1ldGVyIHBhc3NlZCBmcm9tIHRoZSBjb21wb25lbnRcbiAgICAvLyBJZiBubyByZXFCb2R5IGlzIHByb3ZpZGVkLCB1c2UgZGVmYXVsdCBzdHJ1Y3R1cmVcbiAgICBsZXQgcmVxID0gcmVxQm9keSB8fCB7XG4gICAgICBcInJlcXVlc3RcIjoge1xuICAgICAgICBcImZpbHRlcnNcIjoge1xuICAgICAgICAgIFwicHJpbWFyeUNhdGVnb3J5XCI6IFtcIkNvdXJzZVwiXSxcbiAgICAgICAgICBcInN0YXR1c1wiOiBbXCJMaXZlXCJdLFxuICAgICAgICAgIFwiY291cnNlQ2F0ZWdvcnlcIjogW1wiQ291cnNlXCJdXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmllbGRzXCI6IFtcInBvc3RlckltYWdlXCIsIFwiZGVzY3JpcHRpb25cIiwgXCJuYW1lXCJdLFxuICAgICAgICBcImxpbWl0XCI6IDEyLFxuICAgICAgICBcIm9mZnNldFwiOiAwXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKCdnZXRJR09UU3VnZ2VzdGVkQ291cnNlcyBmaW5hbCByZXF1ZXN0OicsIEpTT04uc3RyaW5naWZ5KHJlcSwgbnVsbCwgMikpO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGBodHRwczovL3BvcnRhbC5pZ290a2FybWF5b2dpLmdvdi5pbi9hcGkvY29udGVudC92MS9zZWFyY2hgLCByZXEsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBnZXRTdWdnZXN0ZWRDb3Vyc2VzKHJvbGVfbWFwcGluZ19pZCkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLlNVR0dFU1RFRF9DT1VSU0VfTElTVH0vJHtyb2xlX21hcHBpbmdfaWR9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIHNhdmVTdWdnZXN0ZWRDb3Vyc2UocmVxQm9keSkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5TQVZFX0NPVVJTRV9TVUdHRVNURURfQ09VUlNFfWAsIHJlcUJvZHksIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBhZGREZXNpZ25hdGlvbihyZXFCb2R5KSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkFERF9ERVNJR05BVElPTn1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgcGVyZm9ybUxvZ2luKHJlcUJvZHkpIHtcbiAgICBjb25zdCBib2R5ID0gbmV3IEh0dHBQYXJhbXMoKVxuICAgICAgLnNldCgndXNlcm5hbWUnLCByZXFCb2R5LnVzZXJuYW1lKVxuICAgICAgLnNldCgncGFzc3dvcmQnLCByZXFCb2R5LnBhc3N3b3JkKTtcbiAgICBjb25zb2xlLmxvZygnaW4gbG9naW4gdWF0JylcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5MT0dJTn1gLCBib2R5LnRvU3RyaW5nKCksIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkxPR09VVH1gLCAnJywgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIHNldENCUFBsYW5Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NicFBsYW5GaW5hbE9iaicsIEpTT04uc3RyaW5naWZ5KHRoaXMuY2JwUGxhbkZpbmFsT2JqKSlcbiAgfVxuXG4gIGdldENCUFBsYW5Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgbGV0IGNicFBsYW5GaW5hbE9iaiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NicFBsYW5GaW5hbE9iaicpKVxuICAgIHJldHVybiBjYnBQbGFuRmluYWxPYmpcbiAgfVxuXG4gIGNoZWNrSWZMb2dpbigpIHtcbiAgICBsZXQgZmxhZyA9IGZhbHNlXG4gICAgbGV0IGxvZ2luRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2dpbkRhdGEnKVxuICAgIGlmIChsb2dpbkRhdGEgJiYgSlNPTi5wYXJzZShsb2dpbkRhdGEpWydhY2Nlc3NfdG9rZW4nXSkge1xuICAgICAgZmxhZyA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhZyA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiBmbGFnXG4gIH1cblxuICBkZWxldGVSb2xlTWFwcGluZ0J5U3RhdGVBbmREZXBhcnRtZW50KHN0YXRlX2NlbnRlcl9pZCwgZGVwYXJ0bWVudF9pZCkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICBsZXQgdXJsID0gJydcbiAgICBpZiAoZGVwYXJ0bWVudF9pZCAmJiBkZXBhcnRtZW50X2lkICE9PSAnbnVsbCcgJiYgZGVwYXJ0bWVudF9pZCAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVwYXJ0bWVudF9pZCAhPT0gdW5kZWZpbmVkICYmIGRlcGFydG1lbnRfaWQgIT09IG51bGwpIHtcbiAgICAgIHVybCA9IGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkRFTEVURV9ST0xFX01BUFBJTkdfQllfU1RBVEVfQ0VOVEVSfT9zdGF0ZV9jZW50ZXJfaWQ9JHtzdGF0ZV9jZW50ZXJfaWR9JmRlcGFydG1lbnRfaWQ9JHtkZXBhcnRtZW50X2lkfWBcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuREVMRVRFX1JPTEVfTUFQUElOR19CWV9TVEFURV9DRU5URVJ9P3N0YXRlX2NlbnRlcl9pZD0ke3N0YXRlX2NlbnRlcl9pZH1gXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGU8YW55Pih1cmwsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBhZGRVc2VyQ291cnNlKHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuQUREX1VTRVJfQ09VUlNFU31gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZ2V0VXNlckNvdXJzZShyb2xlX21hcHBpbmdfaWQpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HRVRfVVNFUl9DT1VSU0VTfS8ke3JvbGVfbWFwcGluZ19pZH1gLCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZ2V0Q29tcGV0ZW5jeUpzb24oKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5iYXNlVXJsfS90cmFpbmluZy1wbGEtYWkvYXNzZXRzL2pzb25maWxlcy9jb21wZXRlbmNpZXMuanNvbmAsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gICAgLy8gdGhpcy5odHRwLmdldDxhbnlbXT4oJy9hc3NldHMvanNvbmZpbGVzL2NvbXBldGVuY2llcy5qc29uJylcbiAgfVxuXG4gIGNvbnZlcnQoc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBpZiAoIXNlY29uZHMgfHwgc2Vjb25kcyA8PSAwKSB7XG4gICAgICByZXR1cm4gJ04vQSc7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWxTZWNvbmRzID0gTWF0aC5mbG9vcihzZWNvbmRzKTtcbiAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gMzYwMCk7XG4gICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoKHRvdGFsU2Vjb25kcyAlIDM2MDApIC8gNjApO1xuICAgIGNvbnN0IHJlbWFpbmluZ1NlY29uZHMgPSB0b3RhbFNlY29uZHMgJSA2MDtcblxuICAgIGlmIChob3VycyA+IDApIHtcbiAgICAgIC8vIEZvciBkdXJhdGlvbnMgd2l0aCBob3Vycywgc2hvdyBob3VycyBhbmQgbWludXRlcyAoZS5nLiwgXCIzaCAxMG1cIilcbiAgICAgIGlmIChtaW51dGVzID4gMCkge1xuICAgICAgICByZXR1cm4gYCR7aG91cnN9aCAke21pbnV0ZXN9bWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYCR7aG91cnN9aGA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtaW51dGVzID4gMCkge1xuICAgICAgLy8gRm9yIGR1cmF0aW9ucyB1bmRlciBhbiBob3VyLCBzaG93IG1pbnV0ZXMgYW5kIHNlY29uZHMgKGUuZy4sIFwiNThtIDNzXCIpXG4gICAgICBpZiAocmVtYWluaW5nU2Vjb25kcyA+IDApIHtcbiAgICAgICAgcmV0dXJuIGAke21pbnV0ZXN9bSAke3JlbWFpbmluZ1NlY29uZHN9c2A7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYCR7bWludXRlc31tYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIGR1cmF0aW9ucyB1bmRlciBhIG1pbnV0ZSwgc2hvdyBzZWNvbmRzIG9ubHlcbiAgICAgIHJldHVybiBgJHtyZW1haW5pbmdTZWNvbmRzfXNgO1xuICAgIH1cbiAgfVxuXG4gIGdldFVzZXJQcm9maWxlKCkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdFVF9VU0VSX1BST0ZJTEV9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldFVzZXJSZWNvbW1lbmRhdGlvbkNvdXJzZShyb2xlX21hcHBpbmdfaWQpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HRVRfVVNFUl9TRUxFQ1RFRF9DT1VSU0VTfT9yb2xlX21hcHBpbmdfaWQ9JHtyb2xlX21hcHBpbmdfaWR9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGRvd25sb2FkUGRmKHN0YXRlX2NlbnRlcl9pZDogc3RyaW5nLCBjb250ZXh0OiBzdHJpbmcsIGxhbmd1YWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbmRwb2ludCA9XG4gICAgICBjb250ZXh0ID09PSAnYWNicCdcbiAgICAgICAgPyBBUElfRU5EX1BPSU5UUy5ET1dOTE9BRF9QREZfQUNCUFxuICAgICAgICA6IEFQSV9FTkRfUE9JTlRTLkRPV05MT0FEX1BERjtcbiAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmJhc2VVcmx9JHtlbmRwb2ludH0/c3RhdGVfY2VudGVyX2lkPSR7c3RhdGVfY2VudGVyX2lkfSombGFuZ3VhZ2U9JHtsYW5ndWFnZX1gO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwge1xuICAgICAgaGVhZGVycyxcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZScsXG4gICAgICByZXNwb25zZVR5cGU6ICdibG9iJ1xuICAgIH0pLnN1YnNjcmliZSgocmVzOiBhbnkpID0+IHtcblxuICAgICAgY29uc3QgY29udGVudERpc3Bvc2l0aW9uID0gcmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LWRpc3Bvc2l0aW9uJyk7XG4gICAgICBjb25zb2xlLmxvZygnY29udGVudERpc3Bvc2l0aW9uJywgcmVzLmhlYWRlcnMpXG4gICAgICBsZXQgZmlsZW5hbWUgPSBgQ0JQX1JlcG9ydF8ke3N0YXRlX2NlbnRlcl9pZH0ucGRmYDtcblxuICAgICAgaWYgKGNvbnRlbnREaXNwb3NpdGlvbikge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGNvbnRlbnREaXNwb3NpdGlvbi5tYXRjaCgvZmlsZW5hbWU9XCI/KFteXCJdKylcIj8vKTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzFdKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgYSBibG9iIFVSTCBhbmQgZG93bmxvYWRcbiAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcmVzLmJvZHldLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9wZGYnIH0pO1xuICAgICAgY29uc3QgZG93bmxvYWRVcmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGEuaHJlZiA9IGRvd25sb2FkVXJsO1xuICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgICAgYS5jbGljaygpO1xuXG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGRvd25sb2FkVXJsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvd25sb2FkUGRmRm9yRGVwYXJ0bWVudChzdGF0ZV9jZW50ZXJfaWQsIGRlcGFydG1lbnRfaWQ6IHN0cmluZywgY29udGV4dDogc3RyaW5nLCBsYW5ndWFnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPVxuICAgICAgY29udGV4dCA9PT0gJ2FjYnAnXG4gICAgICAgID8gQVBJX0VORF9QT0lOVFMuRE9XTkxPQURfUERGX0FDQlBcbiAgICAgICAgOiBBUElfRU5EX1BPSU5UUy5ET1dOTE9BRF9QREY7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy5iYXNlVXJsfSR7ZW5kcG9pbnR9P3N0YXRlX2NlbnRlcl9pZD0ke3N0YXRlX2NlbnRlcl9pZH0mZGVwYXJ0bWVudF9pZD0ke2RlcGFydG1lbnRfaWR9Jmxhbmd1YWdlPSR7bGFuZ3VhZ2V9YDtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIHtcbiAgICAgIGhlYWRlcnMsXG4gICAgICBvYnNlcnZlOiAncmVzcG9uc2UnLFxuICAgICAgcmVzcG9uc2VUeXBlOiAnYmxvYidcbiAgICB9KS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG5cbiAgICAgIGNvbnN0IGNvbnRlbnREaXNwb3NpdGlvbiA9IHJlcy5oZWFkZXJzLmdldCgnY29udGVudC1kaXNwb3NpdGlvbicpO1xuICAgICAgY29uc29sZS5sb2coJ2NvbnRlbnREaXNwb3NpdGlvbicsIHJlcy5oZWFkZXJzKVxuICAgICAgbGV0IGZpbGVuYW1lID0gYENCUF9SZXBvcnRfJHtzdGF0ZV9jZW50ZXJfaWR9XyR7ZGVwYXJ0bWVudF9pZH0ucGRmYDtcblxuICAgICAgaWYgKGNvbnRlbnREaXNwb3NpdGlvbikge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGNvbnRlbnREaXNwb3NpdGlvbi5tYXRjaCgvZmlsZW5hbWU9XCI/KFteXCJdKylcIj8vKTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzFdKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgYSBibG9iIFVSTCBhbmQgZG93bmxvYWRcbiAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcmVzLmJvZHldLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9wZGYnIH0pO1xuICAgICAgY29uc3QgZG93bmxvYWRVcmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGEuaHJlZiA9IGRvd25sb2FkVXJsO1xuICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgICAgYS5jbGljaygpO1xuXG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGRvd25sb2FkVXJsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENlbnRlckJhc2VkRGVwYXJ0bWVudChzdGF0ZV9jZW50ZXJfaWQpIHtcbiAgICAvLyBsZXQgcmVxQm9keSA9IHsgXCJyZXF1ZXN0XCI6IHsgXCJmaWx0ZXJzXCI6IHsgXCJzdGF0dXNcIjogMSwgXCJtaW5pc3RyeU9yU3RhdGVUeXBlXCI6IFwibWluaXN0cnlcIiwgXCJtaW5pc3RyeU9yU3RhdGVJZFwiOiBzdGF0ZV9jZW50ZXJfaWR9LCBcInNvcnRfYnlcIjogeyBcImNyZWF0ZWREYXRlXCI6IFwiZGVzY1wiIH0sIFwibGltaXRcIjogOTk5OSwgXCJvZmZzZXRcIjogMCwgXCJmaWVsZHNcIjogW1wiaWRlbnRpZmllclwiLCBcIm9yZ05hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInBhcmVudE9yZ05hbWVcIiwgXCJtaW5pc3RyeU9yU3RhdGVJZFwiLCBcIm1pbmlzdHJ5T3JTdGF0ZVR5cGVcIiwgXCJtaW5pc3RyeU9yU3RhdGVOYW1lXCIsIFwic2JPcmdTdWJUeXBlXCJdIH0gfVxuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkNFTlRFUl9CQVNFRF9NSU5JU1RSWX0vJHtzdGF0ZV9jZW50ZXJfaWR9P2xpbWl0PTk5OTkmb2Zmc2V0PTAmc3ViX29yZ190eXBlPW1pbmlzdHJ5YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG5cbiAgZG93bmxvYWRQZGZGb3JDb3Vyc2VSZWNvbW1lbmRhdGlvbihzdGF0ZV9jZW50ZXJfaWQpIHtcblxuICAgIGNvbnN0IHVybCA9IGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkRPV05MT0FEX0NPVVJTRV9SRUNPTU1FTkRBVElPTn0/cm9sZV9tYXBwaW5nX2lkPSR7c3RhdGVfY2VudGVyX2lkfWA7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsLCB7XG4gICAgICBoZWFkZXJzLFxuICAgICAgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2Jsb2InXG4gICAgfSkuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xuXG4gICAgICBjb25zdCBjb250ZW50RGlzcG9zaXRpb24gPSByZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtZGlzcG9zaXRpb24nKTtcbiAgICAgIGxldCBmaWxlbmFtZSA9IGBDT1VSU0VfUkVDT01NRU5EQVRJT05fUmVwb3J0XyR7c3RhdGVfY2VudGVyX2lkfS5wZGZgO1xuXG4gICAgICBpZiAoY29udGVudERpc3Bvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gY29udGVudERpc3Bvc2l0aW9uLm1hdGNoKC9maWxlbmFtZT1cIj8oW15cIl0rKVwiPy8pO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMV0pIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBhIGJsb2IgVVJMIGFuZCBkb3dubG9hZFxuICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtyZXMuYm9keV0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicgfSk7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgYS5ocmVmID0gZG93bmxvYWRVcmw7XG4gICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgICBhLmNsaWNrKCk7XG5cbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoZG93bmxvYWRVcmwpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBsb2FkRG9jdW1lbnQocmVxQm9keSwgZmlsZT86IEZpbGUpIHtcbiAgICBjb25zdCBzdG9yYWdlRGF0YTogYW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9naW5EYXRhJykpXG4gICAgLy8gIGNvbnNvbGUubG9nKCdzdG9yYWdlRGF0YS0tJywgc3RvcmFnZURhdGEpXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3N0b3JhZ2VEYXRhPy5hY2Nlc3NfdG9rZW59YFxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcblxuICAgIC8vIEFkZCByZXF1aXJlZCBmaWVsZHNcbiAgICAvLyBpZiAocmVxQm9keS5zdGF0ZV9jZW50ZXJfaWQpIHtcbiAgICAvLyAgIGZvcm1EYXRhLmFwcGVuZCgnc3RhdGVfY2VudGVyX2lkJywgcmVxQm9keS5zdGF0ZV9jZW50ZXJfaWQpO1xuICAgIC8vIH1cblxuICAgIC8vIGlmIChyZXFCb2R5LmRlcGFydG1lbnRfaWQpIHtcbiAgICAvLyAgIGZvcm1EYXRhLmFwcGVuZCgnZGVwYXJ0bWVudF9pZCcsIHJlcUJvZHkuZGVwYXJ0bWVudF9pZCk7XG4gICAgLy8gfVxuXG5cblxuICAgIC8vIGlmKHJlcUJvZHkuZG9jdW1lbnROYW1lKSB7XG4gICAgLy8gICBmb3JtRGF0YS5hcHBlbmQoJ2RvY3VtZW50X25hbWUnLCByZXFCb2R5LmRvY3VtZW50TmFtZSk7XG4gICAgLy8gfVxuICAgIC8vIEFkZCBmaWxlIGlmIHByb3ZpZGVkXG4gICAgLy8gaWYgKGZpbGUpIHtcbiAgICAvLyAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuICAgIC8vIH1cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5VUExPQURfRE9DVU1FTlR9YCwgcmVxQm9keSwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldFVwbG9hZGVkRG9jdW1lbnRzKHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzO1xuICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpO1xuXG4gICAgT2JqZWN0LmVudHJpZXMocmVxQm9keSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KGtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdFVF9ET0NVTUVOVFN9YCwge1xuICAgICAgaGVhZGVycyxcbiAgICAgIHBhcmFtc1xuICAgIH0pLnBpcGUoXG4gICAgICBtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZGVsZXRlRmlsZShmaWxlSWQpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGU8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5ERUxFVEVfRklMRX0vJHtmaWxlSWR9YCwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIHRyaWdnZXJGaWxlU3VtbWFyeShmaWxlSWQpIHtcbiAgICBjb25zdCBzdG9yYWdlRGF0YTogYW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9naW5EYXRhJykpXG4gICAgLy8gY29uc29sZS5sb2coJ3N0b3JhZ2VEYXRhLS0nLCBzdG9yYWdlRGF0YSlcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7c3RvcmFnZURhdGE/LmFjY2Vzc190b2tlbn1gXG4gICAgfSk7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkRFTEVURV9GSUxFfS8ke2ZpbGVJZH0vc3VtbWFyeWAsIHt9LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZG93bmxvYWRGaWxlKGZpbGVJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxCbG9iPiB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVycztcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkRPV05MT0FEX0ZJTEV9LyR7ZmlsZUlkfS9kb3dubG9hZGAsIHtcbiAgICAgIGhlYWRlcnMsXG4gICAgICByZXNwb25zZVR5cGU6ICdibG9iJ1xuICAgIH0pO1xuICB9XG5cbiAgZGVsZXRlU3VtbWFyeShmaWxlSWQpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGU8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5ERUxFVEVfU1VNTUFSWX0vJHtmaWxlSWR9L3N1bW1hcnlgLCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZGVsZXRlUmVjb21tZW5kZWRDb3Vyc2Uocm9sZU1hcHBpbmdJZDogc3RyaW5nLCBjb3Vyc2VJZGVudGlmaWVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGU8YW55PihcbiAgICAgIGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkRFTEVURV9DT1VSU0VfUkVDT01NRU5EQVRJT059LyR7cm9sZU1hcHBpbmdJZH0vY291cnNlLyR7Y291cnNlSWRlbnRpZmllcn1gLFxuICAgICAgeyBoZWFkZXJzIH1cbiAgICApO1xuICB9XG5cbiAgZ2V0Q2JwUGxhbnNXaXRoU2VsZWN0ZWRDb3Vyc2VzKCk6IGFueVtdIHtcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmNicFBsYW5GaW5hbE9iajtcblxuICAgIHJldHVybiBzb3VyY2U/LnJvbGVfbWFwcGluZ19nZW5lcmF0aW9uXG4gICAgICA/LmZsYXRNYXAoKHJvbGU6IGFueSkgPT4gcm9sZS5jYnBfcGxhbnMgfHwgW10pXG4gICAgICA/LmZpbHRlcihcbiAgICAgICAgKHBsYW46IGFueSkgPT5cbiAgICAgICAgICBBcnJheS5pc0FycmF5KHBsYW4uc2VsZWN0ZWRfY291cnNlcykgJiZcbiAgICAgICAgICBwbGFuLnNlbGVjdGVkX2NvdXJzZXMubGVuZ3RoID4gMFxuICAgICAgKSB8fCBbXTtcbiAgfVxuXG4gIGdldEFkZGl0aW9uYWxQYXJhbWV0ZXJmb3JTdWdnZXN0ZWRDb3Vyc2VzKGlkZW50aWZpZXJzKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIGxldCByZXFCb2R5ID0ge1xuICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgXCJmaWx0ZXJzXCI6IHtcbiAgICAgICAgICBcImlkZW50aWZpZXJcIjogaWRlbnRpZmllcnMsXG5cblxuICAgICAgICAgIFwic3RhdHVzXCI6IFtcbiAgICAgICAgICAgIFwiTGl2ZVwiXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBcImZpZWxkc1wiOiBbXG4gICAgICAgICAgXCJuYW1lXCIsXG4gICAgICAgICAgXCJsYW5ndWFnZVwiLFxuICAgICAgICAgIFwiaWRlbnRpZmllclwiLFxuICAgICAgICAgIFwiYXZnUmF0aW5nXCJcbiAgICAgICAgXSxcbiAgICAgICAgXCJsaW1pdFwiOiAxMDAwLFxuICAgICAgICBcIm9mZnNldFwiOiAwLFxuICAgICAgICBcInNvcnRfYnlcIjoge31cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuU1VHR0VTVEVEX0NPVVJTRV9MSVNUfWAsIHJlcUJvZHksIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICB1cGRhdGVEZXNpZ25hdGlvbkhpZXJhcmNoeShyZXFCb2R5KSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucHV0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuVVBEQVRFX0RFU0lHTkFUSU9OX0hJRVJBUkNIWX1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgc2VhcmNoUHVibGljRGVzaWduYXRpb24ocmVxQm9keSkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5TRUFSQ0hfUFVCTElDX0RFU0lHTkFUSU9OfWAsIHJlcUJvZHksIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBnZXREYXNoYm9hcmRBZG1pbihyZXFCb2R5KSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkRBU0hCT0FSRF9BRE1JTn1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZ2V0RGFzaGJvYXJkR2FwQW5hbHlzaXNBZG1pbihyZXFCb2R5KSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke3RoaXMuYmFzZVVybH0ke0FQSV9FTkRfUE9JTlRTLkdBUF9BTkFMWVNJU19BRE1JTn1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZ2V0RGFzaGJvYXJkUHVibGljKHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuREFTSEJPQVJEX1BVQkxJQ31gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbiAgZ2V0RGFzaGJvYXJkR2FwQW5hbHlzaXNQdWJsaWMocmVxQm9keSkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HQVBfQU5BTFlTSVNfUFVCTElDfWAsIHJlcUJvZHksIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICAgZ2V0TWF0Y2hlZFJvbGVNYXBwaW5nKHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuTUFUQ0hFRF9ST0xFX01BUFBJTkd9YCwgcmVxQm9keSwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIGdldEFwcHJvdmFsUmVxdWVzdHMocmVxQm9keSkge1xuICAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5HRVRfQVBQUk9WQUxfUkVRVUVTVFN9YCwgIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICBzYXZlQXBwcm92YWxSZXF1ZXN0KHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuU0FWRV9BUFBST1ZBTF9SRVFVRVNUfWAsIHJlcUJvZHksIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICAgc2VhcmNoUHVibGljbWRvKHJlcUJvZHkpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuU0VBUkNIX1BVQkxJQ19NRE99YCwgcmVxQm9keSwgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZShtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICB9KSlcbiAgfVxuXG4gIHZpZXdBcHByb3ZhbFJlcXVlc3RzKHJlcXVlc3RfaWQpIHtcbiAgICAgY29uc3QgaGVhZGVycyA9IHRoaXMuaGVhZGVyc1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueT4oYCR7dGhpcy5iYXNlVXJsfSR7QVBJX0VORF9QT0lOVFMuVklFV19BUFBST1ZBTF9SRVFVRVNUfS8ke3JlcXVlc3RfaWR9YCwgIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUobWFwKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfSkpXG4gIH1cblxuICByZXZva2VBcHByb3ZhbFJlcXVlc3QocmVxQm9keSkge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnNcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHt0aGlzLmJhc2VVcmx9JHtBUElfRU5EX1BPSU5UUy5SRVZPS0VfQVBQUk9WQUxfUkVRVUVTVH1gLCByZXFCb2R5LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5waXBlKG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH0pKVxuICB9XG5cbn1cblxuIl19