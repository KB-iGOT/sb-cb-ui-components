import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TabConfig, DynamicTab } from '../models/content-section.model'
import { filterVisibleTabs } from '../utils/visibility.util'
import { DynamicTabsComponent } from '../dynamic-tabs/dynamic-tabs.component'
import { ContentStripWithPillsComponent } from '../content-strip-with-pills/content-strip-with-pills.component'
import { ContentStripsComponent } from '../content-strips/content-strips.component'

@Component({
  selector: 'sb-uic-content-strip-with-tabs-pills',
  standalone: true,
  imports: [CommonModule, DynamicTabsComponent, ContentStripWithPillsComponent, ContentStripsComponent],
  templateUrl: './content-strip-with-tabs-pills.component.html',
  styleUrls: ['./content-strip-with-tabs-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripWithTabsPillsV2Component {
  tabs = input.required<TabConfig[]>();
  defaultTabKey = input<string>('');
  sectionKey = input<string>('');

  private filteredTabs = computed<TabConfig[]>(() => filterVisibleTabs(this.tabs()));

  visibleTabs = computed<DynamicTab[]>(() => {
    return this.filteredTabs().map(tab => ({
      key: tab?.tabKey ?? '',
      label: tab?.tabLabel ?? '',
      translateLabel: tab?.translateLabel ?? false,
      context: tab
    }))
  });

  onTabChange(tabKey: string): void {
    // Handle tab change if needed
  }
}
