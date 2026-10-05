import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

import { EntitySelectionsComponent } from './entity-selections.component';
import { NsAccessControlConfig } from '../../../_models/access-control.model';
import { ALL_ORGANISATIONS_SELECTION, MAX_ORGANISATION_SELECTIONS } from '../../../_constants/app.constants';

describe('EntitySelectionsComponent', () => {
  let component: EntitySelectionsComponent;
  let accessControlService: any;
  let config: any;

  const createComponent = (dialogData: any = { condition: { entity: NsAccessControlConfig.SelectionType.Organizations }, selected: [] }) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dialogData }]
    });
    return TestBed.runInInjectionContext(
      () => new EntitySelectionsComponent({ close: jest.fn() } as any, accessControlService, {} as any, {})
    );
  };

  const organisationIds = (count: number) => Array.from({ length: count }, (_, index) => `org-${index}`);

  beforeEach(() => {
    config = {
      application: NsAccessControlConfig.Application.MDO,
      userConfig: { org: { isCCA: true, rootOrgId: 'own-org' } },
      accessControlCriteriaSelection: { optionsEntity: [], organizationRadioSelection: [], paginationLimit: 100 }
    };
    accessControlService = {
      accessControlConfig: jest.fn(() => config),
      orgHierarchyOrganisations: jest.fn(() => []),
      customesFieldData: jest.fn(() => []),
      getOrgHierarchyOrgIds: jest.fn(() => ['l0-org', 'l1-org']),
      fetchOrgList: jest.fn(() => of({})),
      fetchDesignation: jest.fn(() => of({})),
      fetchDesignationsWithOrg: jest.fn(() => of({})),
      fetchAllOrgCount: jest.fn(() => of({ result: { response: { count: 3249, content: [] } } }))
    };
    component = createComponent();
    component.application = NsAccessControlConfig.Application.MDO;
    component.selectionType = NsAccessControlConfig.SelectionType.Organizations;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isMdoOrganisationSelection', () => {
    it('should be true for the Organisation condition on MDO', () => {
      expect(component.isMdoOrganisationSelection).toBe(true);
    });

    it('should be true for a non CCA MDO as well', () => {
      component.isCCA = false;
      expect(component.isMdoOrganisationSelection).toBe(true);
    });

    it('should be false on the creation portal', () => {
      component.application = NsAccessControlConfig.Application.Creation_Portal;
      expect(component.isMdoOrganisationSelection).toBe(false);
    });

    it('should be false for any other condition', () => {
      component.selectionType = NsAccessControlConfig.SelectionType.Designation;
      expect(component.isMdoOrganisationSelection).toBe(false);
    });
  });

  describe('organisation selection limit', () => {
    it('should add an organisation below the limit', () => {
      component.toggleSelection({ identifier: 'org-a' });

      expect(component.selectedDataTemp).toEqual(['org-a']);
      expect(component.organisationLimitError).toBe('');
    });

    it('should refuse the organisation past the limit and show the error', () => {
      component.selectedDataTemp = organisationIds(MAX_ORGANISATION_SELECTIONS);

      component.toggleSelection({ identifier: 'one-too-many' });

      expect(component.selectedDataTemp.length).toBe(MAX_ORGANISATION_SELECTIONS);
      expect(component.selectedDataTemp).not.toContain('one-too-many');
      expect(component.organisationLimitError).toContain(`${MAX_ORGANISATION_SELECTIONS}`);
    });

    it('should still remove an organisation at the limit and clear the error', () => {
      component.selectedDataTemp = organisationIds(MAX_ORGANISATION_SELECTIONS);
      component.organisationLimitError = 'limit reached';

      component.toggleSelection({ identifier: 'org-0' });

      expect(component.selectedDataTemp.length).toBe(MAX_ORGANISATION_SELECTIONS - 1);
      expect(component.organisationLimitError).toBe('');
    });

    it('should apply the limit on the selected tab as well', () => {
      component.filterValue = 'selected';
      component.selectedData = organisationIds(MAX_ORGANISATION_SELECTIONS);

      component.toggleSelection({ identifier: 'one-too-many' });

      expect(component.selectedData).not.toContain('one-too-many');
      expect(component.organisationLimitError).not.toBe('');
    });

    it('should not limit the selection on the creation portal', () => {
      component.application = NsAccessControlConfig.Application.Creation_Portal;
      component.selectedDataTemp = organisationIds(MAX_ORGANISATION_SELECTIONS);

      component.toggleSelection({ identifier: 'one-more' });

      expect(component.selectedDataTemp).toContain('one-more');
      expect(component.organisationLimitError).toBe('');
    });
  });

  describe('canSelectAllOrganisations', () => {
    const openAsNonCca = (isL0: boolean) => {
      config.userConfig.org.isCCA = false;
      accessControlService.orgHierarchyOrganisations.mockReturnValue([{ identifier: 'l0-org' }, { identifier: 'l1-org' }]);
      accessControlService.isL0MdoUser = jest.fn(() => isL0);
      component = createComponent();
      component.ngOnInit();
    };

    it('should be offered to a CCA', () => {
      expect(component.canSelectAllOrganisations).toBe(true);
    });

    it('should be offered to a L0, counting its own hierarchy without reading every organisation', () => {
      openAsNonCca(true);

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.canSelectAllOrganisations).toBe(true);
      expect(component.allOrganisationsCount).toBe(2);
      expect(accessControlService.fetchAllOrgCount).not.toHaveBeenCalled();
    });

    it('should be offered to a L1 -> L10 organisation, across its own branch', () => {
      openAsNonCca(false);

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.canSelectAllOrganisations).toBe(true);
      expect(component.isBranchSelectAll).toBe(true);
      expect(component.allOrganisationsCount).toBe(2);
      expect(component.isOrgSelectionLimitExceeded()).toBe(false);
    });

    it('should cap "Select all" of a L1 -> L10 whose branch is over the limit', () => {
      openAsNonCca(false);
      accessControlService.orgHierarchyOrganisations.mockReturnValue(
        organisationIds(MAX_ORGANISATION_SELECTIONS + 1).map((identifier) => ({ identifier }))
      );

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.isOrgSelectionLimitExceeded()).toBe(true);
    });

    it('should not cap "Select all" of a L0', () => {
      openAsNonCca(true);
      accessControlService.orgHierarchyOrganisations.mockReturnValue(
        organisationIds(MAX_ORGANISATION_SELECTIONS + 1).map((identifier) => ({ identifier }))
      );

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.isOrgSelectionLimitExceeded()).toBe(false);
    });
  });

  describe('onChangeOrgSelectionMode', () => {
    it('should select every organisation and read the organisation count on "Select all"', () => {
      component.selectedDataTemp = ['org-a'];

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.isAllOrganisationsSelected).toBe(true);
      expect(component.selectedData).toEqual([ALL_ORGANISATIONS_SELECTION]);
      expect(component.selectedDataTemp).toEqual([ALL_ORGANISATIONS_SELECTION]);
      expect(accessControlService.fetchAllOrgCount).toHaveBeenCalledTimes(1);
      expect(component.allOrganisationsCount).toBe(3249);
    });

    it('should read the organisation count only once', () => {
      component.onChangeOrgSelectionMode({ value: 'all' } as any);
      component.onChangeOrgSelectionMode({ value: 'individual' } as any);
      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(accessControlService.fetchAllOrgCount).toHaveBeenCalledTimes(1);
    });

    it('should keep the count empty when the api returns none', () => {
      accessControlService.fetchAllOrgCount.mockReturnValue(of({}));

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.allOrganisationsCount).toBeNull();
    });

    it('should clear the selection and go back to the list tab on "Manual Selection"', () => {
      component.onChangeOrgSelectionMode({ value: 'all' } as any);
      component.activeTab = 1;
      component.filterValue = 'selected';
      component.organisationLimitError = 'limit reached';

      component.onChangeOrgSelectionMode({ value: 'individual' } as any);

      expect(component.isAllOrganisationsSelected).toBe(false);
      expect(component.selectedData).toEqual([]);
      expect(component.selectedDataTemp).toEqual([]);
      expect(component.activeTab).toBe(0);
      expect(component.filterValue).toBe('all');
      expect(component.organisationLimitError).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('should open on "Select all" for a saved "Select all" selection', () => {
      component = createComponent({
        condition: { entity: NsAccessControlConfig.SelectionType.Organizations },
        selected: [ALL_ORGANISATIONS_SELECTION],
        activeTabSelected: 1
      });

      component.ngOnInit();

      expect(component.orgSelectionMode).toBe('all');
      expect(component.activeTab).toBe(0);
      expect(component.filterValue).toBe('all');
      expect(accessControlService.fetchAllOrgCount).toHaveBeenCalledTimes(1);
      expect(component.allOrganisationsCount).toBe(3249);
      // The organisation list is not read while "Select all" is on
      expect(accessControlService.fetchOrgList).not.toHaveBeenCalled();
    });

    it('should read the organisation list once switched back to "Manual Selection"', () => {
      component = createComponent({
        condition: { entity: NsAccessControlConfig.SelectionType.Organizations },
        selected: [ALL_ORGANISATIONS_SELECTION]
      });
      component.ngOnInit();

      component.onChangeOrgSelectionMode({ value: 'individual' } as any);

      expect(accessControlService.fetchOrgList).toHaveBeenCalledTimes(1);
    });

    it('should open on "Manual Selection" for picked organisations', () => {
      component = createComponent({
        condition: { entity: NsAccessControlConfig.SelectionType.Organizations },
        selected: ['org-a']
      });

      component.ngOnInit();

      expect(component.orgSelectionMode).toBe('individual');
      expect(accessControlService.fetchAllOrgCount).not.toHaveBeenCalled();
    });

    it('should not narrow designations to any organisation when a CCA selected all of them', () => {
      component = createComponent({
        condition: { entity: NsAccessControlConfig.SelectionType.Designation },
        rule: { conditions: [{ entity: NsAccessControlConfig.SelectionType.Organizations, selections: [ALL_ORGANISATIONS_SELECTION] }] },
        selected: []
      });

      component.ngOnInit();

      expect(component.orgSelectionIds).toEqual([]);
      expect(accessControlService.fetchDesignationsWithOrg).not.toHaveBeenCalled();
    });

    it('should narrow designations to the hierarchy when a non CCA MDO selected all organisations', () => {
      config.userConfig.org.isCCA = false;
      accessControlService.orgHierarchyOrganisations.mockReturnValue([{ identifier: 'l0-org' }]);
      component = createComponent({
        condition: { entity: NsAccessControlConfig.SelectionType.Designation },
        rule: { conditions: [{ entity: NsAccessControlConfig.SelectionType.Organizations, selections: [ALL_ORGANISATIONS_SELECTION] }] },
        selected: []
      });

      component.ngOnInit();

      expect(component.orgSelectionIds).toEqual(['l0-org', 'l1-org']);
    });
  });
});
