import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { InviteUsersComponent } from "../dialogs/invite-users/invite-users.component";
import { IUserGroupRequest, NsAccessControlConfig } from "../../_models/access-control.model";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { AccessControlService } from "../../_services/access-control.service";
import { EntitySelectionsComponent } from "../dialogs/entity-selections/entity-selections.component";
import { v4 as uuidv4 } from "uuid";
import { CadreMappingService } from "../../_services/cadre-mapping.service";
import { SnackbarComponent } from "../../components/snackbar/snackbar.component";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { ConfirmDialogComponent } from "../dialogs/confirm-dialog/confirm-dialog.component";
import { AccessControlGuideComponent } from "../dialogs/access-control-guide/access-control-guide.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatRadioChange } from "@angular/material/radio";
import * as _ from "lodash";

@Component({
  selector: "sb-uic-access-control",
  templateUrl: "./access-control.component.html",
  styleUrls: ["./access-control.component.scss"],
})
export class AccessControlComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config!: NsAccessControlConfig.IAccessControlConfig;
  @Input() contentId: string = "";
  @Input() content: any;
  @Input() tempAccessControl: any;

  @Output() accessControlData: EventEmitter<{ userGroup: any; accessType: string }> = new EventEmitter();
  @Output() refreshContentMeta: EventEmitter<boolean> = new EventEmitter();
  @Output() sendForCQF: EventEmitter<boolean> = new EventEmitter();

  private destroy$ = new Subject<void>();

  accessType: NsAccessControlConfig.ITypeAccessType = NsAccessControlConfig.IAccessTypes.Public;
  accessTypeDup: NsAccessControlConfig.ITypeAccessType = NsAccessControlConfig.IAccessTypes.Public;
  ACCESS_TYPE_ENUM = NsAccessControlConfig.IAccessTypes;
  ACCESS_SETTING_ENUM = NsAccessControlConfig.IAccessSetting;

  isLoading = false;
  isVisibilityEnabled: boolean = true;
  filterCriteria: boolean = false;

  defaultConditionRelationship: string = "AND";
  defaultUserGroupRelationship: string = "OR";

  accessControlCriteriaSelection!: NsAccessControlConfig.IAccessControlCriteriaSelection;
  usersTableConfig: NsAccessControlConfig.ITableConfig;
  accessControlForm!: FormGroup;
  MDO_SPECIFIC = NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC;
  MDO_APPLICATION = NsAccessControlConfig.Application.MDO;

  cadreConfigData: any;
  isSaveFltrBtnDisabled = true;
  isApplyBtnDisabled = true;
  isAddUserGroupBtnDisabled = false;
  isApplying = false;
  isSaving = false;
  userCount: any = {};

  initialUserGroupValue: any;

  canShowAccessControlTypeRadio = true;
  shouldShowVisibilityToggle = true;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private accessControlService: AccessControlService,
    private cadreMappingService: CadreMappingService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Dont call read api for MDO its only for CBP for now
    if (this.config.application !== NsAccessControlConfig.Application.MDO) {
      this.getAccessControl();
    }

    if (!this.cadreConfigData) {
      this.fetchCadreConfigData();
    }

    this.config.content = this.content;
    this.accessControlCriteriaSelection = this.config?.accessControlCriteriaSelection;

    if (this.accessControlCriteriaSelection.readOnly) {
      this.accessControlCriteriaSelection.readOnly = false;
    }

    this.usersTableConfig = this.config?.usersTableConfig;

    if (this.content) {
      const isAllUsers = this.content.accessSetting === NsAccessControlConfig.IAccessSetting.ALL_USERS;
      const isCustomAccess =
        this.content.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC ||
        this.content.accessSetting === NsAccessControlConfig.IAccessSetting.CUSTOME_USER;
      const isComprehensiveCategory = this.content.courseCategory === "Comprehensive Assessment Program";

      const accessTypePublic = _.find(this.accessControlCriteriaSelection?.accessTypes, {
        value: NsAccessControlConfig.IAccessTypes.Public
      });

      if (isAllUsers) {
        this.accessType = NsAccessControlConfig.IAccessTypes.Public;
        if (accessTypePublic) accessTypePublic.disabled = false;

        if (this.content.accessSettingsEnabled) {
          this.accessType = NsAccessControlConfig.IAccessTypes.Custom;
        }
      }

      if (isCustomAccess || isComprehensiveCategory) {
        this.accessType = NsAccessControlConfig.IAccessTypes.Custom;
        if (accessTypePublic) accessTypePublic.disabled = true;
      }

      this.processConditionsForContentType();
    } else {
      // Condition for MDO
      this.accessType = NsAccessControlConfig.IAccessTypes.Custom;
    }

    this.canShowAccessControlTypeRadio = this.config?.accessControlCriteriaSelection?.canShowAccessTypeRadio ?? true;
    this.shouldShowVisibilityToggle = this.config?.accessControlCriteriaSelection?.shouldShowVisibilityToggle ?? true;
    this.accessTypeDup = this.accessType;

    if (this.config.accessControlCriteriaSelection.allowCustomsField) {
      if (!this.accessControlService.customesFieldData()?.length) {
        this.getCustomsField();
      }
    }

    if (this.config?.application === NsAccessControlConfig.Application.MDO) {
      const isCCA = this.config?.userConfig?.org?.iscca ?? false;
      if (!isCCA) {
        this.config.accessControlCriteriaSelection.optionsEntity = _.filter(
          this.config.accessControlCriteriaSelection.optionsEntity,
          (entity) => entity.value !== NsAccessControlConfig.SelectionType.Organizations
        );
      }
    }

    if (this.tempAccessControl) {
      this.processTempAccessControl(this.tempAccessControl);
    } else {
      this.addUserGroup();
      setTimeout(() => {
        this.initialUserGroupValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
        this.setupFormChangeDetection();
      }, 0);
    }

    this.accessControlService.accessControlConfig.set(this.config);
  }

  ngAfterViewInit(): void {
    if (this.config?.visiblilityOnOff?.default !== "on") {
      this.isVisibilityEnabled = false;
    }
    localStorage.removeItem("goToSetting");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchCadreConfigData(): void {
    this.isLoading = true;
    this.accessControlService
      .fetchCadreConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.result && response?.result?.response && Object.keys(response?.result?.response)?.length) {
            this.cadreConfigData = response?.result?.response?.value;
            this.cadreMappingService.initialize(this.cadreConfigData);
            this.accessControlService.holdServiceCadrebatch.set({
              service: this.cadreMappingService.getAllServices(),
              batch: this.cadreMappingService.getAllBatchYears(),
              cadre: this.cadreMappingService.getAllCadres()
            });
            this.cadreMappingService.setCadreConfigData(this.cadreConfigData);
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  initForm() {
    this.accessControlForm = this.fb.group({
      userGroup: this.fb.array([])
    });
  }

  get userGroup(): FormArray {
    return this.accessControlForm.get("userGroup") as FormArray;
  }

  ruleConditions(ruleIndex: number): FormArray {
    return this.userGroup.at(ruleIndex).get("conditions") as FormArray;
  }

  onAccessTypeChange(event: MatRadioChange): void {
    const selectedType = event.value;
    (event?.source?._inputElement?.nativeElement as HTMLElement)?.blur();
    if (selectedType === NsAccessControlConfig.IAccessTypes.Public) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "470px",
        data: { type: "confirm-access-type" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.action === NsAccessControlConfig.IActions.Confirm) {
          this.accessType = selectedType;
          this.updateContentAccessSetting();
        } else {
          this.accessTypeDup = this.accessType;
        }
      });
    } else {
      this.accessType = selectedType;
      this.updateContentAccessSetting();
    }
  }

  addUserGroup() {
    const ruleGroup = this.fb.group({
      id: [uuidv4()],
      name: [`User Group ${this.userGroup.length + 1}`],
      description: [`Description for UserGroup ${this.userGroup.length + 1}`],
      conditions: this.fb.array([this.createConditionGroup(uuidv4(), this.userGroup.length - 1)]),
      isUserGroupDisabled: [false],
      isAddConditionDisabled: [false]
    });

    this.userGroup.push(ruleGroup);
  }

  addCondition(userGroupIndex: number) {
    this.processCadreConfigMapping(userGroupIndex);
    const conditions = this.ruleConditions(userGroupIndex);
    const accessSetting = this.content?.accessSetting;

    if (conditions?.value?.length === 8) {
      this.callSnackbar("You have already added all types of conditions", "error");
      return;
    }

    // Check if organization/users already exists based on access setting
    if (accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC || accessSetting === NsAccessControlConfig.IAccessSetting.CUSTOME_USER) {
      const entityType =
        accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC
          ? NsAccessControlConfig.SelectionType.Organizations
          : NsAccessControlConfig.SelectionType.Users;
      const existingEntity = conditions.controls.some(ctrl => ctrl.get("entity")?.value === entityType);

      if (existingEntity) {
        this.callSnackbar(`${entityType.toUpperCase()} is already added in this user group`, "error");
        return;
      }
    }

    // Check if the last condition's selections are empty
    if (conditions?.length > 0) {
      const lastCondition = conditions.at(conditions.length - 1);
      const selections = lastCondition.get("selections")?.value || [];
      if (selections.length === 0) {
        this.callSnackbar("Please select a value for the current condition before adding another one.", "error");
        return;
      }
    }

    // Check if user is added in the condition then no more conditions can be added
    if (conditions?.length > 0) {
      const lastCondition = conditions.at(conditions.length - 1);
      const lastEntity = lastCondition.get("entity")?.value;
      if (lastEntity === NsAccessControlConfig.SelectionType.Users) {
        this.callSnackbar("Adding further condition is not possible , as you have already added User as condition", "error");
        return;
      }
    }

    conditions.push(this.createConditionGroup(uuidv4(), userGroupIndex));
  }

  createConditionGroup(id: number, userGroupIndex: number): FormGroup {
    let entity = "";
    const accessSetting = this.content?.accessSetting;
    if (accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC || accessSetting === NsAccessControlConfig.IAccessSetting.CUSTOME_USER) {
      entity =
        accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC
          ? NsAccessControlConfig.SelectionType.Organizations
          : NsAccessControlConfig.SelectionType.Users;
      this.accessControlCriteriaSelection.optionsEntity.forEach((ele: NsAccessControlConfig.IOptionsEntity) => {
        ele.disabled = ele.value !== entity;
      });
    } else {
      this.accessControlCriteriaSelection.optionsEntity.forEach((ele: NsAccessControlConfig.IOptionsEntity) => {
        ele.disabled = false;
      });
    }

    // Disable entity control if readOnly is true
    const isEntityDisabled = !!this.accessControlCriteriaSelection?.readOnly;
    return this.fb.group({
      id: [id],
      entity: [{ value: entity, disabled: isEntityDisabled }, Validators.required],
      conditionType: [{ value: "is", disabled: true }, Validators.required],
      selections: [[]]
    });
  }

  onEntityChange(userGroupIndex: number, conditionIndex: number): void {
    const conditions = this.ruleConditions(userGroupIndex);
    const condition = conditions.at(conditionIndex);
    const selectedEntity = condition?.get("entity")?.value;

    // Check if the same entity is already selected in another condition of this user group
    const isDuplicate = conditions.controls.some((ctrl, index) => {
      return index !== conditionIndex && ctrl.get("entity")?.value === selectedEntity;
    });

    if (isDuplicate) {
      this.callSnackbar(`${selectedEntity?.toUpperCase()} is already selected in this user group`, "error");
      condition.get("entity")?.setValue("");
      return;
    }

    if (condition?.value?.selections?.length) {
      condition.get("selections")?.setValue([]);
      this.processDisableAddConditionOnClose(userGroupIndex);
    }
  }

  onOpeningEntityChange(event: boolean, userGroupIndex: number, conditionIndex: number): void {
    if (event) {
      // Disable cadre from selection if services/batch has not cadre
      const conditions = this.ruleConditions(userGroupIndex);
      let selectedService: string[] = [];
      let selectedBatch: number[] = [];
      for (let i = 0; i < conditions.length; i++) {
        const entity = conditions.at(i).get("entity")?.value;
        const selections = conditions.at(i).get("selections")?.value || [];
        if (entity === NsAccessControlConfig.SelectionType.Service) {
          selectedService = selections;
        }
        if (entity === NsAccessControlConfig.SelectionType.Batch) {
          selectedBatch = selections;
        }
      }

      let availableCadres: any[] = [];
      let disableCadre = false;

      // 1. Only service is added
      if (selectedService.length) {
        const serviceSelections = this.cadreMappingService.getServiceIdsByName(selectedService || []) || [];
        availableCadres = this.cadreMappingService.getCadresByServices(serviceSelections);
        disableCadre = availableCadres.length === 0;
      } else {
        // If neither is selected, do not disable Cadre
        if (this.content.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) disableCadre = true;
        else disableCadre = false;
      }

      const updatedOptions = this.accessControlCriteriaSelection.optionsEntity.map(option => {
        if (option.value === NsAccessControlConfig.SelectionType.Cadre) {
          return { ...option, disabled: disableCadre };
        }
        return option;
      });
      this.accessControlCriteriaSelection.optionsEntity = [...updatedOptions];
    }
  }

  getAvailableEntities(userGroupIndex: number, currentConditionIndex: number): any[] {
    const conditions = this.ruleConditions(userGroupIndex);
    const selectedEntities = conditions.controls
      .map((ctrl, idx) => (idx !== currentConditionIndex ? ctrl.get("entity")?.value : null))
      .filter(e => !!e);
    return this.accessControlCriteriaSelection?.optionsEntity.filter(option => !selectedEntities.includes(option.value));
  }

  removeUserGroup(index: number) {
    const group = this.userGroup.at(index);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "470px",
      data: { additionalData: group?.value?.name, type: "delete" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === NsAccessControlConfig.IActions.Confirm) {
        if (group?.value?.conditions?.length && group?.value?.conditions[0]?.selections.length) {
          this.userGroup.removeAt(index);
          // Rename remaining groups
          for (let i = 0; i < this.userGroup.length; i++) {
            this.resetUserGroup(i);
          }
          this.reindexUserCount();
          this.applyAccessControlValue(true);
          this.calculateUserCountForUserGroup(index);
        } else {
          this.userGroup.removeAt(index);
          // Rename remaining groups
          for (let i = 0; i < this.userGroup.length; i++) {
            this.resetUserGroup(i);
          }
          this.reindexUserCount();
        }
      }
    });
  }

  private reindexUserCount() {
    const newUserCount: { [key: number]: number } = {};
    for (let i = 0; i < this.userGroup.length; i++) {
      newUserCount[i] = this.userCount[i] || 0;
    }
    this.userCount = newUserCount;
  }

  resetUserGroup(index: number) {
    const group = this.userGroup.at(index);
    if (group) {
      group.get("name")?.setValue(`User Group ${index + 1}`);
    }
  }

  resetUserGroupWithSelections(userGroupIndex: number) {
    const group = this.userGroup.at(userGroupIndex);
    if (group) {
      group.get("name")?.setValue(`User Group ${userGroupIndex + 1}`);
      const conditions = group.get("conditions") as FormArray;
      if (conditions && conditions.length) {
        for (let i = 0; i < conditions.length; i++) {
          const condition = conditions.at(i);
          condition.get("entity")?.setValue("");
          condition.get("selections")?.setValue([]);
        }
      }
      this.calculateUserCountForUserGroup(userGroupIndex);
      this.processDisableAddConditionOnClose(userGroupIndex);
    }
  }

  removeCondition(userGroupIndex: number, conditionIndex: number) {
    const conditions = this.ruleConditions(userGroupIndex);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "470px",
      data: { additionalData: "this condition", type: "delete" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === NsAccessControlConfig.IActions.Confirm) {
        conditions.removeAt(conditionIndex);
        this.applyAccessControlValue(true);
        this.calculateUserCountForUserGroup(userGroupIndex);
        this.processDisableAddConditionOnClose(userGroupIndex);
      }
    });
  }

  resetCondition(userGroupIndex: number, conditionIndex: number) {
    const conditions = this.ruleConditions(userGroupIndex);
    const condition = conditions.at(conditionIndex);
    if (condition) {
      const id = condition.get("id")?.value || uuidv4();
      conditions.setControl(conditionIndex, this.createConditionGroup(id, userGroupIndex));
      this.calculateUserCountForUserGroup(userGroupIndex);
      this.processDisableAddConditionOnClose(userGroupIndex);
    }
  }

  manageSelections(conditionForm: any, ruleForm: any, userGroupIndex: number, activeTabSelected = 0): void {
    const condition = conditionForm.getRawValue();
    const rule = ruleForm.getRawValue();
    let resetFilterFlag = false;
    if (!(this.content?.status === "Live" || this.content?.prevStatus === "Live" || this.content?.status === "Review")) {
      if (this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.ALL_USERS) {
        resetFilterFlag = this.checkForResetFilter(condition, rule, userGroupIndex);
      }
      if (resetFilterFlag) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: "470px",
          data: { type: "confirm-reset-fields" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.action === NsAccessControlConfig.IActions.Confirm) {
            this.resetActiveUserGroupFields(condition, rule, userGroupIndex);
          }
        });
      }
    }

    switch (condition.entity) {
      case NsAccessControlConfig.SelectionType.Users:
        if (!resetFilterFlag) {
          this.openInviteUserDialog(condition, rule, activeTabSelected, rule?.isUserGroupDisabled);
        }
        break;
      case NsAccessControlConfig.SelectionType.Organizations:
      case NsAccessControlConfig.SelectionType.Designation:
      case NsAccessControlConfig.SelectionType.Service:
      case NsAccessControlConfig.SelectionType.Cadre:
      case NsAccessControlConfig.SelectionType.Batch:
      case NsAccessControlConfig.SelectionType.Group:
      case NsAccessControlConfig.SelectionType.VerificationStatus:
        this.processCadreConfigMapping(userGroupIndex);
        if (!resetFilterFlag) {
          this.openSelectionDialog(rule, condition, activeTabSelected, rule?.isUserGroupDisabled);
        }
        break;
      default:
        if (!resetFilterFlag) {
          this.openSelectionDialog(rule, condition, activeTabSelected, rule?.isUserGroupDisabled);
        }
    }
  }

  openSelectionDialog(rule: any, condition: any, activeTabSelected: number, isDisabled: boolean): void {
    const originalSelections = [...(condition.selections || [])];

    const dialogRef = this.dialog.open(EntitySelectionsComponent, {
      width: "1032px",
      data: { rule: rule, condition: condition, selected: condition.selections, activeTabSelected: activeTabSelected, disabled: isDisabled }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Find the rule FormGroup in the FormArray
        const ruleIndex = this.userGroup.controls.findIndex((ctrl: any) => ctrl.get("id")?.value === result.rule.id);
        if (ruleIndex !== -1) {
          const ruleGroup = this.userGroup.at(ruleIndex);
          const conditions = ruleGroup.get("conditions") as FormArray;
          const conditionIndex = conditions.controls.findIndex((ctrl: any) => ctrl.get("id")?.value === result.condition.id);

          if (conditionIndex !== -1) {
            const conditionGroup = conditions.at(conditionIndex);
            conditionGroup.get("selections")?.setValue(result.selected);

            if (
              condition.entity === NsAccessControlConfig.SelectionType.Organizations &&
              !this.areSelectionsEqual(originalSelections, result.selected)
            ) {
              const designationCondition = conditions.controls.find(
                ctrl => ctrl.get("entity")?.value === NsAccessControlConfig.SelectionType.Designation
              );

              if (designationCondition) {
                designationCondition.get("selections")?.setValue([]);
              }
            }

            // Enable Deputation if Service is selected 'All India Services'
            if (this.accessControlService.accessControlConfig()?.application === NsAccessControlConfig.Application.MDO && condition.entity === NsAccessControlConfig.SelectionType.Service) {
              const serviceNames = this.cadreMappingService.getServicesByNames(result.selected || []);
              const selections = serviceNames.map((service) => service.name);
              if (selections.includes("All India Services")) {
                this.accessControlService.enableDeputation(true);
              } else {
                this.accessControlService.enableDeputation(false);
              }
            }
            this.processCadreConfigMapping(ruleIndex);
            this.processDisableAddConditionOnClose(ruleIndex);

            if (!this.areSelectionsEqual(originalSelections, result.selected)) {
              this.calculateUserCountForUserGroup(ruleIndex);
            }

            // send event after every selection for MDO
            if (this.config.application === this.MDO_APPLICATION) {
              this.applyAccessControlValue(false, false);
            }
          }
        }
      }
    });
  }

  private areSelectionsEqual(content_1: any[], content_2: any[]): boolean {
    if (content_1.length !== content_2.length) return false;
    return content_1.every(item => content_2.includes(item));
  }

  processCadreConfigMapping(userGroupIndex: number): void {
    const ruleGroup = this.userGroup.at(userGroupIndex);
    const conditionValue = ruleGroup.get("conditions").value;
    if (conditionValue && conditionValue.length) {
      const services = conditionValue.find((ele: any) => ele.entity === NsAccessControlConfig.SelectionType.Service);
      const cadre = conditionValue.find((ele: any) => ele.entity === NsAccessControlConfig.SelectionType.Cadre);
      const batch = conditionValue.find((ele: any) => ele.entity === NsAccessControlConfig.SelectionType.Batch);

      const serviceSelections = this.cadreMappingService.getServiceIdsByName(services?.selections || []) || [];
      const cadreSelections = this.cadreMappingService.getCadreIdsByName(cadre?.selections || []) || [];
      const batchSelections = batch?.selections || [];

      // Case 1: Only service selected
      if (serviceSelections?.length && !cadreSelections?.length && !batchSelections?.length) {
        this.accessControlService.holdServiceCadrebatch.update(prev => ({
          ...prev,
          service: this.cadreMappingService.getAllServices(),
          cadre: this.cadreMappingService.getCadresByServices(serviceSelections),
          batch: this.cadreMappingService.getBatchYearsByServices(serviceSelections)
        }));
      }
      // Case 2: Only cadre selected
      else if (!serviceSelections?.length && cadreSelections?.length && !batchSelections?.length) {
        this.accessControlService.holdServiceCadrebatch.update(prev => ({
          ...prev,
          cadre: this.cadreMappingService.getAllCadres(),
          service: this.cadreMappingService.getServicesByCadres(cadreSelections),
          batch: this.cadreMappingService.getBatchYearsByCadres(cadreSelections)
        }));
      }
      // Case 3: Only batch selected
      else if (!serviceSelections?.length && !cadreSelections?.length && batchSelections?.length) {
        this.accessControlService.holdServiceCadrebatch.update(prev => ({
          ...prev,
          batch: this.cadreMappingService.getAllBatchYears(),
          service: this.cadreMappingService.getServicesByBatchYears(batchSelections),
          cadre: this.cadreMappingService.getCadresByBatchYears(batchSelections)
        }));
      }
      // Case 4: Service and Cadre selected
      else if (serviceSelections?.length && cadreSelections?.length && !batchSelections?.length) {
        this.accessControlService.holdServiceCadrebatch.update(prev => ({
          ...prev,
          service: this.cadreMappingService.getServicesByCadres(cadreSelections),
          cadre: this.cadreMappingService.getCadresByServices(serviceSelections),
          batch: this.cadreMappingService.getBatchYearsByServicesAndCadres(serviceSelections, cadreSelections)
        }));
      }
      // Case 5: Service and Batch selected
      else if (serviceSelections?.length && !cadreSelections?.length && batchSelections?.length) {
        this.accessControlService.holdServiceCadrebatch.update(prev => ({
          ...prev,
          cadre: this.cadreMappingService.getCadresByServicesAndBatch(serviceSelections, batchSelections),
          service: this.cadreMappingService.getServicesByBatchYears(batchSelections),
          batch: this.cadreMappingService.getBatchYearsByServices(serviceSelections)
        }));
      }
      // Case 6: Cadre and Batch selected
      else if (!serviceSelections?.length && cadreSelections?.length && batchSelections?.length) {
        this.accessControlService.holdServiceCadrebatch.update(prev => ({
          ...prev,
          service: this.cadreMappingService.getServicesByCadresAndBatch(cadreSelections, batchSelections),
          cadre: this.cadreMappingService.getCadresByBatchYears(batchSelections),
          batch: this.cadreMappingService.getBatchYearsByCadres(cadreSelections)
        }));
      } else {
        this.accessControlService.holdServiceCadrebatch.set({
          service: this.cadreMappingService.getAllServices(),
          batch: this.cadreMappingService.getAllBatchYears(),
          cadre: this.cadreMappingService.getAllCadres()
        });
      }
    }
  }

  processDisableAddConditionOnClose(userGroupIndex: number): void {
    // If any condition is Users and at least one user is added, disable add condition
    const ruleGroup = this.userGroup.at(userGroupIndex);
    const conditions = ruleGroup.get("conditions") as FormArray;
    const hasUsersConditionWithSelection = conditions.controls.some(
      ctrl =>
        ctrl.get("entity")?.value === NsAccessControlConfig.SelectionType.Users &&
        Array.isArray(ctrl.get("selections")?.value) &&
        ctrl.get("selections")?.value.length > 0
    );
    ruleGroup.get("isAddConditionDisabled")?.setValue(hasUsersConditionWithSelection);
  }

  openInviteUserDialog(condition: any, rule: any, activeTabSelected: number, isDisabled: boolean): void {
    const originalSelections = [...(condition.selections || [])];

    const dialogRef = this.dialog.open(InviteUsersComponent, {
      width: "1090px",
      data: { condition: condition, rule: rule, selected: condition.selections, activeTab: activeTabSelected, disabled: isDisabled }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Find the rule FormGroup in the FormArray
        const ruleIndex = this.userGroup.controls.findIndex((ctrl: any) => ctrl.get("id")?.value === result.rule.id);
        if (ruleIndex !== -1) {
          const ruleGroup = this.userGroup.at(ruleIndex);
          const conditions = ruleGroup.get("conditions") as FormArray;
          const conditionIndex = conditions.controls.findIndex((ctrl: any) => ctrl.get("id")?.value === result.condition.id);
          if (conditionIndex !== -1) {
            const conditionGroup = conditions.at(conditionIndex);
            // const userIds = result.selected && result.selected.map((user: any) => user?.userId);
            conditionGroup.get("selections")?.setValue(result.selected);
            this.processDisableAddConditionOnClose(ruleIndex);
          }
          if (!this.areSelectionsEqual(originalSelections, result.selected)) {
            this.calculateUserCountForUserGroup(ruleIndex);
          }
        }
      }
    });
  }

  callSnackbar(message: string, type: "success" | "error"): void {
    if (type === "success") {
      this.snackbar.openFromComponent(SnackbarComponent, {
        data: { message: message, type: "success" },
        duration: 3000,
        panelClass: "course-success-snackbar"
      });
    } else if (type === "error") {
      this.snackbar.openFromComponent(SnackbarComponent, {
        data: { message: message, type: "error" },
        duration: 3000,
        panelClass: "course-error-snackbar"
      });
    }
  }

  validateFormData() {
    // Validate user groups and conditions
    if (!this.userGroup || this.userGroup.length === 0) {
      this.callSnackbar("Please add at least one user group.", "error");
      return false;
    }
    for (let i = 0; i < this.userGroup.length; i++) {
      const group = this.userGroup.at(i);
      const conditions = group.get("conditions") as FormArray;
      if (!conditions || conditions.length === 0) {
        this.callSnackbar(`User group ${i + 1} must have at least one condition.`, "error");
        return false;
      }
      for (let j = 0; j < conditions.length; j++) {
        const selections = conditions.at(j).get("selections")?.value;
        if (!selections || selections.length === 0) {
          this.callSnackbar(`Condition ${j + 1} in user group ${i + 1} must have at least one selection.`, "error");
          return false;
        }
      }
    }
    return true;
  }

  async applyAccessControlValue(shouldProceedWithoutValidation: boolean = false, displaySuccessMessage: boolean = true): Promise<void> {
    if (!shouldProceedWithoutValidation) {
      const validated = this.validateFormData();
      if (!validated) return;
    }

    if (this.content?.status === "Live") this.isApplying = true;
    else this.isSaving = true;

    const payload = await this.processRequestCreation();

    if (this.config.application === this.MDO_APPLICATION) {
      this.accessControlData.emit({ userGroup: payload, accessType: this.accessType });
      if (displaySuccessMessage) this.callSnackbar("Access Control saved successfully", "success");
      this.isSaveFltrBtnDisabled = true;
      this.isSaving = false;
      return;
    }

    this.accessControlService
      .applyUserGroupAccessControl(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response?.result && response?.result?.accessControl) {
            this.accessControlData.emit({ userGroup: response.result.accessControl?.userGroups, accessType: this.accessType });
            if (displaySuccessMessage) this.callSnackbar("Access Control saved successfully", "success");
            this.initialUserGroupValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
            this.isSaveFltrBtnDisabled = true;

            // Update secure setting for moderated content
            // if (this.content.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
            if (this.content?.status !== "Live" && this.content?.prevStatus !== "Live") {
              this.updateContentAccessSetting();
            }
            // }
          } else {
            this.callSnackbar("Could not save access control, Please try again.", "error");
          }
          if (this.content?.status === "Live") this.isApplying = false;
          else this.isSaving = false;
        },
        error: () => {
          this.callSnackbar("Could not save access control, Please try again.", "error");
          if (this.content?.status === "Live") this.isApplying = false;
          else this.isSaving = false;
        }
      });
  }

  processRequestCreation(): Promise<IUserGroupRequest> {
    return new Promise((resolve, reject) => {
      try {
        const data = this.accessControlForm.getRawValue();

        // Filter out user groups with empty userGroupCriteriaList
        const userGroups = data.userGroup
          .map((group: any) => ({
            userGroupName: group.name,
            userGroupCriteriaList: group.conditions.map((condition: any) => {
              let criteriaValue: string[];

              if (
                condition?.entity === NsAccessControlConfig.SelectionType.Users &&
                condition?.selections?.length &&
                condition?.selections[0]?.userId
              ) {
                const userIds = condition.selections?.map((user: any) => user?.userId) || [];
                criteriaValue = userIds;
              } else {
                criteriaValue = condition.selections?.map(String) || [];
              }

              return {
                criteriaKey: condition.entity,
                criteriaValue
              };
            })
          }))
          .filter((group: any) => Array.isArray(group.userGroupCriteriaList) && group.userGroupCriteriaList.length > 0);

        const requestPayload: IUserGroupRequest = {
          contentId: this.contentId,
          accessControl: {
            version: 1,
            userGroups
          }
        };

        resolve(requestPayload);
      } catch (error) {
        reject(error);
      }
    });
  }

  openInstructonsDialog(): void {
    this.dialog.open(AccessControlGuideComponent, {
      width: "960px"
    });
  }

  async getAccessControl(): Promise<void> {
    const response = await this.accessControlService
      .fetchUserGroupAccessControl(this.contentId)
      .pipe(takeUntil(this.destroy$))
      .toPromise()
      .catch(() => {
        // For Moderated Content Condition if not already added the usergroup autocreate a usergroup with added conditions and save it
        if (this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
          // Create Organization condition
          const orgCondition = this.createConditionGroup(uuidv4(), 0);
          orgCondition.get("entity")?.setValue(NsAccessControlConfig.SelectionType.Organizations);
          orgCondition.get("selections").setValue([this.config?.userConfig?.rootOrgId]);

          // Create Verification Status condition with default 'Verified'
          const verificationCondition = this.createConditionGroup(uuidv4(), 0);
          verificationCondition.get("entity")?.setValue(NsAccessControlConfig.SelectionType.VerificationStatus);
          verificationCondition.get("selections")?.setValue(["VERIFIED"]);

          // Create user group with these two conditions
          const group = this.fb.group({
            id: [uuidv4()],
            name: ["User Group 1"],
            description: ["Description for UserGroup 1"],
            conditions: this.fb.array([orgCondition, verificationCondition])
          });
          this.userGroup.push(group);

          // Disable add user group btn
          this.isAddUserGroupBtnDisabled = true;
          this.accessControlData.emit({ userGroup: this.accessControlForm.value?.userGroup, accessType: this.accessType });
          this.applyAccessControlValue(false, false);
          this.updateContentAccessSetting();
        } else {
          // this.addUserGroup();
        }
        setTimeout(() => {
          this.initialUserGroupValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
          this.setupFormChangeDetection();
        }, 0);
      });
    if (response?.result?.accessControl) {
      this.processAccessControlResult(response.result.accessControl);
      this.accessControlData.emit({ userGroup: response.result.accessControl?.userGroups, accessType: this.accessType });

      // Temporary fix to updated the failed content for moderated
      // if (this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
      //   if (!this.content?.accessSettingsEnabled) {
      //     this.updateContentAccessSetting();
      //   }
      // }
      // this.updateContentAccessSetting();
    }
  }

  private setupFormChangeDetection(): void {
    this.accessControlForm.valueChanges.subscribe(() => {
      const currentValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
      if (this.content?.status === "Live" || this.content?.prevStatus === "Live") {
        // this.isApplyBtnDisabled = currentValue === this.initialUserGroupValue;
        this.isSaveFltrBtnDisabled = currentValue === this.initialUserGroupValue;
      } else {
        this.isSaveFltrBtnDisabled = currentValue === this.initialUserGroupValue;
      }
    });
  }

  processAccessControlResult(accessControl: any): void {
    if (!accessControl?.userGroups?.length) {
      setTimeout(() => {
        this.initialUserGroupValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
        this.setupFormChangeDetection();
      }, 0);

      return;
    }

    while (this.userGroup.length) {
      this.userGroup.removeAt(0);
    }

    accessControl.userGroups.forEach((group: any, index: number) => {
      const conditions = this.fb.array([]) as any;

      group.userGroupCriteriaList.forEach((criteria: any) => {
        const condition = this.createConditionGroup(uuidv4(), this.userGroup.length);

        // Map API keys to form entity values
        const entityMap: { [key: string]: string } = {
          rootOrgId: NsAccessControlConfig.SelectionType.Organizations,
          user: NsAccessControlConfig.SelectionType.Users,
          group: NsAccessControlConfig.SelectionType.Group,
          designation: NsAccessControlConfig.SelectionType.Designation,
          profilestatus: NsAccessControlConfig.SelectionType.VerificationStatus,
          Cadre: NsAccessControlConfig.SelectionType.Cadre,
          service: NsAccessControlConfig.SelectionType.Service,
          batch: NsAccessControlConfig.SelectionType.Batch
        };

        // Set the form values
        condition.patchValue({
          entity: entityMap[criteria.criteriaKey] || criteria.criteriaKey,
          selections:
            criteria.criteriaKey === NsAccessControlConfig.SelectionType.Batch
              ? Array.isArray(criteria.criteriaValue)
                ? criteria.criteriaValue.map((b: any) => Number(b))
                : []
              : criteria.criteriaValue
        });

        conditions.push(condition);
      });

      const ruleGroup = this.fb.group({
        id: [group.userGroupId || uuidv4()],
        name: [group.userGroupName],
        description: [`Description for ${group.userGroupName}`],
        conditions: conditions,
        isUserGroupDisabled: [false],
        isAddConditionDisabled: [false]
      });

      this.userGroup.push(ruleGroup);

      // Check if add condition should be disabled for this user group
      this.processDisableAddConditionOnClose(index);

      // Calculate count for each user group
      this.calculateUserCountForUserGroup(index);
      if (
        (this.content?.status === "Live" || this.content?.prevStatus === "Live") &&
        (this.config.userConfig.userRoles.has("content_creator") || this.config.userConfig.userRoles.has("spv_publisher"))
      ) {
        // publisher (cannot edit already added)
        for (let i = 0; i < this.userGroup.length; i++) {
          const group = this.userGroup.at(i);
          group.get("id")?.disable();
          group.get("name")?.disable();
          group.get("description")?.disable();
          group.get("conditions")?.disable();
          group.get("isUserGroupDisabled")?.setValue(true);
        }
        this.isSaveFltrBtnDisabled = true;
        this.isApplyBtnDisabled = false;
      }
      setTimeout(() => {
        this.initialUserGroupValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
        this.setupFormChangeDetection();
      }, 0);
    });
  }

  async updateContentAccessSetting(): Promise<void> {
    let secureSettings = {};
    if (typeof this.content.language === "string") {
      this.content.language = [this.content.language];
    }
    if (this.content.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
      const userGroup0 = this.userGroup.at(0);
      let organisation: string[] = [];
      let isVerifiedKarmayogi = "";

      if (userGroup0) {
        const conditions = userGroup0.get("conditions") as FormArray;
        if (conditions && conditions.length) {
          const orgCondition = conditions.controls.find(ctrl => ctrl.get("entity")?.value === NsAccessControlConfig.SelectionType.Organizations);
          if (orgCondition) {
            organisation = orgCondition.get("selections")?.value || [];
          }

          const verificationCondition = conditions.controls.find(
            ctrl => ctrl.get("entity")?.value === NsAccessControlConfig.SelectionType.VerificationStatus
          );
          if (verificationCondition) {
            const verSelections = verificationCondition.get("selections")?.value || [];
            isVerifiedKarmayogi = Array.isArray(verSelections) && verSelections?.length > 1 ? "No" : "Yes";
          }
        }
      }

      this.content.secureSettings = {
        version: 1,
        organisation,
        isVerifiedKarmayogi
      };
      secureSettings = {
        version: 1,
        organisation,
        isVerifiedKarmayogi
      };
    }

    const accessTypeBoolean = this.accessType === NsAccessControlConfig.IAccessTypes.Public ? false : true;
    const request = this.accessControlService.createRequestContent(this.content, accessTypeBoolean);
    const requestForMDO = this.accessControlService.createRequesForMDOContent(this.content, accessTypeBoolean, secureSettings);
    if (this.content.status !== "Live" || this.content.prevStatus != "Live") {
      if (
        (this.config.userConfig.userRoles.has("content_publisher") || this.config.userConfig.userRoles.has("spv_publisher")) &&
        this.content.status !== "Draft"
      ) {
        if (this.content.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
          if (this.content.reviewStatus) {
            (requestForMDO.request.content as any).reviewStatus = this.content.reviewStatus;
          }
          await this.accessControlService.updateContentV4(requestForMDO, this.contentId).toPromise();
        } else {
          if (this.content.reviewStatus) {
            (request.request.content as any).reviewStatus = this.content.reviewStatus;
          }
          await this.accessControlService.updateContentV4(request, this.contentId).toPromise();
        }
      } else {
        if (this.content.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
          await this.accessControlService.updateContentV3(requestForMDO, this.contentId).toPromise();
        } else {
          await this.accessControlService.updateContentV3(request, this.contentId).toPromise();
        }
      }
    }

    this.refreshContentMeta.emit(true);
  }

  get hasUserGroupBeenAdded(): boolean {
    if (!this.userGroup?.length) {
      return true;
    }

    return !this.userGroup.controls.every((group: any) => {
      const conditions = (group.get("conditions") as FormArray)?.controls || [];
      return (
        conditions?.length > 0 &&
        conditions.every((condition: any) => {
          const selections = condition.get("selections")?.value;
          return Array.isArray(selections) && selections.length > 0;
        })
      );
    });
  }

  get getTotalUserCount(): number {
    return (Object.values(this.userCount) as number[]).reduce((total, count) => total + count, 0);
  }

  processConditionsForContentType(): void {
    if (this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
      // Disable add user group btn
      this.isAddUserGroupBtnDisabled = true;
    }

    if (this.content?.status === "Review" && this.content?.reviewStatus === "InReview") {
      // reviewer(readonly)
      this.accessControlCriteriaSelection.readOnly = true;
      this.isSaveFltrBtnDisabled = true;
      this.isApplyBtnDisabled = true;
    } else if (
      (this.content?.status === "Live" || this.content?.prevStatus === "Live") &&
      (this.config.userConfig.userRoles.has("spv_publisher") ||
        this.config.userConfig.userRoles.has("content_publisher") ||
        this.config.userConfig.userRoles.has("content_creator")) &&
      this.content?.courseCategory !== "Comprehensive Assessment Program"
    ) {
      // publisher (disabled all)
      this.accessControlCriteriaSelection.readOnly = true;
      this.isSaveFltrBtnDisabled = true;
      this.isApplyBtnDisabled = true;
    }
  }

  async calculateUserCountForUserGroup(userGroupIndex: number): Promise<void> {
    // Mapping of entity to request key
    const entityKeyMap: { [key: string]: string } = {
      [NsAccessControlConfig.SelectionType.Organizations]: "rootOrgId",
      [NsAccessControlConfig.SelectionType.Designation]: "profileDetails.professionalDetails.designation",
      [NsAccessControlConfig.SelectionType.Group]: "profileDetails.professionalDetails.group",
      [NsAccessControlConfig.SelectionType.VerificationStatus]: "profileDetails.profileStatus",
      [NsAccessControlConfig.SelectionType.Cadre]: "profileDetails.cadreDetails.cadreName",
      [NsAccessControlConfig.SelectionType.Service]: "profileDetails.cadreDetails.civilServiceName",
      [NsAccessControlConfig.SelectionType.Batch]: "profileDetails.cadreDetails.cadreBatch",
      [NsAccessControlConfig.SelectionType.Users]: "identifier"
    };

    const group = this.userGroup.at(userGroupIndex);
    if (!group) {
      this.userCount[userGroupIndex] = 0;
      return;
    }

    const conditions = group.get("conditions") as FormArray;
    const request: { [key: string]: any[] } = {};

    for (let j = 0; j < conditions.length; j++) {
      const condition = conditions.at(j);
      const entity = condition.get("entity")?.value;
      const selections = condition.get("selections")?.value || [];
      const key = entityKeyMap[entity];
      if (key) {
        if (
          entity === NsAccessControlConfig.SelectionType.Users &&
          Array.isArray(selections) &&
          selections.every(sel => typeof sel === "object" && sel !== null)
        ) {
          const userIds = selections && selections.map((user: any) => user?.userId);
          request[key] = userIds;
        } else {
          request[key] = selections;
        }
      }
    }

    // Remove keys with empty array values
    Object.keys(request).forEach(key => {
      if (Array.isArray(request[key]) && request[key].length === 0) {
        delete request[key];
      }
    });

    const filters: any = { ...request };
    if (Object.keys(filters).length > 0) {
      filters.status = 1;
    } else {
      delete filters.status;
    }

    const payload = {
      request: {
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
        fields: ["identifier", "rootOrgId", "firstName"]
      }
    };
    const response = await this.accessControlService
      .validateUser(payload)
      .toPromise()
      .catch(() => {
        this.userCount[userGroupIndex] = 0;
      });
    if (response?.result?.response) {
      const count = response?.result?.response?.count;
      this.userCount[userGroupIndex] = count;
    }
  }

  isUserGroupFormChanged(initialValue: any): boolean {
    const currentValue = this.accessControlForm.getRawValue().userGroup;
    return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
  }

  checkForResetFilter(condition: any, rule: any, userGroupIndex: any) {
    let flag = false;
    let accessControlFormData = this.accessControlForm.getRawValue();
    let activeManageSelection = accessControlFormData && accessControlFormData?.userGroup?.[userGroupIndex];
    let activeSelectionCount = 0;
    if (activeManageSelection && activeManageSelection?.conditions && activeManageSelection?.conditions?.length > 1) {
      //Show Popup
      let onlyOneCondition = this.hasOnlyOneArrayWithLength(activeManageSelection?.conditions, "selections");
      if (onlyOneCondition) {
        flag = false;
      } else {
        activeManageSelection?.conditions?.map(item => {
          if (item?.entity == condition?.entity && item?.selections.length > 0) {
            flag = true;
          }
        });
      }
      if (activeManageSelection?.conditions?.length > 1) {
        let checkLastIndexHaveSelections = -1;
        activeManageSelection?.conditions?.forEach((item, index) => {
          if (item?.selections.length > 0) {
            checkLastIndexHaveSelections = index;
          }
        });
        // console.log('activeManageSelection?.conditions', activeManageSelection?.conditions)
        // console.log('checkLastIndexHaveSelections--', checkLastIndexHaveSelections)
        if (activeManageSelection?.conditions[checkLastIndexHaveSelections]?.entity === condition?.entity && condition?.selections?.length > 0) {
          flag = false;
        }
      }

      // let index = activeManageSelection?.conditions?.findLastIndex((item) =>
      //   item?.entity === condition?.entity && item?.selections.length > 0
      // );
      // if((index + 1) === activeManageSelection?.conditions.length) {
      //   flag = false
      // }
      // console.log('activeManageSelection?.conditions', activeManageSelection?.conditions)
      // console.log('index', index)
    }
    return flag;
  }

  hasOnlyOneArrayWithLength(data, key) {
    let count = 0;
    for (const obj of data) {
      if (Array.isArray(obj[key]) && obj[key].length > 0) {
        count++;
      }
    }
    return count > 1 ? false : true;
  }

  resetActiveUserGroupFields(condition: any, rule: any, userGroupIndex: any) {
    let accessControlFormData = this.accessControlForm.getRawValue();
    let activeManageSelection = accessControlFormData && accessControlFormData?.userGroup?.[userGroupIndex];
    let activeConditionIndex = activeManageSelection?.conditions?.findIndex(item => {
      return item?.entity === condition?.entity && item?.selections?.length > 0;
    });
    let activeManageSelectionArrLength = activeManageSelection?.conditions.length;
    for (let i = activeConditionIndex + 1; i < activeManageSelectionArrLength; i++) {
      const userGroupArray = this.accessControlForm.get("userGroup") as FormArray;
      const userGroup = userGroupArray.at(userGroupIndex) as FormGroup;
      const conditionsArray = userGroup.get("conditions") as FormArray;
      const conditionGroup = conditionsArray.at(i) as FormGroup;
      // conditionGroup.reset();
      const condition = conditionGroup;
      condition.get("entity")?.setValue("");
      condition.get("selections")?.setValue([]);
    }

    this.calculateUserCountForUserGroup(userGroupIndex);
  }

  // Customs Field Logics
  getCustomsField() {
    this.accessControlService
      .fetchCustomsField({
        organisationId: this.config.userConfig.rootOrgId,
        isEnabled: true,
        // isMandatory: true,
      })
      .subscribe({
        next: (data) => {
          if (data && data?.result && data.result.searchResults?.data) {
            const results = data.result.searchResults.data;
            if (Array.isArray(results) && results.length) {
              this.accessControlService.customesFieldData.set(results);
              const mappedResults = results.map((field: any) => ({
                disabled: false,
                value: field?.attributeName || "",
                label: field?.name || "",
                isCustomField: true,
              }));

              // Update optionsEntity
              this.accessControlCriteriaSelection.optionsEntity = [...this.accessControlCriteriaSelection.optionsEntity, ...mappedResults];

              const dynamicFields = mappedResults.reduce((acc, field) => {
                acc[field.value] = [
                  { value: "all", label: `All ${field.label}` },
                  { value: "selected", label: `Selected ${field.label}` },
                ];
                return acc;
              }, {} as Record<string, Array<{ value: string; label: string }>>);

              // Merge dynamic keys into accessControlCriteriaSelection
              this.accessControlCriteriaSelection = {
                ...this.accessControlCriteriaSelection,
                ...dynamicFields,
              };

              // Update the signal with the full updated object
              this.accessControlService.accessControlConfig.update((prevConfig) => ({
                ...prevConfig,
                accessControlCriteriaSelection: this.accessControlCriteriaSelection,
              }));
            }
          }
        },
      });
  }

  // Patch raw accesscontrol to form
  processTempAccessControl(tempAccessControl: any): void {
    while (this.userGroup.length) {
      this.userGroup.removeAt(0);
    }

    tempAccessControl.userGroups.forEach((group: any, index: number) => {
      const conditions = this.fb.array([]) as any;

      group.userGroupCriteriaList.forEach((criteria: any) => {
        const condition = this.createConditionGroup(uuidv4(), this.userGroup.length);

        // Map API keys to form entity values
        const entityMap: { [key: string]: string } = {
          rootOrgId: NsAccessControlConfig.SelectionType.Organizations,
          user: NsAccessControlConfig.SelectionType.Users,
          group: NsAccessControlConfig.SelectionType.Group,
          designation: NsAccessControlConfig.SelectionType.Designation,
          profilestatus: NsAccessControlConfig.SelectionType.VerificationStatus,
          Cadre: NsAccessControlConfig.SelectionType.Cadre,
          service: NsAccessControlConfig.SelectionType.Service,
          batch: NsAccessControlConfig.SelectionType.Batch,
        };

        // Set the form values
        condition.patchValue({
          entity: entityMap[criteria.criteriaKey] || criteria.criteriaKey,
          selections:
            criteria.criteriaKey === NsAccessControlConfig.SelectionType.Batch
              ? Array.isArray(criteria.criteriaValue)
                ? criteria.criteriaValue.map((b: any) => Number(b))
                : []
              : criteria.criteriaValue,
        });

        conditions.push(condition);
      });

      const ruleGroup = this.fb.group({
        id: [group.userGroupId || uuidv4()],
        name: [group.userGroupName],
        description: [`Description for ${group.userGroupName}`],
        conditions: conditions,
        isUserGroupDisabled: [false],
        isAddConditionDisabled: [false],
      });

      this.userGroup.push(ruleGroup);

      // Check if add condition should be disabled for this user group
      this.processDisableAddConditionOnClose(index);

      // Calculate count for each user group
      this.calculateUserCountForUserGroup(index);
    });

    setTimeout(() => {
      this.initialUserGroupValue = JSON.stringify(this.accessControlForm.getRawValue().userGroup);
      this.setupFormChangeDetection();
    }, 0);
  }
}
