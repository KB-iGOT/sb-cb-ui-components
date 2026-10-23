import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { AiProgramComponent, AiProgramData, ContentData } from './ai-program.component'

describe('AiProgramComponent', () => {
  let component: AiProgramComponent
  let mockHttp: any
  let mockConfigSvc: any
  let mockRouter: any

  const mockProgramData: AiProgramData = {
    enabled: true,
    title: 'AI Daksh',
    description: 'The program contain 3 courses, complete them to get the AI Daksh Badge',
    image: 'https://example.com/image.png',
    noOfCoursesToComplete: '3',
    badgeImage: 'https://example.com/badge.png',
    identifier: 'do_program_1',
    courseIdentifiers: ['do_course_1', 'do_course_2', 'do_course_3'],
    styleData: {
      'border-radius': '32px',
      'background': 'linear-gradient(to bottom right, #266EEB 43%, #133F8B 50%)',
    },
    contentData: {
      posterImage: 'https://example.com/thumbnail.png',
      name: 'Course name',
      identifier: 'do_1234567890',
      source: 'iGotKarmayogi',
      creatorLogo: 'https://example.com/logo.png',
      duration: '120',
      courseCategory: 'Program',
      rating: 4.5,
      ratingCount: 234,
    },
    completedCourses: 1,
  }

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined)

    mockHttp = { post: jest.fn().mockReturnValue(of({ result: { courses: [] } })) } as unknown as HttpClient
    mockConfigSvc = { userProfile: { userId: 'test-user' } } as any
    mockRouter = { navigate: jest.fn() } as unknown as Router

    component = new AiProgramComponent(mockHttp, mockConfigSvc, mockRouter)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  describe('totalCourses', () => {
    it('should parse noOfCoursesToComplete from string', () => {
      component.programData = mockProgramData
      expect(component.totalCourses).toBe(3)
    })

    it('should default to 3 when not provided', () => {
      component.programData = { ...mockProgramData, noOfCoursesToComplete: '' }
      expect(component.totalCourses).toBe(3)
    })
  })

  describe('completedCourses', () => {
    it('should track the completed count applied via ngOnInit', () => {
      mockHttp.post.mockReturnValue(of({ result: { courses: [{ contentId: 'do_course_1', status: 2 }] } }))
      component.programData = mockProgramData
      component.ngOnInit()
      expect(component.completedCourses).toBe(1)
    })

    it('should not exceed totalCourses', () => {
      mockHttp.post.mockReturnValue(of({
        result: {
          courses: [
            { contentId: 'do_course_1', status: 2 },
            { contentId: 'do_course_2', status: 2 },
            { contentId: 'do_course_3', status: 2 },
          ],
        },
      }))
      component.programData = { ...mockProgramData, courseIdentifiers: ['do_course_1', 'do_course_2', 'do_course_3', 'do_course_4'] }
      component.ngOnInit()
      expect(component.completedCourses).toBeLessThanOrEqual(3)
    })

    it('should return 0 when nothing completed', () => {
      component.programData = mockProgramData
      expect(component.completedCourses).toBe(0)
    })
  })

  describe('buildProgressItems (via ngOnInit)', () => {
    it('should generate progress items once enrollment resolves', () => {
      component.programData = mockProgramData
      component.ngOnInit()
      // 3 courses -> bar/shield pairs for the first 2, then bar/badge for the last = 6 items
      expect(component.progressItemsCached.length).toBe(6)
    })

    it('should populate progress items once ngOnChanges runs', () => {
      component.programData = mockProgramData
      component.ngOnChanges({ programData: { firstChange: true } } as any)
      // 3 courses -> bar/shield pairs for the first 2, then bar/badge for the last = 6 items
      expect(component.progressItemsCached.length).toBe(6)
    })
  })

  describe('getBarState', () => {
    beforeEach(() => {
      component.programData = mockProgramData
    })

    it('should mark bar 0 as none when nothing is enrolled or completed', () => {
      expect(component.getBarState(0)).toBe('none')
    })
  })

  describe('getRomanNumeral', () => {
    it('should convert 1 to I', () => {
      expect(component.getRomanNumeral(1)).toBe('I')
    })

    it('should convert 3 to III', () => {
      expect(component.getRomanNumeral(3)).toBe('III')
    })

    it('should fallback to string for numbers > 10', () => {
      expect(component.getRomanNumeral(11)).toBe('11')
    })
  })

  describe('formatDuration', () => {
    it('should convert "120" to "2 hrs"', () => {
      expect(component.formatDuration('120')).toBe('2 hrs')
    })

    it('should convert "90" to "1 hrs 30 min"', () => {
      expect(component.formatDuration('90')).toBe('1 hrs 30 min')
    })

    it('should convert "45" to "45 min"', () => {
      expect(component.formatDuration('45')).toBe('45 min')
    })

    it('should return empty string for invalid input', () => {
      expect(component.formatDuration('')).toBe('')
    })
  })

  describe('onContentClick', () => {
    it('should emit contentClicked with contentData and navigate', () => {
      component.programData = mockProgramData
      const emitSpy = jest.spyOn(component.contentClicked, 'emit')
      component.onContentClick()
      expect(emitSpy).toHaveBeenCalledWith(mockProgramData.contentData)
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/toc', 'do_1234567890', 'overview'])
    })

    it('should not emit when contentData is missing', () => {
      component.programData = { ...mockProgramData, contentData: undefined as any }
      const emitSpy = jest.spyOn(component.contentClicked, 'emit')
      component.onContentClick()
      expect(emitSpy).not.toHaveBeenCalled()
    })
  })

  describe('ngOnInit / enrollment lookup', () => {
    it('should skip the enrollment call when the program has no identifier', () => {
      component.programData = { ...mockProgramData, identifier: '' }
      component.ngOnInit()
      expect(mockHttp.post).not.toHaveBeenCalled()
    })

    it('should treat an errored enrollment call as not enrolled', () => {
      mockHttp.post.mockReturnValue(throwError(() => new Error('network error')))
      component.programData = mockProgramData
      component.ngOnInit()
      expect(component.isEnrolled).toBe(false)
    })
  })

  describe('ngOnDestroy', () => {
    it('should not throw when there is no active subscription', () => {
      expect(() => component.ngOnDestroy()).not.toThrow()
    })
  })
})
