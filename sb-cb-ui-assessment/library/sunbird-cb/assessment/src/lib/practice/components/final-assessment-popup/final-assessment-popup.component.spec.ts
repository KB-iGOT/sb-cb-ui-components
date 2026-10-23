import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { FinalAssessmentPopupComponent } from './final-assessment-popup.component'

describe('FinalAssessmentPopupComponent', () => {
  let component: FinalAssessmentPopupComponent
  let fixture: ComponentFixture<FinalAssessmentPopupComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FinalAssessmentPopupComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalAssessmentPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
