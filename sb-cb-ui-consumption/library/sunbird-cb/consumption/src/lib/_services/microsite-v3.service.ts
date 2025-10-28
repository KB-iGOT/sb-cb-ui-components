import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_END_POINTS = {
  ORG_UPLOAD_FILE: 'apis/proxies/v8/storage/orgStoreUpload'
}

@Injectable({
  providedIn: 'root'
})
export class MicrositeV3Service {

  constructor(
    private http: HttpClient,
    @Inject('environment') private environment: any
  ) { }

  /**
   * Upload file to storage
   * @param file File to upload
   * @returns Observable with the transformed URL
   */
  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file)
    return this.http.post<any>(`${API_END_POINTS.ORG_UPLOAD_FILE}`, formData)
      .pipe(
        map(response => {
          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            return this.transformUrl(response.result.url);
          }
          throw new Error('Upload failed. Invalid response.');
        })
      );
  }

  /**
   * Transform storage URL to content delivery URL
   * @param originalUrl Original storage URL
   * @returns Transformed URL
   */
  private transformUrl(originalUrl: string): string {
    const googleStorageUrl = this.environment?.googleStorageUrl || '';
    const contentStoreUrl = `${this.environment?.mdoPath}/content-store` || '';
    
    return originalUrl.replace(googleStorageUrl, contentStoreUrl);
  }
}
