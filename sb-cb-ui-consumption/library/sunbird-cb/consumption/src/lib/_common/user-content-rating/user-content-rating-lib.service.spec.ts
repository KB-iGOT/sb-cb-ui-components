import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { UserContentRatingLibService } from './user-content-rating-lib.service';

describe('UserContentRatingLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: UserContentRatingLibService = TestBed.inject(UserContentRatingLibService);
    expect(service).toBeTruthy();
  });
});
