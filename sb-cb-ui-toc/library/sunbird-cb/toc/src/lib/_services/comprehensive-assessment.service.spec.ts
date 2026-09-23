import { of, throwError } from 'rxjs'

import { ComprehensiveAssessmentService } from './comprehensive-assessment.service'

/**
 * The service is plain logic over two collaborators, so it is exercised directly rather than
 * through TestBed: no Angular test environment is needed, and the suite stays runnable.
 */

const COURSE_A = 'do_courseA'
const COURSE_B = 'do_courseB'
const OPTIONAL_COURSE = 'do_optional'

const ENROLMENT_URL = '/apis/proxies/v8/learner/course/v5/user/enrollment/details'
const RETAKE_URL = '/apis/proxies/v8/user/assessment/retake/do_questionset'
const RETAKE_V5_URL = '/apis/proxies/v8/user/assessment/v5/retake/do_questionset'

/** One row of /learner/course/v5/user/enrollment/details, trimmed to what the service reads. */
function enrolment(courseId: string, status: number): any {
  return {
    courseId,
    contentId: courseId,
    collectionId: courseId,
    batchId: '0146551479289282567',
    completionPercentage: status === 2 ? 100 : 25,
    status,
  }
}

function enrolmentResponse(...rows: any[]): any {
  return { result: { courses: rows } }
}

/** A content read shaped like /extended/content/v1/read for a comprehensive assessment. */
function contentRead(contentList: any[], extra: Record<string, any> = {}): any {
  return {
    identifier: 'do_assessment',
    courseCategory: 'Comprehensive Assessment',
    trainingPlan_v2: {
      identifier: 'plan-1',
      planYear: '2026-27',
      contentList,
    },
    ...extra,
  }
}

/** An assessment carrying the question set the retake call is made for. */
function assessmentWithQuestionSet(compatibilityLevel?: number, extra: Record<string, any> = {}): any {
  return {
    children: [
      { identifier: 'do_questionset', mimeType: 'application/vnd.sunbird.questionset', compatibilityLevel },
    ],
    ...extra,
  }
}

