import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { TreeCatalogComponent } from './tree-catalog.component'

describe('TreeCatalogComponent', () => {
  let component: TreeCatalogComponent
  let fixture: ComponentFixture<TreeCatalogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TreeCatalogComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCatalogComponent)
    component = fixture.componentInstance
    component.widgetData = { url: '', type: '', tags: [], baseClickUrl: '' } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
