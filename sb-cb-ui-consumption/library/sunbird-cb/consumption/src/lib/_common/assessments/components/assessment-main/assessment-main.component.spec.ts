import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MatStepperModule } from '@angular/material/stepper'

import { AssessmentMainComponent } from './assessment-main.component';

describe('AssessmentMainComponent', () => {
  let component: AssessmentMainComponent;
  let assessmentService: any;
  let snackBar: any;

  beforeEach(() => {
    assessmentService = {
      setReadOnly: jest.fn(),
      setPrimaryCategory: jest.fn(),
      setContextCategory: jest.fn(),
      getAssessmentHierarchyDetailsModeEdit: jest.fn(() => of({ primaryCategory: 'Course Assessment' })),
    };
    snackBar = { open: jest.fn() };
    component = new AssessmentMainComponent(assessmentService, snackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hand the course category to the service, which picks the endpoints from it', () => {
    component.config = { identifier: '', primaryCategory: '', contextCategory: 'Comprehensive Assessment' };

    component.ngOnInit();

    expect(assessmentService.setContextCategory).toHaveBeenCalledWith('Comprehensive Assessment');
  });

  it('should reset the course category for a builder opened without one', () => {
    component.config = { identifier: '', primaryCategory: '' };

    component.ngOnInit();

    expect(assessmentService.setContextCategory).toHaveBeenCalledWith(undefined);
  });

  it('should set the course category before an existing assessment is read', () => {
    component.config = { identifier: 'qs-1', primaryCategory: '', contextCategory: 'Comprehensive Assessment' };

    component.ngOnInit();

    const setOrder = assessmentService.setContextCategory.mock.invocationCallOrder[0];
    const readOrder = assessmentService.getAssessmentHierarchyDetailsModeEdit.mock.invocationCallOrder[0];
    expect(setOrder).toBeLessThan(readOrder);
  });
});
