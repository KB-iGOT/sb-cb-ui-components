import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { AccessControlService } from "../../../_services/access-control.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { BATCH_RANGES } from "../../../_constants/app.constants";
import { NsAccessControlConfig } from "../../../_models/access-control.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatRadioChange } from "@angular/material/radio";
import _ from "lodash";

@Component({
  selector: "sb-uic-entity-selections",
  templateUrl: "./entity-selections.component.html",
  styleUrls: ["./entity-selections.component.scss"]
})
export class EntitySelectionsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("tabGroup", { read: ElementRef }) tabGroupRef!: ElementRef;
  private destroy$ = new Subject<void>();
  isLoading = false;
  searchControl = new FormControl("");
  filterValue: "all" | "selected" | "notSelected" = "all";
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

  dataList: any[] = [];
  dataListDup: any[] = [];

  selectedData: any[] = [];
  groupedEntityData: { [key: string]: any[] } = {};
  selectionType: any;
  selectionTypeEnum = NsAccessControlConfig.SelectionType;
  radioSelections: { value: string; label: string }[] = [];
  batchRanges: any;
  selectedCharacterRange: string;
  accessControlCriteriaSelection!: NsAccessControlConfig.IAccessControlCriteriaSelection;
  activeTab = 0;
  selectedVerificationStatus: string = "";
  public readonly data = inject<{ rule: any; condition: any; selected: any[] }>(MAT_DIALOG_DATA);
  constructor(public dialogRef: MatDialogRef<EntitySelectionsComponent>, private accessControlService: AccessControlService) {}

  ngOnInit(): void {
    // If data was passed to the dialog, initialize selections
    this.accessControlCriteriaSelection = this.accessControlService.accessControlConfig().accessControlCriteriaSelection;
    if (this.data) {
      this.selectionType = this.data?.condition?.entity;
    }
    if (this.data && this.data.selected && this.data.selected.length) {
      this.selectedData = [...this.data.selected];
      this.activeTab = 0;

      if (this.selectionType === NsAccessControlConfig.SelectionType.VerificationStatus) {
        this.selectedVerificationStatus = this.data.selected[0];
      }
    }

    // Subscribe to search control changes
    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((query: string) => {
      if (this.selectionType) {
        switch (this.selectionType) {
          case this.selectionTypeEnum.Service:
            this.getServicesList(query);
            break;
          case this.selectionTypeEnum.Cadre:
            this.getCadreList(query);
            break;
          case this.selectionTypeEnum.Batch:
            this.getBatchList(query);
            break;
        }
      }
    });

    this.initializeDisplay();
  }

  ngAfterViewInit(): void {
    const tabHeader = this.tabGroupRef?.nativeElement?.querySelector(".mat-mdc-tab-header");
    if (
      (tabHeader && this.selectionType === NsAccessControlConfig.SelectionType.Cadre) ||
      this.selectionType === NsAccessControlConfig.SelectionType.Batch
    ) {
      tabHeader.style.display = "none";
    }
  }

  initializeDisplay(): void {
    switch (this.selectionType) {
      case NsAccessControlConfig.SelectionType.Organizations:
        this.getOrganisationsList("", []);
        this.radioSelections = this.accessControlCriteriaSelection.organizationRadioSelection;
        break;
      case NsAccessControlConfig.SelectionType.Designation:
        if (this.selectedData?.length) {
          this.getDesignationsList("", this.selectedData);
        } else {
          this.getDesignationsList("");
        }
        this.radioSelections = this.accessControlCriteriaSelection.designationRadioSelection;
        break;
      case NsAccessControlConfig.SelectionType.Service:
        this.radioSelections = this.accessControlCriteriaSelection.servicesRadioSelection;
        this.getServicesList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Cadre:
        this.radioSelections = [{ value: "all", label: "All" }];
        this.getCadreList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Batch:
        this.radioSelections = [{ value: "all", label: "All" }];
        this.getBatchList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Group:
        this.getGroupList();
        break;
      case NsAccessControlConfig.SelectionType.VerificationStatus:
        this.getVerificationStatus();
        break;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private getSelectionValue(item: any): any {
    if (typeof item !== "object" || item === null) {
      return item;
    } else if (
      this.selectionType === NsAccessControlConfig.SelectionType.Cadre ||
      this.selectionType === NsAccessControlConfig.SelectionType.Service ||
      this.selectionType === NsAccessControlConfig.SelectionType.Designation
    ) {
      return item?.name || item?.designation;
    }

    return item?.id || item?.identifier || item;
  }

  isSelected(item: any): boolean {
    const value = this.getSelectionValue(item);
    return this.selectedData.includes(value);
  }

  toggleSelection(item: any): void {
    const value = this.getSelectionValue(item);
    const index = this.selectedData.indexOf(value);

    if (index > -1) {
      this.selectedData.splice(index, 1);
    } else {
      this.selectedData.push(value);
    }
  }

  onFilterChange(event: MatTabChangeEvent): void {
    if ((event?.tab?.textLabel).toLowerCase().includes("selected")) {
      this.filterValue = "selected";
    } else {
      this.filterValue = "all";
    }
    this.updateAlphabet();
    this.getFilteredEntityGrouped();
  }

  search(): void {
    switch (this.selectionType) {
      case NsAccessControlConfig.SelectionType.Designation:
        this.getDesignationsList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Organizations:
        this.getOrganisationsList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Service:
        this.getServicesList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Cadre:
        this.getCadreList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Batch:
        this.getCadreList(this.searchControl.value);
        break;
    }
  }

  getFilteredEntityGrouped(): void {
    this.isLoading = true;
    let filtered = this.dataList;

    if (this.filterValue === "selected") {
      filtered = this.dataListDup;
      filtered = filtered.filter(org => this.isSelected(org));
    }

    if (filtered.length === 0) {
      this.groupedEntityData = {};
      this.isLoading = false;
      return;
    }

    // For batch, group by range and chunk each range
    if (this.selectionType === this.selectionTypeEnum.Batch) {
      const batchGrouped = this.groupBatchByRange(filtered);
      const chunked: { [key: string]: any[][] } = {};
      for (const key in batchGrouped) {
        chunked[key] = this.chunkArray(batchGrouped[key], 8);
      }
      this.groupedEntityData = chunked;
      this.isLoading = false;
      return;
    }

    // For cadre and service, group 8 items irerespective of letter
    if (this.selectionType === this.selectionTypeEnum.Cadre || this.selectionType === this.selectionTypeEnum.Service) {
      // sort the filtered list by name
      filtered = filtered.sort((a, b) => {
        const nameA = a?.name?.toLowerCase() || "";
        const nameB = b?.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });

      // chunk the filtered list into groups of 8
      const grouped: { [key: string]: any[][] } = {};
      grouped["All"] = this.chunkArray(filtered, 8);
      this.groupedEntityData = grouped;
      this.isLoading = false;
      return;
    }

    // For all other types, group by letter and chunk each group
    const grouped: { [key: string]: any[][] } = {};
    const temp: { [key: string]: any[] } = {};
    for (const org of filtered) {
      let entity = org?.channel || org?.name || org?.designation;
      let letter = entity?.charAt(0)?.toUpperCase() || "#";
      if (!/^[A-Z]$/.test(letter)) {
        letter = "#";
      }
      if (!temp[letter]) temp[letter] = [];
      temp[letter].push(org);
    }
    for (const letter in temp) {
      grouped[letter] = this.chunkArray(temp[letter], 7);
    }
    this.groupedEntityData = grouped;
    this.isLoading = false;
  }

  scrollToSection(letter: string) {
    const section = document.getElementById(`section-${letter}`);
    if (section) {
      this.selectedCharacterRange = letter;
      section.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }

  private updateAlphabet(): void {
    this.selectedCharacterRange = 'A';
    const chars = new Set<string>();

    for (const data of this.dataList) {
      let letter = "#";

      const value = data?.channel || data?.name || data?.designation;
      letter = value.charAt(0)?.toUpperCase() || "#";

      if (!/^[A-Z]$/.test(letter)) {
        letter = "#";
      }

      chars.add(letter);
    }

    const sorted = Array.from(chars)
      .filter(c => c !== "#")
      .sort();
    if (chars.has("#")) sorted.push("#");

    this.alphabet = sorted;

    if (this.filterValue === "selected") {
      this.alphabet = [];
    }
  }

  get checkIfData(): boolean {
    return (
      (this.groupedEntityData && Object.keys(this.groupedEntityData).length > 0) ||
      (this.selectionType === NsAccessControlConfig.SelectionType.Group && this.dataList.length > 0) ||
      (this.selectionType === NsAccessControlConfig.SelectionType.VerificationStatus && this.dataList.length > 0)
    );
  }

  getOrganisationsList(query: string, selectedData?: string[]): void {
    this.isLoading = true;
    this.accessControlService.fetchOrgList(query, query ? [] : selectedData).subscribe({
      next: response => {
        if (response?.result && response?.result?.response?.content) {
          this.dataList = response.result.response.content;
          this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);
          this.updateAlphabet();
          this.getFilteredEntityGrouped();
        } else {
          this.dataList = [];
          this.alphabet = [];
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getDesignationsList(query: string, selectedData?: string[]): void {
    this.isLoading = true;
    const selectionIds = this.data?.rule?.conditions?.find((c: any) => c.entity === NsAccessControlConfig.SelectionType.Organizations)?.selections;
    if (selectionIds?.length) {
      const categories = selectionIds.map((ele: string) => `${ele}_odcs_designation`);
      this.accessControlService
        .fetchDesignationsWithOrg(categories, query, query ? [] : selectedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if (response?.result && response?.result?.Term) {
              this.dataList = response?.result?.Term;
              this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);
              this.updateAlphabet();
              this.getFilteredEntityGrouped();
            } else {
              this.dataList = [];
              this.alphabet = [];
            }
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } else {
      this.accessControlService
        .fetchDesignation(query, query ? [] : selectedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if (response?.result && response?.result?.result?.data) {
              this.dataList = response?.result?.result?.data;
              this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);

              this.updateAlphabet();
              this.getFilteredEntityGrouped();
            } else {
              this.dataList = [];
              this.alphabet = [];
            }
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }

  getServicesList(query: string): void {
    const baseList = this.accessControlService.holdServiceCadrebatch().service;
    this.dataList = query ? baseList.filter(service => service.name?.toLowerCase().includes(query.toLowerCase())) : baseList;
    this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);

    this.alphabet = [];
    this.getFilteredEntityGrouped();
  }

  getCadreList(query: string): void {
    const baseList = this.accessControlService.holdServiceCadrebatch().cadre;
    this.dataList = query ? baseList.filter(cadre => cadre.name?.toLowerCase().includes(query.toLowerCase())) : baseList;
    this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);

    this.alphabet = [];
    this.getFilteredEntityGrouped();
  }

  getBatchList(query: string): void {
    const baseList = this.accessControlService.holdServiceCadrebatch().batch;
    this.dataList = query ? baseList.filter(batch => batch.toString().includes(query)) : baseList;
    this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);

    this.updateBatchRanges();
    this.getFilteredEntityGrouped();
  }

  getGroupList(): void {
    this.isLoading = true;
    this.accessControlService
      .fetchGroupsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.result && response?.result?.response) {
            this.dataList = response.result.response;
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  getVerificationStatus(): void {
    this.dataList = this.accessControlCriteriaSelection.verificationStatus;
  }

  updateBatchRanges(): void {
    this.batchRanges = BATCH_RANGES.map(range => range.label);
  }

  groupBatchByRange(batchList: number[]) {
    const grouped: { [key: string]: number[] } = {};
    for (const range of BATCH_RANGES) {
      grouped[range.label] = batchList.filter(year => year >= range.start && year <= range.end);
    }
    return grouped;
  }

  getModalTitle(): string {
    switch (this.selectionType) {
      case NsAccessControlConfig.SelectionType.Designation:
        return "Select Designation";
      case NsAccessControlConfig.SelectionType.Organizations:
        return "Select Organisation";
      case NsAccessControlConfig.SelectionType.Service:
        return "Select Services";
      case NsAccessControlConfig.SelectionType.Cadre:
        return "Select Cadre";
      case NsAccessControlConfig.SelectionType.Batch:
        return "Select Batch";
      case NsAccessControlConfig.SelectionType.Group:
        return "Select Group";
      case NsAccessControlConfig.SelectionType.VerificationStatus:
        return "Verification Status";
    }
    return "";
  }

  applySelections(): void {
    this.dialogRef.close({
      rule: this.data.rule,
      condition: this.data.condition,
      selected: this.selectedData
    });
  }

  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const results: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onVerificationChange(event: MatRadioChange) {
    this.selectedData = [event.value];
  }
}
