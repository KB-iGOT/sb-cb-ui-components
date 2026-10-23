import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ListPopupComponent } from './list-popup.component';

describe('ListPopupComponent', () => {
  let component: ListPopupComponent;
  let fixture: ComponentFixture<ListPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListPopupComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(ListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
