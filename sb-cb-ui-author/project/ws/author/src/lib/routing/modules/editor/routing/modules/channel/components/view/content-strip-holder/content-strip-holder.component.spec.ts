import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ContentStripHolderComponent } from './content-strip-holder.component'

describe('ContentStripHolderComponent', () => {
  let component: ContentStripHolderComponent
  let fixture: ComponentFixture<ContentStripHolderComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripHolderComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripHolderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
