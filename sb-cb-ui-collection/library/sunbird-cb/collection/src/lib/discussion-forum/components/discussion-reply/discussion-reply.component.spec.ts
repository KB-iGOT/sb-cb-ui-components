import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { DiscussionReplyComponent } from './discussion-reply.component'

describe('DiscussionReplyComponent', () => {
  let component: DiscussionReplyComponent
  let fixture: ComponentFixture<DiscussionReplyComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionReplyComponent],
      imports: [HttpClientTestingModule, MatMenuModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionReplyComponent)
    component = fixture.componentInstance
    component.reply = { postCreator: {}, postContent: { body: '' } } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
