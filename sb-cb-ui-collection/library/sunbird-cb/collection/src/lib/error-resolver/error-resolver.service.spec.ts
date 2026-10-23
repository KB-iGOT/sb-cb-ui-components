import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ErrorResolverService } from './error-resolver.service'

describe('ErrorResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ErrorResolverService = TestBed.inject(ErrorResolverService)
    expect(service).toBeTruthy()
  })
})
