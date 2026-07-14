import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class UploadHelperService {

  constructor(private http: HttpClient) { }

  async uploadFile(file: File, config: any): Promise<string> {
    let randomNumber = ''
    for (let i = 0; i < 16; i++) {
      randomNumber += Math.floor(Math.random() * 10)
    }

    const requestData = structuredClone(config.fileRequestData)
    requestData.request.content.code = randomNumber
    requestData.request.content.name = file.name

    const fileType = file.type
    if (fileType.startsWith('audio/')) {
      requestData.request.content.mimeType = 'audio/mpeg'
      requestData.request.content.mediaType = 'audio'
    } else if (fileType.startsWith('video/')) {
      requestData.request.content.mimeType = 'video/mp4'
      requestData.request.content.mediaType = 'video'
    } else if (fileType === 'image/jpeg') {
      requestData.request.content.mimeType = 'image/jpeg'
      requestData.request.content.mediaType = 'image'
    } else if (fileType === 'image/png') {
      requestData.request.content.mimeType = 'image/png'
      requestData.request.content.mediaType = 'image'
    }

    const createResponse: any = await this.http.post(config.contentCreateUrl, requestData).toPromise()
    const identifier = createResponse?.result?.identifier

    const formData = new FormData()
    formData.append('data', file)
    const uploadResponse: any = await this.http.post(`${config.fileUploadUrl}${identifier}`, formData).toPromise()

    const artifactUrl = config.artifactUrl
    const uploadedUrl = uploadResponse?.result?.artifactUrl
    let finalUrl = uploadedUrl

    if (artifactUrl.includes('cbp.dev.karmayogibharat.net')) {
      finalUrl = uploadedUrl.replace('https://storage.googleapis.com/igot', artifactUrl)
    } else if (artifactUrl.includes('cbp.qa.karmayogibharat.net')) {
      finalUrl = uploadedUrl.replace('https://storage.googleapis.com/igotqa', artifactUrl)
    } else if (artifactUrl.includes('cbp.uat.karmayogibharat.net')) {
      finalUrl = uploadedUrl.replace('https://storage.googleapis.com/igotuat', artifactUrl)
    } else if (artifactUrl.includes('cbp.igotkarmayogi.gov.in')) {
      finalUrl = uploadedUrl.replace('https://storage.googleapis.com/igotprod', artifactUrl)
    } else if (artifactUrl.includes('localhost')) {
      finalUrl = uploadedUrl.replace('https://storage.googleapis.com/igotuat', 'https://cbp.uat.karmayogibharat.net/assets/public')
    }

    return finalUrl
  }
}
