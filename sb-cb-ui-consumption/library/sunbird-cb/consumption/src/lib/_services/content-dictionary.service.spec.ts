import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentDictionaryService } from './content-dictionary.service';

describe('ContentDictionaryService', () => {
  let service: ContentDictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(ContentDictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
