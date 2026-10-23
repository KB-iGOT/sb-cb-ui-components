import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { UserEnrollCommunityService } from './user-enroll-community.service';

describe('UserEnrollCommunityService', () => {
  let service: UserEnrollCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(UserEnrollCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
