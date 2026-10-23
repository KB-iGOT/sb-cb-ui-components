import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnContentLikeService } from './btn-content-like.service'

describe('BtnContentLikeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnContentLikeService = TestBed.inject(BtnContentLikeService)
    expect(service).toBeTruthy()
  })
})
