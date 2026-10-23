import { of, Subject } from 'rxjs'
import { FormBuilder } from '@angular/forms'
import { PlayerSurveyComponent } from './player-survey.component'
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { EventService, ConfigurationsService, WsEvents } from '@sunbird-cb/utils-v2'
import { ViewerUtilService } from '../_services/viewer-util.service'
import { ViewerDataService } from '../_services/viewer-data.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('PlayerSurveyComponent', () => {
  let component: PlayerSurveyComponent
  let mockActivatedRoute: Partial<ActivatedRoute>
  let mockEventService: any
  let mockViewerService: any
  let mockSnackBar: any
  let mockViewerDataService: any
  let mockConfigService: any
  let mockWidgetService: any

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          collectionId: 'test-collection',
          batchId: 'test-batch'
        },
        data: {
          content: {
            data: {
              identifier: 'test-identifier'
            }
          }
        },
        params: {
          resourceId: 'test-resource'
        },
        url: [],
        fragment: '',
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
      params: of({
        resourceId: 'test-resource'
      })
    } as any

    mockEventService = {
      dispatchEvent: jasmine.createSpy('dispatchEvent')
    }

    mockViewerService = {
      getBatchIdAndCourseId: jasmine.createSpy('getBatchIdAndCourseId').and.returnValue({
        batchId: 'test-batch',
        courseId: 'test-course'
      }),
      realTimeProgressUpdateQuiz: jasmine.createSpy('realTimeProgressUpdateQuiz'),
      getFormById: jasmine.createSpy('getFormById').and.returnValue(of({}))
    }

    mockSnackBar = {
      open: jasmine.createSpy('open')
    }

    mockViewerDataService = {
      resourceId: 'test-resource',
      changedSubject: new Subject()
    }

    mockConfigService = {
      userProfile: {
        userId: 'test-user'
      }
    }

    mockWidgetService = {
      fetchContentHistoryV2: jasmine.createSpy('fetchContentHistoryV2').and.returnValue(of({
        result: {
          contentList: [{
            contentId: 'test-resource',
            status: 'completed'
          }]
        }
      })),
      setProgramChildResumeData: jasmine.createSpy('setProgramChildResumeData')
    }

    component = new PlayerSurveyComponent(
      mockActivatedRoute as any,
      mockEventService as EventService,
      mockViewerService as ViewerUtilService,
      mockSnackBar as MatSnackBar,
      mockViewerDataService as ViewerDataService,
      mockConfigService as ConfigurationsService,
      mockWidgetService as WidgetContentService,
      new FormBuilder(),
    )

    component.widgetData = {
      surveyUrl: 'test-url/surveys/test-survey',
      collectionId: 'test-collection',
      courseName: 'Test Course',
      progressStatus: 1,
      identifier: 'test-identifier',
      contentType: 'Resource',
      disableTelemetry: false
    } as any
  })

  it('should create component', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should initialize component with widget data', () => {
      component.ngOnInit()
      expect(component.courseId).toBe('test-collection')
      expect(component.courseName).toBe('Test Course')
      expect(component.surveyId).toBe('test-survey')
    })

    it('should setup API data correctly', () => {
      component.ngOnInit()
      expect(component.apiData).toBeTruthy()
      expect(component.apiData?.getAPI).toContain('test-survey')
    })

    it('should not dispatch events when telemetry is disabled', () => {
      component.widgetData.disableTelemetry = true
      component.ngOnInit()
      expect(mockEventService.dispatchEvent).not.toHaveBeenCalled()
    })

    it('should subscribe to viewer data service changes', () => {
      component.ngOnInit()
      mockViewerDataService.changedSubject.next(true)
      expect(component.resourceId).toBe('test-resource')
    })
  })

  describe('checkAfterSubmit', () => {
    it('should update progress and show success message', () => {
      const updateProgressSpy = spyOn(component, 'updateProgress')
      component.checkAfterSubmit({})
      expect(updateProgressSpy).toHaveBeenCalledWith(2)
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Survey is submitted successfully',
        'X',
        jasmine.any(Object)
      )
    })
  })

  describe('updateProgress', () => {
    it('should call realTimeProgressUpdateQuiz with correct params', () => {
      component.updateProgress(2)
      expect(mockViewerService.realTimeProgressUpdateQuiz).toHaveBeenCalledWith(
        'test-identifier',
        'test-course',
        'test-batch',
        2
      )
    })
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from viewer data service', () => {
      const mockSubscription = {
        unsubscribe: jasmine.createSpy('unsubscribe')
      }
      component.viewerDataServiceSubscription = mockSubscription as any
      component.ngOnDestroy()
      expect(mockSubscription.unsubscribe).toHaveBeenCalled()
    })
  })

  describe('eventDispatcher', () => {
    it('should not dispatch event when telemetry is disabled', () => {
      component.widgetData.disableTelemetry = true
      component['eventDispatcher'](WsEvents.EnumTelemetrySubType.Init)
      expect(mockEventService.dispatchEvent).not.toHaveBeenCalled()
    })

    it('should dispatch event with correct structure', () => {
      component.enableTelemetry = true
      component['eventDispatcher'](WsEvents.EnumTelemetrySubType.Init)
      expect(mockEventService.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          eventType: WsEvents.WsEventType.Telemetry,
          data: jasmine.objectContaining({
            eventSubType: WsEvents.EnumTelemetrySubType.Init
          })
        })
      )
    })
  })
})
