import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { AccessControlService } from "../../../_services/access-control.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { BATCH_RANGES } from "../../../_constants/app.constants";
import { NsAccessControlConfig } from "../../../_models/access-control.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatRadioChange } from "@angular/material/radio";
import * as _ from "lodash";

@Component({
  selector: "sb-uic-entity-selections",
  templateUrl: "./entity-selections.component.html",
  styleUrls: ["./entity-selections.component.scss"]
})
export class EntitySelectionsComponent implements OnInit, OnDestroy {
  @ViewChild("tabGroup", { read: ElementRef }) tabGroupRef!: ElementRef;
  private destroy$ = new Subject<void>();
  isLoading = false;
  searchControl = new FormControl("");
  filterValue: "all" | "selected" | "notSelected" = "all";
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

  dataList: any[] = [];
  dataListDup: any[] = [];

  selectedData: any[] = [];
  selectedDataTemp: any[] = [];

  groupedEntityData: { [key: string]: any[] } = {};
  selectionType: any;
  selectionTypeEnum = NsAccessControlConfig.SelectionType;
  radioSelections: { value: string; label: string }[] = [];
  batchRanges: any;
  selectedCharacterRange: string;
  accessControlCriteriaSelection!: NsAccessControlConfig.IAccessControlCriteriaSelection;
  activeTab = 0;
  userProfile: any;
  content: any;
  searchedOrganisationFlagWithQuery: boolean = false;

  public readonly data = inject<{ rule: any; condition: any; selected: any[]; activeTabSelected: number; disabled: boolean }>(MAT_DIALOG_DATA);
  searchedDesignationFlagWithQuery: any;
  orgSelectionIds = [];

  paginationOffset = 0;
  totalItemsCount = 0;
  isFetchingMore = false;
  constructor(public dialogRef: MatDialogRef<EntitySelectionsComponent>, private accessControlService: AccessControlService) {}

