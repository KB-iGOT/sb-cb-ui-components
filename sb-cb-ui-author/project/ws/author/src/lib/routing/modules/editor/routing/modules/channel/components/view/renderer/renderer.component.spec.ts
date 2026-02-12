import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RendererComponent } from './renderer.component'

describe('RendererComponent', () => {
  let component: RendererComponent
  let fixture: ComponentFixture<RendererComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RendererComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RendererComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
