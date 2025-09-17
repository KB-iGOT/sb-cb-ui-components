import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "sb-cb-search-training-plans-card",
  templateUrl: "./training-plans-card.component.html",
  styleUrls: ["./training-plans-card.component.scss"]
})
export class TrainingPlansCardComponent {
  @Input() plan!: any;
  @Output() telemetry = new EventEmitter<any>();
}
