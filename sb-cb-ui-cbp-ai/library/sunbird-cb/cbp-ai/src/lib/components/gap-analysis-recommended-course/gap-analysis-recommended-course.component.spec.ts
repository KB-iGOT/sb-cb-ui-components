import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GapAnalysisRecommendedCourseComponent } from './gap-analysis-recommended-course.component';

describe('GapAnalysisRecommendedCourseComponent', () => {
  let component: GapAnalysisRecommendedCourseComponent;
  let fixture: ComponentFixture<GapAnalysisRecommendedCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GapAnalysisRecommendedCourseComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(GapAnalysisRecommendedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
