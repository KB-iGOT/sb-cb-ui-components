import { TestBed } from '@angular/core/testing';

import { ApprovalService } from './approval.service';

describe('ApprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalService = TestBed.inject(ApprovalService);
    expect(service).toBeTruthy();
  });
});
