import { TestBed } from '@angular/core/testing'

import { WidgetResolverService } from './sb-ui-resolver.service'

describe('WidgetResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: WidgetResolverService = TestBed.get(WidgetResolverService)
    expect(service).toBeTruthy()
  })
})
