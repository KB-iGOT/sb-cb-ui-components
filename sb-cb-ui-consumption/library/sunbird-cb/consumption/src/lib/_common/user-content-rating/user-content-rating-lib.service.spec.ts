import { TestBed } from '@angular/core/testing';

import { UserContentRatingLibService } from './user-content-rating-lib.service';

describe('UserContentRatingLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserContentRatingLibService = TestBed.get(UserContentRatingLibService);
    expect(service).toBeTruthy();
  });
});
