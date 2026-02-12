import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { IprDialogComponent } from './ipr-dialog.component'

describe('IprDialogComponent', () => {
  let component: IprDialogComponent
  let fixture: ComponentFixture<IprDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IprDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(IprDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
