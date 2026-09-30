import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AccessControlComponent } from './access-control.component';
import { NsAccessControlConfig } from '../../_models/access-control.model';
import { ALL_ORGANISATIONS_SELECTION } from '../../_constants/app.constants';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { SaveUserGroupComponent } from '../dialogs/save-user-group/save-user-group.component';

describe('AccessControlComponent', () => {
  let component: AccessControlComponent;
  let dialog: { open: jest.Mock };
  let accessControlService: any;
  const fb = new FormBuilder();

  const dialogResult = (result: any) => ({ afterClosed: () => of(result) });

  const addGroup = (savedUserGroupId: string, selections: any[] = ['org-a']) => {
    component.userGroup.push(
      fb.group({
        id: ['group-1'],
        savedUserGroupId: [savedUserGroupId],
        name: ['User Group 1'],
        conditions: fb.array([
          fb.group({
            id: ['condition-1'],
            entity: [NsAccessControlConfig.SelectionType.Organizations],
            conditionType: ['is'],
            selections: [selections]
          })
        ])
      })
    );
  };

  beforeEach(() => {
    dialog = { open: jest.fn() };
    accessControlService = {
      isL0MdoUser: jest.fn(() => false),
      areAllOrgHierarchyOrgsSelected: jest.fn(() => false),
      getLoggedInOrgId: jest.fn(() => 'own-org'),
      enableDeputation: jest.fn()
    };
    component = new AccessControlComponent(dialog as any, fb, accessControlService, {} as any, {} as any);
    component.config = {
      application: NsAccessControlConfig.Application.MDO,
      userConfig: { rootOrgId: 'own-org', org: { isCCA: true } }
    } as any;
    component.isCCA = true;
    component.accessControlCriteriaSelection = { optionsEntity: [] } as any;
    component.initForm();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isAllOrganisationsSelection', () => {
    it('should be true for the "Select all" selection on MDO', () => {
      expect(component.isAllOrganisationsSelection([ALL_ORGANISATIONS_SELECTION])).toBe(true);
    });

    it('should be true for a non CCA MDO as well', () => {
      component.isCCA = false;
      expect(component.isAllOrganisationsSelection([ALL_ORGANISATIONS_SELECTION])).toBe(true);
    });

    it('should be false for picked organisations', () => {
      expect(component.isAllOrganisationsSelection(['org-a'])).toBe(false);
    });

    it('should be false on the creation portal', () => {
      component.config.application = NsAccessControlConfig.Application.Creation_Portal;
      expect(component.isAllOrganisationsSelection([ALL_ORGANISATIONS_SELECTION])).toBe(false);
    });
  });

  describe('organisation criteria', () => {
    it('should save "Select all" as an empty rootOrgId list', () => {
      expect((component as any).createOrganisationCriteria([ALL_ORGANISATIONS_SELECTION])).toEqual({
        criteriaKey: 'rootOrgId',
        criteriaValue: []
      });
    });

    it('should save "Select all" of a L0 as its own ministry / state', () => {
      component.isCCA = false;
      component.canSelectOrgHierarchy = true;
      accessControlService.isL0MdoUser.mockReturnValue(true);

      expect((component as any).createOrganisationCriteria([ALL_ORGANISATIONS_SELECTION])).toEqual({
        criteriaKey: 'ministryOrStateId',
        criteriaValue: ['own-org']
      });
    });

    it('should save "Select all" of a L1 -> L10 as every organisation of its branch', () => {
      component.isCCA = false;
      component.canSelectOrgHierarchy = true;
      accessControlService.getOrgHierarchyOrgIds = jest.fn(() => ['l1-org', 'l2-org']);

      expect((component as any).createOrganisationCriteria([ALL_ORGANISATIONS_SELECTION])).toEqual({
        criteriaKey: 'rootOrgId',
        criteriaValue: ['l1-org', 'l2-org']
      });
    });

    it('should reopen the whole branch of a L1 -> L10 as "Select all"', () => {
      component.isCCA = false;
      component.canSelectOrgHierarchy = true;
      accessControlService.areAllOrgHierarchyOrgsSelected.mockReturnValue(true);

      expect((component as any).isSavedBranchSelectAll('rootOrgId', ['l1-org', 'l2-org'])).toBe(true);
    });

    it('should reopen a saved ministry / state of a L0 as "Select all"', () => {
      component.isCCA = false;
      component.canSelectOrgHierarchy = true;
      accessControlService.isL0MdoUser.mockReturnValue(true);

      expect((component as any).getMinistryOrStateSelections(['own-org'])).toEqual([ALL_ORGANISATIONS_SELECTION]);
    });

    it('should save picked organisations as they were picked', () => {
      expect((component as any).createOrganisationCriteria(['org-a', 'org-b'])).toEqual({
        criteriaKey: 'rootOrgId',
        criteriaValue: ['org-a', 'org-b']
      });
    });

    it('should not append the own organisation to a non CCA group that selected all organisations', () => {
      component.isCCA = false;
      const criteria = [(component as any).createOrganisationCriteria([ALL_ORGANISATIONS_SELECTION])];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria).toEqual([{ criteriaKey: 'rootOrgId', criteriaValue: [] }]);
    });
  });

  describe('isSavedAllOrganisationsCriteria', () => {
    const isSavedAll = (criteriaKey: string, criteriaValue: any) =>
      (component as any).isSavedAllOrganisationsCriteria(criteriaKey, criteriaValue);

    it('should read an empty rootOrgId list as "Select all"', () => {
      expect(isSavedAll('rootOrgId', [])).toBe(true);
    });

    it('should read a rootOrgId without a list as "Select all"', () => {
      expect(isSavedAll('rootOrgId', null)).toBe(true);
      expect(isSavedAll('rootOrgId', undefined)).toBe(true);
    });

    it('should not read picked organisations as "Select all"', () => {
      expect(isSavedAll('rootOrgId', ['org-a'])).toBe(false);
    });

    it('should not read any other empty criteria as "Select all"', () => {
      expect(isSavedAll('designation', [])).toBe(false);
    });

    it('should not read it as "Select all" on the creation portal', () => {
      component.config.application = NsAccessControlConfig.Application.Creation_Portal;
      expect(isSavedAll('rootOrgId', [])).toBe(false);
    });
  });

  describe('restoring a saved "Select all" group', () => {
    beforeEach(() => {
      jest.spyOn(component, 'processDisableAddConditionOnClose').mockImplementation(() => undefined);
      jest.spyOn(component, 'calculateUserCountForUserGroup').mockResolvedValue(undefined);
    });

    it('should show every organisation as selected', () => {
      const isAdded = (component as any).addUserGroupFromCriteria('Group', [{ criteriaKey: 'rootOrgId', criteriaValue: [] }]);

      expect(isAdded).toBe(true);
      const condition = component.ruleConditions(0).at(0);
      expect(condition.get('entity')?.value).toBe(NsAccessControlConfig.SelectionType.Organizations);
      expect(condition.get('selections')?.value).toEqual([ALL_ORGANISATIONS_SELECTION]);
    });

    it('should skip the organisation condition for a MDO that is offered none', () => {
      component.isCCA = false;
      component.canSelectOrgHierarchy = false;

      const isAdded = (component as any).addUserGroupFromCriteria('Group', [{ criteriaKey: 'rootOrgId', criteriaValue: [] }]);

      expect(isAdded).toBe(false);
    });
  });

  describe('calculateUserCountForUserGroup', () => {
    it('should read the user count across every organisation when a CCA selected all of them', async () => {
      accessControlService.accessControlConfig = jest.fn(() => component.config);
      accessControlService.validateUser = jest.fn(() => of({ result: { response: { count: 12 } } }));
      addGroup('', [ALL_ORGANISATIONS_SELECTION]);

      await component.calculateUserCountForUserGroup(0);

      expect(accessControlService.validateUser).toHaveBeenCalledWith({
        request: { filters: { status: 1 }, fields: ['identifier', 'rootOrgId', 'firstName'] }
      });
      expect(component.userCount[0]).toBe(12);
    });
  });

  describe('saveReusableUserGroups', () => {
    let updateUserGroup: jest.SpyInstance;
    let createUserGroup: jest.SpyInstance;

    beforeEach(() => {
      updateUserGroup = jest.spyOn(component, 'updateUserGroup').mockImplementation(() => undefined);
      createUserGroup = jest.spyOn(component, 'createUserGroup').mockImplementation(() => undefined);
    });

    it('should confirm first, then ask for the name, then update a saved group', () => {
      addGroup('saved-group-id');
      dialog.open
        .mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Confirm }))
        .mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Confirm, userGroupName: 'Renamed group' }));

      component.saveReusableUserGroups(0);

      expect(dialog.open.mock.calls[0][0]).toBe(ConfirmDialogComponent);
      expect(dialog.open.mock.calls[0][1].data).toEqual({ type: 'confirm-update-reusable-group' });
      expect(dialog.open.mock.calls[1][0]).toBe(SaveUserGroupComponent);
      expect(updateUserGroup).toHaveBeenCalledWith(
        {
          request: {
            userGroupId: 'saved-group-id',
            userGroupName: 'Renamed group',
            criteria: [{ criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] }]
          }
        },
        0
      );
      expect(createUserGroup).not.toHaveBeenCalled();
    });

    it('should not ask for the name when the update is not confirmed', () => {
      addGroup('saved-group-id');
      dialog.open.mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Reject }));

      component.saveReusableUserGroups(0);

      expect(dialog.open).toHaveBeenCalledTimes(1);
      expect(updateUserGroup).not.toHaveBeenCalled();
    });

    it('should not update when the name dialog is cancelled', () => {
      addGroup('saved-group-id');
      dialog.open
        .mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Confirm }))
        .mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Reject }));

      component.saveReusableUserGroups(0);

      expect(updateUserGroup).not.toHaveBeenCalled();
    });

    it('should go straight to the name dialog and create a group that is not saved yet', () => {
      addGroup('');
      dialog.open.mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Confirm, userGroupName: 'New group' }));

      component.saveReusableUserGroups(0);

      expect(dialog.open).toHaveBeenCalledTimes(1);
      expect(dialog.open.mock.calls[0][0]).toBe(SaveUserGroupComponent);
      expect(createUserGroup).toHaveBeenCalledWith(
        { request: { userGroupName: 'New group', criteria: [{ criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] }] } },
        0
      );
      expect(updateUserGroup).not.toHaveBeenCalled();
    });

    it('should save "Select all" as an empty rootOrgId list', () => {
      addGroup('', [ALL_ORGANISATIONS_SELECTION]);
      dialog.open.mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Confirm, userGroupName: 'All orgs' }));

      component.saveReusableUserGroups(0);

      expect(createUserGroup).toHaveBeenCalledWith(
        { request: { userGroupName: 'All orgs', criteria: [{ criteriaKey: 'rootOrgId', criteriaValue: [] }] } },
        0
      );
    });
  });
});
