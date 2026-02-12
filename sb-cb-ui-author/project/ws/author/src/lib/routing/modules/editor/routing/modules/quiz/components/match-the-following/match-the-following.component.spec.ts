import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { MatchTheFollowingComponent } from './match-the-following.component'

describe('MatchTheFollowingComponent', () => {
  let component: MatchTheFollowingComponent
  let fixture: ComponentFixture<MatchTheFollowingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchTheFollowingComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchTheFollowingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
