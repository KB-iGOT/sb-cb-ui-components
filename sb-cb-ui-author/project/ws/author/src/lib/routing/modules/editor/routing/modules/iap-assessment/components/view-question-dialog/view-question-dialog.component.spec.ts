import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { ViewQuestionDialogComponent } from './view-question-dialog.component'

describe('ViewQuestionDialogComponent', () => {
  let component: ViewQuestionDialogComponent
  let fixture: ComponentFixture<ViewQuestionDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewQuestionDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuestionDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
