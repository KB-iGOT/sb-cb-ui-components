import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ContentStripWithTabsComponent } from './content-strip-with-tabs.component'

describe('ContentStripWithTabsComponent', () => {
  let component: ContentStripWithTabsComponent
  let fixture: ComponentFixture<ContentStripWithTabsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripWithTabsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: 'environment', useValue: {} }
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripWithTabsComponent)
    component = fixture.componentInstance
    component.widgetData = { strips: [] } as any
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
