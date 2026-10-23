import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { AppTocContentComponent } from './app-toc-content.component'

describe('AppTocContentComponent', () => {
  let component: AppTocContentComponent
  let fixture: ComponentFixture<AppTocContentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocContentComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
