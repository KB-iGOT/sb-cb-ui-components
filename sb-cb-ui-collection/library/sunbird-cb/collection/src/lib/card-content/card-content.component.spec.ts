import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { Pipe, PipeTransform } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatMenuModule } from '@angular/material/menu'

import { CardContentComponent } from './card-content.component'

// Supplied by the host app at runtime; stubbed here since this library doesn't declare or ship one itself.
@Pipe({ name: 'pipeContentRoute', standalone: false })
class MockPipeContentRoute implements PipeTransform {
  transform(value: unknown): unknown {
    return value
  }
}

@Pipe({ name: 'pipeHtmlTagRemoval', standalone: false })
class MockPipeHtmlTagRemoval implements PipeTransform {
  transform(value: unknown): unknown {
    return value
  }
}

describe('CardContentComponent', () => {
  let component: CardContentComponent
  let fixture: ComponentFixture<CardContentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardContentComponent, MockPipeContentRoute, MockPipeHtmlTagRemoval],
      imports: [HttpClientTestingModule, RouterTestingModule, MatMenuModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardContentComponent)
    component = fixture.componentInstance
    component.widgetData = { content: {} } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
