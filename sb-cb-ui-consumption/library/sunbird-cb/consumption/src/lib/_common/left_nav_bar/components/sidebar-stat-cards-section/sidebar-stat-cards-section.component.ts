import { Component, Input, Output, EventEmitter, computed, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatRippleModule } from '@angular/material/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { StatCardsSectionConfig, StatCardItem } from '../../models/sidebar.models'
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

  @Output() itemClicked = new EventEmitter<string>()

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
   * Computed signal for all items (no limit applied)
   */
  visibleItems = computed(() => {
    return this.section?.items ?? []
  });

  /**
   * Computed signal to check if "View All" button should be shown
   */
  shouldShowViewAll = computed(() => {
    return this.section?.showViewAll ?? false
  });

  /**
   * Handle View All click - emit event to parent
   */
  onViewAllClick(): void {
    this.itemClicked.emit(this.section.viewAllKey ?? '')
  }

  /**
   * Track by function for stat items
   */
  trackByIndex(index: number, item: StatCardItem): number {
    return index
  }
}
