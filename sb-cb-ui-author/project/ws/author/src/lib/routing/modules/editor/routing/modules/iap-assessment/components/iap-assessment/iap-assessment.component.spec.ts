import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IapAssessmentComponent } from './iap-assessment.component'

describe('IapAssessmentComponent', () => {
  let component: IapAssessmentComponent
  let fixture: ComponentFixture<IapAssessmentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IapAssessmentComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(IapAssessmentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
