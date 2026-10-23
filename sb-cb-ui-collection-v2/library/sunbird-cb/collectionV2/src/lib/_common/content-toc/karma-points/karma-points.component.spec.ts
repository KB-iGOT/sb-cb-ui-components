import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { KarmaPointsComponent } from './karma-points.component'

describe('KarmaPointsComponent', () => {
  let component: KarmaPointsComponent
  let fixture: ComponentFixture<KarmaPointsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [KarmaPointsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaPointsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
