import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnFacebookShareComponent } from './btn-facebook-share.component'

describe('BtnFacebookShareComponent', () => {
  let component: BtnFacebookShareComponent
  let fixture: ComponentFixture<BtnFacebookShareComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnFacebookShareComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnFacebookShareComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
