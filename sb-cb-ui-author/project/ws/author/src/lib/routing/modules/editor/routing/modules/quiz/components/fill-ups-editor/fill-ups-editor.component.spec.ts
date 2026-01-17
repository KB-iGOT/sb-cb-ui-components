import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FillUpsEditorComponent } from './fill-ups-editor.component'

describe('FillUpsEditorComponent', () => {
  let component: FillUpsEditorComponent
  let fixture: ComponentFixture<FillUpsEditorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FillUpsEditorComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FillUpsEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
