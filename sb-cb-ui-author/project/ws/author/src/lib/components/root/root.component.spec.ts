import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AuthRootComponent } from './root.component'

describe('AuthRootComponent', () => {
  let component: AuthRootComponent
  let fixture: ComponentFixture<AuthRootComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthRootComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRootComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
