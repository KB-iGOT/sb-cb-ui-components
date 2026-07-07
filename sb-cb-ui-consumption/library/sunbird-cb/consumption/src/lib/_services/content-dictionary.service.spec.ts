import { TestBed } from '@angular/core/testing';

import { ContentDictionaryService } from './content-dictionary.service';

describe('ContentDictionaryService', () => {
  let service: ContentDictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentDictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
