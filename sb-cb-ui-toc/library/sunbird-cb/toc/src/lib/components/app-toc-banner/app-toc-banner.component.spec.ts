import { of, Subject, throwError } from 'rxjs'
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatMenuModule } from '@angular/material/menu'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { TranslateModule } from '@ngx-translate/core'
import {
  ConfigurationsService,
  EventService,
  LoggerService,
  MultilingualTranslationsService,
  PipeCountTransformModule,
  PipeLimitToModule,
  PipePartialContentModule,
  PipePublicURLModule,
  UtilityService,
} from '@sunbird-cb/utils-v2'
import { CommonMethodsService } from '@sunbird-cb/consumption'

import { AppTocBannerComponent } from './app-toc-banner.component'
import { AppTocService } from '../../services/app-toc.service'
import { BATCH_LIST_LIMIT, WidgetContentService } from '../../_services/widget-content.service'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { TitleTagService } from '../../services/title-tag.service'
import { ActionService } from '../../services/action.service'
import { UserAutocompleteService } from '../../_collection/_common/user-autocomplete/user-autocomplete.service'
import { TimerService } from '../../services/timer.service'

/**
 * Covers the paginated batch dropdown: when another page is requested, how loaded pages are merged
 * into the batch list, and how scrolling the open panel triggers the next page.
 *
 * The component is built off its prototype rather than through TestBed, so these tests exercise
 * that logic without standing up its full dependency graph.
 */

const COURSE_ID = 'do_1146698403652239361153'

function createBatches(count: number, startIndex = 0): any[] {
  return Array.from({ length: count }, (_value, index) => ({ batchId: `batch_${startIndex + index}` }))
}

function setPanelMetrics(panel: HTMLElement, metrics: { scrollTop?: number, clientHeight: number, scrollHeight: number }) {
  Object.defineProperty(panel, 'scrollTop', { value: metrics.scrollTop || 0, configurable: true })
  Object.defineProperty(panel, 'clientHeight', { value: metrics.clientHeight, configurable: true })
  Object.defineProperty(panel, 'scrollHeight', { value: metrics.scrollHeight, configurable: true })
}

function createComponent(overrides: Record<string, any> = {}): any {
  const component: any = Object.create(AppTocBannerComponent.prototype)
  component.content = { identifier: COURSE_ID }
  component.batchData = { count: 76, content: createBatches(BATCH_LIST_LIMIT) }
  component.batchListLoading = false
  component.allBatchesLoaded = false
  component.logger = { error: jest.fn() }
  component.contentSvc = {
    getCourseBatchesRequest: jest.fn((courseId: string, offset: number) => ({
      request: { filters: { courseId }, sort_by: { createdDate: 'desc' }, offset, limit: BATCH_LIST_LIMIT },
    })),
    fetchCourseBatches: jest.fn(() => of({ count: 76, content: createBatches(BATCH_LIST_LIMIT, BATCH_LIST_LIMIT) })),
  }
  return Object.assign(component, overrides)
}

