import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { PlayerPdfComponent } from './player-pdf.component'

describe('PlayerPdfComponent', () => {
  let component: PlayerPdfComponent
  let fixture: ComponentFixture<PlayerPdfComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerPdfComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPdfComponent)
    component = fixture.componentInstance
    component.widgetData = { disableTelemetry: false } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
