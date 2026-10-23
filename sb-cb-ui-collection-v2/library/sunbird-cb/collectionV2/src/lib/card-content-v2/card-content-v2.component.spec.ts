(window as any)['env'] = {
  name: 'test-environment',
  sitePath: '/test-site-path',
  karmYogiPath: '/test-karm-yogi-path',
  cbpPath: '/test-cbp-path'
}

import { CardContentV2Component } from './card-content-v2.component'
import { WsEvents } from '@sunbird-cb/utils-v2'
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { of, Subject } from 'rxjs'

describe('CardContentV2Component', () => {
  let component: CardContentV2Component
  let mockEventService: any
  let mockConfigService: any
  let mockUtilityService: any
  let mockSnackBar: any
  let mockRouter: any
  let mockActivatedRoute: Partial<ActivatedRoute>
  let mockContentService: any

  beforeEach(() => {
    mockEventService = {
      raiseInteractTelemetry: jasmine.createSpy('raiseInteractTelemetry'),
    }

    mockConfigService = {
      isIntranetAllowed: false,
      instanceConfig: {
        logos: {
          defaultContent: 'default-thumbnail.jpg',
          defaultSourceLogo: 'default-logo.jpg',
        },
        sources: [],
      },
      prefChangeNotifier: new Subject(),
    } as any

    mockUtilityService = {
      isMobile: true,
    } as any

    mockSnackBar = {
      open: jasmine.createSpy('open'),
    }

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    }

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
        url: [],
        params: {},
        fragment: '',
        data: {},
        outlet: '',
        component: '',
        routeConfig: undefined,
        root: new ActivatedRouteSnapshot,
        parent: new ActivatedRouteSnapshot,
        firstChild: new ActivatedRouteSnapshot,
        children: [],
        pathFromRoot: [],
        paramMap: undefined,
        queryParamMap: undefined
      },
    } as any

    mockContentService = {
      getResourseLink: jasmine.createSpy('getResourseLink'),
    }

    component = new CardContentV2Component(
      mockEventService,
      mockConfigService,
      mockUtilityService,
      mockSnackBar,
      mockRouter,
      mockActivatedRoute as ActivatedRoute,
      mockContentService,
      {} as any,
      { watchPlanMap: jasmine.createSpy('watchPlanMap').and.returnValue(of({})) } as any,
      {}
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.widgetData = {
        content: {
          identifier: 'test-id',
          name: 'Test Content',
          contentType: 'Resource',
          primaryCategory: 'Learning Resource',
          mimeType: 'application/pdf',
        },
      } as any
    })

    it('should initialize default values', () => {
      component.ngOnInit()

      expect(component.isIntranetAllowedSettings).toBe(false)
      expect(component.defaultThumbnail).toBe('default-thumbnail.jpg')
      expect(component.defaultSLogo).toBe('default-logo.jpg')
    })

    it('should set up playlist and goals config', () => {
      component.ngOnInit()

      expect(component.btnPlaylistConfig).toEqual({
        contentId: 'test-id',
        contentName: 'Test Content',
        contentType: 'Resource',
        primaryCategory: 'Learning Resource',
        mode: 'dialog',
      })

      expect(component.btnGoalsConfig).toEqual({
        contentId: 'test-id',
        contentName: 'Test Content',
        contentType: 'Resource',
        primaryCategory: 'Learning Resource',
      })
    })
  })



  describe('getRedirectUrlData', () => {
    const mockContent = {
      identifier: 'test-id',
      primaryCategory: 'Resource',
      mimeType: 'application/pdf',
    }

    it('should navigate to player for resource content', async () => {
      await component.getRedirectUrlData(mockContent, true)

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/amrit-gyaan-kosh/player/pdf/test-id'],
        {
          queryParams: {
            primaryCategory: 'Learning Resource',
            ...mockActivatedRoute.snapshot?.queryParams,
          },
        }
      )
    })

    it('should handle content service response for non-resource content', async () => {
      mockContentService.getResourseLink.and.resolveTo({
        url: '/test-url',
        queryParams: { test: 'param' },
      })

      await component.getRedirectUrlData(mockContent, false)

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/test-url'],
        {
          queryParams: { test: 'param' },
        }
      )
    })

    it('should show snackbar when content is archived', async () => {
      mockContentService.getResourseLink.and.resolveTo(null)

      await component.getRedirectUrlData(mockContent, false)

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'This Resource has been archived and is no longer available.',
        'X',
        { duration: 2000 }
      )
    })
  })

  describe('showSnackbar', () => {
    it('should show intranet content message', () => {
      component.widgetData = {
        content: {
          isInIntranet: true,
          status: 'Live',
        },
      } as any

      component.showSnackbar()

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Content is only available in intranet',
        'X',
        { duration: 2000 }
      )
    })

    it('should show expired content message', () => {
      component.widgetData = {
        content: {
          status: 'Expired',
          isInIntranet: false,
        },
      } as any

      component.showSnackbar()

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Content may be expired or deleted',
        'X',
        { duration: 2000 }
      )
    })
  })

  describe('downloadCertificate', () => {
    it('should raise telemetry event for certificate download', () => {
      const certificateData = {
        issuedCertificates: [{ identifier: 'cert-id' }],
      }

      component.downloadCertificate(certificateData)

      expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          id: 'view-certificate',
          subType: WsEvents.EnumInteractSubTypes.CERTIFICATE,
        },
        {
          id: 'cert-id',
          type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
        }
      )
    })
  })
})