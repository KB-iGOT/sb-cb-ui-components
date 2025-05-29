import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AccessControlService } from "../../../_services/access-control.service";

@Component({
  selector: "ws-auth-organisation-selections",
  templateUrl: "./organisation-selections.component.html",
  styleUrls: ["./organisation-selections.component.scss"],
})
export class OrganisationSelectionsComponent implements OnInit {
  isLoading = false;
  searchControl = new FormControl("");
  filterValue: "all" | "selected" | "notSelected" = "all";
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

  organizations: any[] = [];

  selectedOrganizations: number[] = [];
  groupedOrganizations: { [key: string]: any[] } = {};
  public readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<OrganisationSelectionsComponent>,
    private accessControlService: AccessControlService
  ) {}

  ngOnInit(): void {
    // If data was passed to the dialog, initialize selections
    if (this.data && this.data.selectedOrganizations) {
      this.selectedOrganizations = this.data.selectedOrganizations;
    }
    // this.getOrganisationsList("");
    // this.searchControl.valueChanges.subscribe((searchText: string) => {
    //   this.getOrganisationsList(searchText);
    // });
  }

  initializeOrganisations(): void {
    this.getFilteredOrganizationsGrouped();
  }

  onClose(): void {
    this.dialogRef.close({
      rule: this.data.rule,
      condition: this.data.condition,
      selectedOrganizations: this.selectedOrganizations,
    });
  }

  isSelected(id: number): boolean {
    return this.selectedOrganizations.includes(id);
  }

  toggleSelection(id: number): void {
    if (this.isSelected(id)) {
      this.selectedOrganizations = this.selectedOrganizations.filter(
        (orgId) => orgId !== id
      );
    } else {
      this.selectedOrganizations.push(id);
    }
  }

  onFilterChange(event: any): void {
    this.filterValue = event.value;
    this.getFilteredOrganizationsGrouped();
  }

  search(): void {
    this.getOrganisationsList(this.searchControl.value);
  }

  getFilteredOrganizationsGrouped(): void {
    let filtered = this.organizations;

    // Filter by radio selection only
    if (this.filterValue === "selected") {
      filtered = filtered.filter((org) => this.isSelected(org.identifier));
    } else if (this.filterValue === "notSelected") {
      filtered = filtered.filter((org) => !this.isSelected(org.identifier));
    }

    // Group the filtered list by first letter or '#'
    const grouped: { [key: string]: any[] } = {};
    for (const org of filtered) {
      let letter = org?.channel?.charAt(0)?.toUpperCase() || "#";
      if (!/^[A-Z]$/.test(letter)) {
        letter = "#";
      }
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(org);
    }

    this.groupedOrganizations = grouped;
  }

  scrollToSection(letter: string) {
    const section = document.getElementById(`section-${letter}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }

  getOrganisationsList(query: string): void {
    this.isLoading = true;
    this.accessControlService.fetchOrgList(query).subscribe({
      next: (response) => {
        if (response?.result && response?.result?.response?.content) {
          this.organizations = response.result.response.content;
          this.updateAlphabet();
          this.initializeOrganisations();
        } else {
          this.organizations = [];
          this.alphabet = [];
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private updateAlphabet(): void {
    const chars = new Set<string>();
    for (const org of this.organizations) {
      let letter = org?.channel?.charAt(0)?.toUpperCase() || "#";
      if (!/^[A-Z]$/.test(letter)) {
        letter = "#";
      }
      chars.add(letter);
    }
    // Sorting the characters
    const sorted = Array.from(chars)
      .filter((c) => c !== "#")
      .sort();
    if (chars.has("#")) sorted.push("#");
    this.alphabet = sorted;
  }

  get checkIfOrganization(): boolean {
    return (
      this.groupedOrganizations &&
      Object.keys(this.groupedOrganizations).length > 0
    );
  }
}
