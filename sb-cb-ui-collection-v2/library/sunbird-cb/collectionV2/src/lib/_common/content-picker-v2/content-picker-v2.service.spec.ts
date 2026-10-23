import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ContentPickerV2Service } from './content-picker-v2.service'

describe('ContentPickerV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: ContentPickerV2Service = TestBed.inject(ContentPickerV2Service)
    expect(service).toBeTruthy()
  })
})
