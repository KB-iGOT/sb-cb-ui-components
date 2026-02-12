import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AceEditorComponent } from './ace-editor.component'

describe('AceEditorComponent', () => {
  let component: AceEditorComponent
  let fixture: ComponentFixture<AceEditorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AceEditorComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AceEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
