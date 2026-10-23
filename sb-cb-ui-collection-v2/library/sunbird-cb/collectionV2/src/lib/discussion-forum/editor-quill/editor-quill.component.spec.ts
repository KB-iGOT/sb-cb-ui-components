import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { QuillModule } from 'ngx-quill'

import { EditorQuillComponent } from './editor-quill.component'

describe('EditorQuillComponent', () => {
  let component: EditorQuillComponent
  let fixture: ComponentFixture<EditorQuillComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, QuillModule.forRoot()],
      declarations: [EditorQuillComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorQuillComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
