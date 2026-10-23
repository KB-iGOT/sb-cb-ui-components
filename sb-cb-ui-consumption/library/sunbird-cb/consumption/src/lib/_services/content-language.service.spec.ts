import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentLanguageService } from './content-language.service';

describe('ContentLanguageService', () => {
  let service: ContentLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(ContentLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
