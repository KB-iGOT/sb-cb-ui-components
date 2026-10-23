import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { WidgetContentLibService } from './widget-content-lib.service';

describe('WidgetContentLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: WidgetContentLibService = TestBed.inject(WidgetContentLibService);
    expect(service).toBeTruthy();
  });
});
