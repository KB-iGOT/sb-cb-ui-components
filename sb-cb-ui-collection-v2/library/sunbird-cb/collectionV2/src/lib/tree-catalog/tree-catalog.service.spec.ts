import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { TreeCatalogService } from './tree-catalog.service'

describe('TreeCatalogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: TreeCatalogService = TestBed.inject(TreeCatalogService)
    expect(service).toBeTruthy()
  })
})
