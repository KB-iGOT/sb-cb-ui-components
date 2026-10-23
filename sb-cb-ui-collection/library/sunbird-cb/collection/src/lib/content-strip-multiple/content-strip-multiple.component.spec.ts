import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripMultipleComponent } from './content-strip-multiple.component'

describe('ContentStripMultipleComponent', () => {
  let component: ContentStripMultipleComponent
  let fixture: ComponentFixture<ContentStripMultipleComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripMultipleComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripMultipleComponent)
    component = fixture.componentInstance
    component.widgetData = { strips: [] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
