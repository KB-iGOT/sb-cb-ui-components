import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { SurveyFormQuestionComponent } from './survey-form-question.component';

describe('SurveyFormQuestionComponent', () => {
  let component: SurveyFormQuestionComponent;
  let fixture: ComponentFixture<SurveyFormQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyFormQuestionComponent]
    });
    fixture = TestBed.createComponent(SurveyFormQuestionComponent);
    component = fixture.componentInstance;
    component.fieldDetails = {};
    component.questionForm = new FormGroup({
      answer: new FormControl(''),
      isNA: new FormControl(false),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