describe('AppTocBannerComponent', () => {

  describe('hasMoreBatches', () => {

    it('is true while fewer batches are loaded than the total count', () => {
      const component = createComponent()
      expect(component.hasMoreBatches).toBe(true)
    })

    it('is false once every batch in the total count is loaded', () => {
      const component = createComponent({ batchData: { count: 10, content: createBatches(10) } })
      expect(component.hasMoreBatches).toBe(false)
    })

    it('is false when the first page came back shorter than the limit', () => {
      const component = createComponent({ batchData: { count: 76, content: createBatches(4) } })
      expect(component.hasMoreBatches).toBe(false)
    })

    it('falls back to the page size when the response carries no count', () => {
      const component = createComponent({ batchData: { content: createBatches(BATCH_LIST_LIMIT) } })
      expect(component.hasMoreBatches).toBe(true)
    })

    it('is false once the last page has been reached', () => {
      const component = createComponent({ allBatchesLoaded: true })
      expect(component.hasMoreBatches).toBe(false)
    })

    it('is false when there is no batch data', () => {
      const component = createComponent({ batchData: null })
      expect(component.hasMoreBatches).toBe(false)
    })
  })

  describe('fetchMoreBatches', () => {

    it('requests the next page using the loaded batch count as the offset', () => {
      const component = createComponent()

      component.fetchMoreBatches()

      expect(component.contentSvc.getCourseBatchesRequest).toHaveBeenCalledWith(COURSE_ID, BATCH_LIST_LIMIT)
      expect(component.contentSvc.fetchCourseBatches).toHaveBeenCalledWith({
        request: {
          filters: { courseId: COURSE_ID },
          sort_by: { createdDate: 'desc' },
          offset: BATCH_LIST_LIMIT,
          limit: BATCH_LIST_LIMIT,
        },
      })
    })

    it('appends the next page to the loaded batches', () => {
      const component = createComponent()

      component.fetchMoreBatches()

      expect(component.batchData.content.length).toBe(BATCH_LIST_LIMIT * 2)
      expect(component.batchData.content[BATCH_LIST_LIMIT].batchId).toBe(`batch_${BATCH_LIST_LIMIT}`)
      expect(component.batchListLoading).toBe(false)
      expect(component.allBatchesLoaded).toBe(false)
    })

    it('skips batches that are already loaded', () => {
      const component = createComponent()
      component.contentSvc.fetchCourseBatches.mockReturnValue(of({
        count: 76,
        content: [...createBatches(2, 8), ...createBatches(8, BATCH_LIST_LIMIT)],
      }))

      component.fetchMoreBatches()

      const batchIds = component.batchData.content.map((batch: any) => batch.batchId)
      expect(batchIds.length).toBe(18)
      expect(new Set(batchIds).size).toBe(18)
    })

    it('stops paging when a page comes back shorter than the limit', () => {
      const component = createComponent()
      component.contentSvc.fetchCourseBatches.mockReturnValue(of({ count: 76, content: createBatches(6, BATCH_LIST_LIMIT) }))

      component.fetchMoreBatches()

      expect(component.batchData.content.length).toBe(16)
      expect(component.allBatchesLoaded).toBe(true)
    })

    it('stops paging when a page only repeats loaded batches', () => {
      const component = createComponent()
      component.contentSvc.fetchCourseBatches.mockReturnValue(of({ count: 76, content: createBatches(BATCH_LIST_LIMIT) }))

      component.fetchMoreBatches()

      expect(component.batchData.content.length).toBe(BATCH_LIST_LIMIT)
      expect(component.allBatchesLoaded).toBe(true)
    })

    it('does not request a page while one is already loading', () => {
      const component = createComponent({ batchListLoading: true })

      component.fetchMoreBatches()

      expect(component.contentSvc.fetchCourseBatches).not.toHaveBeenCalled()
    })

    it('does not request a page when no more batches remain', () => {
      const component = createComponent({ allBatchesLoaded: true })

      component.fetchMoreBatches()

      expect(component.contentSvc.fetchCourseBatches).not.toHaveBeenCalled()
    })

    it('does not request a page without content', () => {
      const component = createComponent({ content: null })

      component.fetchMoreBatches()

      expect(component.contentSvc.fetchCourseBatches).not.toHaveBeenCalled()
    })

    it('stops paging and logs when the request fails', () => {
      const component = createComponent()
      component.contentSvc.fetchCourseBatches.mockReturnValue(throwError(() => new Error('batch list failed')))

      component.fetchMoreBatches()

      expect(component.batchData.content.length).toBe(BATCH_LIST_LIMIT)
      expect(component.batchListLoading).toBe(false)
      expect(component.allBatchesLoaded).toBe(true)
      expect(component.logger.error).toHaveBeenCalled()
    })

    it('rechecks the open panel once the page is rendered', () => {
      jest.useFakeTimers()
      const component = createComponent()
      const panel = document.createElement('div')
      component.fillBatchPanel = jest.fn()

      component.fetchMoreBatches(panel)
      jest.runAllTimers()

      expect(component.fillBatchPanel).toHaveBeenCalledWith(panel)
      jest.useRealTimers()
    })
  })

  describe('fillBatchPanel', () => {

    it('fetches another page while the panel is too short to scroll', () => {
      const component = createComponent()
      const panel = document.createElement('div')
      setPanelMetrics(panel, { clientHeight: 256, scrollHeight: 120 })
      component.fetchMoreBatches = jest.fn()

      component.fillBatchPanel(panel)

      expect(component.fetchMoreBatches).toHaveBeenCalledWith(panel)
    })

    it('waits for a scroll once the panel overflows', () => {
      const component = createComponent()
      const panel = document.createElement('div')
      setPanelMetrics(panel, { clientHeight: 256, scrollHeight: 600 })
      component.fetchMoreBatches = jest.fn()

      component.fillBatchPanel(panel)

      expect(component.fetchMoreBatches).not.toHaveBeenCalled()
    })
  })

  describe('onBatchDropdownToggle', () => {
    const SELECT_ID = 'mat-select-batch'
    let panel: HTMLElement

    beforeEach(() => {
      jest.useFakeTimers()
      panel = document.createElement('div')
      panel.id = `${SELECT_ID}-panel`
      document.body.appendChild(panel)
    })

    afterEach(() => {
      panel.remove()
      jest.useRealTimers()
    })

    it('fills the rendered panel when the dropdown opens', () => {
      const component = createComponent()
      component.fillBatchPanel = jest.fn()

      component.onBatchDropdownToggle(true, { id: SELECT_ID })
      jest.runAllTimers()

      expect(component.fillBatchPanel).toHaveBeenCalledWith(panel)
    })

    it('fetches the next page when the panel is scrolled near the bottom', () => {
      const component = createComponent()
      component.fillBatchPanel = jest.fn()
      component.fetchMoreBatches = jest.fn()

      component.onBatchDropdownToggle(true, { id: SELECT_ID })
      jest.runAllTimers()
      setPanelMetrics(panel, { scrollTop: 320, clientHeight: 256, scrollHeight: 600 })
      panel.dispatchEvent(new Event('scroll'))

      expect(component.fetchMoreBatches).toHaveBeenCalledWith(panel)
    })

    it('does not fetch while the panel is scrolled away from the bottom', () => {
      const component = createComponent()
      component.fillBatchPanel = jest.fn()
      component.fetchMoreBatches = jest.fn()

      component.onBatchDropdownToggle(true, { id: SELECT_ID })
      jest.runAllTimers()
      setPanelMetrics(panel, { scrollTop: 100, clientHeight: 256, scrollHeight: 600 })
      panel.dispatchEvent(new Event('scroll'))

      expect(component.fetchMoreBatches).not.toHaveBeenCalled()
    })

    it('ignores the dropdown closing', () => {
      const component = createComponent()
      component.fillBatchPanel = jest.fn()

      component.onBatchDropdownToggle(false, { id: SELECT_ID })
      jest.runAllTimers()

      expect(component.fillBatchPanel).not.toHaveBeenCalled()
    })

    it('does nothing when the panel is not rendered', () => {
      const component = createComponent()
      component.fillBatchPanel = jest.fn()

      component.onBatchDropdownToggle(true, { id: 'mat-select-missing' })
      jest.runAllTimers()

      expect(component.fillBatchPanel).not.toHaveBeenCalled()
    })
  })

  describe('ngOnChanges', () => {

    function createChangeableComponent(): any {
      return createComponent({
        content: null,
        resumeData: null,
        allBatchesLoaded: true,
        router: { url: '/app/toc/do_1/overview' },
        batchControl: { valueChanges: of() },
        assignPathAndUpdateBanner: jest.fn(),
      })
    }

    it('resumes paging when a new batch list arrives', () => {
      const component = createChangeableComponent()

      component.ngOnChanges({ batchData: {} })

      expect(component.allBatchesLoaded).toBe(false)
    })

    it('keeps the paging state when other inputs change', () => {
      const component = createChangeableComponent()

      component.ngOnChanges({ resumeData: {} })

      expect(component.allBatchesLoaded).toBe(true)
    })
  })

  describe('TestBed', () => {
    let component: AppTocBannerComponent
    let fixture: ComponentFixture<AppTocBannerComponent>
    let tocSvcMock: any

    beforeEach(waitForAsync(() => {
      tocSvcMock = {
        serverDate: new Subject<any>(),
        setWFDataSubject: new Subject<any>(),
        getSelectedBatch: new Subject<any>(),
        analyticsFetchStatus: 'none',
      }
      TestBed.configureTestingModule({
        declarations: [AppTocBannerComponent],
        imports: [
          TranslateModule.forRoot(),
          ReactiveFormsModule,
          MatMenuModule,
          MatAutocompleteModule,
          PipeCountTransformModule,
          PipeLimitToModule,
          PipePartialContentModule,
          PipePublicURLModule,
        ],
        providers: [
          DatePipe,
          { provide: Router, useValue: { events: new Subject(), url: '/app/toc/do_1/overview', navigate: jest.fn() } },
          {
            provide: ActivatedRoute,
            useValue: { data: of({ pageData: { data: {} } }), queryParamMap: of(convertToParamMap({})) },
          },
          { provide: MatDialog, useValue: { open: jest.fn() } },
          { provide: AppTocService, useValue: tocSvcMock },
          { provide: WidgetContentService, useValue: {} },
          { provide: UtilityService, useValue: { isMobile: false } },
          { provide: MobileAppsService, useValue: {} },
          { provide: MatSnackBar, useValue: { open: jest.fn() } },
          { provide: ConfigurationsService, useValue: { restrictedFeatures: new Set(['goals']) } },
          { provide: TitleTagService, useValue: {} },
          { provide: ActionService, useValue: {} },
          { provide: LoggerService, useValue: { log: jest.fn(), error: jest.fn() } },
          { provide: UserAutocompleteService, useValue: { searchUser: jest.fn().mockReturnValue(of({})) } },
          { provide: EventService, useValue: { raiseInteractTelemetry: jest.fn() } },
          {
            provide: MultilingualTranslationsService,
            useValue: { languageSelectedObservable: of(), translateLabel: jest.fn(), translateActualLabel: jest.fn() },
          },
          { provide: TimerService, useValue: {} },
          { provide: CommonMethodsService, useValue: {} },
          { provide: 'environment', useValue: { helpEmail: 'help@example.com' } },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents()
    }))

    beforeEach(() => {
      fixture = TestBed.createComponent(AppTocBannerComponent)
      component = fixture.componentInstance
      // ngOnChanges is normally triggered by the parent's input bindings
      component.ngOnChanges({})
      fixture.detectChanges()
    })

    it('should create', () => {
      expect(component).toBeTruthy()
      expect(component.helpEmail).toBe('help@example.com')
    })

    it('should read restricted features and route page data on init', () => {
      expect(component.isGoalsEnabled).toBe(false)
      expect(component.tocConfig).toEqual({})
    })

    it('should return star rating icons based on the average rating', () => {
      component.content = { averageRating: 3.5 } as any
      expect(component.getRatingIcon(3)).toBe('star')
      expect(component.getRatingIcon(4)).toBe('star_half')
      expect(component.getRatingIcon(5)).toBe('star_border')
    })

    it('should reset analytics status on destroy', () => {
      tocSvcMock.analyticsFetchStatus = 'done'
      fixture.destroy()
      expect(tocSvcMock.analyticsFetchStatus).toBe('none')
    })
  })
})