describe('ComprehensiveAssessmentService', () => {
  let service: ComprehensiveAssessmentService
  let dictionarySvc: { getContents: jest.Mock }
  let http: { get: jest.Mock, post: jest.Mock }

  beforeEach(() => {
    dictionarySvc = {
      getContents: jest.fn(() => of({
        [COURSE_A]: { name: 'Course A', code: 'LRN-A' },
        [COURSE_B]: { name: 'Course B' },
      })),
    }
    http = {
      get: jest.fn(() => of({ result: {} })),
      post: jest.fn(() => of(enrolmentResponse())),
    }
    service = new ComprehensiveAssessmentService(dictionarySvc as any, http as any)
  })

  describe('getUnlockStatus', () => {

    it('unlocks when every mandatory course is completed', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 2), enrolment(COURSE_B, 2))))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
        { identifier: COURSE_B, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(true)
      expect(status.pendingCourses).toEqual([])
    })

    it('stays locked while a mandatory course is incomplete', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 2), enrolment(COURSE_B, 1))))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
        { identifier: COURSE_B, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(false)
      expect(status.pendingCourses.map((course: any) => course.identifier)).toEqual([COURSE_B])
    })

    it('asks the enrolment API for the mandatory courses only', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 2))))

      await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
        { identifier: OPTIONAL_COURSE, mandatory: false },
      ]))

      expect(http.post).toHaveBeenCalledWith(ENROLMENT_URL, {
        request: { retiredCoursesEnabled: true, courseId: [COURSE_A] },
      })
    })

    it('ignores optional courses when deciding the unlock', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 2))))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
        { identifier: OPTIONAL_COURSE, mandatory: false },
      ]))

      expect(status.isAllCoursesCompleted).toBe(true)
      expect(status.pendingCourses).toEqual([])
      // The optional course is still reported, just never as a blocker.
      expect(status.courses.map((course: any) => course.identifier)).toEqual([COURSE_A, OPTIONAL_COURSE])
    })

    it('does not fetch metadata for optional courses', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 1))))

      await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
        { identifier: OPTIONAL_COURSE, mandatory: false },
      ]))

      expect(dictionarySvc.getContents).toHaveBeenCalledWith([COURSE_A])
    })

    it('unlocks when the plan carries no mandatory course', async () => {
      const status = await service.getUnlockStatus(contentRead([
        { identifier: OPTIONAL_COURSE, mandatory: false },
      ]))

      expect(status.isAllCoursesCompleted).toBe(true)
      expect(status.courses).toEqual([])
      expect(dictionarySvc.getContents).not.toHaveBeenCalled()
      expect(http.post).not.toHaveBeenCalled()
    })

    it('unlocks when there is no training plan at all', async () => {
      const status = await service.getUnlockStatus({ identifier: 'do_assessment' })

      expect(status.isAllCoursesCompleted).toBe(true)
      expect(status.pendingCourses).toEqual([])
    })

    it('counts a course the enrolment response omits as not completed', async () => {
      http.post.mockReturnValue(of(enrolmentResponse()))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(false)
      expect(status.pendingCourses[0].identifier).toBe(COURSE_A)
    })

    it('treats an in-progress course as not completed', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 1))))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(false)
    })

    it('matches an enrolment that carries only contentId', async () => {
      http.post.mockReturnValue(of({
        result: { courses: [{ contentId: COURSE_A, status: 2 }] },
      }))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(true)
    })

    it('carries the course name and code from the dictionary', async () => {
      http.post.mockReturnValue(of(enrolmentResponse()))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.pendingCourses[0]).toEqual({
        identifier: COURSE_A,
        name: 'Course A',
        code: 'LRN-A',
        mandatory: true,
        completed: false,
      })
    })

    it('falls back to empty metadata when the dictionary lookup fails', async () => {
      dictionarySvc.getContents.mockReturnValue(throwError(() => new Error('dictionary down')))
      http.post.mockReturnValue(of(enrolmentResponse()))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.pendingCourses[0].name).toBe('')
      expect(status.isAllCoursesCompleted).toBe(false)
    })

    it('stays locked when the enrolment call fails', async () => {
      http.post.mockReturnValue(throwError(() => new Error('enrolment down')))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(false)
      expect(status.pendingCourses.length).toBe(1)
    })

    it('stays locked when the enrolment response carries no courses', async () => {
      http.post.mockReturnValue(of({ result: null }))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
      ]))

      expect(status.isAllCoursesCompleted).toBe(false)
    })

    it('skips plan entries without an identifier', async () => {
      http.post.mockReturnValue(of(enrolmentResponse(enrolment(COURSE_A, 2))))

      const status = await service.getUnlockStatus(contentRead([
        { identifier: COURSE_A, mandatory: true },
        { mandatory: true },
      ]))

      expect(status.courses.length).toBe(1)
      expect(status.isAllCoursesCompleted).toBe(true)
    })
  })

  describe('getAttemptStatus', () => {

    it('reports remaining attempts from the retake API', async () => {
      http.get.mockReturnValue(of({ result: { attemptsMade: 1, attemptsAllowed: 3 } }))

      const attempts = await service.getAttemptStatus(assessmentWithQuestionSet(6))

      expect(http.get).toHaveBeenCalledWith(RETAKE_URL)
      expect(attempts).toEqual({
        attemptsMade: 1,
        attemptsAllowed: 3,
        attemptsRemaining: 2,
        isAttempted: true,
      })
    })

    it('reports "not attempted" before the first attempt', async () => {
      http.get.mockReturnValue(of({ result: { attemptsMade: 0, attemptsAllowed: 3 } }))

      const attempts = await service.getAttemptStatus(assessmentWithQuestionSet(6))

      expect(attempts.isAttempted).toBe(false)
      expect(attempts.attemptsRemaining).toBe(3)
    })

    it('never reports a negative remaining count', async () => {
      http.get.mockReturnValue(of({ result: { attemptsMade: 5, attemptsAllowed: 3 } }))

      const attempts = await service.getAttemptStatus(assessmentWithQuestionSet(6))

      expect(attempts.attemptsRemaining).toBe(0)
    })

    it('calls the v5 endpoint for a question set at the newer compatibility level', async () => {
      http.get.mockReturnValue(of({ result: { attemptsMade: 0, attemptsAllowed: 2 } }))

      await service.getAttemptStatus(assessmentWithQuestionSet(7))

      expect(http.get).toHaveBeenCalledWith(RETAKE_V5_URL)
    })

    it('falls back to the authored attempt count when the API omits it', async () => {
      http.get.mockReturnValue(of({ result: { attemptsMade: 1 } }))

      const attempts = await service.getAttemptStatus(
        assessmentWithQuestionSet(6, { maxAssessmentRetakeAttempts: 4 }),
      )

      expect(attempts.attemptsAllowed).toBe(4)
      expect(attempts.attemptsRemaining).toBe(3)
    })

    it('falls back to the authored count when the retake call fails', async () => {
      http.get.mockReturnValue(throwError(() => new Error('retake down')))

      const attempts = await service.getAttemptStatus(
        assessmentWithQuestionSet(6, { maxAssessmentRetakeAttempts: 3 }),
      )

      expect(attempts).toEqual({
        attemptsMade: 0,
        attemptsAllowed: 3,
        attemptsRemaining: 3,
        isAttempted: false,
      })
    })

    it('does not call the API when the assessment has no identifier', async () => {
      const attempts = await service.getAttemptStatus({ children: [], maxAssessmentRetakeAttempts: 2 })

      expect(http.get).not.toHaveBeenCalled()
      expect(attempts).toEqual({
        attemptsMade: 0,
        attemptsAllowed: 2,
        attemptsRemaining: 2,
        isAttempted: false,
      })
    })
  })
})
