import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { APP_BASE_HREF } from '@angular/common'

import { CkEditorComponent } from './ck-editor.component'
import { UploadService } from './services/upload.service'
import { ApiService } from './services/api.service'
import { AccessControlService } from './services/access-control.service'
import { LoaderService } from './services/loader.service'

// CKEDITOR is loaded at runtime as a global script, not an npm module
;(globalThis as any).CKEDITOR = { on: () => {}, dtd: { a: {} } }

describe('CkEditorComponent', () => {
  let component: CkEditorComponent
  let fixture: ComponentFixture<CkEditorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CkEditorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [UploadService, ApiService, AccessControlService, LoaderService, { provide: APP_BASE_HREF, useValue: '/' }],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CkEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
