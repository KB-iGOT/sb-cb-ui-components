import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ContentStripInputComponent } from './content-strip-input.component'

describe('ContentStripInputComponent', () => {
  let component: ContentStripInputComponent
  let fixture: ComponentFixture<ContentStripInputComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripInputComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
