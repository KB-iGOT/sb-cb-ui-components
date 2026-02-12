import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UnpublishDialogComponent } from './unpublish-dialog.component'

describe('UnpublishDialogComponent', () => {
  let component: UnpublishDialogComponent
  let fixture: ComponentFixture<UnpublishDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UnpublishDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
