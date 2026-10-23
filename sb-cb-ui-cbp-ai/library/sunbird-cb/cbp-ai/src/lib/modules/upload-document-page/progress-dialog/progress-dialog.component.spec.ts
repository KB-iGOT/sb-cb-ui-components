import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ProgressDialogComponent } from './progress-dialog.component';

describe('ProgressDialogComponent', () => {
  let component: ProgressDialogComponent;
  let fixture: ComponentFixture<ProgressDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { progress: 0, message: '' } }
      ]
    });
    fixture = TestBed.createComponent(ProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
