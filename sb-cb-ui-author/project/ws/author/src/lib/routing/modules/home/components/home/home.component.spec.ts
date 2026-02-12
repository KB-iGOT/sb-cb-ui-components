import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AuthHomeComponent } from './home.component'

describe('AuthHomeComponent', () => {
  let component: AuthHomeComponent
  let fixture: ComponentFixture<AuthHomeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthHomeComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
