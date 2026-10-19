import { of } from 'rxjs'
import { AppTocHomeV2Component } from './app-toc-home-v2.component'

/**
 * Covers the comprehensive assessment call-to-action: whether the page shows Locked or Enroll,
 * and what the attempts line reports.
 *
 * The component is built off its prototype rather than through TestBed, so these tests exercise
 * that logic without standing up its full dependency graph.
 */

const CA_CATEGORY = 'Comprehensive Assessment'

const NO_ATTEMPTS = { attemptsMade: 0, attemptsAllowed: 0, attemptsRemaining: 0, isAttempted: false }

/** Lets the promise callbacks inside loadComprehensiveAssessmentStatus() run. */
function flushPromises(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, 0))
}

function createComponent(overrides: Record<string, any> = {}): any {
  const component: any = Object.create(AppTocHomeV2Component.prototype)
  component.comprehensiveAssessmentCategory = CA_CATEGORY
  component.isAllCoursesCompleted = false
  component.assessmentAttempts = { ...NO_ATTEMPTS }
  component.content = null
  component.contentReadData = null
  component.loggerSvc = { warn: jest.fn(), error: jest.fn() }
  component.comprehensiveAssessmentSvc = {
    getUnlockStatus: jest.fn(() => Promise.resolve({
      courses: [], pendingCourses: [], isAllCoursesCompleted: false,
    })),
    getAttemptStatus: jest.fn(() => Promise.resolve({ ...NO_ATTEMPTS })),
  }
  return Object.assign(component, overrides)
}

