import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ErrorContentUnavailableComponent } from './error-content-unavailable.component'

describe('ErrorContentUnavailableComponent', () => {
  let component: ErrorContentUnavailableComponent
  let fixture: ComponentFixture<ErrorContentUnavailableComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorContentUnavailableComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorContentUnavailableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
