import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripNewMultipleService } from './network-strip-multiple.service'

describe('ContentStripNewMultipleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ContentStripNewMultipleService = TestBed.inject(ContentStripNewMultipleService)
    expect(service).toBeTruthy()
  })
})
