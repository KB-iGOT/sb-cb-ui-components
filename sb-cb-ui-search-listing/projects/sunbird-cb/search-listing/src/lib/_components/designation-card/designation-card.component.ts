import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "sb-cb-search-designation-card",
  templateUrl: "./designation-card.component.html",
  styleUrls: ["./designation-card.component.scss"]
})
export class DesignationCardComponent {
  @Input() designation!: any;
  @Input() category!: any;
  @Output() telemetry = new EventEmitter<any>();

  formatAdditionalInfo(info: string): any {
    if (typeof info === "string") {
      return JSON.parse(info);
    } else {
      return info;
    }
  }
}
