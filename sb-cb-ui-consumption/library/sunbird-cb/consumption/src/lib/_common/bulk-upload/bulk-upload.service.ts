import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { NsBulkUpload } from './bulk-upload.model'

export type OtpContactType = 'email' | 'phone'

@Injectable({
  providedIn: 'root'
})
export class BulkUploadService {

  constructor(private http: HttpClient) { }

  /** replaces {path} placeholders with url encoded values from the context */
  resolveTemplate(template: string, context: any = {}, encode = true): string {
    return (template || '').replace(/{([^{}]+)}/g, (match: string, path: string) => {
      const value = _.get(context, path.trim())
      if (value === undefined || value === null) {
        return ''
      }
      return encode ? encodeURIComponent(String(value)) : String(value)
    })
  }

  validateFileType(fileName: string, allowedExtensions: string[]): boolean {
    const name = fileName || ''
    const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
    return (allowedExtensions || []).map(e => e.toLowerCase()).includes(ext)
  }

  upload(api: NsBulkUpload.IUploadApi, file: File, context: any): Observable<any> {
    const formData = new FormData()
    if (api.appendFileName) {
      formData.append(api.fileField, file, file.name)
    } else {
      formData.append(api.fileField, file)
    }
    _.forEach(api.extraFields || {}, (value: string, key: string) => {
      formData.append(key, this.resolveTemplate(value, context, false))
    })
    return this.http.post<any>(this.resolveTemplate(api.url, context), formData)
  }

  getStatusList(api: NsBulkUpload.IStatusListApi, context: any): Observable<any[]> {
    const url = this.resolveTemplate(api.url, context)
    const request$ = api.method === 'POST'
      ? this.http.post<any>(url, api.body || {})
      : this.http.get<any>(url)
    return request$.pipe(map((res: any) => {
      const list = api.resultPath ? _.get(res, api.resultPath) : res
      return Array.isArray(list) ? list : []
    }))
  }

  /**
   * Saved file name priority: fileName, Content-Disposition header, fallbackFileName, last url segment
   */
  downloadFile(
    url: string,
    mode: NsBulkUpload.DownloadMode = 'blob',
    fileName?: string,
    fallbackFileName?: string,
  ): Observable<void> {
    if (mode === 'open') {
      window.open(url, '_blank')
      return of(undefined)
    }
    return this.http.get(url, { responseType: 'blob', observe: 'response' }).pipe(
      map((res: HttpResponse<Blob>) => {
        const name = fileName
          || this.getFileNameFromDisposition(res.headers.get('Content-Disposition'))
          || fallbackFileName
          || this.getFileNameFromUrl(url)
        if (res.body) {
          this.saveBlob(res.body, name)
        }
      }),
    )
  }

  sendOtp(otp: NsBulkUpload.IOtpConfig, type: OtpContactType, key: string | number): Observable<any> {
    return this.http.post(otp.sendUrl as string, {
      request: { type, key: `${key}` },
    })
  }

  verifyOtp(otp: NsBulkUpload.IOtpConfig, type: OtpContactType, key: string | number, value: string): Observable<any> {
    const url = type === 'email' ? otp.verifyEmailUrl : otp.verifyPhoneUrl
    return this.http.post(url as string, {
      request: { otp: `${value}`, type, key: `${key}` },
    })
  }

  private saveBlob(blob: Blob, fileName: string): void {
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(objectUrl)
  }

  private getFileNameFromDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
      return null
    }
    const matches = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(contentDisposition)
    return matches ? decodeURIComponent(matches[1]) : null
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('?')[0].split('/').pop() || 'download'
  }
}
