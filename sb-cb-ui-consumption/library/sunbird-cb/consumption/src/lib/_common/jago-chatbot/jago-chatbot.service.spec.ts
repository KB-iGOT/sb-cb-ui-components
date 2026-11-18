import { TestBed } from '@angular/core/testing'
import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { DomainConfService } from '@sunbird-cb/utils-v2'
import { JagoChatbotService } from './jago-chatbot.service'
import { CHATBOT_API_DEFAULTS } from './jago-chatbot.constants'

/** Stands in for the portal's AppInterceptorService, which stamps portal headers on every request. */
class PortalHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req.clone({ setHeaders: { Authorization: '', org: 'dopt', wid: 'user-1', cstoken: 'secret' } }))
  }
}

describe('JagoChatbotService', () => {
  let service: JagoChatbotService
  let httpMock: HttpTestingController
  let featureConfig: any

  beforeEach(() => {
    featureConfig = { apiUrl: 'https://tribot.example/api/v1', apiKey: 'test-key' }
    const domainConfSvc = { getFeatureConfig: jest.fn(() => featureConfig) }
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: PortalHeadersInterceptor, multi: true },
        { provide: DomainConfService, useValue: domainConfSvc },
      ],
    })
    service = TestBed.inject(JagoChatbotService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('posts the query and history to the chat endpoint, skipping the portal interceptors', () => {
    service.sendMessage('Hi', [{ role: 'assistant', content: 'Hello' }], 'hin').subscribe()

    const req = httpMock.expectOne('https://tribot.example/api/v1/chat')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({
      query: 'Hi',
      messages: [{ role: 'assistant', content: 'Hello' }, { role: 'user', content: 'Hi' }],
      language: 'hin',
      top_k: 10,
    })
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-key')
    expect(req.request.headers.get('x-api-key')).toBe('test-key')
    expect(req.request.headers.has('org')).toBe(false)
    expect(req.request.headers.has('wid')).toBe(false)
    expect(req.request.headers.has('cstoken')).toBe(false)
    req.flush({ answer: 'ok' })
  })

  it('does not repeat the query when it is already the last user turn', () => {
    service.sendMessage('Hi', [{ role: 'user', content: 'Hi' }]).subscribe()

    const req = httpMock.expectOne('https://tribot.example/api/v1/chat')
    expect(req.request.body.messages).toEqual([{ role: 'user', content: 'Hi' }])
    expect(req.request.body.language).toBe('eng')
    req.flush({ answer: 'ok' })
  })

  it('falls back to the default backend when the global config has no features.jagochatbot', () => {
    featureConfig = null
    service.sendMessage('Hi').subscribe()

    const req = httpMock.expectOne(`${CHATBOT_API_DEFAULTS.apiUrl}/chat`)
    expect(req.request.headers.get('x-api-key')).toBe(CHATBOT_API_DEFAULTS.apiKey)
    req.flush({ answer: 'ok' })
  })
})
