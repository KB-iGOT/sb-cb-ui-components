import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { PlayerAudioComponent } from './player-audio.component'

describe('PlayerAudioComponent', () => {
  let component: PlayerAudioComponent
  let fixture: ComponentFixture<PlayerAudioComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerAudioComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAudioComponent)
    component = fixture.componentInstance
    component.widgetData = {} as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
