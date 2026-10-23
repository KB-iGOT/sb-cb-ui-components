import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ElementHtmlComponent } from './element-html.component'

describe('ElementHtmlComponent', () => {
  let component: ElementHtmlComponent
  let fixture: ComponentFixture<ElementHtmlComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ElementHtmlComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementHtmlComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
