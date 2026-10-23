import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnPlaylistSelectionComponent } from './btn-playlist-selection.component'

describe('BtnPlaylistSelectionComponent', () => {
  let component: BtnPlaylistSelectionComponent
  let fixture: ComponentFixture<BtnPlaylistSelectionComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPlaylistSelectionComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPlaylistSelectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
