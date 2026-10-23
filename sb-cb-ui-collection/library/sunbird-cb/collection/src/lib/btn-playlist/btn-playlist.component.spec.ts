import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnPlaylistComponent } from './btn-playlist.component'

describe('BtnPlaylistComponent', () => {
  let component: BtnPlaylistComponent
  let fixture: ComponentFixture<BtnPlaylistComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnPlaylistComponent],
      imports: [HttpClientTestingModule, MatMenuModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPlaylistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