describe('AppTocHomeV2Component', () => {

  describe('isComprehensiveAssessment', () => {

    it('is true when the content read is a comprehensive assessment', () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })
      expect(component.isComprehensiveAssessment).toBe(true)
    })

    it('is true when only the content carries the category', () => {
      const component = createComponent({ content: { courseCategory: CA_CATEGORY } })
      expect(component.isComprehensiveAssessment).toBe(true)
    })

    it('is false for any other course category', () => {
      const component = createComponent({ contentReadData: { courseCategory: 'Course' } })
      expect(component.isComprehensiveAssessment).toBe(false)
    })
  })

  describe('isAssessmentLocked', () => {

    it('locks a comprehensive assessment while courses are outstanding', () => {
      const component = createComponent({
        contentReadData: { courseCategory: CA_CATEGORY },
        isAllCoursesCompleted: false,
      })
      expect(component.isAssessmentLocked).toBe(true)
    })

    it('unlocks once every mandatory course is completed', () => {
      const component = createComponent({
        contentReadData: { courseCategory: CA_CATEGORY },
        isAllCoursesCompleted: true,
      })
      expect(component.isAssessmentLocked).toBe(false)
    })

    it('never locks content that is not a comprehensive assessment', () => {
      const component = createComponent({
        contentReadData: { courseCategory: 'Course' },
        isAllCoursesCompleted: false,
      })
      expect(component.isAssessmentLocked).toBe(false)
    })
  })

  describe('attempts', () => {

    it('reports the remaining attempts and the attempted state', () => {
      const component = createComponent({
        assessmentAttempts: { attemptsMade: 1, attemptsAllowed: 3, attemptsRemaining: 2, isAttempted: true },
      })

      expect(component.isAssessmentAttempted).toBe(true)
      expect(component.assessmentAttemptsRemaining).toBe(2)
      expect(component.totalAssessmentAttempts).toBe(3)
    })

    it('falls back to the authored attempt count when the API supplied none', () => {
      const component = createComponent({
        contentReadData: { maxAssessmentRetakeAttempts: 5 },
        assessmentAttempts: { ...NO_ATTEMPTS },
      })

      expect(component.totalAssessmentAttempts).toBe(5)
    })

    it('reports zero when neither the API nor the author supplied a total', () => {
      const component = createComponent({ contentReadData: {} })
      expect(component.totalAssessmentAttempts).toBe(0)
    })
  })

  describe('loadComprehensiveAssessmentStatus', () => {

    it('does nothing for content that is not a comprehensive assessment', async () => {
      const component = createComponent({ contentReadData: { courseCategory: 'Course' } })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.comprehensiveAssessmentSvc.getUnlockStatus).not.toHaveBeenCalled()
      expect(component.comprehensiveAssessmentSvc.getAttemptStatus).not.toHaveBeenCalled()
    })

    it('unlocks the call-to-action when the service reports every course complete', async () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })
      component.comprehensiveAssessmentSvc.getUnlockStatus.mockResolvedValue({
        courses: [], pendingCourses: [], isAllCoursesCompleted: true,
      })

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.isAllCoursesCompleted).toBe(true)
      expect(component.isAssessmentLocked).toBe(false)
    })

    it('keeps the assessment locked when the unlock lookup fails', async () => {
      const component = createComponent({
        contentReadData: { courseCategory: CA_CATEGORY },
        isAllCoursesCompleted: true,
      })
      component.comprehensiveAssessmentSvc.getUnlockStatus.mockRejectedValue(new Error('lookup failed'))

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.isAllCoursesCompleted).toBe(false)
      expect(component.isAssessmentLocked).toBe(true)
      expect(component.loggerSvc.warn).toHaveBeenCalled()
    })

    it('stores the attempts the service resolves', async () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })
      const attempts = { attemptsMade: 2, attemptsAllowed: 3, attemptsRemaining: 1, isAttempted: true }
      component.comprehensiveAssessmentSvc.getAttemptStatus.mockResolvedValue(attempts)

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.assessmentAttempts).toEqual(attempts)
      expect(component.assessmentAttemptsRemaining).toBe(1)
    })

    it('leaves the attempts untouched when the retake lookup fails', async () => {
      const component = createComponent({ contentReadData: { courseCategory: CA_CATEGORY } })
      component.comprehensiveAssessmentSvc.getAttemptStatus.mockRejectedValue(new Error('retake failed'))

      component['loadComprehensiveAssessmentStatus']()
      await flushPromises()

      expect(component.assessmentAttempts).toEqual(NO_ATTEMPTS)
      expect(component.loggerSvc.warn).toHaveBeenCalled()
    })
  })

  describe('fetchBatchDetails', () => {
    const COURSE_ID = 'do_1146698403652239361153'

    function createBatchComponent(): any {
      return createComponent({
        content: { identifier: COURSE_ID },
        primaryCategory: { BLENDED_PROGRAM: 'Blended Program' },
        contentSvc: {
          getCourseBatchesRequest: jest.fn((courseId: string) => ({
            request: { filters: { courseId }, sort_by: { createdDate: 'desc' }, offset: 0, limit: 10 },
          })),
          fetchCourseBatches: jest.fn(() => of({ count: 76, content: [{ batchId: 'batch_0' }] })),
        },
        tocSvc: { setBatchData: jest.fn() },
        routerChangeHandler: jest.fn(),
      })
    }

    it('requests the first page of batches for the content', () => {
      const component = createBatchComponent()

      component.fetchBatchDetails()

      expect(component.contentSvc.getCourseBatchesRequest).toHaveBeenCalledWith(COURSE_ID)
      expect(component.contentSvc.fetchCourseBatches).toHaveBeenCalledWith({
        request: { filters: { courseId: COURSE_ID }, sort_by: { createdDate: 'desc' }, offset: 0, limit: 10 },
      })
    })

    it('keeps the total count so the banner can page through the rest', () => {
      const component = createBatchComponent()

      component.fetchBatchDetails()

      expect(component.batchData).toEqual({ count: 76, content: [{ batchId: 'batch_0' }], enrolled: false })
      expect(component.tocSvc.setBatchData).toHaveBeenCalledWith(component.batchData)
    })

    it('does not request batches without content', () => {
      const component = createBatchComponent()
      component.content = null

      component.fetchBatchDetails()

      expect(component.contentSvc.fetchCourseBatches).not.toHaveBeenCalled()
    })
  })

  describe('fetchBlendedProgramBatchDetails', () => {
    const COURSE_ID = 'do_11467506207798886418'
    const BATCH_LIST = { count: 12, content: [{ batchId: 'batch_0' }, { batchId: 'batch_1' }] }
    const WF_BATCH = { batchId: 'batch_wf', enrollmentEndDate: '2099-12-31' }

    function wfItem(currentStatus: string, lastUpdatedOn = 1792084723975, applicationId = 'batch_wf') {
      return { wfId: `wf_${lastUpdatedOn}`, applicationId, currentStatus, lastUpdatedOn }
    }

    function createBlendedComponent(wfData: any[] = [], batch: any = WF_BATCH): any {
      return createComponent({
        content: { identifier: COURSE_ID },
        primaryCategory: { BLENDED_PROGRAM: 'Blended Program' },
        WFBlendedProgramStatus: { APPROVED: 'APPROVED' },
        blendedReRequestStatuses: ['REJECTED', 'WITHDRAWN', 'REMOVED'],
        serverDate: '2026-10-17',
        contentSvc: {
          fetchBlendedWFDetails: jest.fn(() => Promise.resolve({ result: { data: wfData } })),
          fetchCourseBatch: jest.fn(() => of({ result: { response: batch } })),
          getCourseBatchesRequest: jest.fn(() => ({})),
          fetchCourseBatches: jest.fn(() => of({ ...BATCH_LIST, content: [...BATCH_LIST.content] })),
        },
        tocSvc: { setBatchData: jest.fn(), setWFData: jest.fn() },
        routerChangeHandler: jest.fn(),
      })
    }

    it('looks up the workflow by content id', async () => {
      const component = createBlendedComponent()

      await component.fetchBlendedProgramBatchDetails()

      expect(component.contentSvc.fetchBlendedWFDetails).toHaveBeenCalledWith(COURSE_ID)
    })

    it('lists batches when the user has no workflow', async () => {
      const component = createBlendedComponent()

      await component.fetchBlendedProgramBatchDetails()

      expect(component.contentSvc.fetchCourseBatch).not.toHaveBeenCalled()
      expect(component.contentSvc.fetchCourseBatches).toHaveBeenCalled()
      expect(component.batchData.workFlow).toBeUndefined()
    })

    it('reads only the requested batch while the request is pending', async () => {
      const latest = wfItem('ENROLL_IS_IN_PROGRESS', 2)
      const component = createBlendedComponent([wfItem('WITHDRAWN', 1, 'batch_0'), latest])

      await component.fetchBlendedProgramBatchDetails()

      expect(component.contentSvc.fetchCourseBatch).toHaveBeenCalledWith('batch_wf')
      expect(component.contentSvc.fetchCourseBatches).not.toHaveBeenCalled()
      expect(component.batchData).toEqual({
        content: [WF_BATCH],
        count: 1,
        enrolled: false,
        workFlow: { wfInitiated: true, batch: WF_BATCH, wfItem: latest },
      })
      expect(component.tocSvc.setBatchData).toHaveBeenCalledWith(component.batchData)
    })

    it('falls back to the batch list when the pending request batch has expired', async () => {
      const component = createBlendedComponent(
        [wfItem('ENROLL_IS_IN_PROGRESS')],
        { batchId: 'batch_wf', enrollmentEndDate: '2026-10-01' },
      )

      await component.fetchBlendedProgramBatchDetails()

      expect(component.contentSvc.fetchCourseBatches).toHaveBeenCalled()
      expect(component.batchData.workFlow).toBeUndefined()
    })

    it('keeps showing an approved request even after the enrollment window closes', async () => {
      const component = createBlendedComponent(
        [wfItem('APPROVED')],
        { batchId: 'batch_wf', enrollmentEndDate: '2026-10-01' },
      )

      await component.fetchBlendedProgramBatchDetails()

      expect(component.contentSvc.fetchCourseBatches).not.toHaveBeenCalled()
      expect(component.batchData.workFlow.wfItem.currentStatus).toBe('APPROVED')
    })

    it('lists batches with the workflow attached when the request can be raised again', async () => {
      const rejected = wfItem('REJECTED', 1, 'batch_1')
      const component = createBlendedComponent([rejected])

      await component.fetchBlendedProgramBatchDetails()

      expect(component.contentSvc.fetchCourseBatch).not.toHaveBeenCalled()
      expect(component.batchData.workFlow).toEqual({ wfInitiated: true, batch: { batchId: 'batch_1' }, wfItem: rejected })
    })

    it('lists batches when the workflow lookup fails', async () => {
      const component = createBlendedComponent()
      component.contentSvc.fetchBlendedWFDetails.mockRejectedValue(new Error('wf failed'))

      await component.fetchBlendedProgramBatchDetails()

      expect(component.loggerSvc.error).toHaveBeenCalled()
      expect(component.contentSvc.fetchCourseBatches).toHaveBeenCalled()
    })
  })

  describe('APAR karma points', () => {
    const COURSE_ID = 'do_11450212340987654321'
    const KARMA_POINTS = [
      { displayButton: 'Enroll', points: '5', textAfterIcon: 'firstEnroll', toolTipText: 'firstEnrollTip' },
      { displayButton: 'Resume', points: '5', textAfterIcon: 'byCompleting', toolTipText: 'courseCompleteTip' },
      { displayButton: 'Rate this course', points: '2', textAfterIcon: 'rateThis', toolTipText: 'rateTip' },
      { displayButton: 'Take Assessment', points: '5', textAfterIcon: '', toolTipText: 'assessmentTip' },
    ]
    const APAR_COMPLETION = { points: '10', textAfterIcon: 'byCompleting', toolTipText: 'aparCourseCompleteTip' }

    describe('isCourseInAparPlan', () => {

      function createAparComponent(entries: any[]): any {
        return createComponent({ readCbpPlanCache: jest.fn(() => Promise.resolve(entries)) })
      }

      it('finds the course in a cached APAR plan', async () => {
        const component = createAparComponent([
          { aparPlanList: [{ contentList: [{ identifier: 'do_other' }, { identifier: COURSE_ID }] }], cbpPlanList: [] },
        ])

        expect(await component['isCourseInAparPlan'](COURSE_ID)).toBe(true)
      })

      it('finds the course flagged isApar in the older cache format', async () => {
        const component = createAparComponent([{ data: [{ identifier: COURSE_ID, isApar: true }] }])

        expect(await component['isCourseInAparPlan'](COURSE_ID)).toBe(true)
      })

      it('is false for a course that is only in a non-APAR plan', async () => {
        const component = createAparComponent([
          { aparPlanList: [], cbpPlanList: [{ contentList: [{ identifier: COURSE_ID }] }] },
          { data: [{ identifier: COURSE_ID, isApar: false }] },
        ])

        expect(await component['isCourseInAparPlan'](COURSE_ID)).toBe(false)
      })

      it('ignores cache entries in an unexpected shape', async () => {
        const component = createAparComponent([null, { aparPlanList: {} }, { data: 'x' }, { aparPlanList: [{ contentList: null }] }])

        expect(await component['isCourseInAparPlan'](COURSE_ID)).toBe(false)
      })

      it('does not read the cache without a course id', async () => {
        const component = createAparComponent([{ data: [{ identifier: '', isApar: true }] }])

        expect(await component['isCourseInAparPlan']('')).toBe(false)
        expect(component.readCbpPlanCache).not.toHaveBeenCalled()
      })
    })

    describe('readCbpPlanCache', () => {
      const scope: any = globalThis
      const originalIndexedDb = scope.indexedDB

      beforeEach(() => jest.useFakeTimers())

      afterEach(() => {
        scope.indexedDB = originalIndexedDb
        jest.useRealTimers()
      })

      /** indexedDB.open() double; its callbacks fire on a later microtask, as a real open's would. */
      function stubIndexedDb(outcome: 'success' | 'error' | 'newDatabase' | 'pending', db?: any): any {
        const request: any = { result: db, transaction: { abort: jest.fn() } }
        const open = jest.fn(() => {
          Promise.resolve().then(() => {
            if (outcome === 'success') {
              request.onsuccess()
            } else if (outcome === 'newDatabase') {
              request.onupgradeneeded()
              request.onerror()
            } else if (outcome === 'error') {
              request.onerror()
            }
          })
          return request
        })
        scope.indexedDB = { open }
        return { open, request }
      }

      /** A database whose cbpPlans store holds `entries`; without them the store does not exist. */
      function createDb(entries?: any[]): any {
        return {
          close: jest.fn(),
          transaction: jest.fn(() => {
            if (!entries) {
              throw new Error('NotFoundError: no cbpPlans store')
            }
            return {
              objectStore: () => ({
                getAll: () => {
                  const getReq: any = { result: entries }
                  Promise.resolve().then(() => getReq.onsuccess())
                  return getReq
                },
              }),
            }
          }),
        }
      }

      it('returns every cached plan year and closes the database', async () => {
        const entries = [{ aparPlanList: [] }, { data: [] }]
        const db = createDb(entries)
        const { open } = stubIndexedDb('success', db)

        expect(await createComponent()['readCbpPlanCache']()).toEqual(entries)
        expect(open).toHaveBeenCalledWith('iGotAppDB')
        expect(db.transaction).toHaveBeenCalledWith('cbpPlans', 'readonly')
        expect(db.close).toHaveBeenCalled()
      })

      it('returns nothing when the cbpPlans store does not exist', async () => {
        const db = createDb()
        stubIndexedDb('success', db)

        expect(await createComponent()['readCbpPlanCache']()).toEqual([])
        expect(db.close).toHaveBeenCalled()
      })

      it('aborts rather than creating the database when it does not exist yet', async () => {
        const { request } = stubIndexedDb('newDatabase')

        expect(await createComponent()['readCbpPlanCache']()).toEqual([])
        expect(request.transaction.abort).toHaveBeenCalled()
      })

      it('returns nothing when the database fails to open', async () => {
        stubIndexedDb('error')

        expect(await createComponent()['readCbpPlanCache']()).toEqual([])
      })

      it('returns nothing when IndexedDB is unavailable', async () => {
        scope.indexedDB = { open: jest.fn(() => { throw new Error('SecurityError') }) }

        expect(await createComponent()['readCbpPlanCache']()).toEqual([])
      })

      it('stops waiting for a database that never answers after two seconds', async () => {
        stubIndexedDb('pending')

        const result = createComponent()['readCbpPlanCache']()
        jest.advanceTimersByTime(2000)

        expect(await result).toEqual([])
      })
    })

    describe('applyAparKarmaPoints', () => {

      it('leaves the karma points as configured for a course that is not APAR', () => {
        const component = createComponent({ isAparCourse: false, kparray: KARMA_POINTS })

        component['applyAparKarmaPoints']()

        expect(component.kparray).toBe(KARMA_POINTS)
      })

      it('shows 10 points for completing the course on both Enroll and Resume', () => {
        const component = createComponent({ isAparCourse: true, kparray: KARMA_POINTS })

        component['applyAparKarmaPoints']()

        expect(component.kparray[0]).toEqual({ displayButton: 'Enroll', ...APAR_COMPLETION })
        expect(component.kparray[1]).toEqual({ displayButton: 'Resume', ...APAR_COMPLETION })
      })

      it('raises the other 5-point slides to 10 and keeps the rest as configured', () => {
        const component = createComponent({ isAparCourse: true, kparray: KARMA_POINTS })

        component['applyAparKarmaPoints']()

        expect(component.kparray[2]).toBe(KARMA_POINTS[2])
        expect(component.kparray[3]).toEqual({ ...KARMA_POINTS[3], points: '10' })
      })

      it('keeps the Enroll text when the config has no Resume slide', () => {
        const component = createComponent({ isAparCourse: true, kparray: [KARMA_POINTS[0]] })

        component['applyAparKarmaPoints']()

        expect(component.kparray[0].textAfterIcon).toBe('firstEnroll')
        expect(component.kparray[0].points).toBe('10')
      })

      it('does not modify the page config it was built from', () => {
        const config = KARMA_POINTS.map((item: any) => ({ ...item }))
        const component = createComponent({ isAparCourse: true, kparray: config })

        component['applyAparKarmaPoints']()

        expect(config).toEqual(KARMA_POINTS)
      })
    })

    describe('loadBannerAndTocConfig', () => {

      it('builds the karma points from the page config with the APAR points applied', () => {
        const component = createComponent({ isAparCourse: true, contentReadData: { courseCategory: 'Course' }, tocSvc: {} })

        component['loadBannerAndTocConfig']({ pageData: { data: { karmaPoints: KARMA_POINTS } } })

        expect(component.kparray[0]).toEqual({ displayButton: 'Enroll', ...APAR_COMPLETION })
        expect(component.tocConfig.karmaPoints).toBe(KARMA_POINTS)
      })
    })
  })
})
