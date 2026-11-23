import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EntitySelectionsComponent } from './entity-selections.component';
import { NsAccessControlConfig } from '../../../_models/access-control.model';
import { ALL_ORGANISATIONS_SELECTION, MAX_ORGANISATION_SELECTIONS, SPV_MAX_SELECTIONS } from '../../../_constants/app.constants';
import { AccessControlService } from '../../../_services/access-control.service';
import { CadreMappingService } from '../../../_services/cadre-mapping.service';

/** Trimmed copy of the cadreConfig system setting, in its published shape. */
const CADRE_CONFIG_FIXTURE: any = {
  civilServiceType: {
    civilServiceTypeList: [
      {
        id: 'cst-001', name: 'All India Services',
        serviceList: [
          { id: 'cs-001', name: 'Indian Administrative Service (IAS)', cadreControllingAuthority: 'Department of Personnel and Training', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] },
          { id: 'cs-002', name: 'Indian Police Service (IPS)', cadreControllingAuthority: 'Ministry of Home Affairs', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] }
        ]
      },
      {
        id: 'cst-002', name: 'Central Civil Service',
        serviceList: [
          { id: 'cs-004', name: 'Indian Railway Service', cadreControllingAuthority: 'Ministry of Railways', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] },
          { id: 'cs-030', name: 'Indian Railway Accounts Service', cadreControllingAuthority: 'Railway Board', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] },
          { id: 'cs-040', name: 'DANICS', cadreControllingAuthority: 'Ministry of Home Affairs', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] },
          { id: 'cs-043', name: 'Central Secretariat Stenographers Service', cadreControllingAuthority: 'Department of Personnel and Training (DOPT)', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] },
          { id: 'cs-003', name: 'Indian Forest Service (IFoS)', cadreControllingAuthority: 'Ministry of Environment & Forests', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] }
        ]
      },
      {
        id: 'cst-003', name: 'State Service',
        states: [
          {
            id: 'st-bihar', name: 'Bihar',
            serviceList: [
              { id: 'cs-101', name: 'Bihar Administrative Service (BAS)', cadreControllingAuthority: 'Government of Bihar', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] }
            ]
          },
          {
            id: 'st-karnataka', name: 'Karnataka',
            serviceList: [
              { id: 'cs-201', name: 'Karnataka Administrative Service (KAS)', cadreControllingAuthority: 'Government of Karnataka', commonBatchStartYear: 2000, commonBatchEndYear: 2001, cadreList: [] }
            ]
          }
        ]
      }
    ]
  }
};

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

  describe('SPV portal', () => {
    beforeEach(() => {
      component.application = NsAccessControlConfig.Application.SPV;
    });

    it('should cap Organisation at the limit, saying so, and still let one be removed', () => {
      component.selectedDataTemp = organisationIds(SPV_MAX_SELECTIONS);

      component.toggleSelection({ identifier: 'one-too-many' });
      expect(component.selectedDataTemp.length).toBe(SPV_MAX_SELECTIONS);
      expect(component.organisationLimitError).toBe(`Maximum ${SPV_MAX_SELECTIONS} values`);

      component.toggleSelection({ identifier: 'org-0' });
      expect(component.selectedDataTemp.length).toBe(SPV_MAX_SELECTIONS - 1);
      expect(component.organisationLimitError).toBe('');
    });

    it('should cap Designation as well, but no other field', () => {
      component.selectionType = NsAccessControlConfig.SelectionType.Designation;
      component.selectedDataTemp = organisationIds(SPV_MAX_SELECTIONS);
      component.toggleSelection({ designation: 'One Too Many' });
      expect(component.selectedDataTemp.length).toBe(SPV_MAX_SELECTIONS);

      component.selectionType = NsAccessControlConfig.SelectionType.Group;
      component.toggleSelection('Group A');
      expect(component.selectedDataTemp.length).toBe(SPV_MAX_SELECTIONS + 1);
    });

    it('should not offer the MDO "Select all organisations"', () => {
      expect(component.isMdoOrganisationSelection).toBe(false);
      expect(component.canSelectAllOrganisations).toBe(false);
    });

    it('should tick up to the limit with Select All', () => {
      jest.spyOn(component, 'getFilteredEntityGrouped').mockImplementation(() => undefined);
      component.selectedDataTemp = organisationIds(SPV_MAX_SELECTIONS - 1);
      component.dataList = [{ identifier: 'new-1' }, { identifier: 'new-2' }];

      component.selectAvailableOptions({ checked: true, source: { value: 'selectAll' } } as any);

      expect(component.selectedDataTemp.length).toBe(SPV_MAX_SELECTIONS);
      expect(component.organisationLimitError).toBe(`Maximum ${SPV_MAX_SELECTIONS} values`);
    });

    it('should title the popup of a locked group as view only', () => {
      component = createComponent({ condition: { entity: NsAccessControlConfig.SelectionType.Organizations }, selected: [], disabled: true });
      component.application = NsAccessControlConfig.Application.SPV;
      component.selectionType = NsAccessControlConfig.SelectionType.Organizations;
      expect(component.getModalTitle()).toBe('Organisation (view only)');

      component.selectionType = NsAccessControlConfig.SelectionType.Service;
      expect(component.getModalTitle()).toBe('Services (view only)');

      component.application = NsAccessControlConfig.Application.MDO;
      expect(component.getModalTitle()).toBe('Select Services');
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
      component.ngOnInit();

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
      component.ngOnInit();
      component.selectedDataTemp = ['org-a'];

      component.onChangeOrgSelectionMode({ value: 'all' } as any);

      expect(component.isAllOrganisationsSelected).toBe(true);
      expect(component.selectedData).toEqual([ALL_ORGANISATIONS_SELECTION]);
      expect(component.selectedDataTemp).toEqual([ALL_ORGANISATIONS_SELECTION]);
      expect(accessControlService.fetchAllOrgCount).toHaveBeenCalledTimes(1);
      expect(component.allOrganisationsCount).toBe(3249);
    });

    it('should read the organisation count only once', () => {
      component.ngOnInit();
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
      component.ngOnInit();
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

  describe('service list', () => {
    let cadreMappingService: CadreMappingService;

    const openServiceList = (org: any, application = NsAccessControlConfig.Application.MDO, authorityNames: string[] = [], stateName = '') => {
      config.application = application;
      config.userConfig.org = { rootOrgId: 'own-org', ...org };
      config.accessControlCriteriaSelection.servicesRadioSelection = [];
      cadreMappingService = new CadreMappingService();
      cadreMappingService.initialize(CADRE_CONFIG_FIXTURE);
      cadreMappingService.setCadreConfigData(CADRE_CONFIG_FIXTURE);
      accessControlService.holdServiceCadrebatch = jest.fn(() => ({ service: cadreMappingService.getAllServices(), cadre: [], batch: [] }));
      accessControlService.getCadreControllingAuthorityNames = jest.fn(() => authorityNames);
      accessControlService.getOrgStateName = jest.fn(() => stateName);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: MAT_DIALOG_DATA, useValue: { condition: { entity: NsAccessControlConfig.SelectionType.Service }, selected: [] } }]
      });
      component = TestBed.runInInjectionContext(
        () => new EntitySelectionsComponent({ close: jest.fn() } as any, accessControlService, cadreMappingService, {})
      );
      component.ngOnInit();
    };

    const listedServices = () => component.dataList.map((service: any) => service.name).sort();

    it('should show DoPT (CCA) the master list with the service type filter', () => {
      openServiceList({ isCCA: true });

      expect(component.isServiceListScopedToOrganisation).toBe(false);
      expect(component.serviceSelectionTypes).toEqual(['All Services', 'All India Services', 'Central Civil Service', 'State Service']);
      expect(component.dataList.length).toBe(cadreMappingService.getAllServices().length);
      expect(component.noServicesMapped).toBe(false);
    });

    it('should show a ministry that is a Cadre Controlling Authority only the services it controls, without the filter', () => {
      openServiceList({ isCCA: false }, NsAccessControlConfig.Application.MDO, ['Ministry of Home Affairs']);

      expect(component.isServiceListScopedToOrganisation).toBe(true);
      expect(listedServices()).toEqual(['DANICS', 'Indian Police Service (IPS)']);
      expect(accessControlService.getCadreControllingAuthorityNames).toHaveBeenCalledWith(config);
    });

    it('should show a state organisation only the services of its own state', () => {
      openServiceList({ isCCA: false, sbOrgType: 'state' }, NsAccessControlConfig.Application.MDO, [], 'BIHAR');

      expect(component.isServiceListScopedToOrganisation).toBe(true);
      expect(listedServices()).toEqual(['Bihar Administrative Service (BAS)']);
    });

    it('should show the no services message when the organisation has none to select from', () => {
      openServiceList({ isCCA: false, orgName: 'Mahesh MDO' });

      expect(component.dataList).toEqual([]);
      expect(component.noServicesMapped).toBe(true);
      expect(component.noServicesMappedMessage).toContain('No services are currently mapped to your State/Ministry');
    });

    it('should not show the no services message when only a search finds nothing', () => {
      openServiceList({ isCCA: false }, NsAccessControlConfig.Application.MDO, ['Ministry of Home Affairs']);

      component.getServicesList('no such service');

      expect(component.dataList).toEqual([]);
      expect(component.noServicesMapped).toBe(false);
    });

    it('should search within the scoped services only', () => {
      openServiceList({ isCCA: false }, NsAccessControlConfig.Application.MDO, ['Ministry of Home Affairs']);

      component.getServicesList('police');

      expect(listedServices()).toEqual(['Indian Police Service (IPS)']);
    });

    it('should keep the services narrowed by a selected cadre or batch', () => {
      openServiceList({ isCCA: false }, NsAccessControlConfig.Application.MDO, ['Ministry of Home Affairs']);
      accessControlService.holdServiceCadrebatch.mockReturnValue({ service: [{ id: 'x', name: 'DANICS' }], cadre: [], batch: [] });

      component.getServicesList('');

      expect(listedServices()).toEqual(['DANICS']);
    });

    it('should leave the creation portal list unscoped', () => {
      openServiceList({ isCCA: false }, NsAccessControlConfig.Application.Creation_Portal);

      expect(component.isServiceListScopedToOrganisation).toBe(false);
      expect(component.noServicesMapped).toBe(false);
      expect(component.dataList.length).toBeGreaterThan(0);
    });

    it('should scope the list in the MDO reusable user groups as in the training plan', () => {
      config.context = { type: 'reusable-user-groups' };
      openServiceList({ isCCA: false }, NsAccessControlConfig.Application.MDO, ['Ministry of Home Affairs']);

      expect(component.isServiceListScopedToOrganisation).toBe(true);
      expect(listedServices()).toEqual(['DANICS', 'Indian Police Service (IPS)']);
    });
  });
});
