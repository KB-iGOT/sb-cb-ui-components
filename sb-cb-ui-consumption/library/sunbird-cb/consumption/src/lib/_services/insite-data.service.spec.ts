import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { InsiteDataService } from './insite-data.service';

describe('InsiteDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: InsiteDataService = TestBed.inject(InsiteDataService);
    expect(service).toBeTruthy();
  });
});
