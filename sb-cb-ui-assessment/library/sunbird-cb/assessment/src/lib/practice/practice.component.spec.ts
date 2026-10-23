import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { PracticeComponent } from './practice.component'
import { WidgetContentService } from '../services/widget-content.service'

describe('PracticeComponent', () => {
  let component: PracticeComponent
  let fixture: ComponentFixture<PracticeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PracticeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'environment', useValue: {} },
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    TestBed.inject(WidgetContentService).currentMetaData = {} as any
    fixture = TestBed.createComponent(PracticeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
