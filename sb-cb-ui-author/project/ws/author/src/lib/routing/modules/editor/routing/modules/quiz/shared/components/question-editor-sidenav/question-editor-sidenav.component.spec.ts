import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { QuestionEditorSidenavComponent } from './question-editor-sidenav.component'

describe('QuestionEditorSidenavComponent', () => {
  let component: QuestionEditorSidenavComponent
  let fixture: ComponentFixture<QuestionEditorSidenavComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionEditorSidenavComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditorSidenavComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
