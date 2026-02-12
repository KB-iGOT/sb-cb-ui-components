import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UrlUploadComponent } from './url-upload.component'

describe('UrlUploadComponent', () => {
  let component: UrlUploadComponent
  let fixture: ComponentFixture<UrlUploadComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UrlUploadComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
