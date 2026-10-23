import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ConfigurationsService } from './configurations.service';

describe('ConfigurationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: ConfigurationsService = TestBed.inject(ConfigurationsService);
    expect(service).toBeTruthy();
  });
});
