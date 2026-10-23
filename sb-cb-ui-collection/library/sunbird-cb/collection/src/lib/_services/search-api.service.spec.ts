import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { SearchApiService } from './search-api.service'

describe('SearchApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: SearchApiService = TestBed.inject(SearchApiService)
    expect(service).toBeTruthy()
  })
})
