/**
 * Constants for Dynamic Sidebar Component
 */

/**
 * Animation timing constants
 */
export const SIDEBAR_ANIMATION = {
  DURATION: '300ms',
  EASING: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
} as const

/**
 * Breakpoint constants
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  MAX_ITEMS_VISIBLE: 3,
  COLLAPSED_STATE: false
} as const
