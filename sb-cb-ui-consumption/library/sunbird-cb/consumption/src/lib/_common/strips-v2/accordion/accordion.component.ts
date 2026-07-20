import { Component, input, output, signal, TemplateRef, ChangeDetectionStrategy, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'sb-uic-accordion',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  header = input.required<string>();
  showHeaderSubLabel = input<boolean>(false);
  headerSubLabel = input<string | null>(null)
  headersubLableTeme = input<string | null>(null)
  translateHeader = input<boolean>(false);
  expanded = input<boolean>(true);
  contentTemplate = input<TemplateRef<unknown> | null>(null);

  expandedChange = output<boolean>();

  isExpanded = signal(true);

  constructor() {
    // Sync expanded input with isExpanded signal
    effect(() => {
      this.isExpanded.set(this.expanded())
    })
  }

  toggleExpanded(): void {
    this.isExpanded.update(val => !val)
    this.expandedChange.emit(this.isExpanded())
  }
}
