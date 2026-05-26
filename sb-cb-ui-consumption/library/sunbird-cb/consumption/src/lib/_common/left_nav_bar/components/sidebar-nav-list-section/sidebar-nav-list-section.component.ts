import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core'
import { NavListSectionConfig, NavListItem } from '../../models/sidebar.models'

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
    MatRippleModule
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

  constructor(private router: Router) { }

  /**
   * Check if a route is currently active
   */
  isActiveRoute(navUrl: string): boolean {
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
