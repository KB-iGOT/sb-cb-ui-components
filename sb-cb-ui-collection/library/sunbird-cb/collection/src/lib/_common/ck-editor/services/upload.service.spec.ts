import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { APP_BASE_HREF } from '@angular/common'

import { UploadService } from './upload.service'
import { ApiService } from './api.service'
import { AccessControlService } from './access-control.service'

describe('UploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UploadService, ApiService, AccessControlService, { provide: APP_BASE_HREF, useValue: '/' }],
  }))

  it('should be created', () => {
    const service: UploadService = TestBed.inject(UploadService)
    expect(service).toBeTruthy()
  })
})
