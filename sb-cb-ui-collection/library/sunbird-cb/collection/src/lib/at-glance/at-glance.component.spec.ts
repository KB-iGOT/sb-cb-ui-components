import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { Pipe, PipeTransform } from '@angular/core'

import { AtGlanceComponent } from './at-glance.component'

// Supplied by the host app at runtime; stubbed here since this library doesn't declare or ship one itself.
@Pipe({ name: 'pipeDurationTransform', standalone: false })
class MockPipeDurationTransform implements PipeTransform {
  transform(value: unknown): unknown {
    return value
  }
}

describe('AtGlanceComponent', () => {
  let component: AtGlanceComponent
  let fixture: ComponentFixture<AtGlanceComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AtGlanceComponent, MockPipeDurationTransform],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AtGlanceComponent)
    component = fixture.componentInstance
    component.widgetData = { counts: {} } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
