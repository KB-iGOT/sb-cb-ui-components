import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ImageMapComponent } from './image-map.component'

describe('ImageMapComponent', () => {
  let component: ImageMapComponent
  let fixture: ComponentFixture<ImageMapComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageMapComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMapComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
