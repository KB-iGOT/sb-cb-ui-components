import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContentSectionConfig, DisplayType } from '../models/content-section.model'
import { filterVisibleSections } from '../utils/visibility.util'
import { AccordionComponent } from '../accordion/accordion.component'
import { ContentStripWithTabsPillsV2Component } from '../content-strip-with-tabs-pills/content-strip-with-tabs-pills.component'
import { ContentStripWithPillsComponent } from '../content-strip-with-pills/content-strip-with-pills.component'
import { ContentStripsComponent } from '../content-strips/content-strips.component'

@Component({
  selector: 'sb-uic-contetn-sections',
  standalone: true,
  imports: [
    CommonModule,
    AccordionComponent,
    ContentStripWithTabsPillsV2Component,
    ContentStripWithPillsComponent,
    ContentStripsComponent
  ],
  templateUrl: './contetn-sections.component.html',
  styleUrl: './contetn-sections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContetnSectionsComponent {
  sections = input.required<ContentSectionConfig[]>();

  visibleSections = computed(() => filterVisibleSections(this.sections()));

  readonly DisplayType = DisplayType;

  isTabsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Tabs
  }

  isPillsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Pills
  }

  isCardsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Cards
  }
}
