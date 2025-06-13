import { HttpClient } from "@angular/common/http";
import { Injectable, signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";
import { IUserGroupRequest, NsAccessControlConfig } from "../_models/access-control.model";
import { toNumber } from "lodash";

const ENDPOINTS = {
  SEARCH_USER_WITH_ADMIN: (query: string) => `/apis/proxies/v8/user/v1/autocomplete/${query}`,
  SEARCH_USER: `/apis/proxies/v8/user/v1/admin/search`,
  SEARCH_ORG: "/apis/proxies/v8/org/v1/admin/search",
  VALIDATE_USER: "/apis/proxies/v8/user/v1/search",
  GROUPS: "/apis/proxies/v8/user/v1/groups",
  CADRE_CONFIG: "/apis/proxies/v8/data/v2/system/settings/get/cadreConfig",
  DESIGNATION_LIST: "/apis/proxies/v8/designation/search",
  SEARCH_V4: "/apis/proxies/v8/sunbirdigot/v4/search",
  CREATE_USERGROUPS_CONTROL: "/apis/proxies/v8/accessSetttings/v1/upsert",
  GET_ACCESS_CONTROL: (id: string) => `/apis/proxies/v8/accessSetttings/read/${id}`,
  ACTION_CONTENT_V3: `apis/proxies/v8/action/content/v3/`
};

@Injectable({
  providedIn: "root"
})
export class AccessControlService {
  accessControlConfig: WritableSignal<NsAccessControlConfig.IAccessControlConfig>;
  holdServiceCadrebatch: WritableSignal<{
    service: { id: string; name: string }[];
    batch: number[];
    cadre: { id: string; name: string }[];
  }>;

  constructor(private readonly http: HttpClient) {
    this.accessControlConfig = signal<NsAccessControlConfig.IAccessControlConfig>(null);
    this.holdServiceCadrebatch = signal({
      service: [],
      batch: [],
      cadre: []
    });
  }

  fetchUserListWithAdmin(queryString: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.SEARCH_USER_WITH_ADMIN(queryString));
  }

  fetchUserList(query: string, pagination: { limit: number; offset: number }, userIds?: string[]): Observable<any> {
    let request: any = {
      filters: {
        "profileDetails.profileStatus": ["VERIFIED", "NOT-VERIFIED"],
        status: 1
      },
      limit: pagination.limit || 5,
      offset: pagination.offset || 0,
      query: query,
      sort_by: {
        firstName: "asc"
      }
    };
    if (userIds?.length) {
      request.filters = { ...request.filters, userId: userIds };
    }
    return this.http.post<any>(ENDPOINTS.SEARCH_USER, { request: request });
  }

  fetchOrgList(query: string, selectedData?: string[], characterSearch?: string): Observable<any> {
    let request: any = {
      request: {
        filters: {
          status: 1
        },
        sort_by: {
          channel: "asc"
        },
        fields: ["channel", "identifier"],
        query: query,
        limit: 200
      }
    };
    if (selectedData?.length) {
      request.request.filters.identifier = selectedData;
    }

    if (characterSearch) {
      request.request.filters.channel = { startsWith: characterSearch };
    }
    return this.http.post<any>(ENDPOINTS.SEARCH_ORG, request);
  }

  validateUser(request: any): Observable<any> {
    return this.http.post<any>(ENDPOINTS.VALIDATE_USER, request);
  }

  fetchGroupsList(): Observable<any> {
    return this.http.get<any>(ENDPOINTS.GROUPS);
  }

  fetchCadreConfig(): Observable<any> {
    return this.http.get<any>(ENDPOINTS.CADRE_CONFIG);
  }

  fetchDesignation(query: string, selectedData?: string[]): Observable<any> {
    let payload: any = {
      filterCriteriaMap: {
        status: "Active"
      },
      requestedFields: ["designation", "id"],
      pageSize:1000,
      pageNumber: 0
    };
    if (selectedData?.length) {
      payload.filterCriteriaMap.designation = selectedData;
    }
    if (query) {
      payload.searchString = query;
    }
    return this.http.post<any>(ENDPOINTS.DESIGNATION_LIST, payload);
  }

  fetchDesignationsWithOrg(categories: string[], query: string, selectedData?: string[]): Observable<any> {
    let payload: any = {
      request: {
        filters: {
          status: "Live",
          category: "designation",
          categories: categories,
          objectType: "Term"
        },
        fields: ["identifier", "name"],
        query: query,
        sort_by: {
          lastUpdatedOn: "desc",
          objectType: "Term"
        },
        facets: []
      }
    };
    if (selectedData?.length) {
      payload.request.filters.name = selectedData;
    }
    return this.http.post<any>(ENDPOINTS.SEARCH_V4, payload);
  }

  applyUserGroupAccessControl(request: IUserGroupRequest): Observable<any> {
    return this.http.put<any>(ENDPOINTS.CREATE_USERGROUPS_CONTROL, request);
  }

  fetchUserGroupAccessControl(id: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.GET_ACCESS_CONTROL(id));
  }

  updateContentV3(meta: any, id: string): Observable<any> {
    return this.http.patch<any>(`${ENDPOINTS.ACTION_CONTENT_V3}update/${id}`, meta);
  }

  downloadFile(data: any, filename = "data") {
    const csvData = this.convertToCSV(data, ["email", "status", "mobile", "message"]);
    const blob = new Blob([`\ufeff${csvData}`], { type: "text/csv;charset=utf-8;" });
    const dwldLink = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;
    if (isSafariBrowser) {
      // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", `${filename}.csv`);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  convertToCSV(objArray: any, headerList: any) {
    const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "S.No,";

    for (const index in headerList) {
      if (headerList[index]) {
        row += `${headerList[index]} ,`;
      }
    }
    row = row.slice(0, -1);
    str += `${row}\r\n`;
    // for (let i = 0; i < array.length; i += 1) {
    for (const iIndex in array) {
      if (array[iIndex]) {
        let line = `${toNumber(iIndex) + 1} `;
        for (const index in headerList) {
          if (headerList[index]) {
            const head = headerList[index];

            line += `, ${array[iIndex][head]}`;
          }
        }
        str += `${line}\r\n`;
      }
    }
    return str;
  }

  createRequestContent(apiResponse: any, accessSettingsEnabled: boolean) {
    return {
      request: {
        content: {
          appIcon: apiResponse.appIcon || "",
          posterImage: apiResponse.posterImage || "",
          code: apiResponse.code || "",
          contentType: apiResponse.contentType || "",
          createdBy: apiResponse.createdBy || "",
          creatorContacts: apiResponse.creatorContacts || [],
          creatorIDs: apiResponse.creatorIDs || [],
          createdFor: apiResponse.createdFor || [],
          creator: apiResponse.creator || "",
          framework: apiResponse.framework || "",
          mimeType: apiResponse.mimeType || "",
          name: apiResponse.name || "",
          organisation: apiResponse.organisation || [],
          isExternal: apiResponse.isExternal || false,
          primaryCategory: apiResponse.primaryCategory || "",
          courseCategory: apiResponse.courseCategory || "",
          license: apiResponse.license || "",
          ownershipType: apiResponse.ownershipType || [],
          cumulativeTracking: apiResponse.cumulativeTracking || false,
          language: apiResponse.language || [],
          accessSetting: apiResponse.accessSetting || "",
          versionKey: apiResponse.versionKey || "",
          accessSettingsEnabled: accessSettingsEnabled || false
        }
      }
    };
  }
}
