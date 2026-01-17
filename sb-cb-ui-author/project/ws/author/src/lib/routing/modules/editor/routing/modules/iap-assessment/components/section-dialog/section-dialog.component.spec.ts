import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { SectionDialogComponent } from './section-dialog.component'

describe('SectionDialogComponent', () => {
  let component: SectionDialogComponent
  let fixture: ComponentFixture<SectionDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SectionDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
