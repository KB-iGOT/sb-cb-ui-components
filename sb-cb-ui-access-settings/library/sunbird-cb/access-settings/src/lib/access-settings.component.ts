import { Component, OnInit } from "@angular/core";

@Component({
    selector: "sb-uic-access-settings",
    template: ` <p>access settings works!</p> `,
    styles: [
        `
      ::ng-deep .mdc-tooltip {
        --mat-tooltip-container-color: #616161;
        --mat-tooltip-supporting-text-color: #ffffff;
        --mat-tooltip-container-shape: 4px;
        --mat-tooltip-container-size: 340px;
        --mat-tooltip-supporting-text-padding: 8px;
      }
    `
    ],
    standalone: false
})
export class AccessSettingsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
