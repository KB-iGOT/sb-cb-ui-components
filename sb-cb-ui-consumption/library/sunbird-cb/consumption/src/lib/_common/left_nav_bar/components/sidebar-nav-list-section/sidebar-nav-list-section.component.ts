import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core'
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
 * <app-sidebar-nav-list-section [section]="navListConfig" />
 */
@Component({
  selector: 'app-sidebar-nav-list-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    TranslateModule,
    SkeletonLoaderLibModule
  ],
  templateUrl: './sidebar-nav-list-section.component.html',
  styleUrls: ['./sidebar-nav-list-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavListSectionComponent {
  /**
   * Navigation list section configuration
   */
  @Input({ required: true }) section!: NavListSectionConfig

  /**
   * Sidebar open/close state
   */
  @Input({ required: true }) isOpen!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean
  @Input() activeItemCode?: string

  @Output() itemClicked = new EventEmitter<string>()

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

  /**
   * Translate a label using MultilingualTranslationsService
   */
  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  onItemClick(item: NavListItem): void {
    if (item?.code) {
      this.itemClicked.emit(item.code)
    }
  }

  /**
   * Check if a route is currently active
   */
  isActiveRoute(navUrl?: string): boolean {
    if (!navUrl) return false
    return this.router.isActive(navUrl, {
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
