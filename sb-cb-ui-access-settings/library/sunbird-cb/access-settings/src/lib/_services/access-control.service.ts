import { HttpClient } from "@angular/common/http";
import { Injectable, signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";
import { NsAccessControlConfig } from "../_models/access-control.model";
import { toNumber } from "lodash";

const ENDPOINTS = {
  SEARCH_USER_WITH_ADMIN: (query: string) =>
    `/apis/proxies/v8/user/v1/autocomplete/${query}`,
  SEARCH_USER: `/apis/proxies/v8/user/v1/admin/search`,
  SEARCH_ORG: "/apis/proxies/v8/org/v1/admin/search",
  VALIDATE_USER: "apis/proxies/v8/user/v1/search",
};

@Injectable({
  providedIn: "root",
})
export class AccessControlService {
  accessControlConfig: WritableSignal<NsAccessControlConfig.IAccessControlConfig> =
    signal<NsAccessControlConfig.IAccessControlConfig>(null);

  constructor(private readonly http: HttpClient) {}

  fetchUserListWithAdmin(queryString: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.SEARCH_USER_WITH_ADMIN(queryString));
  }

  fetchUserList(
    query: string,
    pagination: { limit: number; offset: number }
  ): Observable<any> {
    const request = {
      filters: {
        "profileDetails.profileStatus": ["VERIFIED", "NOT-VERIFIED"],
        status: 1,
      },
      limit: pagination.limit || 5,
      offset: pagination.offset || 0,
      query: query,
      sort_by: {
        firstName: "asc",
      },
    };
    return this.http.post<any>(ENDPOINTS.SEARCH_USER, { request: request });
  }

  fetchOrgList(
    query: string,
    pagination?: { limit: number; offset: number }
  ): Observable<any> {
    const request = {
      request: {
        filters: {},
        sort_by: {
          channel: "asc",
        },
        fields: ["channel", "identifier"],
        // limit: pagination.limit || 5,
        // offset: pagination.offset || 0,
        query: query,
      },
    };
    return this.http.post<any>(ENDPOINTS.SEARCH_ORG, request);
  }

  validateUser(request: any): Observable<any> {
    return this.http.post<any>(ENDPOINTS.VALIDATE_USER, request);
  }

  downloadFile(data: any, filename = 'data') {
    const csvData = this.convertToCSV(data, ['email', 'status', 'mobile', 'message'])
    const blob = new Blob([`\ufeff${csvData}`], { type: 'text/csv;charset=utf-8;' })
    const dwldLink = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1
    if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank')
    }
    dwldLink.setAttribute('href', url)
    dwldLink.setAttribute('download', `${filename}.csv`)
    dwldLink.style.visibility = 'hidden'
    document.body.appendChild(dwldLink)
    dwldLink.click()
    document.body.removeChild(dwldLink)
  }

  convertToCSV(objArray: any, headerList: any) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
    let str = ''
    let row = 'S.No,'

    for (const index in headerList) {
      if (headerList[index]) {
        row += `${headerList[index]} ,`
      }
    }
    row = row.slice(0, -1)
    str += `${row}\r\n`
    // for (let i = 0; i < array.length; i += 1) {
    for (const iIndex in array) {
      if (array[iIndex]) {
        let line = `${toNumber(iIndex) + 1} `
        for (const index in headerList) {
          if (headerList[index]) {
            const head = headerList[index]

            line += `, ${array[iIndex][head]}`
          }
        }
        str += `${line}\r\n`
      }
    }
    return str
  }
}
