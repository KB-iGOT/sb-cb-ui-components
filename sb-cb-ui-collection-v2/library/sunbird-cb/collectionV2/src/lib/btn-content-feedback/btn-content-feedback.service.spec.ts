import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnContentFeedbackService } from './btn-content-feedback.service'

describe('BtnContentFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnContentFeedbackService = TestBed.inject(BtnContentFeedbackService)
    expect(service).toBeTruthy()
  })
})
