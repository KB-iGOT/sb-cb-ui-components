import { Component, input, ChangeDetectionStrategy, computed, signal, Output, EventEmitter, inject, DestroyRef, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ContentSectionConfig, DisplayType } from '../models/content-section.model'
import { filterVisibleSections } from '../utils/visibility.util'
import { AccordionComponent } from '../accordion/accordion.component'
import { ContentStripWithTabsPillsV2Component } from '../content-strip-with-tabs-pills/content-strip-with-tabs-pills.component'
import { ContentStripWithPillsComponent } from '../content-strip-with-pills/content-strip-with-pills.component'
import { ContentStripsComponent } from '../content-strips/content-strips.component'
import { SbUicSpotlightCardsV2Component } from '../../spotlight-cards-v2/spotlight-cards-v2.component'
import { ContentApiService } from '../services/content-api.service'

@Component({
  selector: 'sb-uic-contetn-sections',
  standalone: true,
  imports: [
    CommonModule,
    AccordionComponent,
    ContentStripWithTabsPillsV2Component,
    ContentStripWithPillsComponent,
    ContentStripsComponent,
    SbUicSpotlightCardsV2Component
  ],
  templateUrl: './contetn-sections.component.html',
  styleUrls: ['./contetn-sections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContetnSectionsComponent implements OnDestroy {
  @Output() cardClicked = new EventEmitter<{ cardClickDetails: any }>();
  sections = input.required<ContentSectionConfig[]>();

  private readonly contentApiService = inject(ContentApiService)
  private readonly destroyRef = inject(DestroyRef)

  private emptySectionKeys = signal<string[]>([]);

  visibleSections = computed(() => {
    const sections = filterVisibleSections(this.sections())
    const emptyKeys = this.emptySectionKeys()
    return sections.filter(section => !emptyKeys.includes(section.sectionKey))
  });

  readonly DisplayType = DisplayType;

  constructor() {
    this.contentApiService.cardClickDetails$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((details) => {
        if (details) {
          this.cardClicked.emit({ cardClickDetails: details })
        }
      })

    this.contentApiService.emptySectionKeys$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((keys) => {
        this.emptySectionKeys.set(keys)
      })
  }

  isTabsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Tabs
  }

  isPillsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Pills
  }

  isCardsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Cards
  }

  ngOnDestroy() {
    this.destroyRef.destroyed
  }
}
