import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnSettingsComponent } from './btn-settings.component'

describe('BtnSettingsComponent', () => {
  let component: BtnSettingsComponent
  let fixture: ComponentFixture<BtnSettingsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnSettingsComponent],
      imports: [HttpClientTestingModule, MatMenuModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnSettingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
