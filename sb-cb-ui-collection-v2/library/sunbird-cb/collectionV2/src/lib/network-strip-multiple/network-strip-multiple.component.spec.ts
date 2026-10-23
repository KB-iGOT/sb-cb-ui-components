import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { NetworkStripMultipleComponent } from './network-strip-multiple.component'

describe('NetworkStripMultipleComponent', () => {
  let component: NetworkStripMultipleComponent
  let fixture: ComponentFixture<NetworkStripMultipleComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkStripMultipleComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkStripMultipleComponent)
    component = fixture.componentInstance
    component.widgetData = { strips: [] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
