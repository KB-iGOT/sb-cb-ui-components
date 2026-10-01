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
});
