import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnTwitterShareComponent } from './btn-twitter-share.component'

describe('BtnTwitterShareComponent', () => {
  let component: BtnTwitterShareComponent
  let fixture: ComponentFixture<BtnTwitterShareComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnTwitterShareComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnTwitterShareComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
