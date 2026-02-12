import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { StatusTrackComponent } from './status-track.component'

describe('StatusTrackComponent', () => {
  let component: StatusTrackComponent
  let fixture: ComponentFixture<StatusTrackComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StatusTrackComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTrackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
