import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ExpiryDateDisplayComponent } from './expiry-date-display.component'

describe('ExpiryDateDisplayComponent', () => {
  let component: ExpiryDateDisplayComponent
  let fixture: ComponentFixture<ExpiryDateDisplayComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExpiryDateDisplayComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryDateDisplayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
