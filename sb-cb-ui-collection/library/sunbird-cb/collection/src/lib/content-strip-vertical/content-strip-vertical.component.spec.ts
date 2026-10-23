import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripVerticalComponent } from './content-strip-vertical.component'

describe('ContentStripVerticalComponent', () => {
  let component: ContentStripVerticalComponent
  let fixture: ComponentFixture<ContentStripVerticalComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripVerticalComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripVerticalComponent)
    component = fixture.componentInstance
    component.widgetData = { strips: [] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
