import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core'

@Component({
  selector: 'sb-uic-horizontal-dynamic-stepper',
  templateUrl: './horizontal-dynamic-stepper.component.html',
  styleUrls: ['./horizontal-dynamic-stepper.component.scss']
})
export class HorizontalDynamicStepperComponent implements AfterContentInit {

  @ContentChildren(TemplateRef) bodyTemplates!: QueryList<TemplateRef<any>>
  @Input() labels: string[] = [];
  @Input() selectedIndex = 0;

  @Output() stepChange = new EventEmitter<number>();

  stepBodies = new Map<number, TemplateRef<any>>();

  ngAfterContentInit() {
    this.bodyTemplates.forEach((tpl, index) => {
      this.stepBodies.set(index, tpl)
    })
  }

  onSelectionChange(event: StepperSelectionEvent) {
    this.stepChange.emit(event.selectedIndex)
  }

}
