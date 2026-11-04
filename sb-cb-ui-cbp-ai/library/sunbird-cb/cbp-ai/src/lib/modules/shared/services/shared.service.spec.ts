import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SharedService } from './shared.service';
import { InitService } from './init.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: InitService, useValue: {} }]
    });
    service = TestBed.inject(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMarketplaceCourseType', () => {
    it('should return paid / free for marketplace courses, ignoring case and spaces', () => {
      expect(service.getMarketplaceCourseType({ course_type: 'Paid' })).toBe('paid');
      expect(service.getMarketplaceCourseType({ course_type: ' FREE ' })).toBe('free');
    });

    it('should return null for non-marketplace courses', () => {
      expect(service.getMarketplaceCourseType({ course_type: 'User Added' })).toBeNull();
      expect(service.getMarketplaceCourseType({ course_type: null })).toBeNull();
      expect(service.getMarketplaceCourseType({})).toBeNull();
      expect(service.getMarketplaceCourseType(undefined)).toBeNull();
    });
  });

  describe('isMarketplaceCourse', () => {
    it('should be true only for paid / free courses', () => {
      expect(service.isMarketplaceCourse({ course_type: 'Free' })).toBe(true);
      expect(service.isMarketplaceCourse({ course_type: 'User Added' })).toBe(false);
    });
  });

  describe('countMarketplaceCourses', () => {
    it('should count marketplace, free and paid courses', () => {
      const courses = [
        { course_type: 'Paid' },
        { course_type: 'Free' },
        { course_type: 'Free' },
        { course_type: 'User Added' },
        {}
      ];
      expect(service.countMarketplaceCourses(courses)).toEqual({ marketplace: 3, free: 2, paid: 1 });
    });

    it('should return zero counts for empty or missing lists', () => {
      expect(service.countMarketplaceCourses([])).toEqual({ marketplace: 0, free: 0, paid: 0 });
      expect(service.countMarketplaceCourses(undefined)).toEqual({ marketplace: 0, free: 0, paid: 0 });
    });
  });
});
