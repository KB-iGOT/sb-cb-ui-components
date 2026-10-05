export namespace NsBulkUpload {

  export type HttpMethod = 'GET' | 'POST'

  /** `open` opens the url in a new tab, `blob` fetches it and saves it locally */
  export type DownloadMode = 'open' | 'blob'

  export type LogFieldType = 'text' | 'date'

  export interface IInstructions {
    title?: string
    /** each step is rendered with innerHTML so simple markup like <strong> is allowed */
    steps: string[]
  }

  export interface ITexts {
    title?: string
    instructions?: IInstructions
    browseText?: string
    /** defaults to "Max file size: <maxFileSizeInMb> MB" */
    maxFileSizeText?: string
    /** defaults to "Supported file types: <allowedExtensions>" */
    supportedFileTypeText?: string
    logsTitle?: string
    refreshText?: string
    logCardTitle?: string
    emptyLogsText?: string
    downloadErrorLogText?: string
    downloadFileText?: string
  }

  export interface IMessages {
    /** defaults to "Upload <allowedExtensions> format file only" */
    invalidFileType?: string
    /** defaults to "File size should not exceed <maxFileSizeInMb> MB" */
    fileSizeExceeded?: string
    uploadSuccess?: string
    uploadFailed?: string
    statusListFailed?: string
    sampleDownloadFailed?: string
    logDownloadFailed?: string
  }

  export interface IFileRules {
    /** extensions without the dot, e.g. ['csv'] */
    allowedExtensions: string[]
    /** leave empty to skip the size check */
    maxFileSizeInMb?: number
    /** icon shown on the picker and in the progress dialog */
    icon?: string
  }

  export interface IUploadApi {
    /** supports {placeholders} resolved from the component context, e.g. ?orgId={orgId} */
    url: string
    /** FormData key for the file, e.g. 'data' or 'file' */
    fileField: string
    /** append the file name as the third FormData argument */
    appendFileName?: boolean
    /** additional FormData entries, values support {placeholders} */
    extraFields?: { [key: string]: string }
  }

  export interface IStatusListApi {
    url: string
    method?: HttpMethod
    body?: any
    /** lodash path of the list inside the response */
    resultPath?: string
  }

  export interface IDownloadLogApi {
    /** set to false to hide the download button on the log cards, defaults to true */
    enabled?: boolean
    /** url with {placeholders}, the log row is available as {row.<key>} */
    url: string
    mode?: DownloadMode
    /** row key used as the saved file name for blob downloads when no Content-Disposition header is sent */
    fileNameKey?: string
  }

  export interface ISampleFile {
    label: string
    /** static asset path or api url, supports {placeholders} */
    url: string
    mode?: DownloadMode
    /** saved file name; when empty the Content-Disposition header name is used */
    fileName?: string
  }

  export interface IOtpConfig {
    enabled: boolean
    sendUrl?: string
    verifyEmailUrl?: string
    verifyPhoneUrl?: string
    /** seconds before resend is allowed */
    resendTimeInSec?: number
  }

  export interface ILogField {
    label: string
    /** lodash path inside the log row */
    key: string
    type?: LogFieldType
    /** date pipe format for type date */
    format?: string
  }

  export interface ILogsConfig {
    fields: ILogField[]
    /** set to false to hide the refresh button next to the logs title, defaults to true */
    showRefresh?: boolean
    statusKey?: string
    /** rows with any other status get the error log download label */
    successStatus?: string
    /** rows still being processed have no result file yet, so they get no download button */
    pendingStatuses?: string[]
    sortKey?: string
    sortOrder?: 'asc' | 'desc'
    pageSize?: number
    pageSizeOptions?: number[]
  }

  export interface IApiConfig {
    upload: IUploadApi
    statusList: IStatusListApi
    downloadLog?: IDownloadLogApi
  }

  export interface IBulkUploadConfig {
    texts?: ITexts
    messages?: IMessages
    file?: IFileRules
    api: IApiConfig
    sampleFiles?: ISampleFile[]
    otp?: IOtpConfig
    logs?: ILogsConfig
  }

  /** consumer supplied overrides, merged on top of the default config */
  export interface IBulkUploadConfigSetting {
    texts?: ITexts
    messages?: IMessages
    file?: Partial<IFileRules>
    api?: {
      upload?: Partial<IUploadApi>
      statusList?: Partial<IStatusListApi>
      downloadLog?: Partial<IDownloadLogApi>
    }
    sampleFiles?: ISampleFile[]
    otp?: Partial<IOtpConfig>
    logs?: Partial<ILogsConfig>
  }

  export interface IOtpUser {
    email?: string
    mobile?: string | number
  }

  export interface IOtpDialogData extends IOtpUser {
    otp: IOtpConfig
  }

  export interface IFileProgressDialogData {
    icon?: string
    text?: string
  }

  export interface IUploadEvent {
    fileName: string
    response: any
  }
}
