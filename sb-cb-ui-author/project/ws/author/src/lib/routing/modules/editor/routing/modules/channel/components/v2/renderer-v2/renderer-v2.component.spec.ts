import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RendererV2Component } from './renderer-v2.component'

describe('RendererV2Component', () => {
  let component: RendererV2Component
  let fixture: ComponentFixture<RendererV2Component>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RendererV2Component],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RendererV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
