import { Component, Input, computed, signal, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatRippleModule } from '@angular/material/core'
import { StatCardsSectionConfig, StatCardItem } from '../../models/sidebar.models'
import { DEFAULTS } from '../../constants/sidebar.constants'

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
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatRippleModule
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

  /**
   * Signal to track if "View All" is expanded
   */
  isExpanded = signal<boolean>(false);

  /**
   * Computed signal for visible items based on maxItemsVisible and expansion state
   */
  visibleItems = computed(() => {
    if (!this.section?.items) return []

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
  trackByNavUrl(index: number, item: StatCardItem): string {
    return item.navUrl || `stat-item-${index}`
  }
}
