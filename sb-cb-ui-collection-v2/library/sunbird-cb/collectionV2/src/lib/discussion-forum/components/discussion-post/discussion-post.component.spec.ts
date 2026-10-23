import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { DiscussionPostComponent } from './discussion-post.component'

describe('DiscussionPostComponent', () => {
  let component: DiscussionPostComponent
  let fixture: ComponentFixture<DiscussionPostComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionPostComponent],
      imports: [HttpClientTestingModule, MatMenuModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionPostComponent)
    component = fixture.componentInstance
    component.post = { postCreator: {}, postContent: { title: '' } } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
