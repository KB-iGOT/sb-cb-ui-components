// card-landscape.component.spec.ts
// Pure unit tests - the component is instantiated directly with mocked dependencies, no TestBed.

// Mock all external modules BEFORE importing the component under test.
jest.mock('@angular/material/snack-bar', () => ({
  MatSnackBar: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@sunbird-cb/utils-v2', () => ({
  ConfigurationsService: jest.fn().mockImplementation(() => ({})),
  DomainConfService: jest.fn().mockImplementation(() => ({})),
  EventService: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@ngx-translate/core', () => ({
  TranslateService: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('../../../_services/multilingual-translations.service', () => ({
  MultilingualTranslationsService: jest.fn().mockImplementation(() => ({})),
}))

import { BehaviorSubject } from 'rxjs'
import { CardLandscapeComponent } from './card-landscape.component'

describe('CardLandscapeComponent', () => {
  let component: CardLandscapeComponent

  let snackBarMock: any
  let eventsMock: any
  let translateMock: any
  let langtranslationsMock: any
  let configSvcMock: any
  let domainConfSvcMock: any

  /** Builds a fresh component with the current mocks. */
  const createComponent = (): CardLandscapeComponent =>
    new CardLandscapeComponent(
      snackBarMock,
      eventsMock,
      translateMock,
      langtranslationsMock,
      configSvcMock,
      domainConfSvcMock
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    localStorage.clear()

    snackBarMock = { open: jest.fn() }
    eventsMock = { raiseInteractTelemetry: jest.fn() }
    translateMock = { setDefaultLang: jest.fn(), use: jest.fn() }
    langtranslationsMock = { languageSelectedObservable: new BehaviorSubject<any>(true) }
    configSvcMock = { instanceConfig: null }
    domainConfSvcMock = { isConfigEnabled: jest.fn().mockReturnValue(true) }

    component = createComponent()
  })

  afterEach(() => {
    clearInterval(component.cbPlanInterval)
    jest.useRealTimers()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  describe('default state', () => {
    it('should start unflipped and not loading', () => {
      expect(component.isCardFlipped).toBe(false)
      expect(component.isCardLoading).toBe(false)
      expect(component.showFlip).toBe(false)
    })

    it('should keep the enrolment status pill opt-in off by default', () => {
      expect(component.showEnrolmentStatus).toBe(false)
    })

    it('should expose the acbp constants', () => {
      expect(component.acbpConstants).toBeDefined()
      expect(component.acbpConstants.OVERDUE).toBe('overdue')
    })

    it('should expose the content and telemetry emitters', () => {
      expect(typeof component.contentData.emit).toBe('function')
      expect(typeof component.triggerTelemetry.emit).toBe('function')
    })
  })

  describe('constructor - language handling', () => {
    it('should not touch the translate service when no website language is stored', () => {
      expect(translateMock.setDefaultLang).not.toHaveBeenCalled()
      expect(translateMock.use).not.toHaveBeenCalled()
    })

    it('should apply the stored website language on subscription', () => {
      localStorage.setItem('websiteLanguage', 'hi')
      createComponent()
      expect(translateMock.setDefaultLang).toHaveBeenCalledWith('en')
      expect(translateMock.use).toHaveBeenCalledWith('hi')
    })

    it('should re-apply the language every time the selection changes', () => {
      localStorage.setItem('websiteLanguage', 'ta')
      createComponent()
      const callsAfterInit = translateMock.use.mock.calls.length
      langtranslationsMock.languageSelectedObservable.next(true)
      expect(translateMock.use.mock.calls.length).toBeGreaterThan(callsAfterInit)
      expect(translateMock.use).toHaveBeenLastCalledWith('ta')
    })
  })

  describe('isCardElementEnabled', () => {
    it('should delegate to the domain config service', () => {
      expect(component.isCardElementEnabled('enrolmentStatus')).toBe(true)
      expect(domainConfSvcMock.isConfigEnabled).toHaveBeenCalledWith('components.cards', 'enrolmentStatus')
    })

    it('should report a disabled element', () => {
      domainConfSvcMock.isConfigEnabled.mockReturnValue(false)
      expect(component.isCardElementEnabled('enrolmentStatus')).toBe(false)
    })
  })

  describe('enrolmentStatusPill', () => {
    beforeEach(() => {
      component.showEnrolmentStatus = true
      component.widgetData = { content: { completionStatus: 2 } } as any
    })

    it('should return null when the caller has not opted in', () => {
      component.showEnrolmentStatus = false
      expect(component.enrolmentStatusPill).toBeNull()
    })

    it('should return null when the config has switched the element off', () => {
      domainConfSvcMock.isConfigEnabled.mockReturnValue(false)
      expect(component.enrolmentStatusPill).toBeNull()
    })

    it('should return null when there is no widget data', () => {
      component.widgetData = undefined as any
      expect(component.enrolmentStatusPill).toBeNull()
    })

    it('should return null when the content carries no completion status', () => {
      component.widgetData = { content: {} } as any
      expect(component.enrolmentStatusPill).toBeNull()
    })

    it('should return null when the completion status is null', () => {
      component.widgetData = { content: { completionStatus: null } } as any
      expect(component.enrolmentStatusPill).toBeNull()
    })

    it('should return null when the completion status is an empty string', () => {
      component.widgetData = { content: { completionStatus: '' } } as any
      expect(component.enrolmentStatusPill).toBeNull()
    })

    it('should report completed for status 2', () => {
      expect(component.enrolmentStatusPill).toEqual({
        label: 'Completed',
        cssClass: 'enrolment-status-completed',
      })
    })

    it('should report completed for a numeric string status of 2', () => {
      component.widgetData = { content: { completionStatus: '2' } } as any
      expect(component.enrolmentStatusPill).toEqual({
        label: 'Completed',
        cssClass: 'enrolment-status-completed',
      })
    })

    it('should report in progress for a not started status', () => {
      component.widgetData = { content: { completionStatus: 0 } } as any
      expect(component.enrolmentStatusPill).toEqual({
        label: 'In Progress',
        cssClass: 'enrolment-status-in-progress',
      })
    })

    it('should report in progress for a started status', () => {
      component.widgetData = { content: { completionStatus: 1 } } as any
      expect(component.enrolmentStatusPill).toEqual({
        label: 'In Progress',
        cssClass: 'enrolment-status-in-progress',
      })
    })
  })

  describe('ngOnInit', () => {
    it('should read the thumbnails and source logos from the instance config', () => {
      configSvcMock.instanceConfig = {
        logos: { defaultContent: 'content.png', defaultSourceLogo: 'source.svg' },
        sources: { partner: 'partner.svg' },
      }
      const created = createComponent()
      created.ngOnInit()
      expect(created.defaultThumbnail).toBe('content.png')
      expect(created.sourceLogos).toEqual({ partner: 'partner.svg' })
      expect(created.defaultSLogo).toBe('source.svg')
      clearInterval(created.cbPlanInterval)
    })

    it('should fall back to empty logos when the instance config carries none', () => {
      configSvcMock.instanceConfig = { logos: {}, sources: {} }
      const created = createComponent()
      created.ngOnInit()
      expect(created.defaultThumbnail).toBe('')
      expect(created.defaultSLogo).toBe('')
      clearInterval(created.cbPlanInterval)
    })

    it('should fall back to the eagle assets without an instance config', () => {
      component.ngOnInit()
      expect(component.defaultThumbnail).toBe('/assets/instances/eagle/app_logos/default.png')
      expect(component.defaultSLogo).toBe('/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg')
    })

    it('should use the provider logo for content from a content partner', () => {
      component.widgetData = { content: { contentPartner: { contentPartnerName: 'Partner A' } } } as any
      component.ngOnInit()
      expect(component.defaultSLogo).toBe('/assets/icons/content/provider.svg')
    })

    it('should keep the default logo when the content partner has no name', () => {
      component.widgetData = { content: { contentPartner: {} } } as any
      component.ngOnInit()
      expect(component.defaultSLogo).toBe('/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg')
    })

    it('should poll for the cb plan data every second', () => {
      const cbPlanSpy = jest.spyOn(component, 'getCbPlanData')
      component.ngOnInit()
      expect(cbPlanSpy).not.toHaveBeenCalled()
      jest.advanceTimersByTime(1000)
      expect(cbPlanSpy).toHaveBeenCalledTimes(1)
      jest.advanceTimersByTime(2000)
      expect(cbPlanSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('showSnackbar', () => {
    it('should warn that intranet content is unavailable', () => {
      component.showIntranetContent = true
      component.showSnackbar()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Content is only available in intranet',
        'X',
        { duration: 2000 }
      )
    })

    it('should warn that the content may be expired or deleted', () => {
      component.showIntranetContent = false
      component.isLiveOrMarkForDeletion = false
      component.showSnackbar()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Content may be expired or deleted',
        'X',
        { duration: 2000 }
      )
    })

    it('should stay silent for live content outside the intranet', () => {
      component.showIntranetContent = false
      component.isLiveOrMarkForDeletion = true
      component.showSnackbar()
      expect(snackBarMock.open).not.toHaveBeenCalled()
    })

    it('should prefer the intranet warning when both conditions hold', () => {
      component.showIntranetContent = true
      component.isLiveOrMarkForDeletion = false
      component.showSnackbar()
      expect(snackBarMock.open).toHaveBeenCalledTimes(1)
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Content is only available in intranet',
        'X',
        { duration: 2000 }
      )
    })
  })

  describe('getRedirectUrlData', () => {
    it('should emit the content data', () => {
      const emitSpy = jest.spyOn(component.contentData, 'emit')
      component.getRedirectUrlData({ identifier: 'do_1' })
      expect(emitSpy).toHaveBeenCalledWith({ identifier: 'do_1' })
    })

    it('should notify subscribers', () => {
      const received: any[] = []
      component.contentData.subscribe((value: any) => received.push(value))
      component.getRedirectUrlData({ identifier: 'do_1' })
      expect(received).toEqual([{ identifier: 'do_1' }])
    })
  })

  describe('raiseTelemetry', () => {
    it('should emit the content on the telemetry output', () => {
      const emitSpy = jest.spyOn(component.triggerTelemetry, 'emit')
      component.raiseTelemetry({ identifier: 'do_1' })
      expect(emitSpy).toHaveBeenCalledWith({ identifier: 'do_1' })
    })
  })

  describe('getCbPlanData', () => {
    it('should do nothing when there is no cb plan data stored', () => {
      const clearSpy = jest.spyOn(global, 'clearInterval')
      component.getCbPlanData()
      expect(clearSpy).not.toHaveBeenCalled()
    })

    it('should stop polling once the cb plan data is stored', () => {
      const clearSpy = jest.spyOn(global, 'clearInterval')
      component.cbPlanInterval = 42
      localStorage.setItem('cbpData', JSON.stringify([{ identifier: 'do_1' }]))
      component.getCbPlanData()
      expect(clearSpy).toHaveBeenCalledWith(42)
    })

    it('should stop polling even when the stored cb plan list is empty', () => {
      const clearSpy = jest.spyOn(global, 'clearInterval')
      component.cbPlanInterval = 7
      localStorage.setItem('cbpData', JSON.stringify([]))
      component.getCbPlanData()
      expect(clearSpy).toHaveBeenCalledWith(7)
    })

    it('should stop polling when the stored cb plan data is not a list', () => {
      const clearSpy = jest.spyOn(global, 'clearInterval')
      component.cbPlanInterval = 9
      localStorage.setItem('cbpData', JSON.stringify({ identifier: 'do_1' }))
      component.getCbPlanData()
      expect(clearSpy).toHaveBeenCalledWith(9)
    })

    it('should stop the polling interval started by ngOnInit', () => {
      component.ngOnInit()
      localStorage.setItem('cbpData', JSON.stringify([{ identifier: 'do_1' }]))
      jest.advanceTimersByTime(1000)
      const callsAfterFirstTick = (jest.getTimerCount as any)()
      jest.advanceTimersByTime(5000)
      expect((jest.getTimerCount as any)()).toBe(callsAfterFirstTick)
    })
  })

  describe('getProviderNames', () => {
    it('should join the provider names', () => {
      expect(component.getProviderNames([{ name: 'A' }, { name: 'B' }])).toBe('A, B')
    })

    it('should return an empty string for an empty list', () => {
      expect(component.getProviderNames([])).toBe('')
    })

    it('should return an empty string when the providers are missing', () => {
      expect(component.getProviderNames(null as any)).toBe('')
    })

    it('should tolerate provider entries without a name', () => {
      expect(component.getProviderNames([{ name: 'A' }, null])).toBe('A, ')
    })
  })
})
