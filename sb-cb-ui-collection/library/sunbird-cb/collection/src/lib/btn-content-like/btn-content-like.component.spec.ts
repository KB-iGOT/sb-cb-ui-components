import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnContentLikeComponent } from './btn-content-like.component'

describe('BtnContentLikeComponent', () => {
  let component: BtnContentLikeComponent
  let fixture: ComponentFixture<BtnContentLikeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnContentLikeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnContentLikeComponent)
    component = fixture.componentInstance
    component.widgetData = {} as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
