import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { QuestionComponent } from './question.component'
import { QuestionSafeUrlPipe } from '../../question-safe-pipe.pipe'

describe('QuestionComponent', () => {
  let component: QuestionComponent
  let fixture: ComponentFixture<QuestionComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QuestionComponent, QuestionSafeUrlPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
