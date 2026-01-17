import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CurateComponent } from './curate.component'

describe('CurateComponent', () => {
  let component: CurateComponent
  let fixture: ComponentFixture<CurateComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CurateComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CurateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
