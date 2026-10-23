import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ErrorFeatureUnavailableComponent } from './error-feature-unavailable.component'

describe('ErrorFeatureUnavailableComponent', () => {
  let component: ErrorFeatureUnavailableComponent
  let fixture: ComponentFixture<ErrorFeatureUnavailableComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorFeatureUnavailableComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFeatureUnavailableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
