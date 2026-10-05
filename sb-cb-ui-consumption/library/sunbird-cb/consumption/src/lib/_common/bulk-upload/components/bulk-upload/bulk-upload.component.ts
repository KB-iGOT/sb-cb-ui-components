import {
  Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, SimpleChanges,
} from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Subject, Subscription } from 'rxjs'
import { finalize, takeUntil } from 'rxjs/operators'
import * as _ from 'lodash'
import { NsBulkUpload } from '../../bulk-upload.model'
import { buildBulkUploadConfig } from '../../bulk-upload.constants'
import { BulkUploadService } from '../../bulk-upload.service'
import { BulkUploadVerifyOtpComponent } from '../bulk-upload-verify-otp/bulk-upload-verify-otp.component'
import { BulkUploadFileProgressComponent } from '../bulk-upload-file-progress/bulk-upload-file-progress.component'
import { ILoaderService, LOADER_SERVICE } from '../../../peer-validation/service/loader-service.token'

interface IUploadLogView {
  row: any
  values: any[]
  isSuccess: boolean
  isPending: boolean
}

@Component({
  selector: 'sb-uic-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
  standalone: false
})
export class BulkUploadComponent implements OnInit, OnChanges, OnDestroy {

  /** overrides merged on top of the default (users) config, see BULK_UPLOAD_PRESETS */
  @Input() configSetting?: NsBulkUpload.IBulkUploadConfigSetting | null
  /** values for the {placeholders} used in the api urls, e.g. { rootOrgId } */
  @Input() context: { [key: string]: any } | null = {}
  /** email / mobile used for OTP, defaults to the logged in user */
  @Input() userProfile?: NsBulkUpload.IOtpUser | null

  @Output() uploadSuccess = new EventEmitter<NsBulkUpload.IUploadEvent>()
  @Output() uploadFailed = new EventEmitter<HttpErrorResponse>()
  @Output() logsLoaded = new EventEmitter<any[]>()

  config: NsBulkUpload.IBulkUploadConfig = buildBulkUploadConfig()
  uploadLogs: IUploadLogView[] = []
  pageIndex = 0
  pageSize = 10

  acceptTypes = ''
  maxFileSizeText = ''
  supportedFileTypeText = ''
  invalidFileTypeMessage = ''
  fileSizeExceededMessage = ''

  showFileError = false
  showFileSizeError = false
  isUploading = false
  isLoadingLogs = false
  fileSelected: File | null = null

  private initialized = false
  private destroySubject$ = new Subject<void>()
  private statusListSubscription?: Subscription
  private fileUploadDialogRef?: MatDialogRef<BulkUploadFileProgressComponent>

