import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnGoalsService } from './btn-goals.service'

describe('BtnGoalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnGoalsService = TestBed.inject(BtnGoalsService)
    expect(service).toBeTruthy()
  })
})
