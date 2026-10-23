import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { MarkAsCompleteConfirmDialogComponent } from './confirm-dialog.component'

describe('MarkAsCompleteConfirmDialogComponent', () => {
  let component: MarkAsCompleteConfirmDialogComponent
  let fixture: ComponentFixture<MarkAsCompleteConfirmDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MarkAsCompleteConfirmDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: MAT_DIALOG_DATA, useValue: {} }
    ],
    
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsCompleteConfirmDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
