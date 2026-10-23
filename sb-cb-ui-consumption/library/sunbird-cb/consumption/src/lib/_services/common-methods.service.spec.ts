import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CommonMethodsService } from './common-methods.service';

describe('CommonMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: CommonMethodsService = TestBed.inject(CommonMethodsService);
    expect(service).toBeTruthy();
  });
});
