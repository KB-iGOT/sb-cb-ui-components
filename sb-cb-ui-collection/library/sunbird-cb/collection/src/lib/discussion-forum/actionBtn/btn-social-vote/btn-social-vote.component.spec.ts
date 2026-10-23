import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnSocialVoteComponent } from './btn-social-vote.component'

describe('BtnSocialVoteComponent', () => {
  let component: BtnSocialVoteComponent
  let fixture: ComponentFixture<BtnSocialVoteComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnSocialVoteComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnSocialVoteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
