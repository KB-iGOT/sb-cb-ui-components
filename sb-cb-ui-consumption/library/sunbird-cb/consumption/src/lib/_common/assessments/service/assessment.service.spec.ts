import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AssessmentService } from './assessment.service';
import { NsAssessment } from './assessment.model';

describe('AssessmentService', () => {
  let service: AssessmentService;
  let httpMock: HttpTestingController;

  const createReq = {
    request: { questionset: { primaryCategory: NsAssessment.EAssessmentPrimaryCategory.FINAL_ASSESSMENT } },
  };
  const cqfCreateReq = {
    request: { questionset: { primaryCategory: NsAssessment.EAssessmentPrimaryCategory.CQF_ASSESSMENT } },
  };
  const hierarchyReq = {
    request: {
      data: {
        nodesModified: {},
        hierarchy: {
          'section-1': { root: false, children: [] },
          'qs-1': { root: true, children: ['section-1'] },
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AssessmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should tell a comprehensive assessment only by its course category', () => {
    service.setCourseCategory(NsAssessment.EAssessmentCourseCategory.COMPREHENSIVE_ASSESSMENT);
    expect(service.isComprehensiveAssessment()).toBe(true);

    service.setCourseCategory(NsAssessment.EAssessmentCourseCategory.STANDALONE_ASSESSMENT);
    expect(service.isComprehensiveAssessment()).toBe(false);

    service.setCourseCategory(undefined as any);
    expect(service.getCourseCategory()).toBe('');
    expect(service.isComprehensiveAssessment()).toBe(false);
  });

  describe('for a normal assessment', () => {
    it('should create through the question set create', () => {
      service.createAssessment(createReq).subscribe();

      const req = httpMock.expectOne('apis/proxies/v8/questionset/v1/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createReq);
      req.flush({});
    });

    it('should update through the question set hierarchy update', () => {
      service.updateAssessment(hierarchyReq).subscribe();

      const req = httpMock.expectOne('apis/proxies/v8/questionset/v1/hierarchy/update');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(hierarchyReq);
      req.flush({});
    });
  });

  describe('for a comprehensive assessment', () => {
    beforeEach(() => {
      service.setCourseCategory(NsAssessment.EAssessmentCourseCategory.COMPREHENSIVE_ASSESSMENT);
    });

    it('should create through the CA wrapper, with the payload unchanged', () => {
      service.createAssessment(createReq).subscribe();

      const req = httpMock.expectOne('apis/proxies/v8/ca/questionset/v1/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createReq);
      req.flush({});
    });

    it('should update through the CA hierarchy wrapper, with the payload unchanged', () => {
      service.updateAssessment(hierarchyReq).subscribe();

      const req = httpMock.expectOne('apis/proxies/v8/ca/questionset/v1/hierarchy/update');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(hierarchyReq);
      req.flush({});
    });
  });

  describe('for a CQF assessment', () => {
    it('should keep the CQF endpoints', () => {
      service.createAssessment(cqfCreateReq).subscribe();
      service.updateAssessment(hierarchyReq).subscribe();

      httpMock.expectOne('apis/proxies/v8/cqfquestionset/questionset/create').flush({});
      httpMock.expectOne('apis/proxies/v8/cqfquestionset/questionset/update').flush({});
    });

    it('should keep the CQF endpoints even under the comprehensive course category', () => {
      service.setCourseCategory(NsAssessment.EAssessmentCourseCategory.COMPREHENSIVE_ASSESSMENT);
      service.createAssessment(cqfCreateReq).subscribe();
      service.updateAssessment(hierarchyReq).subscribe();

      httpMock.expectOne('apis/proxies/v8/cqfquestionset/questionset/create').flush({});
      httpMock.expectOne('apis/proxies/v8/cqfquestionset/questionset/update').flush({});
    });
  });
});
