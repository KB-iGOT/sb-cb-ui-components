import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CustomTourService } from './tour-guide.service'

describe('CustomTourService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: CustomTourService = TestBed.inject(CustomTourService)
    expect(service).toBeTruthy()
  })
})
