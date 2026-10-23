import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripNewMultipleComponent } from './content-strip-new-multiple.component'

describe('ContentStripNewMultipleComponent', () => {
  let component: ContentStripNewMultipleComponent
  let fixture: ComponentFixture<ContentStripNewMultipleComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripNewMultipleComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripNewMultipleComponent)
    component = fixture.componentInstance
    component.widgetData = { strips: [] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
