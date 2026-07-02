import { Component, Input, Output, EventEmitter, computed, signal, ChangeDetectionStrategy, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core'
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
 * <sb-uic-sidebar-stat-cards-section [section]="statCardsConfig" />
 */
@Component({
  selector: 'sb-uic-sidebar-stat-cards-section',
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
export class SidebarStatCardsSectionComponent implements OnChanges {
  /**
   * Stat cards section configuration
   */
  @Input({ required: true }) section!: StatCardsSectionConfig
  @Input({ required: true }) detailsChanged!: boolean

  /**
   * Sidebar open/close state
   */
  @Input({ required: true }) isOpen!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean

  @Output() itemClicked = new EventEmitter<{ code: string; subType: string }>()

  constructor(
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Manually detect changes when detailsChanged flag is toggled
    if (changes['detailsChanged'] && !changes['detailsChanged'].firstChange) {
      this.cdr.markForCheck()
      this.sectionSignal.set(this.section)
    }
  }
  /**
   * Translate a label using MultilingualTranslationsService
   */
  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  // Keep a signal copy of the `section` input so `computed` can track changes
  private sectionSignal = signal<StatCardsSectionConfig | undefined>(undefined)

  visibleItems = computed(() => {
    return this.sectionSignal()?.items ?? []
  });

  sectionLoading = computed(() => {
    return this.sectionSignal()?.sectionLoading ?? false
  });

  shouldShowViewAll = computed(() => {
    return this.sectionSignal()?.showViewAll ?? false
  });

  /**
   * Handle View All click - emit event to parent
   */
  onViewAllClick(): void {
    console.log('View All clicked for section:', this.section)
    this.itemClicked.emit({ code: this.section.viewAllKey ?? '', subType: '' })
  }

  /**
   * Track by function for stat items
   */
  trackByIndex(index: number, item: StatCardItem): number {
    return index
  }
}
