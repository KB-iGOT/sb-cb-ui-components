import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AccessControlService } from "../../../_services/access-control.service";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { PageChangeEmitter } from "../../../_models/pagination.model";
import { NsAccessControlConfig } from "../../../_models/access-control.model";
import { SnackbarComponent } from "../../../components/snackbar/snackbar.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "sb-uic-invite-users",
  templateUrl: "./invite-users.component.html",
  styleUrls: ["./invite-users.component.scss"]
})
export class InviteUsersComponent implements OnInit, OnDestroy {
  public readonly data = inject<any>(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl("");
  filterValue: NsAccessControlConfig.IManageSelectionType = "add_karmayogis";

  usersList: any[] = [];
  totalUsers: number = 0;

  holdSelectedUsers: any[] = [];
  finalSelectedUsers: any[] = [];
  usersFinalList: any[] = [];

  usersTableConfig!: NsAccessControlConfig.ITableConfig;
  usersLoading = false;
  activeTab = 0;
  constructor(
    public dialogRef: MatDialogRef<InviteUsersComponent>,
    private accessControlService: AccessControlService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usersTableConfig = this.accessControlService.accessControlConfig().usersTableConfig;
    if (this.data && this.data.selected && this.data.selected.length) {
      if (!this.isArrayOfObjects(this.data?.selected)) {
        this.getUsersList("", 5, 0, this.data?.selected);
      } else {
        this.usersFinalList = this.data.selected;
        this.holdSelectedUsers = this.usersFinalList;
        this.finalSelectedUsers = this.usersFinalList;
        this.activeTab = 1;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  search(): void {
    this.holdSelectedUsers = [];
    this.getUsersList(this.searchControl.value);
  }

  onFilterChange(event: any): void {
    this.filterValue = event.value;
  }

  getUsersList(query: string, limit?: number, offset?: number, userIds?: string[]): void {
    this.usersLoading = true;
    this.accessControlService
      .fetchUserList(query, { limit: limit, offset: offset }, userIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response?.result && response?.result?.response?.content) {
            this.usersList = response?.result?.response?.content;
            this.totalUsers = response?.result?.response?.count;
            if (userIds?.length) {
              this.finalSelectedUsers = response.result.response.content;
              this.holdSelectedUsers = this.finalSelectedUsers;
              this.activeTab = 1;
            }
            if (this.holdSelectedUsers?.length) {
              this.usersFinalList = [...this.holdSelectedUsers];
            }
          } else {
            this.usersList = [];
            this.totalUsers = 0;
          }
          this.usersLoading = false;
        },
        complete: () => {
          this.usersLoading = false;
        }
      });
  }

  onSelectingUser(event: any): void {
    this.holdSelectedUsers = event.selectedRows;
  }

  selectUsers(): void {
    this.finalSelectedUsers = this.holdSelectedUsers;
    this.usersFinalList = this.finalSelectedUsers;
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: { message: `Users added to Selected tab`, type: "success" },
      duration: 3000,
      panelClass: "course-success-snackbar"
    });
    this.activeTab = 1;
  }

  onPageChange(event: PageChangeEmitter): void {
    const limit = event.limit;
    const offset = (event.currentPage - 1) * limit;
    this.getUsersList(this.searchControl.value, limit, offset);
  }

  removedUserData(event: any): void {
    this.finalSelectedUsers = [...event.remainingList];
    this.holdSelectedUsers = this.finalSelectedUsers;
  }

  onSelectingUserToApply(users: any): void {
    this.usersFinalList = users;
  }

  applySelections(): void {
    this.dialogRef.close({
      rule: this.data.rule,
      condition: this.data.condition,
      selected: this.usersFinalList
    });
  }

  isArrayOfObjects(arr: any): boolean {
    return Array.isArray(arr) && arr.every(item => typeof item === "object" && item !== null && !Array.isArray(item));
  }
}
