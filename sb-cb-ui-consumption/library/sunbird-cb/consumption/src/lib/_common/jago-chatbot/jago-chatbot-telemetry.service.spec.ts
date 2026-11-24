import { TestBed } from '@angular/core/testing'
import { TelemetryService, UtilityService } from '@sunbird-cb/utils-v2'
import { JagoChatbotTelemetryService } from './jago-chatbot-telemetry.service'

describe('JagoChatbotTelemetryService', () => {
  const pdata = { id: 'prod.portal', ver: '4.8.40', pid: 'portal' }
  let service: JagoChatbotTelemetryService
  let telemetrySvc: { pData: any, impression: jest.Mock }
  let utilitySvc: { routeData: any }
  let sdk: { interact: jest.Mock, impression: jest.Mock }

  beforeEach(() => {
    telemetrySvc = { pData: pdata, impression: jest.fn() }
    utilitySvc = { routeData: { pageId: 'page/home', module: 'Home' } }
    sdk = { interact: jest.fn(), impression: jest.fn() }
    ;(window as any).$t = sdk
    TestBed.configureTestingModule({
      providers: [
        { provide: TelemetryService, useValue: telemetrySvc },
        { provide: UtilityService, useValue: utilitySvc },
      ],
    })
    service = TestBed.inject(JagoChatbotTelemetryService)
  })

  afterEach(() => {
    delete (window as any).$t
  })

  it('sends an INTERACT with the route page id, the portal pdata and the route module as env', () => {
    service.raiseInteract({ type: 'click', subtype: 'Jago', id: 'chatbot-open' })

    expect(sdk.interact).toHaveBeenCalledWith(
      { type: 'click', subtype: 'Jago', id: 'chatbot-open', pageid: 'page/home' },
      { context: { pdata, env: 'Home' }, object: {} },
    )
  })

  it('adds cdata to the INTERACT context when given', () => {
    service.raiseInteract(
      { type: 'click', subtype: 'English', id: 'language-change-existing' },
      [{ id: 'language-change', type: '' }],
    )

    expect(sdk.interact).toHaveBeenCalledWith(
      { type: 'click', subtype: 'English', id: 'language-change-existing', pageid: 'page/home' },
      { context: { pdata, env: 'Home', cdata: [{ id: 'language-change', type: '' }] }, object: {} },
    )
  })

  it('sends a subtyped page IMPRESSION with the same context', () => {
    service.raiseImpression({ subtype: 'chatbot-open' })

    expect(sdk.impression).toHaveBeenCalledWith(
      { type: 'page', subtype: 'chatbot-open', pageid: 'page/home', uri: window.location.pathname },
      { context: { pdata, env: 'Home' }, object: {} },
    )
    expect(telemetrySvc.impression).not.toHaveBeenCalled()
  })

  it('uses the library page impression when there is no subtype', () => {
    service.raiseImpression()

    expect(telemetrySvc.impression).toHaveBeenCalledTimes(1)
    expect(sdk.impression).not.toHaveBeenCalled()
  })

  it('falls back to the URL path for the page id and leaves env to the SDK when the route has no data', () => {
    utilitySvc.routeData = undefined
    service.raiseInteract({ type: 'click', subtype: 'Hindi', id: 'language-change-target' })

    expect(sdk.interact).toHaveBeenCalledWith(
      { type: 'click', subtype: 'Hindi', id: 'language-change-target', pageid: window.location.pathname },
      { context: { pdata }, object: {} },
    )
  })

  it('does nothing when the telemetry SDK is not loaded', () => {
    delete (window as any).$t
    expect(() => service.raiseInteract({ type: 'click', id: 'chatbot-open' })).not.toThrow()
    expect(() => service.raiseImpression({ subtype: 'chatbot-open' })).not.toThrow()
  })
})
