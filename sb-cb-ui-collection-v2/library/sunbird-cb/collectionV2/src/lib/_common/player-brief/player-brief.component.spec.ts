import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { PlayerBriefComponent } from './player-brief.component'

describe('PlayerBriefComponent', () => {
  let component: PlayerBriefComponent
  let fixture: ComponentFixture<PlayerBriefComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerBriefComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBriefComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
