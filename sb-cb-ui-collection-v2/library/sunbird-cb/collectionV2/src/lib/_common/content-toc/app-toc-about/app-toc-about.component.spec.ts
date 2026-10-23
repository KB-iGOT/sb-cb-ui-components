(window as any)['env'] = {
  name: 'test-environment',
  sitePath: '/test-site-path',
  karmYogiPath: '/test-karm-yogi-path',
  cbpPath: '/test-cbp-path'
}


import { Subject } from 'rxjs'
import { AppTocAboutComponent } from './app-toc-about.component'

describe('AppTocAboutComponent', () => {
  let component: AppTocAboutComponent
  let mockRatingService: any
  let mockLoggerService: any
  let mockTimerService: any
  let mockDialog: any
  let mockMatSnackBar: any
  let mockLoadCheckService: any
  let mockTocSvc: any
  let mockConfigService: any
  let mockRouter: any
  let mockReviewDataService: any
  let mockHandleClaimService: any
  let mockResetRatingsService: any
  let mockContentSvc: any

  beforeEach(() => {
    // Create mock services
    mockRatingService = {
      getRatingSummary: jasmine.createSpy('getRatingSummary'),
      getRatingLookup: jasmine.createSpy('getRatingLookup'),
      getRatingReply: jasmine.createSpy('getRatingReply'),
    }

    mockLoggerService = {
      error: jasmine.createSpy('error'),
    }

    mockTimerService = {
      getTimerData: jasmine.createSpy('getTimerData').and.returnValue(new Subject()),
    }

    mockDialog = {
      open: jasmine.createSpy('open'),
    }

    mockMatSnackBar = {
      open: jasmine.createSpy('open'),
    }

    mockLoadCheckService = {
      componentLoaded: jasmine.createSpy('componentLoaded'),
    }

    mockTocSvc = {
      getTocStructure: jasmine.createSpy('getTocStructure'),
    }

    mockConfigService = {
      compentency: {},
    }

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    }

    mockReviewDataService = {
      setReviewData: jasmine.createSpy('setReviewData'),
    }

    mockHandleClaimService = {
      setClaimData: jasmine.createSpy('setClaimData'),
    }

    mockResetRatingsService = {
      resetRatings$: new Subject(),
    }

    mockContentSvc = {
      downloadCert: jasmine.createSpy('downloadCert'),
    }

    // Initialize component
    component = new AppTocAboutComponent(
      mockRatingService,
      mockLoggerService,
      mockDialog,
      mockMatSnackBar,
      mockLoadCheckService,
      mockTimerService,
      mockTocSvc,
      mockConfigService,
      mockRouter,
      mockReviewDataService,
      mockHandleClaimService,
      mockResetRatingsService,
      mockContentSvc
    )

    // Initialize default component properties
    component['destroySubject$'] = new Subject()
    component.timerUnsubscribe = new Subject()

  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {


    it('should set isMobile to false when window width > 1200', () => {
      window.innerWidth = 1300
      component.ngOnInit()
      expect(component.isMobile).toBeFalsy()
    })

  })


  describe('processRatingSummary', () => {
    it('should correctly calculate average rating', () => {
      component.ratingSummary = {
        total_number_of_ratings: 10,
        sum_of_total_ratings: 40,
        totalcount1stars: 1,
        totalcount2stars: 1,
        totalcount3stars: 2,
        totalcount4stars: 3,
        totalcount5stars: 3,
      }

      const result = component.processRatingSummary()

      expect(result.avgRating).toBe(4.0)
      expect(result.total_number_of_ratings).toBe(10)
    })
  })

  describe('handleClickOfClaim', () => {
    it('should call handleClaimService with event data', () => {
      const mockEvent = { data: 'test' }

      component.handleClickOfClaim(mockEvent)

      expect(mockHandleClaimService.setClaimData).toHaveBeenCalledWith(mockEvent)
    })
  })

  describe('navigateToDiscussionHub', () => {
    it('should navigate to discussion forum with correct params', () => {
      component.navigateToDiscussionHub()

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum'],
        jasmine.any(Object)
      )
    })
  })

  describe('handleOpenCertificateDialog', () => {


    it('should open dialog directly if certData is present', () => {

      component.handleOpenCertificateDialog()

      expect(mockContentSvc.downloadCert).not.toHaveBeenCalled()
      expect(mockDialog.open).toHaveBeenCalled()
    })
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from observables', () => {
      const destroySpy = spyOn(component['destroySubject$'], 'unsubscribe')
      const timerUnsubSpy = spyOn(component.timerUnsubscribe, 'unsubscribe')

      component.ngOnDestroy()

      expect(destroySpy).toHaveBeenCalled()
      expect(timerUnsubSpy).toHaveBeenCalled()
    })
  })
})