import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AuthLanguageSelectBarComponent } from './auth-language-select-bar.component'

describe('AuthLanguageSelectBarComponent', () => {
  let component: AuthLanguageSelectBarComponent
  let fixture: ComponentFixture<AuthLanguageSelectBarComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLanguageSelectBarComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLanguageSelectBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
