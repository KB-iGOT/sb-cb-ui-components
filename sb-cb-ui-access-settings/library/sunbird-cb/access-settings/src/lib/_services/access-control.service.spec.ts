import { of } from 'rxjs';

import { AccessControlService } from './access-control.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  let http: { post: jest.Mock; get: jest.Mock; patch: jest.Mock };

  beforeEach(() => {
    http = { post: jest.fn(() => of({})), get: jest.fn(() => of({})), patch: jest.fn(() => of({})) };
    service = new AccessControlService(http as any);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchAllOrgCount', () => {
    it('should ask the org search for the count of every organisation only', () => {
      service.fetchAllOrgCount().subscribe();

      expect(http.post).toHaveBeenCalledWith('/apis/proxies/v8/org/v1/admin/search', {
        request: {
          criteriaKey: 'rootOrgId',
          criteriaValue: [],
          filters: { status: 1 },
          fields: ['channel', 'identifier', 'iscca'],
          query: '',
          limit: 0,
          offset: 0
        }
      });
    });
  });

  describe('getCadreControllingAuthorityNames', () => {
    const configFor = (org: any): any => ({ userConfig: { org } });

    it('should name the organisation when it is a Cadre Controlling Authority', () => {
      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Ministry of Railways', allowservicebasedtargeting: true }))).toEqual([
        'Ministry of Railways'
      ]);
    });

    it('should not name an organisation that is not one', () => {
      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Ministry of Railways', allowservicebasedtargeting: false }))).toEqual([]);
      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Ministry of Railways' }))).toEqual([]);
    });

    it('should add the L0 it is mapped to when the L0 is one, so a L1 selects the ministry services', () => {
      service.parentOrganisation.set({ orgName: 'Ministry of Railways', allowservicebasedtargeting: true });

      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Railway Board', allowservicebasedtargeting: true }))).toEqual([
        'Railway Board',
        'Ministry of Railways'
      ]);
      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Railway Division' }))).toEqual(['Ministry of Railways']);
    });
  });
});
