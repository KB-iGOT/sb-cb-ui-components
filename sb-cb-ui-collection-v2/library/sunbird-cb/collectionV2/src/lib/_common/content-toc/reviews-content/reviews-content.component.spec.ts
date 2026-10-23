import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { ReviewsContentComponent } from './reviews-content.component'

describe('ReviewsContentComponent', () => {
  let component: ReviewsContentComponent
  let fixture: ComponentFixture<ReviewsContentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [ReviewsContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: MAT_DIALOG_DATA, useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
