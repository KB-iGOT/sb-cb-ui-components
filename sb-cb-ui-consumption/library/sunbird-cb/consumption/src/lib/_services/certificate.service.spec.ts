import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CertificateService } from './certificate.service';

describe('CertificateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: CertificateService = TestBed.inject(CertificateService);
    expect(service).toBeTruthy();
  });
});
