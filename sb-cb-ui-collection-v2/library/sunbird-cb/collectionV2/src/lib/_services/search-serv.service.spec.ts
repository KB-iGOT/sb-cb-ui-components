import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { SearchServService } from './search-serv.service'

describe('SearchServService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
      { provide: 'environment', useValue: {} }
    ],
    }))

  it('should be created', () => {
    const service: SearchServService = TestBed.inject(SearchServService)
    expect(service).toBeTruthy()
  })
})
