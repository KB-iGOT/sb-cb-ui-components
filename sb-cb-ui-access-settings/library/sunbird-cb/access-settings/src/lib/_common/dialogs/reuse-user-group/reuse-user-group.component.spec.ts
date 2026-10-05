import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReuseUserGroupComponent } from './reuse-user-group.component';
import { AccessControlService } from '../../../_services/access-control.service';

describe('ReuseUserGroupComponent', () => {
  let component: ReuseUserGroupComponent;
  let accessControlConfig: any;

  const conditionLabel = (entry: any) => (component as any).toConditionLabel(entry);

  beforeEach(() => {
    accessControlConfig = signal({ userConfig: { org: { isCCA: true } } });
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { optionsEntity: [], usedUserGroupIds: [] } },
        { provide: AccessControlService, useValue: { accessControlConfig } }
      ]
    });
    component = TestBed.runInInjectionContext(() => new ReuseUserGroupComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('organisation condition label', () => {
    it('should label a "Select all" organisation condition', () => {
      expect(conditionLabel({ criteriaKey: 'rootOrgId', criteriaValue: [] })).toBe('Organisation is all');
    });

    it('should label picked organisations by their count', () => {
      expect(conditionLabel({ criteriaKey: 'rootOrgId', criteriaValue: ['org-a', 'org-b'] })).toBe('Organisation is any of 2');
      expect(conditionLabel({ criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] })).toBe('Organisation is 1');
    });

    it('should hide the organisation condition from a non CCA MDO', () => {
      accessControlConfig.set({ userConfig: { org: { isCCA: false } } });
      expect(conditionLabel({ criteriaKey: 'rootOrgId', criteriaValue: [] })).toBe('');
    });

    it('should still hide any other empty condition', () => {
      expect(conditionLabel({ criteriaKey: 'designation', criteriaValue: [] })).toBe('');
    });
  });
});
