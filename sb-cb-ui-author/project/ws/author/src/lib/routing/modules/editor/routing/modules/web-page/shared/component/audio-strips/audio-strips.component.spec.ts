import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AudioStripsComponent } from './audio-strips.component'

describe('AudioStripsComponent', () => {
  let component: AudioStripsComponent
  let fixture: ComponentFixture<AudioStripsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AudioStripsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioStripsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
