import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { SlidersComponent } from './sliders.component'

describe('SlidersComponent', () => {
  let component: SlidersComponent
  let fixture: ComponentFixture<SlidersComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [SlidersComponent],
      providers: [
        { provide: 'environment', useValue: {} }
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidersComponent)
    component = fixture.componentInstance
    component.widgetData = [] as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
