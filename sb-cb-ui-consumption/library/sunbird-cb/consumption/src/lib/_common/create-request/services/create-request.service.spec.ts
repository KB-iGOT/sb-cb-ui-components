import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CreateRequestService } from './create-request.service';

describe('CreateRequestService', () => {
  let service: CreateRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(CreateRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
