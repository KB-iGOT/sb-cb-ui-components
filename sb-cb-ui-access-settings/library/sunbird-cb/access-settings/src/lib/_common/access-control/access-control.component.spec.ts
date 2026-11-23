import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccessControlComponent } from './access-control.component';
import { NsAccessControlConfig } from '../../_models/access-control.model';
import { ALL_ORGANISATIONS_SELECTION, CRITERIA_LABELS, MINISTRY_OR_STATE_FILTER_KEY } from '../../_constants/app.constants';
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
      getOrgHierarchyOrgIds: jest.fn(() => []),
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

  describe('organisation selection label', () => {
    it('should show the numeric count when all organisations are selected on MDO', () => {
      accessControlService.getOrgHierarchyOrgIds.mockReturnValue(Array.from({ length: 104 }, (_, index) => `org-${index}`));

      expect(component.getMdoOrganisationSelectionLabel([ALL_ORGANISATIONS_SELECTION])).toBe('104 items selected');
      expect(component.getMdoOrganisationSelectionLabel([ALL_ORGANISATIONS_SELECTION])).not.toContain('All organisations selected');
    });

    it('should show the numeric count for a partial MDO selection', () => {
      expect(component.getMdoOrganisationSelectionLabel(Array.from({ length: 25 }, (_, index) => `org-${index}`))).toBe('25 items selected');
    });

    it('should use the singular label for one MDO selection', () => {
      expect(component.getMdoOrganisationSelectionLabel(['org-a'])).toBe('1 item selected');
    });

    it('should use the plural label for multiple MDO selections', () => {
      expect(component.getMdoOrganisationSelectionLabel(['org-a', 'org-b'])).toBe('2 items selected');
    });

    it('should show the restored saved-filter count on MDO', () => {
      jest.spyOn(component, 'processDisableAddConditionOnClose').mockImplementation(() => undefined);
      jest.spyOn(component, 'calculateUserCountForUserGroup').mockResolvedValue(undefined);
      (component as any).addUserGroupFromCriteria('Saved group', [
        { criteriaKey: 'rootOrgId', criteriaValue: ['org-a', 'org-b', 'org-c'] }
      ]);

      const selections = component.ruleConditions(0).at(0).get('selections')?.value;
      expect(component.getMdoOrganisationSelectionLabel(selections)).toBe('3 items selected');
    });

    it('should preserve the selected count when switching selection tabs', () => {
      addGroup('', ['org-a', 'org-b']);
      const condition = component.ruleConditions(0).at(0);
      const selections = condition.get('selections')?.value;
      dialog.open.mockReturnValue(dialogResult(null));
      jest.spyOn(component, 'processCadreConfigMapping').mockImplementation(() => undefined);

      component.manageSelections(condition.value, component.userGroup.at(0).value, 0, 1);

      expect(dialog.open.mock.calls[0][1].data.activeTabSelected).toBe(1);
      expect(component.getMdoOrganisationSelectionLabel(condition.get('selections')?.value)).toBe('2 items selected');
      expect(condition.get('selections')?.value).toEqual(selections);
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

  describe('cross organisation reach services', () => {
    beforeEach(() => {
      component.isCCA = false;
      component.config.crossOrgReachServices = ['Indian Police Service (IPS)', 'Indian Forest Service (IFoS)', 'Central Health Service (CHS)'];
    });

    it('should not append the own organisation to a group of only a cross organisation service, so it reaches every organisation', () => {
      const criteria: any[] = [
        { criteriaKey: 'service', criteriaValue: ['Indian Police Service (IPS)'] },
        { criteriaKey: 'Cadre', criteriaValue: ['Bihar'] }
      ];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria.some((entry) => entry.criteriaKey === 'rootOrgId')).toBe(false);
    });

    it('should match a saved group whose service names came back lower cased', () => {
      const criteria: any[] = [{ criteriaKey: 'service', criteriaValue: ['indian forest service (ifos)'] }];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria.some((entry) => entry.criteriaKey === 'rootOrgId')).toBe(false);
    });

    it('should keep the own organisation when another service is selected with it', () => {
      const criteria: any[] = [{ criteriaKey: 'service', criteriaValue: ['Indian Police Service (IPS)', 'DANICS'] }];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria).toContainEqual({ criteriaKey: 'rootOrgId', criteriaValue: ['own-org'] });
    });

    it('should keep the own organisation for any other service', () => {
      const criteria: any[] = [{ criteriaKey: 'service', criteriaValue: ['Indian Railway Service'] }];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria).toContainEqual({ criteriaKey: 'rootOrgId', criteriaValue: ['own-org'] });
    });

    it('should keep the organisations the group selected itself', () => {
      const criteria: any[] = [
        { criteriaKey: 'service', criteriaValue: ['Indian Police Service (IPS)'] },
        { criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] }
      ];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria.filter((entry) => entry.criteriaKey === 'rootOrgId')).toEqual([{ criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] }]);
    });

    it('should keep the own organisation when the config lists no cross organisation services', () => {
      component.config.crossOrgReachServices = undefined;
      const criteria: any[] = [{ criteriaKey: 'service', criteriaValue: ['Indian Police Service (IPS)'] }];

      (component as any).appendOwnOrganisationCriteria(criteria);

      expect(criteria).toContainEqual({ criteriaKey: 'rootOrgId', criteriaValue: ['own-org'] });
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

    it('should show the whole branch of a L1 -> L10 as "Select all"', () => {
      component.isCCA = false;
      component.canSelectOrgHierarchy = true;
      accessControlService.areAllOrgHierarchyOrgsSelected.mockReturnValue(true);

      const isAdded = (component as any).addUserGroupFromCriteria('Group', [
        { criteriaKey: 'rootOrgId', criteriaValue: ['l1-org', 'l2-org'] }
      ]);

      expect(isAdded).toBe(true);
      expect(component.ruleConditions(0).at(0).get('selections')?.value).toEqual([ALL_ORGANISATIONS_SELECTION]);
    });

    it('should treat a restored saved group as unchanged', () => {
      (component as any).addUserGroupFromCriteria('Group', [{ criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] }], 'saved-group-id');

      expect(component.isSavedUserGroupUnchanged(0)).toBe(true);
    });
  });

  describe('isSavedUserGroupUnchanged', () => {
    it('should be false for a group that is not saved yet', () => {
      addGroup('');
      (component as any).markUserGroupConditionsSaved(0);

      expect(component.isSavedUserGroupUnchanged(0)).toBe(false);
    });

    it('should be false for a saved group whose conditions were never marked saved', () => {
      addGroup('saved-group-id');

      expect(component.isSavedUserGroupUnchanged(0)).toBe(false);
    });

    it('should be true while the saved conditions are not edited', () => {
      addGroup('saved-group-id');
      (component as any).markUserGroupConditionsSaved(0);

      expect(component.isSavedUserGroupUnchanged(0)).toBe(true);
    });

    it('should be false once the selections are edited', () => {
      addGroup('saved-group-id');
      (component as any).markUserGroupConditionsSaved(0);

      component.ruleConditions(0).at(0).get('selections')?.setValue(['org-a', 'org-b']);

      expect(component.isSavedUserGroupUnchanged(0)).toBe(false);
    });

    it('should ignore a change of the group name', () => {
      addGroup('saved-group-id');
      (component as any).markUserGroupConditionsSaved(0);

      component.userGroup.at(0).get('name')?.setValue('Renamed group');

      expect(component.isSavedUserGroupUnchanged(0)).toBe(true);
    });
  });

  describe('createUserGroup / updateUserGroup', () => {
    const payload = { request: { userGroupName: 'Group', criteria: [{ criteriaKey: 'rootOrgId', criteriaValue: ['org-a'] }] } };

    beforeEach(() => {
      jest.spyOn(component, 'callSnackbar').mockImplementation(() => undefined);
      jest.spyOn(component.accessControlData, 'emit');
    });

    it('should keep the new id and treat the created group as unchanged', () => {
      accessControlService.createReusableUserGroup = jest.fn(() => of({ result: { usergroupid: 'new-group-id', accessControl: { userGroups: [] } } }));
      addGroup('');

      component.createUserGroup(payload as any, 0);

      expect(component.userGroup.at(0).get('savedUserGroupId')?.value).toBe('new-group-id');
      expect(component.isSavedUserGroupUnchanged(0)).toBe(true);
      expect(component.isSavingReusableUserGroup).toBe(false);
      expect(component.accessControlData.emit).toHaveBeenCalledWith(expect.objectContaining({ action: 'CREATED', userGroupId: 'new-group-id' }));
      expect(component.callSnackbar).toHaveBeenCalledWith('User group saved successfully', 'success');
    });

    it('should treat the updated group as unchanged', () => {
      accessControlService.updateReusableUserGroup = jest.fn(() => of({ result: { usergroupid: 'saved-group-id', accessControl: { userGroups: [] } } }));
      addGroup('saved-group-id');
      component.ruleConditions(0).at(0).get('selections')?.setValue(['org-b']);

      component.updateUserGroup({ request: { ...payload.request, userGroupId: 'saved-group-id' } } as any, 0);

      expect(component.isSavedUserGroupUnchanged(0)).toBe(true);
      expect(component.isSavingReusableUserGroup).toBe(false);
      expect(component.accessControlData.emit).toHaveBeenCalledWith(expect.objectContaining({ action: 'UPDATED' }));
      expect(component.callSnackbar).toHaveBeenCalledWith('User group updated successfully', 'success');
    });

    it('should not treat the group as saved when the update fails', () => {
      accessControlService.updateReusableUserGroup = jest.fn(() => of({}));
      addGroup('saved-group-id');

      component.updateUserGroup({ request: { ...payload.request, userGroupId: 'saved-group-id' } } as any, 0);

      expect(component.isSavedUserGroupUnchanged(0)).toBe(false);
      expect(component.callSnackbar).toHaveBeenCalledWith('Could not update the user group, Please try again.', 'error');
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

    describe('for a non CCA MDO', () => {
      beforeEach(() => {
        component.isCCA = false;
        component.canSelectOrgHierarchy = true;
        component.config.userConfig.org = { isCCA: false, rootOrgId: 'own-org' } as any;
        accessControlService.accessControlConfig = jest.fn(() => component.config);
        accessControlService.validateUser = jest.fn(() => of({ result: { response: { count: 7 } } }));
        accessControlService.getOrgHierarchyOrgIds = jest.fn(() => ['l1-org', 'l2-org']);
      });

      it('should count the whole ministry / state when a L0 selected all organisations', async () => {
        accessControlService.isL0MdoUser.mockReturnValue(true);
        addGroup('', [ALL_ORGANISATIONS_SELECTION]);

        await component.calculateUserCountForUserGroup(0);

        expect(accessControlService.validateUser).toHaveBeenCalledWith({
          request: {
            filters: { [MINISTRY_OR_STATE_FILTER_KEY]: ['own-org'], status: 1 },
            fields: ['identifier', 'rootOrgId', 'firstName']
          }
        });
        expect(component.userCount[0]).toBe(7);
      });

      it('should count the whole ministry / state when a L0 picked every organisation of its hierarchy', async () => {
        accessControlService.isL0MdoUser.mockReturnValue(true);
        accessControlService.areAllOrgHierarchyOrgsSelected.mockReturnValue(true);
        addGroup('', ['l1-org', 'l2-org']);

        await component.calculateUserCountForUserGroup(0);

        const filters = accessControlService.validateUser.mock.calls[0][0].request.filters;
        expect(filters).toEqual({ [MINISTRY_OR_STATE_FILTER_KEY]: ['own-org'], status: 1 });
        expect(filters).not.toHaveProperty('rootOrgId');
      });

      it('should count every organisation of the branch when a L1 -> L10 selected all organisations', async () => {
        addGroup('', [ALL_ORGANISATIONS_SELECTION]);

        await component.calculateUserCountForUserGroup(0);

        const filters = accessControlService.validateUser.mock.calls[0][0].request.filters;
        expect(filters).toEqual({ rootOrgId: ['l1-org', 'l2-org'], status: 1 });
        expect(filters).not.toHaveProperty(MINISTRY_OR_STATE_FILTER_KEY);
      });

      it('should count the picked organisations of a L0 partial selection', async () => {
        accessControlService.isL0MdoUser.mockReturnValue(true);
        addGroup('', ['l1-org']);

        await component.calculateUserCountForUserGroup(0);

        const filters = accessControlService.validateUser.mock.calls[0][0].request.filters;
        expect(filters).toEqual({ rootOrgId: ['l1-org'], status: 1 });
      });

      describe('with service and central deputation', () => {
        const addGroupWithDeputation = (deputation: any) => {
          component.userGroup.push(
            fb.group({
              id: ['group-1'],
              savedUserGroupId: [''],
              name: ['User Group 1'],
              conditions: fb.array([
                fb.group({ id: ['c-1'], entity: [NsAccessControlConfig.SelectionType.Organizations], conditionType: ['is'], selections: [[ALL_ORGANISATIONS_SELECTION]] }),
                fb.group({ id: ['c-2'], entity: [NsAccessControlConfig.SelectionType.Service], conditionType: ['is'], selections: [['indian administrative service (ias)']] }),
                fb.group({ id: ['c-3'], entity: [NsAccessControlConfig.SelectionType.CentralDeputation], conditionType: ['is'], selections: [deputation] })
              ])
            })
          );
        };

        const countFilters = async (deputation: any) => {
          accessControlService.isL0MdoUser.mockReturnValue(true);
          addGroupWithDeputation(deputation);
          await component.calculateUserCountForUserGroup(0);
          return accessControlService.validateUser.mock.calls[0][0].request.filters;
        };

        it('should send a boolean central deputation beside the ministry / state', async () => {
          const filters = await countFilters([true]);

          expect(filters).toEqual({
            [MINISTRY_OR_STATE_FILTER_KEY]: ['own-org'],
            'profileDetails.cadreDetails.civilServiceName': ['indian administrative service (ias)'],
            'profileDetails.cadreDetails.isOnCentralDeputation': true,
            status: 1
          });
        });

        it('should convert a "true" string from a reopened group to a boolean', async () => {
          const filters = await countFilters(['true']);

          expect(filters['profileDetails.cadreDetails.isOnCentralDeputation']).toBe(true);
          expect(filters[MINISTRY_OR_STATE_FILTER_KEY]).toEqual(['own-org']);
        });

        it('should convert a "false" string from a reopened group to a boolean', async () => {
          const filters = await countFilters(['false']);

          expect(filters['profileDetails.cadreDetails.isOnCentralDeputation']).toBe(false);
        });

        it('should accept a central deputation value not wrapped in an array', async () => {
          const filters = await countFilters(true);

          expect(filters['profileDetails.cadreDetails.isOnCentralDeputation']).toBe(true);
        });

        it('should leave the flag out for an unrecognised value', async () => {
          const filters = await countFilters(['yes']);

          expect(filters).not.toHaveProperty('profileDetails.cadreDetails.isOnCentralDeputation');
        });
      });

      describe('org custom fields', () => {
        const addGroupWithConditions = (conditions: { entity: string; selections: any }[]) => {
          component.userGroup.push(
            fb.group({
              id: ['group-1'],
              savedUserGroupId: [''],
              name: ['User Group 1'],
              conditions: fb.array(
                conditions.map((condition, index) =>
                  fb.group({ id: [`c-${index}`], entity: [condition.entity], conditionType: ['is'], selections: [condition.selections] })
                )
              )
            })
          );
        };

        const countFilters = async (conditions: { entity: string; selections: any }[]) => {
          accessControlService.isL0MdoUser.mockReturnValue(true);
          addGroupWithConditions(conditions);
          await component.calculateUserCountForUserGroup(0);
          return accessControlService.validateUser.mock.calls[0][0].request.filters;
        };

        it('should not send orgCustomFields for a condition without an entity', async () => {
          const filters = await countFilters([
            { entity: NsAccessControlConfig.SelectionType.Organizations, selections: [ALL_ORGANISATIONS_SELECTION] },
            { entity: '', selections: [] }
          ]);

          expect(filters).toEqual({ [MINISTRY_OR_STATE_FILTER_KEY]: ['own-org'], status: 1 });
        });

        it('should not send orgCustomFields for a custom field without selections', async () => {
          const filters = await countFilters([
            { entity: NsAccessControlConfig.SelectionType.Organizations, selections: [ALL_ORGANISATIONS_SELECTION] },
            { entity: 'customFieldA', selections: [] }
          ]);

          expect(filters).not.toHaveProperty('orgCustomFields');
        });

        it('should send the filled custom fields only', async () => {
          const filters = await countFilters([
            { entity: NsAccessControlConfig.SelectionType.Organizations, selections: [ALL_ORGANISATIONS_SELECTION] },
            { entity: 'customFieldA', selections: [{ fieldValue: 'value-1' }, 'value-2'] },
            { entity: '', selections: [] }
          ]);

          expect(filters.orgCustomFields).toEqual({ customFieldA: ['value-1', 'value-2'] });
        });
      });

      it('should restrict the count to the own organisation when the hierarchy cannot be selected', async () => {
        component.canSelectOrgHierarchy = false;
        addGroup('', ['org-a']);

        await component.calculateUserCountForUserGroup(0);

        const filters = accessControlService.validateUser.mock.calls[0][0].request.filters;
        expect(filters).toEqual({ rootOrgId: ['own-org'], status: 1 });
      });
    });
  });

  describe('saveReusableUserGroups', () => {
    let updateUserGroup: jest.SpyInstance;
    let createUserGroup: jest.SpyInstance;

    beforeEach(() => {
      updateUserGroup = jest.spyOn(component, 'updateUserGroup').mockImplementation(() => undefined);
      createUserGroup = jest.spyOn(component, 'createUserGroup').mockImplementation(() => undefined);
    });

    it('should confirm first, then ask for the name, then update a saved group of live content', () => {
      component.mdoContent = { status: 'Live' };
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
      component.mdoContent = { status: 'Live' };
      addGroup('saved-group-id');
      dialog.open.mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Reject }));

      component.saveReusableUserGroups(0);

      expect(dialog.open).toHaveBeenCalledTimes(1);
      expect(updateUserGroup).not.toHaveBeenCalled();
    });

    it('should skip the confirmation and ask for the name to update a saved group of content that is not live', () => {
      component.mdoContent = { status: 'Draft' };
      addGroup('saved-group-id');
      dialog.open.mockReturnValueOnce(dialogResult({ action: NsAccessControlConfig.IActions.Confirm, userGroupName: 'Renamed group' }));

      component.saveReusableUserGroups(0);

      expect(dialog.open).toHaveBeenCalledTimes(1);
      expect(dialog.open.mock.calls[0][0]).toBe(SaveUserGroupComponent);
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
    });

    it('should not update when the name dialog is cancelled', () => {
      component.mdoContent = { status: 'Live' };
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

  describe('other portals, untouched by the SPV portal', () => {
    it('should not be the SPV portal on MDO or the creation portal', () => {
      expect(component.isSpvPortal).toBe(false);
      component.config.application = NsAccessControlConfig.Application.Creation_Portal;
      expect(component.isSpvPortal).toBe(false);
    });

    it('should open its popups as before, without the SPV panel class', () => {
      expect(component.spvDialogPanel).toEqual({});
    });

    it('should ignore input changes', () => {
      const applySettings = jest.spyOn(component as any, 'spvApplySavedSettings');
      component.ngOnChanges({ tempAccessControl: new SimpleChange(null, {}, false) });
      expect(applySettings).not.toHaveBeenCalled();
    });

    it('should still offer User beside other conditions', () => {
      component.accessControlCriteriaSelection = {
        optionsEntity: [
          { value: NsAccessControlConfig.SelectionType.Organizations, label: 'Organisation', disabled: false },
          { value: NsAccessControlConfig.SelectionType.Users, label: 'User', disabled: false }
        ]
      } as any;
      addGroup('', ['org-a']);
      component.ruleConditions(0).push(fb.group({ id: ['condition-2'], entity: [''], conditionType: ['is'], selections: [[]] }));

      expect(component.getAvailableEntities(0, 1).map((option: any) => option.value)).toEqual([NsAccessControlConfig.SelectionType.Users]);
    });
  });

  describe('SPV portal (provider access settings)', () => {
    const SelectionType = NsAccessControlConfig.SelectionType;
    let snackbar: { openFromComponent: jest.Mock };
    let toast: { dismiss: jest.Mock };

    // as the provider access settings read gives them: out of priority order, with a deleted group
    const savedSettings = (): any => ({
      accessControl: {
        version: 2,
        userGroups: [
          {
            userGroupId: 'ug-2', userGroup: 2, licenceAllocation: 200, status: 'ACTIVE', consumed: 0,
            userGroupCriteriaList: [{ criteriaKey: 'user', criteriaValue: ['user-1'] }]
          },
          {
            userGroupId: 'ug-1', userGroup: 1, licenceAllocation: 400, status: 'ACTIVE', consumed: 120,
            userGroupCriteriaList: [
              { criteriaKey: 'rootOrgId', criteriaValue: ['org-1'] },
              { criteriaKey: 'cadre', criteriaValue: ['Assam'] },
              { criteriaKey: 'batch', criteriaValue: [2019] }
            ]
          },
          {
            userGroupId: 'ug-0', userGroup: 3, licenceAllocation: 5, status: 'DELETED', consumed: 0,
            userGroupCriteriaList: [{ criteriaKey: 'group', criteriaValue: ['Group A'] }]
          }
        ]
      },
      licence: { consumed: 21496, unaudited: 320 }
    });
    const provider = (overrides: any = {}): NsAccessControlConfig.ISpvProvider => ({
      name: 'SIMPLILEARN',
      licenseType: 'Course',
      overAllLimit: 40000,
      consumedCount: 20996,
      providerPreference: true,
      publishedCourseCount: 20,
      ...overrides
    });
    const optionsEntity = () => [
      SelectionType.Organizations, SelectionType.Group, SelectionType.Designation, SelectionType.Service,
      SelectionType.Batch, SelectionType.Cadre, SelectionType.VerificationStatus, SelectionType.Users
    ].map(value => ({ value, label: CRITERIA_LABELS[value], disabled: false }));
    const toastMessages = () => snackbar.openFromComponent.mock.calls.map((call: any[]) => call[1].data.message);

    const cadreMappingService = {
      getServiceIdsByName: jest.fn(() => []),
      getCadreIdsByName: jest.fn(() => []),
      getServicesByNames: jest.fn(() => []),
      getAllServices: jest.fn(() => []),
      getAllCadres: jest.fn(() => []),
      getAllBatchYears: jest.fn(() => [])
    };

    const openSpv = async (settings: any = savedSettings(), spvProvider = provider()) => {
      component = new AccessControlComponent(dialog as any, fb, accessControlService, cadreMappingService as any, snackbar as any);
      component.config = {
        application: NsAccessControlConfig.Application.SPV,
        accessControlCriteriaSelection: { optionsEntity: optionsEntity(), readOnly: false }
      } as any;
      component.contentId = 'partner-1';
      component.spvProvider = spvProvider;
      component.tempAccessControl = settings;
      await component.ngOnInit();
    };

    beforeEach(async () => {
      toast = { dismiss: jest.fn() };
      snackbar = { openFromComponent: jest.fn(() => toast) };
      accessControlService.accessControlConfig = Object.assign(jest.fn(() => component?.config), { set: jest.fn() });
      accessControlService.fetchCadreConfig = jest.fn(() => Promise.resolve(null));
      accessControlService.validateUser = jest.fn(() => of({ result: { response: { count: 7 } } }));
      accessControlService.fetchUserGroupAccessControl = jest.fn(() => of({}));
      accessControlService.applyUserGroupAccessControl = jest.fn(() => of({}));
      accessControlService.holdServiceCadrebatch = { set: jest.fn(), update: jest.fn() };
      await openSpv();
    });

    it('should set itself up apart from the content and MDO steps', () => {
      expect(component.isSpvPortal).toBe(true);
      expect(accessControlService.fetchUserGroupAccessControl).not.toHaveBeenCalled();
      expect(component.accessType).toBe(NsAccessControlConfig.IAccessTypes.Custom);
      expect(component.canShowAccessControlTypeRadio).toBe(false);
      expect(component.shouldShowVisibilityToggle).toBe(false);
      expect(accessControlService.accessControlConfig.set).toHaveBeenCalledWith(component.config);
    });

    it('should restore the saved groups in priority order, the deleted one left out', () => {
      expect(component.userGroup.length).toBe(2);
      const first = component.userGroup.at(0);
      expect(first.get('savedUserGroupId')?.value).toBe('ug-1');
      expect(first.get('name')?.value).toBe('User Group 1');
      expect(component.spvLicencesOf(first)).toBe(400);
      expect(component.spvConsumedOf(first)).toBe(120);
      // the api's cadre is the library's Cadre, and batches are years
      expect(component.ruleConditions(0).getRawValue().map((condition: any) => [condition.entity, condition.selections])).toEqual([
        [SelectionType.Organizations, ['org-1']],
        [SelectionType.Cadre, ['Assam']],
        [SelectionType.Batch, [2019]]
      ]);
      expect(component.spvChecksEnrolment).toBe(true);
      expect(component.spvSavedPreferenceTitle).toBe('Yes');
      expect(component.spvHasUnsavedChanges).toBe(false);
    });

    it('should split the Over All Limit across the groups in priority order', () => {
      expect(component.spvAllocatedToGroups).toBe(600);
      expect(component.spvUnauditedCount).toBe(320);
      expect(component.spvConsumedCount).toBe(21496);
      expect(component.spvUnallocatedCount).toBe(40000 - 600 - 320);
      expect(component.spvOverAllocatedCount).toBe(0);
      // a group takes what the groups before it and the unaudited licences leave
      expect(component.spvMaxLicencesOf(component.userGroup.at(1))).toBe(40000 - 320 - 400);
      expect(component.spvSegments.map(segment => [segment.name, segment.licences, segment.percent])).toEqual([
        ['User Group 1', 400, '1.0'],
        ['User Group 2', 200, '0.5']
      ]);
      expect(component.spvProviderCourses).toBe('all 20 SIMPLILEARN courses');
    });

    it('should lock the conditions of saved groups and groups in use, and keep a new group editable', () => {
      const inUse = component.userGroup.at(0);
      expect(component.spvIsInUse(inUse)).toBe(true);
      expect(inUse.get('isUserGroupDisabled')?.value).toBe(true);
      // saved, but nobody enrolled through it
      expect(component.spvIsInUse(component.userGroup.at(1))).toBe(false);
      expect(component.spvAreConditionsLocked(component.userGroup.at(1))).toBe(true);
      expect(component.ruleConditions(1).at(0).get('entity')?.disabled).toBe(true);

      component.addUserGroup();

      const newGroup = component.userGroup.at(2);
      expect(component.spvAreConditionsLocked(newGroup)).toBe(false);
      expect(component.ruleConditions(2).at(0).get('entity')?.enabled).toBe(true);
      expect(newGroup.get('licences')?.value).toBeNull();
    });

    it('should not delete a group learners enrolled through, and save nothing when a group is deleted', () => {
      component.removeUserGroup(0);
      expect(dialog.open).not.toHaveBeenCalled();

      dialog.open.mockReturnValue(dialogResult({ action: NsAccessControlConfig.IActions.Confirm }));
      component.removeUserGroup(1);

      expect(component.userGroup.length).toBe(1);
      expect(accessControlService.applyUserGroupAccessControl).not.toHaveBeenCalled();
      expect(component.spvAllocatedToGroups).toBe(400);
    });

    it('should take whole licences from 1, never below what is consumed nor above what is left', () => {
      const licences = component.userGroup.at(1).get('licences')!;
      for (const [value, error] of [[null, 'required'], [0, 'invalidLicence'], [2.5, 'invalidLicence'], [40000, 'exceedsLimit']] as any[]) {
        licences.setValue(value);
        expect(licences.hasError(error)).toBe(true);
      }
      const inUse = component.userGroup.at(0);
      inUse.get('licences')!.setValue(100);
      expect(component.spvLicenceErrorMessage(inUse)).toBe("Can't be lower than licences already used (120). Only unused licences can be removed.");
      expect(component.spvMinLicencesOf(inUse)).toBe(120);
      expect(component.spvMinLicencesOf(component.userGroup.at(1))).toBe(1);
    });

    it('should offer User only as the one condition of a group', () => {
      component.addUserGroup();
      const values = (options: any[]) => options.map(option => option.value);
      expect(values(component.getAvailableEntities(2, 0))).toContain(SelectionType.Users);

      component.ruleConditions(2).at(0).patchValue({ entity: SelectionType.Organizations, selections: ['org-1'] });
      component.addCondition(2);

      expect(component.ruleConditions(2).length).toBe(2);
      expect(values(component.getAvailableEntities(2, 1))).not.toContain(SelectionType.Users);
      // a group picking its users takes no further condition
      expect(component.spvHasUserCondition(1)).toBe(true);
      expect(component.spvCanAddCondition(1)).toBe(false);
    });

    it('should emit the user groups as the provider api takes them, and mark them saved once the host has saved them', () => {
      const emitted: any[] = [];
      component.accessControlData.subscribe(event => emitted.push(event));
      component.userGroup.at(1).get('licences')!.setValue(300);
      expect(component.spvCanSave).toBe(true);

      component.spvSave();

      expect(dialog.open).not.toHaveBeenCalled();
      expect(component.isSaving).toBe(true);
      expect(emitted).toEqual([{
        userGroup: {
          partnerId: 'partner-1',
          accessControl: {
            version: 2,
            userGroups: [
              {
                userGroupId: 'ug-1', userGroup: 1, licenceAllocation: 400,
                userGroupCriteriaList: [
                  { criteriaKey: 'rootOrgId', criteriaValue: ['org-1'] },
                  { criteriaKey: 'cadre', criteriaValue: ['Assam'] },
                  { criteriaKey: 'batch', criteriaValue: ['2019'] }
                ]
              },
              {
                userGroupId: 'ug-2', userGroup: 2, licenceAllocation: 300,
                userGroupCriteriaList: [{ criteriaKey: 'user', criteriaValue: ['user-1'] }]
              }
            ]
          }
        },
        accessType: NsAccessControlConfig.IAccessTypes.Custom,
        action: NsAccessControlConfig.SPV_SAVE_ACTION,
        providerPreference: true,
        preferenceChanged: false
      }]);

      component.completeSpvSave();

      expect(component.isSaving).toBe(false);
      expect(component.spvHasUnsavedChanges).toBe(false);
      expect(toastMessages()).toContain('Access settings saved successfully');
    });

    it('should keep the changes unsaved and say why when the host could not save them', () => {
      component.userGroup.at(1).get('licences')!.setValue(300);
      component.spvSave();

      component.completeSpvSave('Invalid partnerId');

      expect(component.isSaving).toBe(false);
      expect(component.spvHasUnsavedChanges).toBe(true);
      expect(toastMessages()).toContain('Invalid partnerId');
    });

    it('should confirm a change of the saved preference, and save only the preference for No', () => {
      const emitted: any[] = [];
      component.accessControlData.subscribe(event => emitted.push(event));
      component.spvPreferenceChangeConfirm = {} as any;
      dialog.open.mockReturnValue(dialogResult(true));
      component.spvChecksEnrolment = false;
      expect(component.spvIsChangingPreference).toBe(true);

      component.spvSave();

      expect(dialog.open).toHaveBeenCalledWith(component.spvPreferenceChangeConfirm, expect.objectContaining({ width: '520px' }));
      expect(emitted[0]).toEqual(expect.objectContaining({ userGroup: null, providerPreference: false, preferenceChanged: true }));

      component.completeSpvSave();

      expect(component.spvSavedPreference).toBe(false);
      // the groups stay as last saved, to come back with Yes
      expect(component.userGroup.length).toBe(2);
      expect(component.spvHasUnsavedChanges).toBe(false);
    });

    it('should confirm the first save, listing every user group it saves', async () => {
      await openSpv(null, provider({ providerPreference: null }));
      component.spvSaveConfirm = {} as any;
      dialog.open.mockReturnValue(dialogResult(false));
      component.spvChecksEnrolment = true;
      component.addUserGroup();
      component.ruleConditions(0).at(0).patchValue({ entity: SelectionType.Group, selections: ['Group A'] });
      component.userGroup.at(0).get('licences')!.setValue(10);

      expect(component.spvUserGroupsToSave).toEqual([{ name: 'User Group 1', detail: 'New · 10 licences · Group (1)' }]);
      component.spvSave();

      expect(dialog.open).toHaveBeenCalledWith(component.spvSaveConfirm, expect.objectContaining({ width: '520px' }));
      // not confirmed: nothing is emitted
      expect(component.isSaving).toBe(false);
    });

    it('should say the first problem in a toast when Save is pressed before the groups are complete', () => {
      component.addUserGroup();

      component.spvSave();

      expect(component.spvSaveAttempted).toBe(true);
      expect(toastMessages().pop()).toBe('Add at least one condition');
      expect(component.userGroup.at(2).get('licences')?.touched).toBe(true);
    });

    it('should put the saved settings back on Reset, once confirmed', () => {
      component.spvDiscardConfirm = {} as any;
      dialog.open.mockReturnValue(dialogResult(true));
      component.userGroup.at(1).get('licences')!.setValue(300);

      component.spvReset();

      expect(component.spvLicencesOf(component.userGroup.at(1))).toBe(200);
      expect(component.spvHasUnsavedChanges).toBe(false);
    });

    it('should apply the settings the host passes in after a save, a new group locked by its new id', () => {
      const settings = savedSettings();
      settings.accessControl.userGroups.push({
        userGroupId: 'ug-3', userGroup: 3, licenceAllocation: 10, status: 'ACTIVE', consumed: 0,
        userGroupCriteriaList: [{ criteriaKey: 'group', criteriaValue: ['Group B'] }]
      });
      component.tempAccessControl = settings;

      component.ngOnChanges({ tempAccessControl: new SimpleChange(null, settings, false) });

      expect(component.userGroup.length).toBe(3);
      expect(component.spvAreConditionsLocked(component.userGroup.at(2))).toBe(true);
      expect(component.spvHasUnsavedChanges).toBe(false);
    });

    it('should follow the preference the host passes in once it is saved', () => {
      component.spvProvider = provider({ providerPreference: false });

      component.ngOnChanges({ spvProvider: new SimpleChange(null, component.spvProvider, false) });

      expect(component.spvSavedPreference).toBe(false);
      expect(component.spvChecksEnrolment).toBe(false);
    });

    it('should ask for the Over All Limit while the provider has none, until the page is left', async () => {
      await openSpv(savedSettings(), provider({ overAllLimit: 0 }));

      expect(toastMessages()).toContain('Set the Over All Limit in Provider Settings first');
      expect(component.spvCanOfferSave).toBe(false);

      component.ngOnDestroy();
      expect(toast.dismiss).toHaveBeenCalled();
    });

    it('should open its popups with the panel class the SPV portal styles them by', () => {
      dialog.open.mockReturnValue(dialogResult(undefined));

      component.openSelectionDialog(component.userGroup.at(1).getRawValue(), component.ruleConditions(1).at(0).getRawValue(), 0, false);
      component.removeCondition(1, 0);

      expect(dialog.open.mock.calls.map((call: any[]) => call[1].panelClass)).toEqual(['spv-access-settings-dialog']);
    });

    it('should warn under a group that matches nobody, instead of a toast', async () => {
      accessControlService.validateUser.mockReturnValue(of({ result: { response: { count: 0 } } }));

      await component.calculateUserCountForUserGroup(1);

      expect(component.userCount[1]).toBe(0);
      expect(component.spvMatchesNoUsers(component.userGroup.at(1), 1)).toBe(true);
      expect(toastMessages().some((message: string) => message.includes('No iGOT official'))).toBe(false);
    });
  });
});
