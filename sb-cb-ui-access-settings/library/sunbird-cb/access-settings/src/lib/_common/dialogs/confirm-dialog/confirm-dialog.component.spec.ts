import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { NsAccessControlConfig } from '../../../_models/access-control.model';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: { close: jest.Mock };

  const setup = (type: string) => {
    dialogRef = { close: jest.fn() };
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { type } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    setup('delete');
    expect(component).toBeTruthy();
  });

  it('should close with Confirm on yes', () => {
    setup('delete');
    component.confirmYes();
    expect(dialogRef.close).toHaveBeenCalledWith({ action: NsAccessControlConfig.IActions.Confirm });
  });

  it('should close with Reject on no', () => {
    setup('delete');
    component.confirmNo();
    expect(dialogRef.close).toHaveBeenCalledWith({ action: NsAccessControlConfig.IActions.Reject });
  });

  describe('confirm-update-reusable-group', () => {
    beforeEach(() => setup('confirm-update-reusable-group'));

    it('should ask to confirm the update of a reusable user group', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Are you sure you want to update?');
      expect(text).toContain('Editing the reusable user group may impact learners who have already accessed this training plan.');
      expect(text).toContain('Please confirm before proceeding.');
    });

    it('should offer Cancel and Yes', () => {
      const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')).map((button: any) => button.textContent.trim());
      expect(buttons).toEqual(['Cancel', 'Yes']);
    });
  });
});
