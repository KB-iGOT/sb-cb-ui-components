import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { IntranetSelectorComponent } from './intranet-selector.component'

describe('IntranetSelectorComponent', () => {
  let component: IntranetSelectorComponent
  let fixture: ComponentFixture<IntranetSelectorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IntranetSelectorComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(IntranetSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
