import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { UserContentDetailedRatingComponent } from './user-content-detailed-rating.component'

describe('UserContentDetailedRatingComponent', () => {
  let component: UserContentDetailedRatingComponent
  let fixture: ComponentFixture<UserContentDetailedRatingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserContentDetailedRatingComponent],
      imports: [HttpClientTestingModule],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentDetailedRatingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
