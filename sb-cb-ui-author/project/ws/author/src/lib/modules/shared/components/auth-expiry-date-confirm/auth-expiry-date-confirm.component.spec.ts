import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AuthExpiryDateConfirmComponent } from './auth-expiry-date-confirm.component'

describe('AuthExpiryDateConfirmComponent', () => {
  let component: AuthExpiryDateConfirmComponent
  let fixture: ComponentFixture<AuthExpiryDateConfirmComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthExpiryDateConfirmComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthExpiryDateConfirmComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
