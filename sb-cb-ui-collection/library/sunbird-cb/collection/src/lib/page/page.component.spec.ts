import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatMenuModule } from '@angular/material/menu'
import { NPSGridService } from '@sunbird-cb/utils-v2'

import { PageComponent } from './page.component'

describe('PageComponent', () => {
  let component: PageComponent
  let fixture: ComponentFixture<PageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatMenuModule],
      providers: [
      { provide: 'environment', useValue: {} },
      NPSGridService
    ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
