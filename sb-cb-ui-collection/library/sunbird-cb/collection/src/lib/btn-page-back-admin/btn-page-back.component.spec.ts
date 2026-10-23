import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnPageBackAdminComponent } from './btn-page-back.component'

describe('BtnPageBackAdminComponent', () => {
  let component: BtnPageBackAdminComponent
  let fixture: ComponentFixture<BtnPageBackAdminComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPageBackAdminComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPageBackAdminComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
