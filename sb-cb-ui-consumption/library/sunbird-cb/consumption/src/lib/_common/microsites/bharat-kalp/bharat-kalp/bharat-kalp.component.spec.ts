import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BharatKalpComponent } from './bharat-kalp.component'

describe('BharatKalpComponent', () => {
  let component: BharatKalpComponent
  let fixture: ComponentFixture<BharatKalpComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BharatKalpComponent],
    })
    fixture = TestBed.createComponent(BharatKalpComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
