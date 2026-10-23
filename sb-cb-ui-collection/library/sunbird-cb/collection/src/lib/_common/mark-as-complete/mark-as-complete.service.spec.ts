import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { MarkAsCompleteService } from './mark-as-complete.service'

describe('MarkAsCompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: MarkAsCompleteService = TestBed.inject(MarkAsCompleteService)
    expect(service).toBeTruthy()
  })
})
