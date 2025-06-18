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

@Component({
  selector: "sb-uic-access-control",
  templateUrl: "./access-control.component.html",
  styleUrls: ["./access-control.component.scss"]
})
export class AccessControlComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config!: NsAccessControlConfig.IAccessControlConfig;
  @Input() contentId: string = "";
  @Input() content: any;

  @Output() accessControlData: EventEmitter<{ userGroup: any[]; accessType: string }> = new EventEmitter();
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

  cadreConfigData: any;
  isSaveFltrBtnDisabled = false;
  isApplyBtnDisabled = false;
  isAddUserGroupBtnDisabled = false;
  isApplying = false;
  isSaving = false;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private accessControlService: AccessControlService,
    private cadreMappingService: CadreMappingService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAccessControl();
    this.accessControlService.accessControlConfig.set(this.config);
    this.accessControlCriteriaSelection = this.config?.accessControlCriteriaSelection;

    // Disable form for reviewer if readonly is true
    if (this.accessControlCriteriaSelection?.readOnly) {
      this.accessControlForm.disable();
      this.isSaveFltrBtnDisabled = true;
      this.isApplyBtnDisabled = true;
    }

    this.usersTableConfig = this.config?.usersTableConfig;

    if (!this.contentId) {
      this.callSnackbar("Content id is required", "error");
    }
    if (this.content) {
      if (this.content?.status === "Live") {
        this.accessControlCriteriaSelection.readOnly = true;
        this.isSaveFltrBtnDisabled = true;
      } else {
        this.isApplyBtnDisabled = true;
        this.accessControlCriteriaSelection.readOnly = false;
      }

      if (this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.ALL_USERS) {
        this.accessType = NsAccessControlConfig.IAccessTypes.Public;
        const accessTypePublic = this.accessControlCriteriaSelection?.accessTypes.find(
          type => type?.value === NsAccessControlConfig.IAccessTypes.Public
        );
        if (accessTypePublic) accessTypePublic.disabled = false;
        if (this.content?.accessSettingsEnabled) {
          this.accessType = NsAccessControlConfig.IAccessTypes.Custom;
        }
      } else if (
        this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC ||
        this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.CUSTOME_USER
      ) {
        this.accessType = NsAccessControlConfig.IAccessTypes.Custom;
        const accessTypePublic = this.accessControlCriteriaSelection?.accessTypes.find(
          type => type?.value === NsAccessControlConfig.IAccessTypes.Public
        );
        if (accessTypePublic) accessTypePublic.disabled = true;
      }

      this.processConditionsForContentType();
    }
    this.accessTypeDup = this.accessType;
  }

  ngAfterViewInit(): void {
    if (this.config?.visiblilityOnOff?.default !== "on") {
      this.isVisibilityEnabled = false;
    }
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
          }
        },
        complete: () => {
          this.isLoading = false;
        }
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
      conditions: this.fb.array([this.createConditionGroup(uuidv4(), this.userGroup.length - 1)])
    });

    this.userGroup.push(ruleGroup);
  }

  addCondition(userGroupIndex: number) {
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
    }
  }

  getAvailableEntities(userGroupIndex: number, currentConditionIndex: number): { value: string; label: string }[] {
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
          this.applyAccessControlValue(true);
        } else {
          this.userGroup.removeAt(index);
          // Rename remaining groups
          for (let i = 0; i < this.userGroup.length; i++) {
            this.resetUserGroup(i);
          }
        }
      }
    });
  }

  resetUserGroup(index: number) {
    const group = this.userGroup.at(index);
    if (group) {
      group.get("name")?.setValue(`User Group ${index + 1}`);
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
      }
    });
  }

  resetCondition(userGroupIndex: number, conditionIndex: number) {
    const conditions = this.ruleConditions(userGroupIndex);
    const condition = conditions.at(conditionIndex);
    if (condition) {
      const id = condition.get("id")?.value || uuidv4();
      conditions.setControl(conditionIndex, this.createConditionGroup(id, userGroupIndex));
    }
  }

  manageSelections(conditionForm: any, ruleForm: any, userGroupIndex: number, activeTabSelected = 0): void {
    const condition = conditionForm.getRawValue();
    const rule = ruleForm.getRawValue();
    switch (condition.entity) {
      case NsAccessControlConfig.SelectionType.Users:
        this.openInviteUserDialog(condition, rule, activeTabSelected);
        break;
      case NsAccessControlConfig.SelectionType.Organizations:
      case NsAccessControlConfig.SelectionType.Designation:
      case NsAccessControlConfig.SelectionType.Service:
      case NsAccessControlConfig.SelectionType.Cadre:
      case NsAccessControlConfig.SelectionType.Batch:
      case NsAccessControlConfig.SelectionType.Group:
      case NsAccessControlConfig.SelectionType.VerificationStatus:
        this.processCadreConfigMapping(userGroupIndex);
        this.openSelectionDialog(rule, condition, activeTabSelected);
        break;
      default:
        console.warn("Unsupported entity type:", condition.entity);
    }
  }

  openSelectionDialog(rule: any, condition: any, activeTabSelected: number): void {
    const originalSelections = [...(condition.selections || [])];

    const dialogRef = this.dialog.open(EntitySelectionsComponent, {
      width: "1032px",
      data: { rule: rule, condition: condition, selected: condition.selections, activeTabSelected: activeTabSelected }
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

            this.processCadreConfigMapping(ruleIndex);
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
          batch: this.cadreMappingService.getBatchYearsByServices(cadreSelections)
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
          cadre: this.cadreMappingService.getCadresByServicesAndBatch(serviceSelections, batchSelections),
          batch: this.cadreMappingService.getBatchYearsByServicesAndCadres(serviceSelections, cadreSelections)
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

  openInviteUserDialog(condition: any, rule: any, activeTabSelected: number): void {
    const dialogRef = this.dialog.open(InviteUsersComponent, {
      width: "1090px",
      data: { condition: condition, rule: rule, selected: condition.selections, activeTab: activeTabSelected }
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

  async applyAccessControlValue(shouldProceedWithoutValidation: boolean = false): Promise<void> {
    if (!shouldProceedWithoutValidation) {
      const validated = this.validateFormData();
      if (!validated) return;
    }

    if (this.content?.status === "Live") this.isApplying = true;
    else this.isSaving = true;

    const payload = await this.processRequestCreation();
    this.accessControlService
      .applyUserGroupAccessControl(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response?.result && response?.result?.accessControl) {
            this.accessControlData.emit({ userGroup: response.result.accessControl?.userGroups, accessType: this.accessType });
            this.callSnackbar("Access Control saved successfully", "success");
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
        const data = this.accessControlForm.value;

        const userGroups = data.userGroup.map((group: any) => ({
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
        }));

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
    if (!this.cadreConfigData) {
      this.fetchCadreConfigData();
    }
    const response = await this.accessControlService
      .fetchUserGroupAccessControl(this.contentId)
      .pipe(takeUntil(this.destroy$))
      .toPromise()
      .catch(() => {
        this.accessControlData.emit({ userGroup: this.accessControlForm.value?.userGroup, accessType: this.accessType });
      });
    if (response?.result?.accessControl) {
      this.processAccessControlResult(response.result.accessControl);
      this.accessControlData.emit({ userGroup: response.result.accessControl?.userGroups, accessType: this.accessType });
    }
  }

  processAccessControlResult(accessControl: any): void {
    if (!accessControl?.userGroups?.length) return;

    while (this.userGroup.length) {
      this.userGroup.removeAt(0);
    }

    accessControl.userGroups.forEach((group: any) => {
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
          selections: criteria.criteriaValue
        });

        conditions.push(condition);
      });

      const ruleGroup = this.fb.group({
        id: [group.userGroupId || uuidv4()],
        name: [group.userGroupName],
        description: [`Description for ${group.userGroupName}`],
        conditions: conditions
      });

      this.userGroup.push(ruleGroup);
    });
  }

  async updateContentAccessSetting(): Promise<void> {
    const accessTypeBoolean = this.accessType === NsAccessControlConfig.IAccessTypes.Public ? false : true;
    const request = this.accessControlService.createRequestContent(this.content, accessTypeBoolean);
    await this.accessControlService.updateContentV3(request, this.contentId).toPromise();
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
    return this.userGroup.controls.reduce((total: number, group: any) => {
      const conditions = (group.get("conditions") as FormArray)?.controls || [];
      return (
        total +
        conditions.reduce((count: number, condition: any) => {
          const entity = condition.get("entity")?.value;
          const selections = condition.get("selections")?.value || [];
          if (entity === NsAccessControlConfig.SelectionType.Users) {
            return count + selections.length;
          }
          return count;
        }, 0)
      );
    }, 0);
  }

  getUserCountForUserGroup(userGroupIndex: number): number {
    const group = this.userGroup.at(userGroupIndex);
    if (!group) return 0;

    const conditions = (group.get("conditions") as FormArray)?.controls || [];
    return conditions.reduce((count: number, condition: any) => {
      const entity = condition.get("entity")?.value;
      const selections = condition.get("selections")?.value || [];
      if (entity === NsAccessControlConfig.SelectionType.Users) {
        return count + selections.length;
      }
      return count;
    }, 0);
  }

  processConditionsForContentType(): void {
    // For Moderated Content Condition
    if (this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) {
      // Create Organization condition
      const orgCondition = this.createConditionGroup(uuidv4(), 0);
      orgCondition.get("entity")?.setValue(NsAccessControlConfig.SelectionType.Organizations);

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
    }

    // For Access Control Content Type
    if (this.accessType === NsAccessControlConfig.IAccessTypes.Public) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "470px",
        data: { type: "confirm-access-type" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.action === NsAccessControlConfig.IActions.Confirm) {
          this.sendForCQF.emit(true);
          this.updateContentAccessSetting();
        }
      });
    }
  }
}
