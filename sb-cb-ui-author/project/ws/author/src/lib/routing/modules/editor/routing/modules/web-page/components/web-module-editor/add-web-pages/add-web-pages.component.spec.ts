import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AddWebPagesComponent } from './add-web-pages.component'

describe('AddWebPagesComponent', () => {
  let component: AddWebPagesComponent
  let fixture: ComponentFixture<AddWebPagesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddWebPagesComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWebPagesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
