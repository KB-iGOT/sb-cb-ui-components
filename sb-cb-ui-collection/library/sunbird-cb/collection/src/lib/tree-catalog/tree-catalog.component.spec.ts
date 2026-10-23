import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { TreeCatalogComponent } from './tree-catalog.component'

describe('TreeCatalogComponent', () => {
  let component: TreeCatalogComponent
  let fixture: ComponentFixture<TreeCatalogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TreeCatalogComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCatalogComponent)
    component = fixture.componentInstance
    component.widgetData = {} as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
