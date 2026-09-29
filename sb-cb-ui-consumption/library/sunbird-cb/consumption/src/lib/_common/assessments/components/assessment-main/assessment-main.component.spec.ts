import { of } from 'rxjs';

import { AssessmentMainComponent } from './assessment-main.component';

describe('AssessmentMainComponent', () => {
  let component: AssessmentMainComponent;
  let assessmentService: any;
  let snackBar: any;

  beforeEach(() => {
    assessmentService = {
      setReadOnly: jest.fn(),
      setPrimaryCategory: jest.fn(),
      setCourseCategory: jest.fn(),
      getAssessmentHierarchyDetailsModeEdit: jest.fn(() => of({ primaryCategory: 'Course Assessment' })),
    };
    snackBar = { open: jest.fn() };
    component = new AssessmentMainComponent(assessmentService, snackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hand the course category to the service, which picks the endpoints from it', () => {
    component.config = { identifier: '', primaryCategory: '', courseCategory: 'Comprehensive Assessment' };

    component.ngOnInit();

    expect(assessmentService.setCourseCategory).toHaveBeenCalledWith('Comprehensive Assessment');
  });

  it('should reset the course category for a builder opened without one', () => {
    component.config = { identifier: '', primaryCategory: '' };

    component.ngOnInit();

    expect(assessmentService.setCourseCategory).toHaveBeenCalledWith(undefined);
  });

  it('should set the course category before an existing assessment is read', () => {
    component.config = { identifier: 'qs-1', primaryCategory: '', courseCategory: 'Comprehensive Assessment' };

    component.ngOnInit();

    const setOrder = assessmentService.setCourseCategory.mock.invocationCallOrder[0];
    const readOrder = assessmentService.getAssessmentHierarchyDetailsModeEdit.mock.invocationCallOrder[0];
    expect(setOrder).toBeLessThan(readOrder);
  });
});
