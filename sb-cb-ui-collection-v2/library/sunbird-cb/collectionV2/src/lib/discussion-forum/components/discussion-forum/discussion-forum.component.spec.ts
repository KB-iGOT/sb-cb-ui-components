import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { DiscussionForumComponent } from './discussion-forum.component'

describe('DiscussionForumComponent', () => {
  let component: DiscussionForumComponent
  let fixture: ComponentFixture<DiscussionForumComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionForumComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionForumComponent)
    component = fixture.componentInstance
    component.widgetData = {} as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
