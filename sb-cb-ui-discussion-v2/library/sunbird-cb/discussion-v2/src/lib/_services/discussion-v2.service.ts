import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  CREATE_POST: `/apis/proxies/v8/feedDiscussion/create`,
  CREATE_ANSWER_POST: `/apis/proxies/v8/feedDiscussion/answerPosts`,
  READ_POST: (id: string) =>`/apis/proxies/v8/feedDiscussion/read/${id}`,
  UPDATE_POST: `/apis/proxies/v8/feedDiscussion/update`,
  SEARCH_POSTS: `/apis/proxies/v8/feedDiscussion/search`,
  UP_VOTE: (id: string) => `/apis/proxies/v8/feedDiscussion/upVote/${id}`,
  DOWN_VOTE: (id: string) => `/apis/proxies/v8/feedDiscussion/downVote/${id}`,
  DELETE_POST: (id: string) => `/apis/proxies/v8/feedDiscussion/delete/${id}`,
  REPORT_POST: `/apis/proxies/v8/feedDiscussion/report`,
  FLAG_LIST: `/apis/proxies/v8/data/v2/system/settings/get/commentReportReasonConfig`,
  UPLOAD_FILE: `/apis/proxies/v8/feedDiscussion/uploadFile`
}

@Injectable({
  providedIn: 'root',
})
export class DiscussionV2Service {
  baseUrl = this.configSvc.sitePath
  enrolledContent: boolean = false
  entityId: string = ''
  entityType: string = ''
  workflow: string = ''
  commentTreeId: string =''
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  createPost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_POST}`, req)
  }

  createAnswerPost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ANSWER_POST}`, req)
  }

  readPost(id: string) {
    return this.http.get<any>(`${API_END_POINTS.READ_POST(id)}`)
  }

  updatePost(req: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_POST}`, req)
  }

  searchPosts(req: any) {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_POSTS}`, req) 
  }

  upVotePost(id: string) {
    return this.http.post<any>(`${API_END_POINTS.UP_VOTE(id)}`, {})
  }

  downVotePost(id: string) {
    return this.http.post<any>(`${API_END_POINTS.DOWN_VOTE(id)}`, {})
  }

  deletePost(id: string) {
    return this.http.get<any>(`${API_END_POINTS.DELETE_POST(id)}`)
  }

  fetchAllFlags(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.FLAG_LIST}`)
  }

  reportPost(requestData: any) {
    return this.http.post<any>(`${API_END_POINTS.REPORT_POST}`, requestData)
  }

  uploadFile(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.UPLOAD_FILE}`, req)
  }
}
