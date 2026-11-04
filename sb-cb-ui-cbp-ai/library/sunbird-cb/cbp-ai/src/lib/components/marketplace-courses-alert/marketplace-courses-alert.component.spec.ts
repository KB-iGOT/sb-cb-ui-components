import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MarketplaceCoursesAlertComponent, MarketplaceCoursesAlertData } from './marketplace-courses-alert.component';

describe('MarketplaceCoursesAlertComponent', () => {
  let component: MarketplaceCoursesAlertComponent;
  let fixture: ComponentFixture<MarketplaceCoursesAlertComponent>;
  let dialogRef: { close: jest.Mock };

  function createComponent(data: MarketplaceCoursesAlertData) {
    dialogRef = { close: jest.fn() };
    TestBed.configureTestingModule({
      declarations: [MarketplaceCoursesAlertComponent],
      imports: [FormsModule, MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    });
    fixture = TestBed.createComponent(MarketplaceCoursesAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  const element = (): HTMLElement => fixture.nativeElement;

  describe('with a single designation', () => {
    beforeEach(() => createComponent({
      rows: [{ name: 'Secretary', marketplace: 2, free: 1, paid: 1 }],
      confirmLabel: 'Save Courses'
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the designation table without the Total row', () => {
      const bodyRows = element().querySelectorAll('.mkt-table tbody tr');
      expect(bodyRows.length).toBe(1);
      expect(bodyRows[0].textContent).toContain('Secretary');
      expect(element().querySelector('.mkt-table tfoot')).toBeNull();
    });

    it('should use the confirm label passed in', () => {
      expect(element().querySelector('.mkt-btn-confirm').textContent.trim()).toBe('Save Courses');
    });
  });

  describe('with multiple designations', () => {
    beforeEach(() => createComponent({
      rows: [
        { name: 'Secretary', marketplace: 2, free: 1, paid: 1 },
        { name: 'Under Secretary', marketplace: 0, free: 0, paid: 0 },
        { name: 'Director', marketplace: 3, free: 0, paid: 3 }
      ]
    }));

    it('should drop designations without marketplace courses and total the rest', () => {
      expect(component.rows.map(row => row.name)).toEqual(['Secretary', 'Director']);
      expect(component.total).toEqual({ marketplace: 5, free: 1, paid: 4 });
    });

    it('should show the Total row', () => {
      expect(element().querySelector('.mkt-table tfoot').textContent).toContain('Total (2 designations)');
    });

    it('should default the confirm label to Proceed', () => {
      expect(component.confirmLabel).toBe('Proceed');
    });
  });

  it('should show "-" when the designation name is missing', () => {
    createComponent({ rows: [{ marketplace: 1, free: 1, paid: 0 }] });
    expect(element().querySelector('.mkt-table tbody td').textContent.trim()).toBe('-');
  });

  describe('actions', () => {
    beforeEach(() => createComponent({ rows: [{ name: 'Secretary', marketplace: 1, free: 0, paid: 1 }] }));

    it('should not close on confirm until acknowledged', () => {
      component.confirm();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should close with true on confirm once acknowledged', () => {
      component.acknowledged = true;
      component.confirm();
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close with false on cancel', () => {
      component.cancel();
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });
});
