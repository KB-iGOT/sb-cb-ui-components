import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { DiscussionV2Service } from './discussion-v2.service'

describe('DiscussionV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'environment', useValue: {} }],
  }))

  it('should be created', () => {
    const service: DiscussionV2Service = TestBed.inject(DiscussionV2Service)
    expect(service).toBeTruthy()
  })
})
