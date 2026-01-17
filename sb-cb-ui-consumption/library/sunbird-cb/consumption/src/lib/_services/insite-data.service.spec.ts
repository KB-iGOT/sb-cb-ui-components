import { TestBed } from '@angular/core/testing';

import { InsiteDataService } from './insite-data.service';

describe('InsiteDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InsiteDataService = TestBed.inject(InsiteDataService);
    expect(service).toBeTruthy();
  });
});
