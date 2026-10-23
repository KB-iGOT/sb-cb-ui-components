import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { Router } from '@angular/router'

import { AppTocSessionCardNewComponent } from './app-toc-session-card-new.component'
import { WidgetContentService } from '../../../../_services/widget-content.service'

describe('AppTocSessionCardComponent', () => {
  let component: AppTocSessionCardNewComponent
  let fixture: ComponentFixture<AppTocSessionCardNewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocSessionCardNewComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: WidgetContentService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSessionCardNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
