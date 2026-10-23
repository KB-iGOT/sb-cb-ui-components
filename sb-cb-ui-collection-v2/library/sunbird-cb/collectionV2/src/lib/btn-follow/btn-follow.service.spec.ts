import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnFollowService } from './btn-follow.service'

describe('BtnFollowService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnFollowService = TestBed.inject(BtnFollowService)
    expect(service).toBeTruthy()
  })
})
