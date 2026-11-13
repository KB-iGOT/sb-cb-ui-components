import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { of } from 'rxjs'

import { AssessmentSessionsComponent } from './assessment-sessions.component';

describe('AssessmentSessionsComponent', () => {
  let component: AssessmentSessionsComponent;
  let fixture: ComponentFixture<AssessmentSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentSessionsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule ],
      providers: [
        DatePipe,
        { provide: 'environment', useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });
    fixture = TestBed.createComponent(AssessmentSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('generating questions with AI', () => {
    const generated = { assessment_data: { questions: { 'Multiple Choice Question': [1, 2].map(n => ({
      question_id: `MCQ_00${n}`, question_type: 'MCQ', question_text: `Question ${n}`,
      options: [{ text: 'a', index: 0 }, { text: 'b', index: 1 }], correct_option_index: 0,
    })) } } };

    function generate(assessmentData: any) {
      component.assessmentData = assessmentData;
      component.questionsList = [];
      jest.spyOn((component as any).dialog, 'open').mockReturnValue({ afterClosed: () => of({ request: {}, response: generated }) } as any);
      jest.spyOn((component as any).snackBar, 'open').mockReturnValue(undefined);
      const emit = jest.spyOn(component.updateQuestion, 'emit');
      component.onGenerateAIQuestions();
      return emit;
    }

    it('should save the generated questions to the section the way a single question is saved', () => {
      const emit = generate({ compatibilityLevel: 5, children: [{ identifier: 'do_section' }] });

      const event: any = emit.mock.calls[0][0];
      expect(event.sectionIdentifier).toBe('do_section');
      expect(Object.values(event.changedData).map((node: any) => [node.isNew, node.metadata.qType, node.metadata.answer]))
        .toEqual([[true, 'MCQ-SCA', '0'], [true, 'MCQ-SCA', '0']]);
      expect(event.savedMessage).toBe('2 questions saved successfully');
    });

    it('should save no more than the section is set to hold', () => {
      component.basicAssessmentForm.patchValue({ totalQuestions: 1 });

      const emit = generate({ compatibilityLevel: 6, children: [{ identifier: 'do_section' }] });

      const event: any = emit.mock.calls[0][0];
      expect(Object.keys(event.changedData).length).toBe(1);
      expect(event.savedMessage).toBe('1 question saved successfully. 1 could not be added.');
    });

    it('should ask for the section to be saved before generating', () => {
      const emit = generate({ compatibilityLevel: 5, children: [{}] });

      expect((component as any).snackBar.open).toHaveBeenCalledWith('Save the section before generating questions.');
      expect((component as any).dialog.open).not.toHaveBeenCalled();
      expect(emit).not.toHaveBeenCalled();
    });
  });
});
