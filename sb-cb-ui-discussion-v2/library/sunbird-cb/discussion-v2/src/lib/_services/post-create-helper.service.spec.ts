import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { PostCreateHelperService } from './post-create-helper.service';

describe('PostCreateHelperService', () => {
  let service: PostCreateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  });
    service = TestBed.inject(PostCreateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
