import { CadreMappingService } from './cadre-mapping.service';

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

describe('CadreMappingService', () => {
  let service: CadreMappingService;

  beforeEach(() => {
    service = new CadreMappingService();
    service.initialize(CADRE_CONFIG_FIXTURE);
  });

  describe('getServicesByCadreControllingAuthorities', () => {
    const names = (services: Array<{ name: string }>) => services.map(s => s.name).sort();

    it('should return every service the authority controls, across service types', () => {
      expect(names(service.getServicesByCadreControllingAuthorities(['Ministry of Home Affairs']))).toEqual(['DANICS', 'Indian Police Service (IPS)']);
    });

    it('should match the organisation name exactly as published', () => {
      expect(names(service.getServicesByCadreControllingAuthorities(['Department of Personnel and Training']))).toEqual(['Indian Administrative Service (IAS)']);
      expect(names(service.getServicesByCadreControllingAuthorities(['Ministry of Environment & Forests']))).toEqual(['Indian Forest Service (IFoS)']);
    });

    it('should combine several authorities', () => {
      expect(names(service.getServicesByCadreControllingAuthorities(['Railway Board', 'Ministry of Railways']))).toEqual([
        'Indian Railway Accounts Service',
        'Indian Railway Service'
      ]);
    });

    it('should return nothing for an organisation that controls no service, or for no name', () => {
      expect(service.getServicesByCadreControllingAuthorities(['Mahesh MDO'])).toEqual([]);
      expect(service.getServicesByCadreControllingAuthorities([])).toEqual([]);
      expect(service.getServicesByCadreControllingAuthorities([''])).toEqual([]);
    });
  });
});
