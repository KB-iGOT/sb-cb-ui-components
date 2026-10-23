import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ConsumptionService } from './consumption.service';

describe('ConsumptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: ConsumptionService = TestBed.inject(ConsumptionService);
    expect(service).toBeTruthy();
  });
});
