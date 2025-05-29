import { SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PageChangeEmitter } from "../../_models/pagination.model";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";

@Component({
  selector: "sb-uic-list-table",
  templateUrl: "./list-table.component.html",
  styleUrls: ["./list-table.component.scss"],
})
export class ListTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() count: number = 0;
  @Input() initialPaginationSize: number = 5;
  @Input() initialPaginationSizeOptions: number[] = [5, 10, 25, 100];
  @Input() tableConfig: any;
  @Input() selected: any;
  @Input() bulkUploadEntriesCount: any;

  @Output() selectedDataChange: EventEmitter<any> = new EventEmitter();
  @Output() pageChange: EventEmitter<PageChangeEmitter> = new EventEmitter();
  @Output() removeSelectedData: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  selectedTablerow: any[] = [];

  currentPage: number = 1;
  constructor(private _liveAnnouncer: LiveAnnouncer) {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    // Handle data input change
    if (changes["data"]?.currentValue?.length) {
      const mappedUsers = changes["data"].currentValue.map((user: any) => ({
        firstName:
          user?.firstName ||
          user?.profileDetails?.personalDetails?.firstname ||
          "",
        mobile:
          user?.mobile || user?.profileDetails?.personalDetails?.mobile || "",
        email:
          user?.email ||
          user?.profileDetails?.personalDetails?.primaryEmail ||
          "",
        ministry: user?.ministry || user?.organisations[0]?.orgName || "",
        invited_on: user?.invited_on || "",
        status: user?.status || "",
        userId: user?.userId || "",
      }));
      this.data = mappedUsers;
      this.dataSource = new MatTableDataSource<any>(mappedUsers);
    }

    if (changes["count"]?.currentValue !== undefined) {
      this.count = changes["count"].currentValue;
    }

    if (changes["selected"]?.currentValue) {
      this.selection.clear();

      if (changes["selected"].currentValue.length > 0) {
        this.dataSource.data.forEach((row) => {
          if (
            changes["selected"].currentValue.some(
              (sel: any) => sel.userId === row.userId
            )
          ) {
            this.selection.select(row);
          }
        });
      }

      this.selectedTablerow = this.selection.selected;
    }
  }

  ngAfterViewInit() {
    if (this.tableConfig?.canSortColumn) {
      this.dataSource.sort = this.sort;
    }
  }

  setPaginatedUsers(page: number) {
    const startIndex = (page - 1) * this.initialPaginationSize;
    const endIndex = startIndex + this.initialPaginationSize;
    const paginatedUsers = this.data.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource<any>(paginatedUsers);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    this.selectedTablerow = this.selection.selected;
    if (this.tableConfig?.type === "allLearners") {
      this.selectedDataChange.emit(this.selectedTablerow);
    }
  }

  toggleSelection(row: any): void {
    this.selection.toggle(row);
    this.selectedTablerow = this.selection.selected;
    if (this.tableConfig?.type === "allLearners") {
      this.selectedDataChange.emit(this.selectedTablerow);
    }
  }

  onPageChange(event: PageChangeEmitter) {
    this.pageChange.emit(event);
  }

  removeUserFromSelected(): void {
    if (!this.selectedTablerow.length) {
      return;
    }
    const removedList = [...this.selectedTablerow];
    const remainingList = this.data.filter(
      (user) =>
        !this.selectedTablerow.some(
          (selected) => selected.userId === user.userId
        )
    );
    this.data = remainingList;
    this.count = remainingList.length;
    this.selectedTablerow = [];
    this.selection.clear();
    this.dataSource = new MatTableDataSource<any>(remainingList);
    if (this.tableConfig?.type === "selectedUsers") {
      this.removeSelectedData.emit({
        remainingList,
        removedList,
      });
    }
  }

  onSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
