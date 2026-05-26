import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatRippleModule } from '@angular/material/core'
import { InfoCardsSectionConfig, InfoCardItem } from '../../models/sidebar.models'

/**
 * Sidebar Info Cards Section Component
 *
 * Renders informational cards with support for nested children cards.
 *
 * Features:
 * - Info card display with title and description
 * - Nested children cards support
 * - Collapsible parent section
 * - Expandable children cards
 * - Click navigation support
 * - Material Design accordions
 *
 * @example
 * <app-sidebar-info-cards-section [section]="infoCardsConfig" />
 */
@Component({
  selector: 'app-sidebar-info-cards-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatRippleModule
  ],
  templateUrl: './sidebar-info-cards-section.component.html',
  styleUrls: ['./sidebar-info-cards-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarInfoCardsSectionComponent {
  /**
   * Info cards section configuration
   */
  @Input({ required: true }) section!: InfoCardsSectionConfig

  /**
   * Sidebar open/close state
   */
  @Input({ required: true }) isOpen!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean

  /**
   * Track expanded state of each parent card
   */
  expandedCards = signal<Set<number>>(new Set());

  /**
   * Toggle expansion of a parent card with children
   */
  toggleCardExpansion(index: number): void {
    this.expandedCards.update(expanded => {
      const newSet = new Set(expanded)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  /**
   * Check if a card is expanded
   */
  isCardExpanded(index: number): boolean {
    return this.expandedCards().has(index)
  }

  /**
   * Track by function for info items
   */
  trackByTitle(index: number, item: InfoCardItem): string {
    return item.title || `info-item-${index}`
  }

  /**
   * Track by function for child items
   */
  trackByChildTitle(index: number, child: any): string {
    return child.title || `child-item-${index}`
  }
}
