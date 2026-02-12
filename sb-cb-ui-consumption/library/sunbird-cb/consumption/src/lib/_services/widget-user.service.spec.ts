import { TestBed } from '@angular/core/testing';

import { WidgetUserServiceLib } from './widget-user-lib.service';

describe('WidgetUserServiceLib', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetUserServiceLib = TestBed.inject(WidgetUserServiceLib);
    expect(service).toBeTruthy();
  });
});
