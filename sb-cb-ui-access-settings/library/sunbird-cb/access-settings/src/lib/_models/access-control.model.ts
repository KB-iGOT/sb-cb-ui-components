export namespace NsAccessControlConfig {
  export interface IAccessControlConfig {
    accessControlCriteriaSelection: IAccessControlCriteriaSelection;
    usersTableConfig: ITableConfig;
    bulkUploadKarmayogi: IBulkUploadKarmayogi;
  }
  export interface IAccessControlCriteriaSelection {
    optionsEntity: IOptionsEntity[];
    optionsConditions: IOptionsCondition[];
  }

  export interface IOptionsEntity {
    value: string;
    label: string;
  }

  export interface IOptionsCondition {
    value: string;
    label: string;
  }

  export interface ITableConfig {
    allLearners: ITableParameters;
    selectedUsers: ITableParameters;
    bulkUploadTable: ITableParameters;
  }

  export interface ITableParameters {
    displayedColumns: string[];
    type: string;
    initialPaginationSize: number;
    initialPaginationSizeOptions: number[];
    canShowPagination: boolean;
    canShowMasterSelect: boolean;
    canShowRefreshBtn: boolean;
    canShowDeleteBtn: boolean;
    canShowSelectedItems: boolean;
    canSortColumn: boolean;
  }
  export type IUserTableType =
    | "allLearners"
    | "selectedUsers"
    | "bulkUploadTable";

  export type IManageSelectionType =
    | "add_karmayogis"
    | "bulk_upload_karmayogis";

  export interface IBulkUploadKarmayogi {
    uploadInstructions: string[];
    downloadSampleFile: {
      path: string;
      fileName: string;
    };
    bulkUploadTable: ITableParameters;
  }
}
