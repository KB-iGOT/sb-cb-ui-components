import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { PickerContentService } from './picker-content.service'

describe('PickerContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: PickerContentService = TestBed.inject(PickerContentService)
    expect(service).toBeTruthy()
  })
})
