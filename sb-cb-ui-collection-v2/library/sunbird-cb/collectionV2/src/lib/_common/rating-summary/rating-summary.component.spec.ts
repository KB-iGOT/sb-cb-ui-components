import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { RatingSummaryComponent } from './rating-summary.component'

describe('RatingSummaryComponent', () => {
  let component: RatingSummaryComponent
  let fixture: ComponentFixture<RatingSummaryComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RatingSummaryComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
