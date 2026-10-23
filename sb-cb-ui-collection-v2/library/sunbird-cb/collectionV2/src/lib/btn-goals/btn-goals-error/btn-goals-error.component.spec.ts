import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar'

import { BtnGoalsErrorComponent } from './btn-goals-error.component'

describe('BtnGoalsErrorComponent', () => {
  let component: BtnGoalsErrorComponent
  let fixture: ComponentFixture<BtnGoalsErrorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnGoalsErrorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatSnackBarRef, useValue: { dismiss: () => {} } },
      { provide: MAT_SNACK_BAR_DATA, useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnGoalsErrorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
