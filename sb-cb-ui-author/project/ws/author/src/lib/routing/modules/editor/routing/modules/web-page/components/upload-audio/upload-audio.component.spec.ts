import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UploadAudioComponent } from './upload-audio.component'

describe('UploadAudioComponent', () => {
  let component: UploadAudioComponent
  let fixture: ComponentFixture<UploadAudioComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAudioComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAudioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
