import { TestBed } from '@angular/core/testing'

import { BtnPageBackServiceAdmin } from './btn-page-back.service'

describe('BtnPageBackServiceAdmin', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: BtnPageBackServiceAdmin = TestBed.inject(BtnPageBackServiceAdmin)
    expect(service).toBeTruthy()
  })
})
