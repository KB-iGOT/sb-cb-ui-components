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

    it('should name the organisation, whatever allowservicebasedtargeting says', () => {
      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Ministry of Railways' }))).toEqual(['Ministry of Railways']);
      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Ministry of Railways', allowservicebasedtargeting: false }))).toEqual([
        'Ministry of Railways'
      ]);
    });

    it('should name nothing when the organisation has no name', () => {
      expect(service.getCadreControllingAuthorityNames(configFor(null))).toEqual([]);
    });

    it('should add the L0 it is mapped to, so a L1 selects the ministry services', () => {
      service.parentOrganisation.set({ orgName: 'Ministry of Railways' });

      expect(service.getCadreControllingAuthorityNames(configFor({ orgName: 'Railway Board' }))).toEqual([
        'Railway Board',
        'Ministry of Railways'
      ]);
    });

    it('should name the organisation by its channel too, when it differs from the orgName', () => {
      expect(
        service.getCadreControllingAuthorityNames(
          configFor({ orgName: 'Department of Personnel and Training DoPT', channel: 'Department of Personnel and Training' })
        )
      ).toEqual(['Department of Personnel and Training DoPT', 'Department of Personnel and Training']);
    });

    it('should not repeat a name the orgName and channel share', () => {
      expect(
        service.getCadreControllingAuthorityNames(configFor({ orgName: 'Ministry of Railways', channel: 'Ministry of Railways' }))
      ).toEqual(['Ministry of Railways']);
    });
  });
});
