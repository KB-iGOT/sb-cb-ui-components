import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { MicrositeV3Service } from './microsite-v3.service';

describe('MicrositeV3Service', () => {
  let service: MicrositeV3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(MicrositeV3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
