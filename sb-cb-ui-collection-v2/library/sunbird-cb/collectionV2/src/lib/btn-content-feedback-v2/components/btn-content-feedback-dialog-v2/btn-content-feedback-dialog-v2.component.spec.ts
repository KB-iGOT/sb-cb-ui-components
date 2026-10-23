import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { BtnContentFeedbackDialogV2Component } from './btn-content-feedback-dialog-v2.component'

describe('BtnContentFeedbackDialogV2Component', () => {
  let component: BtnContentFeedbackDialogV2Component
  let fixture: ComponentFixture<BtnContentFeedbackDialogV2Component>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BtnContentFeedbackDialogV2Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: MAT_DIALOG_DATA, useValue: {} }
    ],
    
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnContentFeedbackDialogV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
