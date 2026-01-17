import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { QuizQusetionsComponent } from './quiz-questions.component'

describe('QuizQusetionsComponent', () => {
  let component: QuizQusetionsComponent
  let fixture: ComponentFixture<QuizQusetionsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuizQusetionsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizQusetionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
