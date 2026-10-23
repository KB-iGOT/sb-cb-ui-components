import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnSettingsService } from './btn-settings.service'

describe('BtnSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnSettingsService = TestBed.inject(BtnSettingsService)
    expect(service).toBeTruthy()
  })
})
