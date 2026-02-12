import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { SearchTemplateComponent } from './search-template.component'

describe('SearchTemplateComponent', () => {
  let component: SearchTemplateComponent
  let fixture: ComponentFixture<SearchTemplateComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTemplateComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTemplateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
