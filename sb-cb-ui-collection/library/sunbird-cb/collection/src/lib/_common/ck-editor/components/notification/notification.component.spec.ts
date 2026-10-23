import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar'

import { NotificationComponent } from './notification.component'

describe('NotificationComponent', () => {
  let component: NotificationComponent
  let fixture: ComponentFixture<NotificationComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatSnackBarRef, useValue: { dismiss: () => {} } },
      { provide: MAT_SNACK_BAR_DATA, useValue: {} }
    ],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
