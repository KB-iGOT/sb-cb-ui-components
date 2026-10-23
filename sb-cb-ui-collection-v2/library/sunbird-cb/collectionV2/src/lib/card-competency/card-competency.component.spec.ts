import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { CardCompetencyComponent } from './card-competency.component'

describe('CardCompetencyComponent', () => {
  let component: CardCompetencyComponent
  let fixture: ComponentFixture<CardCompetencyComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [CardCompetencyComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCompetencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
