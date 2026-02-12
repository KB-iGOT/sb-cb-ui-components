import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CommentsDialogComponent } from './comments-dialog.component'

describe('CommentsDialogComponent', () => {
  let component: CommentsDialogComponent
  let fixture: ComponentFixture<CommentsDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
