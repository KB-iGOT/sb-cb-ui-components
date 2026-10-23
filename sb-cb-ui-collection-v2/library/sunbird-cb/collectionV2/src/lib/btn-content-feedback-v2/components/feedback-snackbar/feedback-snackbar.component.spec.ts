import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar'

import { FeedbackSnackbarComponent } from './feedback-snackbar.component'

describe('FeedbackSnackbarComponent', () => {
  let component: FeedbackSnackbarComponent
  let fixture: ComponentFixture<FeedbackSnackbarComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackSnackbarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatSnackBarRef, useValue: { dismiss: () => {} } },
      { provide: MAT_SNACK_BAR_DATA, useValue: {} }
    ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSnackbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
