import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { UserImageComponent } from './user-image.component'

describe('UserImageComponent', () => {
  let component: UserImageComponent
  let fixture: ComponentFixture<UserImageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserImageComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