  ngOnInit(): void {
    // If data was passed to the dialog, initialize selections
    this.accessControlCriteriaSelection = this.accessControlService.accessControlConfig()?.accessControlCriteriaSelection;
    this.userProfile = this.accessControlService.accessControlConfig()?.userConfig;
    this.content = this.accessControlService.accessControlConfig()?.content;

    if (this.data) {
      this.selectionType = this.data?.condition?.entity;
    }
    if (this.data && this.data.selected && this.data.selected.length) {
      if (this.selectionType === NsAccessControlConfig.SelectionType.Batch) {
        this.selectedData = [...this.data.selected.map((ele: any) => _.toNumber(ele))];
        this.selectedDataTemp = [...this.selectedData];
      } else {
        this.selectedData = [...this.data.selected];
        this.selectedDataTemp = [...this.selectedData];
      }
      this.activeTab = this.data?.activeTabSelected || 0;
      this.filterValue = this.data?.activeTabSelected > 0 ? "selected" : "all";
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
          case this.selectionTypeEnum.Designation:
            // if (!query) {
            //   this.getDesignationsList(query);
            // }
            break;
          case this.selectionTypeEnum.Organizations:
            // if (!query) {
            //   this.getOrganisationsList(query, [], "A");
            // }
            break;
        }
      }
    });

    this.initializeDisplay();
  }

  initializeDisplay(): void {
    switch (this.selectionType) {
      case NsAccessControlConfig.SelectionType.Organizations:
        if (this.activeTab === 0) {
          this.getOrganisationsList("", [], "A");
          this.selectedCharacterRange = "A";
        } else {
          this.getOrganisationsList("", this.selectedData, undefined);
          this.alphabet = [];
        }
        this.radioSelections = this.accessControlCriteriaSelection.organizationRadioSelection;
        break;
      case NsAccessControlConfig.SelectionType.Designation:
        if (this.activeTab === 0) {
          this.getDesignationsList(this.paginationOffset, "", [], "A");
          this.selectedCharacterRange = "A";
        } else {
          this.getDesignationsList(this.paginationOffset, "", this.selectedData, undefined);
          this.alphabet = [];
        }
        this.radioSelections = this.accessControlCriteriaSelection?.designationRadioSelection;
        break;
      case NsAccessControlConfig.SelectionType.Service:
        this.radioSelections = this.accessControlCriteriaSelection?.servicesRadioSelection;
        this.getServicesList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Cadre:
        this.radioSelections = this.accessControlCriteriaSelection?.cadreRadioSelection;
        this.getCadreList(this.searchControl.value);
        break;
      case NsAccessControlConfig.SelectionType.Batch:
        this.radioSelections = this.accessControlCriteriaSelection?.batchRadioSelection;
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
    } else if (this.selectionType === NsAccessControlConfig.SelectionType.Batch) {
      return Number(item);
    }

    return item?.id || item?.identifier || item;
  }

  isSelected(item: any): boolean {
    const value = this.getSelectionValue(item);
    return this.filterValue === "selected" ? this.selectedData.includes(value) : this.selectedDataTemp.includes(value);
  }

  toggleSelection(item: any): void {
    const value = this.getSelectionValue(item);
    if (this.filterValue === "all") {
      if (this.selectedDataTemp.includes(value)) {
        this.selectedDataTemp = this.selectedDataTemp.filter(v => v !== value);
      } else {
        this.selectedDataTemp = [...this.selectedDataTemp, value];
      }
    } else if (this.filterValue === "selected") {
      if (this.selectedData.includes(value)) {
        this.selectedData = this.selectedData.filter(v => v !== value);
      } else {
        this.selectedData = [...this.selectedData, value];
      }
      this.selectedDataTemp = [...this.selectedData];
    }
  }

  setSelected(): void {
    this.selectedData = [...this.selectedDataTemp];
    this.activeTab = 1;
  }

  onFilterChange(event: MatTabChangeEvent): void {
    if ((event?.tab?.textLabel).toLowerCase().includes("selected")) {
      this.filterValue = "selected";
      this.searchControl.setValue("");
    } else {
      this.filterValue = "all";
    }
    if (this.selectionType === NsAccessControlConfig.SelectionType.Organizations) {
      if (this.activeTab === 0) {
        this.getOrganisationsList("", [], "A");
        this.selectedCharacterRange = "A";
      } else {
        this.getOrganisationsList("", this.selectedData, undefined);
      }
    }

    if (this.selectionType === NsAccessControlConfig.SelectionType.Designation) {
      if (this.activeTab === 0) {
        this.getDesignationsList(this.paginationOffset, "", [], "A");
        this.selectedCharacterRange = "A";
      } else {
        this.getDesignationsList(this.paginationOffset, "", this.selectedData, undefined);
      }
    }

    this.getFilteredEntityGrouped();
    if (this.selectionType === NsAccessControlConfig.SelectionType.Batch) {
      this.updateBatchRanges();
    } else {
      this.updateAlphabet();
    }

    if (this.selectionType === NsAccessControlConfig.SelectionType.Cadre || this.selectionType === NsAccessControlConfig.SelectionType.Service) {
      this.alphabet = [];
    }
  }

  search(): void {
    switch (this.selectionType) {
      case NsAccessControlConfig.SelectionType.Designation:
        this.paginationOffset = 0;
        if (this.filterValue === "all" && !this.searchControl.value) {
          this.selectedCharacterRange = "A";
          this.updateAlphabet();
          this.getDesignationsList(this.paginationOffset, this.searchControl.value, [], this.selectedCharacterRange);
        } else {
          this.getDesignationsList(this.paginationOffset, this.searchControl.value);
        }
        break;
      case NsAccessControlConfig.SelectionType.Organizations:
        this.selectedCharacterRange = "A";
        if (this.filterValue === "all" && !this.searchControl.value) this.updateAlphabet();
        this.getOrganisationsList(this.searchControl.value, []);
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
      filtered = this.dataListDup.filter(
        item => this.isSelected(item) && this.selectedData.includes(item?.name || item?.designation || item?.id || item?.identifier || item)
      );
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

    // For cadre and service, group 8 items irrespective of letter
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
      let letter = entity?.trim()?.charAt(0)?.toUpperCase() || "#";
      if (!/^[A-Z]$/.test(letter)) {
        letter = "#";
      }
      if (!temp[letter]) temp[letter] = [];
      temp[letter].push(org);
    }
    // Ensure # group is assigned at the end
    const sortedLetters = Object.keys(temp)
      .filter(l => l !== "#")
      .sort();
    if (temp["#"]) sortedLetters.push("#");
    for (const letter of sortedLetters) {
      grouped[letter] = this.chunkArray(temp[letter], 7);
    }
    this.groupedEntityData = grouped;
    this.isLoading = false;
  }

  scrollToSection(letter: string) {
    this.paginationOffset = 0;
    if (
      this.selectionType === NsAccessControlConfig.SelectionType.Organizations &&
      this.filterValue === "all" &&
      !this.searchedOrganisationFlagWithQuery
    ) {
      this.selectedCharacterRange = letter;
      this.getOrganisationsList("", [], letter);
      return;
    }
    if (
      this.selectionType === NsAccessControlConfig.SelectionType.Designation &&
      this.filterValue === "all" &&
      !this.searchedDesignationFlagWithQuery
    ) {
      // !this.orgSelectionIds?.length
      this.selectedCharacterRange = letter;
      this.getDesignationsList(this.paginationOffset, "", [], letter);
      return;
    }

    const section = document.getElementById(`section-${letter}`);
    if (section) {
      this.selectedCharacterRange = letter;
      section.scrollIntoView({ behavior: "auto", inline: "start" });
    }
  }

  private updateAlphabet(): void {
    this.selectedCharacterRange = "A";
    const chars = new Set<string>();

    const sourceList =
      this.filterValue === "selected"
        ? this.dataListDup.filter(
            item => this.isSelected(item) && this.selectedData.includes(item?.name || item?.designation || item?.id || item?.identifier || item)
          )
        : this.dataList;

    for (const data of sourceList) {
      const value = data?.channel || data?.name || data?.designation || "";
      let letter = value.charAt(0)?.toUpperCase() || "#";
      if (!/^[A-Z]$/.test(letter)) {
        letter = "#";
      }
      chars.add(letter);
    }

    const sorted = Array.from(chars)
      .filter(c => c !== "#")
      .sort();
    if (chars.has("#")) sorted.push("#");

    // Show all characters for Organizations
    if (
      (this.selectionType === NsAccessControlConfig.SelectionType.Organizations ||
        this.selectionType === NsAccessControlConfig.SelectionType.Designation) &&
      this.filterValue === "all" &&
      !this.searchControl.value
    ) {
      this.alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "#"];
    } else {
      this.alphabet = sorted;
    }
  }

  get checkIfData(): boolean {
    return (
      (this.groupedEntityData && Object.keys(this.groupedEntityData).length > 0) ||
      (this.selectionType === NsAccessControlConfig.SelectionType.Group && this.dataList.length > 0) ||
      (this.selectionType === NsAccessControlConfig.SelectionType.VerificationStatus && this.dataList.length > 0)
    );
  }

  onScrollPaginate(event: any): void {
    const threshold = 150;
    const position = event.target.scrollLeft + event.target.offsetWidth;
    const width = event.target.scrollWidth;
    if (width - position < threshold && !this.isLoading && !this.isFetchingMore && this.dataList.length < this.totalItemsCount) {
      this.loadMore();
    }
  }

  loadMore(): void {
    if (this.dataList.length >= this.totalItemsCount || this.isFetchingMore) return;
    this.isFetchingMore = true;
    this.paginationOffset += 100;
    switch (this.selectionType) {
      case this.selectionTypeEnum.Designation:
        if (this.searchControl.value) this.selectedCharacterRange = "";
        this.getDesignationsList(this.paginationOffset, this.searchControl.value, [], this.selectedCharacterRange, true);
        break;
    }
  }

  getOrganisationsList(query: string, selectedData?: string[], character?: string): void {
    this.isLoading = true;
    this.accessControlService.fetchOrgList(query, query ? [] : selectedData, character).subscribe({
      next: response => {
        if (response?.result && response?.result?.response?.content) {
          this.dataList = response.result.response.content;
          this.dataListDup = _.uniqWith([...this.dataListDup, ...this.dataList], _.isEqual);
          if (query) this.searchedOrganisationFlagWithQuery = true;
          else this.searchedOrganisationFlagWithQuery = false;

          if (this.filterValue === "selected" || query) this.updateAlphabet();

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

  getDesignationsList(paginationOffset: number, query: string, selectedData?: string[], character?: string, append: boolean = false): void {
    if (!append) {
      this.isLoading = true;
    }
    this.orgSelectionIds = this.data?.rule?.conditions?.find((c: any) => c.entity === NsAccessControlConfig.SelectionType.Organizations)?.selections;
    if (this.orgSelectionIds?.length) {
      const categories = this.orgSelectionIds.map((ele: string) => `${ele}_odcs_master_fw_designation`);
      this.accessControlService
        .fetchDesignationsWithOrg(paginationOffset, categories, query, query ? [] : selectedData, character)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if (response?.result && response?.result?.Term) {
              const newData = response?.result?.Term;
              this.dataList = append ? [...this.dataList, ...newData] : newData;
              this.dataListDup = _.uniqWith([...this.dataListDup, ...newData], _.isEqual);
              this.totalItemsCount = response?.result?.count;

              if (query) this.searchedDesignationFlagWithQuery = true;
              if (this.filterValue === "selected" || query) this.updateAlphabet();
              this.getFilteredEntityGrouped();
            } else {
              this.dataList = [];
              if (query) this.alphabet = [];
            }
          },
          complete: () => {
            this.isLoading = false;
            this.isFetchingMore = false;
          }
        });
    } else {
      this.accessControlService
        .fetchDesignation(query, query ? [] : selectedData, character)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if (response?.result && response?.result?.result?.data) {
              const newData = response?.result?.result?.data;
              this.dataList = append ? [...this.dataList, ...newData] : newData;
              this.dataListDup = _.uniqWith([...this.dataListDup, ...newData], _.isEqual);
              this.totalItemsCount = response?.result?.result?.count;
              if (query) this.searchedDesignationFlagWithQuery = true;
              else this.searchedDesignationFlagWithQuery = false;
              if (this.filterValue === "selected" || query) this.updateAlphabet();
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
    const isSelectedFilter = this.filterValue === "selected";

    const sourceList = isSelectedFilter ? this.dataListDup.filter(item => this.isSelected(item) && this.selectedData.includes(item)) : this.dataList;

    const validLabels: string[] = [];

    for (const { label, start, end } of BATCH_RANGES) {
      const hasItemInRange = sourceList.some(item => item >= start && item <= end);
      if (hasItemInRange) {
        validLabels.push(label);
      }
    }

    this.batchRanges = validLabels;
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
    if (
      this.selectionType === NsAccessControlConfig.SelectionType.Group ||
      this.selectionType === NsAccessControlConfig.SelectionType.VerificationStatus
    ) {
      this.selectedData = this.selectedDataTemp;
    }
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
    const value = event.value;
    const index = this.selectedDataTemp.indexOf(value);
    if (index > -1) {
      this.selectedDataTemp.splice(index, 1);
    } else {
      this.selectedDataTemp.push(value);
    }
  }

  isSelectedVerification(event: any): boolean {
    return this.selectedDataTemp.includes(event?.value);
  }

  disableOrganisationIfModerated(item: any): boolean {
    const value = this.getSelectionValue(item);
    if (value === this.userProfile?.rootOrgId && this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) return true;
    return false;
  }

  disabledVerifiedIfModerated(item: any): boolean {
    if (item?.value === "VERIFIED" && this.content?.accessSetting === NsAccessControlConfig.IAccessSetting.MDO_SPECIFIC) return true;
    return false;
  }
}
