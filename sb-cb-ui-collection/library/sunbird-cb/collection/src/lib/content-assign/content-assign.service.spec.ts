import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentAssignService } from './content-assign.service'

describe('ContentAssignService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ContentAssignService = TestBed.inject(ContentAssignService)
    expect(service).toBeTruthy()
  })
})
