import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { PeerValidationService } from './peer-validation.service';

describe('PeerValidationService', () => {
  let service: PeerValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(PeerValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
