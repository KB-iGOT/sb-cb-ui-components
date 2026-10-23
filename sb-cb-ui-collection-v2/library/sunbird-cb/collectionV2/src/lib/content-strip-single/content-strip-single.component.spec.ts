import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripSingleComponent } from './content-strip-single.component'

describe('ContentStripSingleComponent', () => {
  let component: ContentStripSingleComponent
  let fixture: ComponentFixture<ContentStripSingleComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripSingleComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripSingleComponent)
    component = fixture.componentInstance
    component.widgetData = { loader: false, request: {} } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
