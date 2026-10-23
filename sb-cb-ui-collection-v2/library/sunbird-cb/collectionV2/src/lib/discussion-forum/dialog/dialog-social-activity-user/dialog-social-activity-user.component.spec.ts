import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { DialogSocialActivityUserComponent } from './dialog-social-activity-user.component'

describe('DialogSocialActivityUserComponent', () => {
  let component: DialogSocialActivityUserComponent
  let fixture: ComponentFixture<DialogSocialActivityUserComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DialogSocialActivityUserComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: MAT_DIALOG_DATA, useValue: { activityType: 'like' } }
    ],
    
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSocialActivityUserComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
