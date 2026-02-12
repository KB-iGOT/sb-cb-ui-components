import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { ErrorParserComponent } from './error-parser.component'

describe('ErrorParserComponent', () => {
  let component: ErrorParserComponent
  let fixture: ComponentFixture<ErrorParserComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorParserComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorParserComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
