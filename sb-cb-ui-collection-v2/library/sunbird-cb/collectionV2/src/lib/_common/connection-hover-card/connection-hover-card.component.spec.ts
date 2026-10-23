import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ConnectionHoverCardComponent } from './connection-hover-card.component'

describe('ConnectionHoverCardComponent', () => {
  let component: ConnectionHoverCardComponent
  let fixture: ComponentFixture<ConnectionHoverCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionHoverCardComponent],
      imports: [RouterTestingModule],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionHoverCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
