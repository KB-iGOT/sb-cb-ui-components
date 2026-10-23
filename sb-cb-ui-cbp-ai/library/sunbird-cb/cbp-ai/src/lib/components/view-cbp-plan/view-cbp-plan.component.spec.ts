import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ViewCbpPlanComponent } from './view-cbp-plan.component';

describe('ViewCbpPlanComponent', () => {
  let component: ViewCbpPlanComponent;
  let fixture: ComponentFixture<ViewCbpPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCbpPlanComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { competencies: [] } }
      ]
    });
    fixture = TestBed.createComponent(ViewCbpPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
