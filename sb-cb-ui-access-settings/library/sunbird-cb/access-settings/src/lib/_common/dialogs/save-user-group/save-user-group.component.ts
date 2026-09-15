import { Component, computed, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NsAccessControlConfig } from "../../../_models/access-control.model";

@Component({
  selector: "sb-uic-save-user-group",
  templateUrl: "./save-user-group.component.html",
  styleUrls: ["./save-user-group.component.scss"],
  standalone: false
})
export class SaveUserGroupComponent {
  private readonly dialogRef = inject<MatDialogRef<SaveUserGroupComponent>>(MatDialogRef);

  readonly data = inject<{ userGroupName: string }>(MAT_DIALOG_DATA);

  readonly userGroupName = signal(this.data?.userGroupName || "");
  readonly isTouched = signal(false);

  readonly isApplyDisabled = computed(() => !this.userGroupName().trim());
  readonly isErrorVisible = computed(() => this.isTouched() && this.isApplyDisabled());

  onNameChange(value: string): void {
    this.isTouched.set(true);
    this.userGroupName.set(value || "");
  }

  cancel(): void {
    this.dialogRef.close({ action: NsAccessControlConfig.IActions.Reject });
  }

  apply(): void {
    if (this.isApplyDisabled()) {
      this.isTouched.set(true);
      return;
    }
    this.dialogRef.close({
      action: NsAccessControlConfig.IActions.Confirm,
      userGroupName: this.userGroupName().trim()
    });
  }
}
