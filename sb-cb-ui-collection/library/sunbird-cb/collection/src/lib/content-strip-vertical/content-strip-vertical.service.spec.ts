import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentStripVerticalService } from './content-strip-vertical.service'

describe('ContentStripVerticalService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }))

  it('should be created', () => {
    const service: ContentStripVerticalService = TestBed.inject(ContentStripVerticalService)
    expect(service).toBeTruthy()
  })
})
