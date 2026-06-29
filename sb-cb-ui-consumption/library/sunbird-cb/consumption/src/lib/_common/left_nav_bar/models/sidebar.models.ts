/**
 * Enums and Types for Dynamic Sidebar Configuration
 */

/**
 * Sidebar state change event
 */
export interface SidebarStateChange {
  isOpen: boolean
}

/**
 * Enum defining the types of cards/sections supported in the sidebar
 */
export enum SidebarCardType {
  NAV_LIST = 'nav_list',
  STAT_CARDS = 'stat_cards',
  INFO_CARDS = 'info_cards'
}

/**
 * Base interface for all navigation items
 */
export interface BaseNavItem {
  iconName?: string
  iconUrl?: string
  disableTranslate?: boolean
  enabled?: boolean
  subtype?: string
}

/**
 * Navigation list item configuration
 */
export interface NavListItem extends BaseNavItem {
  label: string
  navUrl: string
  code?: string
  isActive?: boolean
}

/**
 * Stat card item configuration (for achievements, rankings, etc.)
 */
export interface StatCardItem extends BaseNavItem {
  headerLabel: string
  value: string
}

/**
 * Info card item configuration with support for nested children
 */
export interface InfoCardItem extends BaseNavItem {
  hasChildren: boolean
  title: string
  description: string
  navUrl: string
  children?: InfoCardChild[]
}

/**
 * Nested child info card configuration
 */
export interface InfoCardChild extends BaseNavItem {
  title: string
  description: string
  navUrl: string
}

/**
 * Base section configuration shared across all section types
 */
export interface BaseSectionConfig {
  cardType: SidebarCardType
  sectionTitle: string
  sectionKey: string
  sectionLoading?: boolean
  disableTranslate?: boolean
  viewAllKey?: string
  collapsible: boolean
  showViewAll: boolean
  viewAllLabel?: string
  disableTranslateOnViewAll?: boolean
  maxItemsVisible?: number | null
  enabled?: boolean
}

/**
 * Nav list section configuration
 */
export interface NavListSectionConfig extends BaseSectionConfig {
  cardType: SidebarCardType.NAV_LIST
  items: NavListItem[] | null
}

/**
 * Stat cards section configuration
 */
export interface StatCardsSectionConfig extends BaseSectionConfig {
  cardType: SidebarCardType.STAT_CARDS
  items: StatCardItem[]
}

/**
 * Info cards section configuration
 */
export interface InfoCardsSectionConfig extends BaseSectionConfig {
  cardType: SidebarCardType.INFO_CARDS
  items: InfoCardItem[]
}

/**
 * Union type for all section configurations
 */
export type SidebarSection =
  | NavListSectionConfig
  | StatCardsSectionConfig
  | InfoCardsSectionConfig

/**
 * Main sidebar configuration interface
 */
export interface SidebarConfig {
  logoUrl?: string
  headerText?: string
  defaultOpen: boolean
  activeItemCode?: string
  navSections: SidebarSection[]
  footerSections?: any[]
}
