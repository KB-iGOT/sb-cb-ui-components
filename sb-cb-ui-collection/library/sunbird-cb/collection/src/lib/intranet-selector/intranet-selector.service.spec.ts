import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { IntranetSelectorService } from './intranet-selector.service'

describe('IntranetSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: IntranetSelectorService = TestBed.inject(IntranetSelectorService)
    expect(service).toBeTruthy()
  })
})
