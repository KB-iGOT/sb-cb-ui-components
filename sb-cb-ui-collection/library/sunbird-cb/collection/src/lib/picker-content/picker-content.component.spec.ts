import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatMenuModule } from '@angular/material/menu'

import { PickerContentComponent } from './picker-content.component'

describe('PickerContentComponent', () => {
  let component: PickerContentComponent
  let fixture: ComponentFixture<PickerContentComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PickerContentComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatMenuModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerContentComponent)
    component = fixture.componentInstance
    component.widgetData = {} as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
