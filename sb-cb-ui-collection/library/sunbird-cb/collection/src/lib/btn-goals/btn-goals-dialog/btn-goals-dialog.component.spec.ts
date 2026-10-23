import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { BtnGoalsDialogComponent } from './btn-goals-dialog.component'

describe('BtnGoalsDialogComponent', () => {
  let component: BtnGoalsDialogComponent
  let fixture: ComponentFixture<BtnGoalsDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnGoalsDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: MAT_DIALOG_DATA, useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnGoalsDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
