import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OrganisationSelectionsComponent } from "../dialogs/organisation-selections/organisation-selections.component";
import { InviteUsersComponent } from "../dialogs/invite-users/invite-users.component";
import { NsAccessControlConfig } from "../../_models/access-control.model";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { AccessControlService } from "../../_services/access-control.service";

@Component({
  selector: "sb-uic-access-control",
  templateUrl: "./access-control.component.html",
  styleUrls: ["./access-control.component.scss"],
})
export class AccessControlComponent implements OnInit {
  @Input() config!: NsAccessControlConfig.IAccessControlConfig;

  accessType: string = "public";
  accessTypes: any[] = [
    { name: "Public", value: "public" },
    { name: "Custom", value: "custom" },
  ];
  isVisibilityEnabled: boolean = false;
  filterCriteria: boolean = false;
  userGroupList: any[] = [];

  defaultConditionRelationship: string = "AND";
  defaultUserGroupRelationship: string = "OR";

  accessControlCriteriaSelection!: NsAccessControlConfig.IAccessControlCriteriaSelection;
  usersTableConfig: NsAccessControlConfig.ITableConfig;
  accessControlForm!: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private accessControlService: AccessControlService
  ) {}

  ngOnInit(): void {
    this.accessControlService.accessControlConfig.set(this.config);
    this.accessControlCriteriaSelection =
      this.config?.accessControlCriteriaSelection;
    this.usersTableConfig = this.config?.usersTableConfig;

    this.initForm();
  }

  initForm() {
    this.accessControlForm = this.fb.group({
      userGroup: this.fb.array([]),
    });
  }

  get userGroup(): FormArray {
    return this.accessControlForm.get("userGroup") as FormArray;
  }

  ruleConditions(ruleIndex: number): FormArray {
    return this.userGroup.at(ruleIndex).get("conditions") as FormArray;
  }

  onAccessTypeChange(event: any) {
    if (event.value === "custom") {
      this.isVisibilityEnabled = false;
    }
  }

  addUserGroup() {
    const ruleGroup = this.fb.group({
      id: [this.userGroup.length + 1],
      name: [`User Group ${this.userGroup.length + 1}`],
      description: [`Description for UserGroup ${this.userGroup.length + 1}`],
      conditions: this.fb.array([this.createConditionGroup(1)]),
    });

    this.userGroup.push(ruleGroup);
    console.log(this.userGroup.controls);
  }

  removeRule(index: number) {
    this.userGroupList.splice(index, 1);
  }

  addCondition(userGroupIndex: number) {
    const conditions = this.ruleConditions(userGroupIndex);
    conditions.push(this.createConditionGroup(conditions.length + 1));
  }

  createConditionGroup(id: number): FormGroup {
    return this.fb.group({
      id: [id],
      entity: ["", Validators.required],
      conditionType: ["", Validators.required],
      selections: [[]],
    });
  }

  manageSelections(condition: any, rule: any): void {
    switch (condition.value.entity) {
      case "users":
        this.openInviteUserDialog(condition, rule);
        break;
      case "organization":
        this.openOrganizationDialog(rule, condition);
        break;
      default:
        console.warn("Unsupported entity type:", condition.value.entity);
    }
  }

  openOrganizationDialog(rule: any, condition: any): void {
    const dialogRef = this.dialog.open(OrganisationSelectionsComponent, {
      width: "1032px",
      data: {
        rule: rule,
        condition: condition,
        selectedOrganizations: condition.selections,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const rule = this.userGroupList.find(
          (rule: any) => rule.id === result.rule.id
        );
        if (rule) {
          const condition = rule.conditions.find(
            (condition: any) => condition.id === result.condition.id
          );
          if (condition) {
            condition.selections = result.selectedOrganizations;
          }
        }
      }
    });
  }

  openInviteUserDialog(condition: any, rule: any): void {
    const dialogRef = this.dialog.open(InviteUsersComponent, {
      width: "1090px",
      data: { condition: condition.value, rule: rule.value },
    });
  }
}
