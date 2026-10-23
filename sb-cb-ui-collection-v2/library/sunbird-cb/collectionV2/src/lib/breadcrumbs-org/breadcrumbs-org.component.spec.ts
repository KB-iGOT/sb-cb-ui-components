import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BreadcrumbsOrgComponent } from './breadcrumbs-org.component'

describe('BreadcrumbsOrgComponent', () => {
  let component: BreadcrumbsOrgComponent
  let fixture: ComponentFixture<BreadcrumbsOrgComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsOrgComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsOrgComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
