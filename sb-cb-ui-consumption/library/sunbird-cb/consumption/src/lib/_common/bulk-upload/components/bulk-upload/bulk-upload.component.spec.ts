import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of, throwError } from 'rxjs'

import { BulkUploadComponent } from './bulk-upload.component'
import { BulkUploadService } from '../../bulk-upload.service'
import { BulkUploadVerifyOtpComponent } from '../bulk-upload-verify-otp/bulk-upload-verify-otp.component'
import { BulkUploadFileProgressComponent } from '../bulk-upload-file-progress/bulk-upload-file-progress.component'
import { LOADER_SERVICE } from '../../../peer-validation/service/loader-service.token'

// the real package pulls in the telemetry sdk, only the DI token is needed here
jest.mock('@sunbird-cb/utils-v2', () => ({ ConfigurationsService: class ConfigurationsService { } }))

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent
  let fixture: ComponentFixture<BulkUploadComponent>
  let bulkUploadService: any
  let dialog: any
  let snackBar: any
  let loader: any
  let otpVerified: boolean
  let progressDialogRef: any

  const logs = [
    { fileName: 'old.csv', status: 'SUCCESSFUL', dateCreatedOn: '2026-01-01T10:00:00Z' },
    { fileName: 'new.csv', status: 'FAILED', dateCreatedOn: '2026-03-01T10:00:00Z' },
  ]

  const fileChangeEvent = (file: File) => ({ target: { files: [file] } } as any)

  beforeEach(() => {
    otpVerified = true
    progressDialogRef = { close: jest.fn() }
    bulkUploadService = {
      resolveTemplate: jest.fn((url: string) => url),
      validateFileType: jest.fn((name: string, exts: string[]) => exts.includes(name.split('.').pop() as string)),
      getStatusList: jest.fn(() => of(logs)),
      upload: jest.fn(() => of({ result: {} })),
      downloadFile: jest.fn(() => of(undefined)),
    }
    dialog = {
      open: jest.fn((cmp: any) => cmp === BulkUploadVerifyOtpComponent
        ? { afterClosed: () => of(otpVerified) }
        : progressDialogRef),
    }
    snackBar = { open: jest.fn() }
    loader = { changeLoaderState: jest.fn() }

    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      providers: [
        { provide: BulkUploadService, useValue: bulkUploadService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: ConfigurationsService, useValue: { userProfileV2: { email: 'admin@test.com', mobile: '9999999999' } } },
        { provide: LOADER_SERVICE, useValue: loader },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    fixture = TestBed.createComponent(BulkUploadComponent)
    component = fixture.componentInstance
    component.context = { rootOrgId: 'org-1' }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('loads the status list on init sorted by latest first', () => {
    expect(bulkUploadService.getStatusList).toHaveBeenCalledWith(component.config.api.statusList, { rootOrgId: 'org-1' })
    expect(component.uploadLogs.map(l => l.row.fileName)).toEqual(['new.csv', 'old.csv'])
    expect(component.uploadLogs.map(l => l.isSuccess)).toEqual([false, true])
    expect(loader.changeLoaderState).toHaveBeenCalledWith(true)
    expect(loader.changeLoaderState).toHaveBeenLastCalledWith(false)
  })

  it('applies the config setting and reloads the list', () => {
    bulkUploadService.getStatusList.mockClear()
    component.configSetting = { texts: { title: 'Custom title' }, logs: { pageSize: 20 } }
    component.ngOnChanges({ configSetting: new SimpleChange(null, component.configSetting, false) })

    expect(component.texts.title).toBe('Custom title')
    expect(component.texts.logsTitle).toBe('File logs')
    expect(component.pageSize).toBe(20)
    expect(bulkUploadService.getStatusList).toHaveBeenCalledTimes(1)
  })

  it('re-reads the status list on refresh', () => {
    bulkUploadService.getStatusList.mockClear()
    expect(component.canRefreshLogs).toBe(true)

    component.handleRefreshLogs()

    expect(bulkUploadService.getStatusList).toHaveBeenCalledWith(component.config.api.statusList, { rootOrgId: 'org-1' })
    expect(component.isLoadingLogs).toBe(false)
  })

  it('ignores a refresh while the status list is still loading', () => {
    bulkUploadService.getStatusList.mockClear()
    component.isLoadingLogs = true
    component.handleRefreshLogs()
    expect(bulkUploadService.getStatusList).not.toHaveBeenCalled()
  })

  it('hides the refresh button when it is turned off', () => {
    component.configSetting = { logs: { showRefresh: false } }
    component.ngOnChanges({ configSetting: new SimpleChange(null, component.configSetting, false) })
    expect(component.canRefreshLogs).toBe(false)
  })

  it('derives file texts from the file rules', () => {
    expect(component.acceptTypes).toBe('.csv')
    expect(component.maxFileSizeText).toBe('Max file size: 10 MB')
    expect(component.supportedFileTypeText).toBe('Supported file types: csv')
  })

  it('shows an error for an unsupported file type', () => {
    component.handleOnFileChange(fileChangeEvent(new File(['x'], 'users.pdf')))
    expect(component.showFileError).toBe(true)
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('shows an error when the file is too large', () => {
    const file = new File(['x'], 'users.csv')
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 })
    component.handleOnFileChange(fileChangeEvent(file))
    expect(component.showFileSizeError).toBe(true)
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('verifies otp, uploads and refreshes the list', () => {
    const successSpy = jest.spyOn(component.uploadSuccess, 'emit')
    bulkUploadService.getStatusList.mockClear()
    const file = new File(['a,b'], 'users.csv')

    component.handleOnFileChange(fileChangeEvent(file))

    expect(dialog.open).toHaveBeenCalledWith(BulkUploadVerifyOtpComponent, expect.objectContaining({
      data: expect.objectContaining({ email: 'admin@test.com', mobile: '9999999999' }),
    }))
    expect(dialog.open).toHaveBeenCalledWith(BulkUploadFileProgressComponent, expect.anything())
    expect(bulkUploadService.upload).toHaveBeenCalledWith(component.config.api.upload, file, { rootOrgId: 'org-1' })
    expect(progressDialogRef.close).toHaveBeenCalled()
    expect(successSpy).toHaveBeenCalledWith({ fileName: 'users.csv', response: { result: {} } })
    expect(bulkUploadService.getStatusList).toHaveBeenCalledTimes(1)
    expect(component.fileSelected).toBeNull()
  })

  it('does not upload when otp is cancelled', () => {
    otpVerified = false
    component.handleOnFileChange(fileChangeEvent(new File(['a,b'], 'users.csv')))
    expect(bulkUploadService.upload).not.toHaveBeenCalled()
    expect(component.fileSelected).toBeNull()
  })

  it('uploads directly when otp is disabled', () => {
    component.configSetting = { otp: { enabled: false } }
    component.ngOnChanges({ configSetting: new SimpleChange(null, component.configSetting, false) })

    component.handleOnFileChange(fileChangeEvent(new File(['a,b'], 'users.csv')))

    expect(dialog.open).not.toHaveBeenCalledWith(BulkUploadVerifyOtpComponent, expect.anything())
    expect(bulkUploadService.upload).toHaveBeenCalled()
  })

  it('closes the progress dialog and shows the api error when upload fails', () => {
    const failedSpy = jest.spyOn(component.uploadFailed, 'emit')
    bulkUploadService.upload.mockReturnValue(throwError({ error: { params: { errmsg: 'Invalid headers' } } }))

    component.handleOnFileChange(fileChangeEvent(new File(['a,b'], 'users.csv')))

    expect(progressDialogRef.close).toHaveBeenCalled()
    expect(snackBar.open).toHaveBeenCalledWith('Invalid headers')
    expect(failedSpy).toHaveBeenCalled()
    expect(component.isUploading).toBe(false)
  })

  it('downloads the log file using the row values', () => {
    component.handleDownloadLog(component.uploadLogs[0])
    expect(bulkUploadService.resolveTemplate).toHaveBeenCalledWith(
      component.config.api.downloadLog!.url,
      { rootOrgId: 'org-1', row: component.uploadLogs[0].row },
    )
    expect(bulkUploadService.downloadFile).toHaveBeenCalledWith(expect.any(String), 'open', undefined, 'new.csv')
  })

  it('marks rows still being processed as pending and does not download them', () => {
    bulkUploadService.getStatusList.mockReturnValue(of([
      { fileName: 'queued.csv', status: 'INITIATED', dateCreatedOn: '2026-04-01T10:00:00Z' },
      { fileName: 'running.csv', status: 'IN-PROGRESS', dateCreatedOn: '2026-03-15T10:00:00Z' },
      ...logs,
    ]))
    component.getBulkStatusList()

    expect(component.uploadLogs.map(l => l.isPending)).toEqual([true, true, false, false])
    component.handleDownloadLog(component.uploadLogs[1])
    expect(bulkUploadService.downloadFile).not.toHaveBeenCalled()
  })

  it('does not download the log file when log download is disabled', () => {
    component.configSetting = { api: { downloadLog: { enabled: false } } }
    component.ngOnChanges({ configSetting: new SimpleChange(null, component.configSetting, false) })

    expect(component.canDownloadLog).toBe(false)
    component.handleDownloadLog(component.uploadLogs[0])
    expect(bulkUploadService.downloadFile).not.toHaveBeenCalled()
  })

  it('downloads the sample file as a blob with its file name', () => {
    const sample = component.config.sampleFiles![0]
    component.handleDownloadSampleFile(sample)
    expect(bulkUploadService.downloadFile).toHaveBeenCalledWith(sample.url, 'blob', 'user-bulk-creation-upload-sample.zip')
  })
})
