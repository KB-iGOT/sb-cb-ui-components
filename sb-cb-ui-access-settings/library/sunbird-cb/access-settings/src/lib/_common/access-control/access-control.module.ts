import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccessControlComponent } from "./access-control.component";
import { OrganisationSelectionsComponent } from "../dialogs/organisation-selections/organisation-selections.component";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatRippleModule } from "@angular/material/core";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { InviteUsersComponent } from "../dialogs/invite-users/invite-users.component";
import { MatTabsModule } from "@angular/material/tabs";
import { ListTableComponent } from "../../components/list-table/list-table.component";
import { MatTableModule } from "@angular/material/table";
import { PaginationComponent } from "../pagination/pagination.component";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { BulkUploadKarmayogiComponent } from "../../components/bulk-upload-karmayogi/bulk-upload-karmayogi.component";
import { DragDropDirective } from "../../_directives/drag-drop.directive";
import { MatSortModule } from "@angular/material/sort";

@NgModule({
  declarations: [
    AccessControlComponent,
    OrganisationSelectionsComponent,
    InviteUsersComponent,
    ListTableComponent,
    PaginationComponent,
    BulkUploadKarmayogiComponent,
    DragDropDirective,
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRippleModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
  ],
  exports: [AccessControlComponent, PaginationComponent],
})
export class AccessControlModule {}
