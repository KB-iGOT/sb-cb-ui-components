import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSelectionsComponent } from './organisation-selections.component';

describe('OrganisationSelectionsComponent', () => {
  let component: OrganisationSelectionsComponent;
  let fixture: ComponentFixture<OrganisationSelectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationSelectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationSelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
