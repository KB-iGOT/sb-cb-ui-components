import { Component, Input, computed, signal, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatRippleModule } from '@angular/material/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { StatCardsSectionConfig, StatCardItem } from '../../models/sidebar.models'
import { DEFAULTS } from '../../constants/sidebar.constants'
import { MultilingualTranslationsService } from '../../../../_services/multilingual-translations.service'
import { SkeletonLoaderLibModule } from '../../../skeleton-loader-lib/skeleton-loader-lib.module'

/**
 * Sidebar Stat Cards Section Component
 *
 * Renders achievement/statistic cards with optional collapsible functionality.
 *
 * Features:
 * - Card-based stat display (rank, karma points, badges, etc.)
 * - Collapsible section support
 * - "View All" button with maxItemsVisible support
 * - Click navigation support
 * - Responsive card layout
 * - Material Design cards
 *
 * @example
 * <app-sidebar-stat-cards-section [section]="statCardsConfig" />
 */
@Component({
  selector: 'app-sidebar-stat-cards-section',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatRippleModule,
    TranslateModule,
    SkeletonLoaderLibModule
  ],
  templateUrl: './sidebar-stat-cards-section.component.html',
  styleUrls: ['./sidebar-stat-cards-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarStatCardsSectionComponent {
  /**
   * Stat cards section configuration
   */
  @Input({ required: true }) section!: StatCardsSectionConfig

  /**
   * Sidebar open/close state
   */
  @Input({ required: true }) isOpen!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean

  constructor(
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  /**
   * Translate a label using MultilingualTranslationsService
   */
  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  /**
   * Signal to track if "View All" is expanded
   */
  isExpanded = signal<boolean>(false);

  /**
   * Computed signal for visible items based on maxItemsVisible and expansion state
   */
  visibleItems = computed(() => {
    if (!this.section?.items) return []

    if (this.section.maxItemsVisible === null) return this.section.items

    const maxItems = this.section.maxItemsVisible ?? DEFAULTS.MAX_ITEMS_VISIBLE
    const shouldLimit = this.section.showViewAll && !this.isExpanded() && maxItems

    return shouldLimit
      ? this.section.items.slice(0, maxItems)
      : this.section.items
  });

  /**
   * Computed signal to check if "View All" button should be shown
   */
  shouldShowViewAll = computed(() => {
    if (!this.section?.showViewAll || !this.section?.items) return false

    const maxItems = this.section.maxItemsVisible ?? DEFAULTS.MAX_ITEMS_VISIBLE
    return this.section.items.length > maxItems
  });

  /**
   * Toggle view all expansion
   */
  toggleViewAll(): void {
    this.isExpanded.update(state => !state)
  }

  /**
   * Track by function for stat items
   */
  trackByIndex(index: number, item: StatCardItem): number {
    return index
  }
}
