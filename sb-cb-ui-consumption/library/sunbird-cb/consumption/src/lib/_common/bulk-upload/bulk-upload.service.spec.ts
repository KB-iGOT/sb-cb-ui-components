import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'

import { BulkUploadService } from './bulk-upload.service'
import { BULK_UPLOAD_DEFAULT_CONFIG, BULK_UPLOAD_PRESETS, buildBulkUploadConfig } from './bulk-upload.constants'

describe('BulkUploadService', () => {
  let service: BulkUploadService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(BulkUploadService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('resolveTemplate', () => {
    it('replaces placeholders with encoded context values', () => {
      const url = service.resolveTemplate('/api?orgId={orgId}&channel={channel}', { orgId: 'o1', channel: 'Science & Tech' })
      expect(url).toBe('/api?orgId=o1&channel=Science%20%26%20Tech')
    })

    it('supports nested paths and blanks missing values', () => {
      expect(service.resolveTemplate('/a/{row.fileName}/{missing}', { row: { fileName: 'f.csv' } })).toBe('/a/f.csv/')
    })

    it('can skip encoding', () => {
      expect(service.resolveTemplate('{name}', { name: 'a b' }, false)).toBe('a b')
    })
  })

  it('validates file extensions case insensitively', () => {
    expect(service.validateFileType('users.CSV', ['csv'])).toBe(true)
    expect(service.validateFileType('users.xlsx', ['csv'])).toBe(false)
    expect(service.validateFileType('', ['csv'])).toBe(false)
  })

  it('uploads with the configured field name and file name', () => {
    const file = new File(['a,b'], 'users.csv', { type: 'text/csv' })
    service.upload(BULK_UPLOAD_DEFAULT_CONFIG.api.upload, file, {}).subscribe()

    const req = httpMock.expectOne('/apis/proxies/v8/user/v2/bulkupload')
    expect(req.request.method).toBe('POST')
    const body = req.request.body as FormData
    expect((body.get('data') as File).name).toBe('users.csv')
    req.flush({})
  })

  it('adds resolved extra fields for ngo users', () => {
    const config = buildBulkUploadConfig(BULK_UPLOAD_PRESETS.ngoUsers)
    const file = new File(['a,b'], 'ngo.csv', { type: 'text/csv' })
    service.upload(config.api.upload, file, { rootOrgId: 'org-1' }).subscribe()

    const req = httpMock.expectOne('/apis/proxies/v8/user/nongovt/v1/bulkupload')
    const body = req.request.body as FormData
    expect(body.get('file')).toBeTruthy()
    expect(body.get('data')).toBeNull()
    expect(body.get('targetorgid')).toBe('org-1')
    req.flush({})
  })

  it('builds the v3 url for a selected org', () => {
    const config = buildBulkUploadConfig(BULK_UPLOAD_PRESETS.usersForOrg)
    const file = new File(['a,b'], 'users.csv', { type: 'text/csv' })
    service.upload(config.api.upload, file, { orgId: 'o1', channel: 'Dept' }).subscribe()

    httpMock.expectOne('/apis/proxies/v8/user/v3/bulkupload?orgId=o1&channel=Dept').flush({})
  })

  it('extracts the status list from the configured path', done => {
    service.getStatusList(BULK_UPLOAD_DEFAULT_CONFIG.api.statusList, { rootOrgId: 'org-1' }).subscribe(list => {
      expect(list).toEqual([{ fileName: 'a.csv' }])
      done()
    })
    httpMock.expectOne('/apis/proxies/v8/user/v1/bulkupload/org-1').flush({ result: { content: [{ fileName: 'a.csv' }] } })
  })

  it('returns an empty list when the path is missing', done => {
    service.getStatusList(BULK_UPLOAD_DEFAULT_CONFIG.api.statusList, { rootOrgId: 'org-1' }).subscribe(list => {
      expect(list).toEqual([])
      done()
    })
    httpMock.expectOne('/apis/proxies/v8/user/v1/bulkupload/org-1').flush({ result: {} })
  })

  it('verifies email and phone otp on their own urls', () => {
    const otp = BULK_UPLOAD_DEFAULT_CONFIG.otp as any
    service.verifyOtp(otp, 'email', 'a@b.com', '123456').subscribe()
    service.verifyOtp(otp, 'phone', 9999999999, '654321').subscribe()

    const emailReq = httpMock.expectOne('/apis/proxies/v8/otp/v3/verify')
    expect(emailReq.request.body).toEqual({ request: { otp: '123456', type: 'email', key: 'a@b.com' } })
    emailReq.flush({})
    const phoneReq = httpMock.expectOne('/apis/proxies/v8/otp/v1/verify')
    expect(phoneReq.request.body).toEqual({ request: { otp: '654321', type: 'phone', key: '9999999999' } })
    phoneReq.flush({})
  })

  it('opens the url in a new tab for open mode', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    service.downloadFile('/log/a.csv', 'open').subscribe()
    expect(openSpy).toHaveBeenCalledWith('/log/a.csv', '_blank')
    openSpy.mockRestore()
  })

  describe('buildBulkUploadConfig', () => {
    it('deep merges objects and replaces arrays', () => {
      const config = buildBulkUploadConfig({
        texts: { title: 'Custom' },
        logs: { fields: [{ label: 'Name', key: 'fileName' }] },
      })
      expect(config.texts!.title).toBe('Custom')
      expect(config.texts!.logsTitle).toBe('File logs')
      expect(config.logs!.fields.length).toBe(1)
      expect(config.logs!.pageSizeOptions).toEqual([10, 20])
    })

    it('does not mutate the default config', () => {
      buildBulkUploadConfig({ texts: { title: 'Changed' } })
      expect(BULK_UPLOAD_DEFAULT_CONFIG.texts!.title).toBe('Bulk Creation')
    })
  })
})
