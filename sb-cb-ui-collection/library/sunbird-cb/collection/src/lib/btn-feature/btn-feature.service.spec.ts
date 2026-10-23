import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnFeatureService } from './btn-feature.service'

describe('BtnFeatureService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnFeatureService = TestBed.inject(BtnFeatureService)
    expect(service).toBeTruthy()
  })
})
