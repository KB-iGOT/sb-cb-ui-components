import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ErrorInternalServerComponent } from './error-internal-server.component'

describe('ErrorInternalServerComponent', () => {
  let component: ErrorInternalServerComponent
  let fixture: ComponentFixture<ErrorInternalServerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorInternalServerComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorInternalServerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
