import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AuthTableOfContentsComponent } from './auth-table-of-contents.component'

describe('AuthTableOfContentsComponent', () => {
  let component: AuthTableOfContentsComponent
  let fixture: ComponentFixture<AuthTableOfContentsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthTableOfContentsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTableOfContentsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
