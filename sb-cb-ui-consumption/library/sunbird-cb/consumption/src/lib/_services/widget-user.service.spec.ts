import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { WidgetUserServiceLib } from './widget-user-lib.service';

describe('WidgetUserServiceLib', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }));

  it('should be created', () => {
    const service: WidgetUserServiceLib = TestBed.inject(WidgetUserServiceLib);
    expect(service).toBeTruthy();
  });
});
