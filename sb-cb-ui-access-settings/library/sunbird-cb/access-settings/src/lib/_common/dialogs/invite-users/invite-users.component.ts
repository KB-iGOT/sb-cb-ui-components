import { Component, inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AccessControlService } from "../../../_services/access-control.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PageChangeEmitter } from "../../../_models/pagination.model";
import { NsAccessControlConfig } from "../../../_models/access-control.model";

@Component({
  selector: "sb-uic-invite-users",
  templateUrl: "./invite-users.component.html",
  styleUrls: ["./invite-users.component.scss"],
})
export class InviteUsersComponent implements OnInit {
  public readonly data = inject<any>(MAT_DIALOG_DATA);

  searchControl = new FormControl("");
  filterValue: NsAccessControlConfig.IManageSelectionType = "add_karmayogis";

  usersList: any[] = [];
  totalUsers: number = 0;

  holdSelectedUsers: any[] = [];
  finalSelectedUsers: any[] = [];

  usersTableConfig!: NsAccessControlConfig.ITableConfig;
  usersLoading = false;
  activeTab = 0;
  constructor(
    public dialogRef: MatDialogRef<InviteUsersComponent>,
    private accessControlService: AccessControlService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usersTableConfig =
      this.accessControlService.accessControlConfig().usersTableConfig;
    console.log(this.data, "InviteUsersComponent data");
  }

  onClose(): void {
    this.dialogRef.close();
  }

  search(): void {
    this.holdSelectedUsers = [];
    switch (this.data?.condition?.entity) {
      case "users":
        this.getUsersList(this.searchControl.value);
        break;
    }
  }

  onFilterChange(event: any): void {
    this.filterValue = event.value;
  }

  getUsersList(query: string, limit?: number, offset?: number): void {
    this.usersLoading = true;
    this.accessControlService
      .fetchUserList(query, { limit: limit, offset: offset })
      .subscribe({
        next: (response) => {
          if (response?.result && response?.result?.response?.content) {
            this.usersList = response.result.response.content;
            this.totalUsers = response.result.response.count;
          } else {
            this.usersList = [];
            this.totalUsers = 0;
          }
        },
        error: (error) => {
          console.error("Error fetching users list", error);
        },
        complete: () => {
          this.usersLoading = false;
        },
      });
  }

  getOrgList(query: string, limit?: number, offset?: number): void {
    this.usersLoading = true;
    this.accessControlService
      .fetchOrgList(query, { limit: limit, offset: offset })
      .subscribe({
        next: (response) => {
          debugger;
          if (response?.result && response?.result?.response?.content) {
            this.usersList = response.result.response.content;
            this.totalUsers = response.result.response.count;
          } else {
            this.usersList = [];
            this.totalUsers = 0;
          }
        },
        error: (error) => {
          console.error("Error fetching users list", error);
        },
        complete: () => {
          this.usersLoading = false;
        },
      });
  }

  onSelectingUser(event: any): void {
    this.holdSelectedUsers = event;
  }

  selectUsers(): void {
    this.finalSelectedUsers = this.holdSelectedUsers;

    this.snackbar.open("Added to selected users", "", {
      duration: 3000,
    });
    this.activeTab = 1;
  }

  onPageChange(event: PageChangeEmitter): void {
    const limit = event.limit;
    const offset = (event.currentPage - 1) * limit;
    this.getUsersList(this.searchControl.value, limit, offset);
  }

  removedUserData(event: any): void {debugger
    this.finalSelectedUsers = [...event.remainingList];
    this.holdSelectedUsers = this.finalSelectedUsers;
  }
}
