import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { AppTocContentCardV2Component } from './app-toc-content-card-v2.component'

describe('AppTocContentCardV2Component', () => {
  let component: AppTocContentCardV2Component
  let fixture: ComponentFixture<AppTocContentCardV2Component>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocContentCardV2Component],
      imports: [HttpClientTestingModule, RouterTestingModule, MatMenuModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentCardV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
