import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { EntityCardComponent } from './entity-card.component'

describe('EntityCardComponent', () => {
  let component: EntityCardComponent
  let fixture: ComponentFixture<EntityCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EntityCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
