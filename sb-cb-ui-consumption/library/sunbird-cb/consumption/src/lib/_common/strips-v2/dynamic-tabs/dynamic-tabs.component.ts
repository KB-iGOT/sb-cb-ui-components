import { Component, input, output, signal, TemplateRef, ChangeDetectionStrategy, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTabsModule } from '@angular/material/tabs'
import { DynamicTab } from '../models/content-section.model'

@Component({
  selector: 'sb-uic-dynamic-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './dynamic-tabs.component.html',
  styleUrl: './dynamic-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTabsComponent {
  tabs = input.required<DynamicTab[]>();
  activeTabKey = input<string>('');
  contentTemplate = input<TemplateRef<any> | null>(null);

  activeTabChange = output<string>();

  activeIndex = signal(0);

  constructor() {
    effect(() => {
      const tabsList = this.tabs()
      const key = this.activeTabKey()
      if (tabsList?.length && key) {
        const idx = tabsList.findIndex(t => t?.key === key)
        if (idx >= 0) {
          this.activeIndex.set(idx)
        }
      }
    })
  }

  onTabChange(index: number): void {
    this.activeIndex.set(index)
    const tab = this.tabs()?.[index]
    if (tab?.key) {
      this.activeTabChange.emit(tab.key)
    }
  }
}
