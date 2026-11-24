import { Injectable } from '@angular/core'
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { timeout } from 'rxjs/operators'
import { DomainConfService } from '@sunbird-cb/utils-v2'
import { CHATBOT_API_DEFAULTS } from './jago-chatbot.constants'

export interface IChatHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface IChatResponse {
  response_type: string
  answer: string
  items: any[]
  table_headers: string[]
  table_rows: any[]
  actions: any[]
  sources: { filename: string, page: number, section: string }[]
  confidence_level: 'high' | 'medium' | 'low'
  session_id: string
  turn_number: number
  lang: string
}

/** `features.jagochatbot` block of the global-web form config. */
export interface IJagoChatbotConfig {
  apiUrl?: string
  apiKey?: string
}

const REQUEST_TIMEOUT_MS = 45000

/**
 * Client for the Ministry of Tribal Affairs (Jago / Tribot) RAG chat backend.
 * The endpoint and API key come from `features.jagochatbot` in the global-web form config, read
 * on every call because that config loads after the app starts. Missing values fall back to
 * CHATBOT_API_DEFAULTS.
 */
@Injectable({
  providedIn: 'root',
})
export class JagoChatbotService {
  /**
   * Built on HttpBackend, so the host app's HTTP interceptors are skipped. The chat backend is a
   * third-party origin: the portal's AppInterceptorService would blank the Authorization header
   * carrying the API key, add portal headers its CORS policy does not allow, and send the user's
   * id and cstoken to it.
   */
  private http: HttpClient

  constructor(httpBackend: HttpBackend, private domainConfSvc: DomainConfService) {
    this.http = new HttpClient(httpBackend)
  }

  /**
   * Sends a query to the chat backend.
   * `history` is the conversation so far; the query is appended if it is not already the last user turn.
   */
  sendMessage(query: string, history: IChatHistoryMessage[] = [], language = 'eng'): Observable<IChatResponse> {
    const { apiUrl, apiKey } = this.getConfig()

    const messages = [...history]
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'user' || last.content !== query) {
      messages.push({ role: 'user', content: query })
    }

    const body = {
      query,
      messages,
      language,
      top_k: 10,
    }

    return this.http
      .post<IChatResponse>(`${apiUrl.replace(/\/+$/, '')}/chat`, body, { headers: this.getHeaders(apiKey) })
      .pipe(timeout(REQUEST_TIMEOUT_MS))
  }

  private getConfig(): Required<IJagoChatbotConfig> {
    const config: IJagoChatbotConfig = this.domainConfSvc.getFeatureConfig('jagochatbot') || {}
    return {
      apiUrl: config.apiUrl || CHATBOT_API_DEFAULTS.apiUrl,
      apiKey: config.apiKey || CHATBOT_API_DEFAULTS.apiKey,
    }
  }

  private getHeaders(apiKey: string): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    if (apiKey) {
      headers = headers
        .set('x-api-key', apiKey)
        .set('Authorization', `Bearer ${apiKey}`)
    }
    return headers
  }
}
