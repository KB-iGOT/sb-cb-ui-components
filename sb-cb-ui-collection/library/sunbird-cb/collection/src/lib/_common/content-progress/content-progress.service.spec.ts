import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentProgressService } from './content-progress.service'

describe('ContentProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ContentProgressService = TestBed.inject(ContentProgressService)
    expect(service).toBeTruthy()
  })
})
