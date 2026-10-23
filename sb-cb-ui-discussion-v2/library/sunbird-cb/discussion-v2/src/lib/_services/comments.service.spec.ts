import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CommentsService } from './comments.service'

describe('CommentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: CommentsService = TestBed.inject(CommentsService)
    expect(service).toBeTruthy()
  })
})
