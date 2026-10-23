import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CardLearnComponent } from './card-learn.component'

describe('CardLearnComponent', () => {
  let component: CardLearnComponent
  let fixture: ComponentFixture<CardLearnComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardLearnComponent],
      imports: [HttpClientTestingModule],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLearnComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
