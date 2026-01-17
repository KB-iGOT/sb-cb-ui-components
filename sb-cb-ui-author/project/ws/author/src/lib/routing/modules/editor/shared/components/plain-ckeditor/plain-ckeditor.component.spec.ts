import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PlainCKEditorComponent } from './plain-ckeditor.component'

describe('PlainCKEditorComponent', () => {
  let component: PlainCKEditorComponent
  let fixture: ComponentFixture<PlainCKEditorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlainCKEditorComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainCKEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
