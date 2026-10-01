import * as _ from 'lodash'
import { NsBulkUpload } from './bulk-upload.model'

const DATE_FORMAT = 'dd MMM yyyy h:mm a'

/** Default config, matches the orgportal users bulk creation screen */
export const BULK_UPLOAD_DEFAULT_CONFIG: NsBulkUpload.IBulkUploadConfig = {
  texts: {
    title: 'Bulk Creation',
    instructions: {
      title: 'Follow these steps to create users in bulk:',
      steps: [
        'Download the sample ZIP file.',
        'Unzip to get the actual Excel or CSV files given as sample.',
        'Make appropriate changes in the file.',
        '<strong>[Important]</strong> Save the file in CSV format i.e. CSV (Comma delimited) (*.csv)',
        'Upload this newly saved CSV file to the system.',
        'Check the upload results for confirmation.',
      ],
    },
    browseText: 'Browse files',
    logsTitle: 'File logs',
    refreshText: 'Refresh',
    logCardTitle: 'File Information',
    emptyLogsText: 'No files uploaded yet',
    downloadErrorLogText: 'Download error log',
    downloadFileText: 'Download file',
  },
  messages: {
    uploadSuccess: 'File uploaded successfully!',
    uploadFailed: 'Uploading CSV file failed due to some error, please try again later!',
    statusListFailed: 'Unable to get Bulk status list',
    sampleDownloadFailed: 'Could not download the sample file',
    logDownloadFailed: 'Could not download the file',
  },
  file: {
    allowedExtensions: ['csv'],
    maxFileSizeInMb: 10,
    icon: '/assets/icons/csv-file.svg',
  },
  api: {
    upload: {
      url: '/apis/proxies/v8/user/v2/bulkupload',
      fileField: 'data',
      appendFileName: true,
      extraFields: {},
    },
    statusList: {
      url: '/apis/proxies/v8/user/v1/bulkupload/{rootOrgId}',
      method: 'GET',
      resultPath: 'result.content',
    },
    downloadLog: {
      enabled: true,
      url: '/apis/proxies/v8/user/v1/bulkuser/download/{row.fileName}',
      mode: 'open',
      fileNameKey: 'fileName',
    },
  },
  sampleFiles: [
    {
      label: 'Download Sample File',
      url: '/assets/userbulkuploadsample/user-bulk-creation-upload-sample.zip',
      mode: 'blob',
      fileName: 'user-bulk-creation-upload-sample.zip',
    },
  ],
  otp: {
    enabled: true,
    sendUrl: '/apis/proxies/v8/otp/v1/generate',
    verifyEmailUrl: '/apis/proxies/v8/otp/v3/verify',
    verifyPhoneUrl: '/apis/proxies/v8/otp/v1/verify',
    resendTimeInSec: 150,
  },
  logs: {
    fields: [
      { label: 'Name', key: 'fileName' },
      { label: 'Status', key: 'status' },
      { label: 'Failed Records', key: 'failedRecordsCount' },
      { label: 'Success Records', key: 'successfulRecordsCount' },
      { label: 'Total Records', key: 'totalRecords' },
      { label: 'Initiated On', key: 'dateCreatedOn', type: 'date', format: DATE_FORMAT },
      { label: 'Completed On', key: 'dateUpdatedOn', type: 'date', format: DATE_FORMAT },
    ],
    showRefresh: true,
    statusKey: 'status',
    successStatus: 'SUCCESSFUL',
    pendingStatuses: ['INITIATED', 'IN-PROGRESS'],
    sortKey: 'dateCreatedOn',
    sortOrder: 'desc',
    pageSize: 10,
    pageSizeOptions: [10, 20],
  },
}

/**
 * Merges config settings on top of the default config, left to right.
 * Objects are merged deeply, arrays are replaced.
 */
export function buildBulkUploadConfig(
  ...settings: (NsBulkUpload.IBulkUploadConfigSetting | null | undefined)[]
): NsBulkUpload.IBulkUploadConfig {
  return _.mergeWith(
    {},
    _.cloneDeep(BULK_UPLOAD_DEFAULT_CONFIG),
    ...settings.filter(Boolean).map(s => _.cloneDeep(s)),
    (objValue: any, srcValue: any) => (Array.isArray(srcValue) ? srcValue : undefined),
  )
}

/**
 * Ready made settings for the user bulk upload variants.
 * Pass one as configSetting along with the context values mentioned against it.
 */
export const BULK_UPLOAD_PRESETS = {
  /** users of the logged in org. context: { rootOrgId } */
  users: {} as NsBulkUpload.IBulkUploadConfigSetting,

  /** users of a selected org (v3). context: { rootOrgId, orgId, channel } */
  usersForOrg: {
    api: {
      upload: {
        url: '/apis/proxies/v8/user/v3/bulkupload?orgId={orgId}&channel={channel}',
      },
    },
    sampleFiles: [
      {
        label: 'Download Sample File',
        url: '/assets/common/user-bulk-creation-upload-sample.zip',
        mode: 'blob',
        fileName: 'user-bulk-creation-upload-sample.zip',
      },
    ],
  } as NsBulkUpload.IBulkUploadConfigSetting,

  /** non govt (volunteer) org users. context: { rootOrgId } */
  ngoUsers: {
    api: {
      upload: {
        url: '/apis/proxies/v8/user/nongovt/v1/bulkupload',
        fileField: 'file',
        extraFields: { targetorgid: '{rootOrgId}' },
      },
    },
    sampleFiles: [
      {
        label: 'Download Sample File',
        url: '/assets/common/ngo-bulk-creation-upload-sample/ngo-bulk-creation-upload-sample.zip',
        mode: 'blob',
        fileName: 'ngo-bulk-creation-upload-sample.zip',
      },
    ],
  } as NsBulkUpload.IBulkUploadConfigSetting,
}
