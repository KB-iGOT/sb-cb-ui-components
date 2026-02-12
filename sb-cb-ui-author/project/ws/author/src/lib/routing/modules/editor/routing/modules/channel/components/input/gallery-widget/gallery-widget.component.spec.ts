import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { GalleryWidgetComponent } from './gallery-widget.component'

describe('GalleryWidgetComponent', () => {
  let component: GalleryWidgetComponent
  let fixture: ComponentFixture<GalleryWidgetComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryWidgetComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryWidgetComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
