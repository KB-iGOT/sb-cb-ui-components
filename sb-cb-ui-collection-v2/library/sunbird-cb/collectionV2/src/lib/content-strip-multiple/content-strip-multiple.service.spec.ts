import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripMultipleService } from './content-strip-multiple.service'

describe('ContentStripMultipleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ContentStripMultipleService = TestBed.inject(ContentStripMultipleService)
    expect(service).toBeTruthy()
  })
})