  constructor(
    private bulkUploadService: BulkUploadService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private configSvc: ConfigurationsService,
    @Optional() @Inject(LOADER_SERVICE) private loaderService: ILoaderService | null,
  ) {
    this.applyConfig()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configSetting) {
      this.applyConfig()
    }
    if (this.initialized && (changes.configSetting || changes.context)) {
      this.getBulkStatusList()
    }
  }

  ngOnInit(): void {
    this.initialized = true
    this.getBulkStatusList()
  }

  get fileRules(): NsBulkUpload.IFileRules {
    return this.config.file as NsBulkUpload.IFileRules
  }

  get texts(): NsBulkUpload.ITexts {
    return this.config.texts || {}
  }

  get messages(): NsBulkUpload.IMessages {
    return this.config.messages || {}
  }

  get logsConfig(): NsBulkUpload.ILogsConfig {
    return this.config.logs as NsBulkUpload.ILogsConfig
  }

  get canDownloadLog(): boolean {
    const api = this.config.api.downloadLog
    return !!api && api.enabled !== false
  }

  get canRefreshLogs(): boolean {
    return this.logsConfig.showRefresh !== false
  }

  private get resolvedContext(): { [key: string]: any } {
    return this.context || {}
  }

  private applyConfig(): void {
    this.config = buildBulkUploadConfig(this.configSetting)
    const extensions = this.fileRules.allowedExtensions || []
    const extensionText = extensions.join(', ')
    const maxSize = this.fileRules.maxFileSizeInMb

    this.acceptTypes = extensions.map(ext => `.${ext}`).join(',')
    this.maxFileSizeText = this.texts.maxFileSizeText || (maxSize ? `Max file size: ${maxSize} MB` : '')
    this.supportedFileTypeText = this.texts.supportedFileTypeText || `Supported file types: ${extensionText}`
    this.invalidFileTypeMessage = this.messages.invalidFileType || `Upload ${extensionText} format file only`
    this.fileSizeExceededMessage = this.messages.fileSizeExceeded || `File size should not exceed ${maxSize} MB`

    this.pageSize = this.logsConfig.pageSize || _.first(this.logsConfig.pageSizeOptions) || 10
    this.pageIndex = 0
  }

  getBulkStatusList(): void {
    if (this.statusListSubscription) {
      this.statusListSubscription.unsubscribe()
    }
    this.setLoader(true)
    this.isLoadingLogs = true
    this.statusListSubscription = this.bulkUploadService
      .getStatusList(this.config.api.statusList, this.resolvedContext)
      .pipe(
        finalize(() => {
          this.isLoadingLogs = false
          this.setLoader(false)
        }),
        takeUntil(this.destroySubject$),
      )
      .subscribe({
        next: (list: any[]) => {
          this.uploadLogs = this.toLogViews(list)
          if (this.pageIndex * this.pageSize >= this.uploadLogs.length) {
            this.pageIndex = 0
          }
          this.logsLoaded.emit(list)
        },
        error: () => {
          this.uploadLogs = []
          this.matSnackBar.open(this.messages.statusListFailed as string)
        },
      })
  }

  /** uploads are processed in the background, this re-reads the logs for their latest status */
  handleRefreshLogs(): void {
    if (this.isLoadingLogs) {
      return
    }
    this.getBulkStatusList()
  }

  handleChangePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
  }

  handleDownloadSampleFile(sample: NsBulkUpload.ISampleFile): void {
    const url = this.bulkUploadService.resolveTemplate(sample.url, this.resolvedContext)
    this.bulkUploadService.downloadFile(url, sample.mode || 'blob', sample.fileName)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe({
        error: () => this.matSnackBar.open(this.messages.sampleDownloadFailed as string),
      })
  }

  handleDownloadLog(log: IUploadLogView): void {
    const api = this.config.api.downloadLog
    if (!api || !this.canDownloadLog || log.isPending) {
      return
    }
    const url = this.bulkUploadService.resolveTemplate(api.url, { ...this.resolvedContext, row: log.row })
    const fallbackFileName = api.fileNameKey ? _.get(log.row, api.fileNameKey) : undefined
    this.bulkUploadService.downloadFile(url, api.mode || 'open', undefined, fallbackFileName)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe({
        error: () => this.matSnackBar.open(this.messages.logDownloadFailed as string),
      })
  }

  /** clears the input so selecting the same file again still triggers change */
  handleFileClick(event: Event): void {
    (event.target as HTMLInputElement).value = ''
  }

  handleOnFileChange(event: Event): void {
    this.showFileError = false
    this.showFileSizeError = false
    const fileList = (event.target as HTMLInputElement).files
    const file = fileList && fileList.length > 0 ? fileList[0] : null
    if (!file || this.isUploading) {
      return
    }
    if (!this.bulkUploadService.validateFileType(file.name, this.fileRules.allowedExtensions)) {
      this.showFileError = true
      return
    }
    const maxSize = this.fileRules.maxFileSizeInMb
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      this.showFileSizeError = true
      return
    }
    this.fileSelected = file
    if (this.config.otp && this.config.otp.enabled) {
      this.verifyOTP()
    } else {
      this.uploadFile()
    }
  }

  verifyOTP(): void {
    const user = this.getOtpUser()
    if (!user.email && !user.mobile) {
      this.fileSelected = null
      this.matSnackBar.open('Email or mobile number is required to verify OTP')
      return
    }
    const dialogData: NsBulkUpload.IOtpDialogData = {
      email: user.email,
      mobile: user.mobile,
      otp: this.config.otp as NsBulkUpload.IOtpConfig,
    }
    this.dialog.open(BulkUploadVerifyOtpComponent, {
      data: dialogData,
      disableClose: true,
      width: '420px',
      maxWidth: '90vw',
    }).afterClosed()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((verified: boolean) => {
        if (verified) {
          this.uploadFile()
        } else {
          this.fileSelected = null
        }
      })
  }

  uploadFile(): void {
    const file = this.fileSelected
    if (!file || this.isUploading) {
      return
    }
    this.isUploading = true
    this.showFileUploadProgress()
    this.bulkUploadService.upload(this.config.api.upload, file, this.resolvedContext)
      .pipe(
        finalize(() => {
          this.isUploading = false
          this.fileSelected = null
          this.closeFileUploadProgress()
        }),
        takeUntil(this.destroySubject$),
      )
      .subscribe({
        next: (response: any) => {
          this.matSnackBar.open(this.messages.uploadSuccess as string)
          this.uploadSuccess.emit({ response, fileName: file.name })
          this.pageIndex = 0
          this.getBulkStatusList()
        },
        error: (error: HttpErrorResponse) => {
          this.matSnackBar.open(_.get(error, 'error.params.errmsg') || this.messages.uploadFailed as string)
          this.uploadFailed.emit(error)
        },
      })
  }

  private showFileUploadProgress(): void {
    const data: NsBulkUpload.IFileProgressDialogData = { icon: this.fileRules.icon }
    this.fileUploadDialogRef = this.dialog.open(BulkUploadFileProgressComponent, {
      data,
      disableClose: true,
      width: '920px',
      height: '420px',
      maxWidth: '90vw',
    })
  }

  private closeFileUploadProgress(): void {
    if (this.fileUploadDialogRef) {
      this.fileUploadDialogRef.close()
      this.fileUploadDialogRef = undefined
    }
  }

  private getOtpUser(): NsBulkUpload.IOtpUser {
    if (this.userProfile) {
      return this.userProfile
    }
    const profile = this.configSvc.userProfileV2 || this.configSvc.userProfile
    return {
      email: _.get(profile, 'email'),
      mobile: _.get(profile, 'mobile'),
    }
  }

  private toLogViews(list: any[]): IUploadLogView[] {
    const logs = this.logsConfig
    const sorted = logs.sortKey
      ? _.orderBy(list, [(row: any) => this.toSortable(_.get(row, logs.sortKey as string))], [logs.sortOrder || 'desc'])
      : list
    return sorted.map((row: any) => {
      const status = _.get(row, logs.statusKey || 'status')
      return {
        row,
        values: (logs.fields || []).map(field => _.get(row, field.key)),
        isSuccess: status === logs.successStatus,
        isPending: (logs.pendingStatuses || []).includes(status),
      }
    })
  }

  /** dates (strings or timestamps) are compared by time, anything else as is */
  private toSortable(value: any): any {
    if (value === null || value === undefined || value === '') {
      return 0
    }
    if (typeof value === 'number') {
      return value
    }
    const time = new Date(value).getTime()
    return isNaN(time) ? value : time
  }

  private setLoader(isLoading: boolean): void {
    if (this.loaderService) {
      this.loaderService.changeLoaderState(isLoading)
    }
  }

  ngOnDestroy(): void {
    this.closeFileUploadProgress()
    this.destroySubject$.next()
    this.destroySubject$.complete()
  }
}
