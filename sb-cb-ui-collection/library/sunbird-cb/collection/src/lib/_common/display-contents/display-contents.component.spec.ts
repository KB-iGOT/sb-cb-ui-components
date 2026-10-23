import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { Pipe, PipeTransform } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { DisplayContentsComponent } from './display-contents.component'

// Supplied by the host app at runtime; stubbed here since this library doesn't declare or ship one itself.
@Pipe({ name: 'pipeLimitTo', standalone: false })
class MockPipeLimitTo implements PipeTransform {
  transform(value: unknown): unknown {
    return value
  }
}

describe('DisplayContentsComponent', () => {
  let component: DisplayContentsComponent
  let fixture: ComponentFixture<DisplayContentsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayContentsComponent, MockPipeLimitTo],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContentsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
