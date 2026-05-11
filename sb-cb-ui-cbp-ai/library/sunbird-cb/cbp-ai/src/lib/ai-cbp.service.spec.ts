import { TestBed } from '@angular/core/testing';

import { AiCbpService } from './ai-cbp.service';

describe('AiCbpService', () => {
  let service: AiCbpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiCbpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
