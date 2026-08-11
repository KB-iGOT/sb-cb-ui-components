import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NavListSectionConfig, NavListItem } from '../../models/sidebar.models'
import { MultilingualTranslationsService } from '../../../../_services/multilingual-translations.service'
import { SkeletonLoaderLibModule } from '../../../skeleton-loader-lib/skeleton-loader-lib.module'

/**
 * Sidebar Nav List Section Component
 *
 * Renders a list of navigation items with icons and active route highlighting.
 *
 * Features:
 * - Material icons and custom image icons support
 * - Active route highlighting
 * - Hover effects with ripple animation
 * - Accessible keyboard navigation
 * - RouterLink integration
 *
 * @example
 * <sb-uic-sidebar-nav-list-section [section]="navListConfig" />
 */
@Component({
  selector: 'sb-uic-sidebar-nav-list-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    TranslateModule,
    SkeletonLoaderLibModule
  ],
  templateUrl: './sidebar-nav-list-section.component.html',
  styleUrls: ['./sidebar-nav-list-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavListSectionComponent implements OnChanges {
  /**
   * Navigation list section configuration
   */
  @Input({ required: true }) section!: NavListSectionConfig
  @Input({ required: true }) isOpen!: boolean // Sidebar open/close state
  @Input({ required: true }) detailsChanged!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean
  @Input() activeItemCode?: string

  @Output() itemClicked = new EventEmitter<{ code: string; subType: string }>()

  itemsList: NavListItem[] = []
  limitedItemsList: NavListItem[] = []

  viewAllItems = signal<boolean>(false)
  showViewAll = signal<boolean>(false)

  visibleItems = computed(() =>
    this.viewAllItems() ? this.itemsList : this.limitedItemsList
  );

  constructor(
    private router: Router,
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section'] && this.section && this.section.items) {
      this.itemsList = this.section.items.filter(item => item.enabled !== false)
      if (this.section.maxItemsVisible) {
        this.limitedItemsList = this.itemsList.slice(0, this.section.maxItemsVisible)
      }
      if (this.section.showViewAll && this.section.maxItemsVisible && this.itemsList.length > this.section.maxItemsVisible) {
        this.showViewAll.set(true)
      }
      if (!this.showViewAll()) {
        this.viewAllItems.set(true)
      }
    }
  }

  /**
   * Translate a label using MultilingualTranslationsService
   */

  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  itemTooltip(item?: NavListItem): string {
    return item?.tooltipText || item?.label || ''
  }

  onItemClick(item: NavListItem): void {
    if (item?.code) {
      this.itemClicked.emit({ code: item.code, subType: item.subtype ?? '' })
    }
  }

  /**
   * Check if a route is currently active
   *
   * "my-learning" shares its navUrl with other sidebar items that point to the
   * same seeAll page, so it's only active when the continueLearning
   * queryParams also match - path alone isn't enough to disambiguate it.
   */
  isActiveRoute(item?: NavListItem): boolean {
    if (!item?.navUrl) return false

    if (item.code === 'my-learning') {
      return this.router.isActive(
        this.router.createUrlTree([item.navUrl], { queryParams: item.queryParams || {} }),
        { paths: 'exact', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' }
      )
    }

    return this.router.isActive(item.navUrl, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })
  }

  /**
   * Track by function for nav items
   */
  trackByNavUrl(index: number, item: NavListItem): string {
    return item.navUrl || `nav-item-${index}`
  }
}
