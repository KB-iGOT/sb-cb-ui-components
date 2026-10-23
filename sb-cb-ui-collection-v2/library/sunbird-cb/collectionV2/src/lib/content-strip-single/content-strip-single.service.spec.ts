import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripSingleService } from './content-strip-single.service'

describe('ContentStripSingleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ContentStripSingleService = TestBed.inject(ContentStripSingleService)
    expect(service).toBeTruthy()
  })
})
