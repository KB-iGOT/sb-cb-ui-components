import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnKbService } from './btn-kb.service'

describe('BtnKbService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnKbService = TestBed.inject(BtnKbService)
    expect(service).toBeTruthy()
  })
})
