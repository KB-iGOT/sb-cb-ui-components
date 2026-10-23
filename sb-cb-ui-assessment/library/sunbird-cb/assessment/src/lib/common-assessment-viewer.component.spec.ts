import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

import { CommonAssessmentViewerComponent } from './common-assessment-viewer.component'

describe('CommonAssessmentViewerComponent', () => {
  let component: CommonAssessmentViewerComponent
  let fixture: ComponentFixture<CommonAssessmentViewerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommonAssessmentViewerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAssessmentViewerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
