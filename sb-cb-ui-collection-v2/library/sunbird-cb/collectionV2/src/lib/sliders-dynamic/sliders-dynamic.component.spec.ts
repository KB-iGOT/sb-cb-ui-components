import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { SlidersDynamicComponent } from './sliders-dynamic.component'

describe('SlidersComponent', () => {
  let component: SlidersDynamicComponent
  let fixture: ComponentFixture<SlidersDynamicComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [SlidersDynamicComponent],
      providers: [
        { provide: 'environment', useValue: {} }
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidersDynamicComponent)
    component = fixture.componentInstance
    component.widgetData = { sliderData: [] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
