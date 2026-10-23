import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ConnectionNameComponent } from './connection-name.component'

describe('ConnectionNameComponent', () => {
  let component: ConnectionNameComponent
  let fixture: ComponentFixture<ConnectionNameComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionNameComponent],
      imports: [RouterTestingModule],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionNameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
