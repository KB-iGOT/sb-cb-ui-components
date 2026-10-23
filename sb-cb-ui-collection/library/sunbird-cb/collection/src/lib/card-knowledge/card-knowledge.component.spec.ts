import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CardKnowledgeComponent } from './card-knowledge.component'

describe('CardKnowledgeComponent', () => {
  let component: CardKnowledgeComponent
  let fixture: ComponentFixture<CardKnowledgeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardKnowledgeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardKnowledgeComponent)
    component = fixture.componentInstance
    component.widgetData = { content: {} } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
