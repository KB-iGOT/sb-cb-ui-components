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
 *
 * Mobile:  < 768px            (existing overlay behavior, unchanged)
 * Tablet:  768px - 1199.98px  (new overlay-drawer behavior)
 * Desktop: >= 1200px          (existing push/shift behavior, unchanged)
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET_MIN: 768.1,
  TABLET: 1024,
  DESKTOP_MIN: 1024.1
} as const

/**
 * Media query strings shared between the component (BreakpointObserver) and SCSS breakpoints
 */
export const BREAKPOINT_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.MOBILE}px)`,
  TABLET: `(min-width: ${BREAKPOINTS.TABLET_MIN}px) and (max-width: ${BREAKPOINTS.TABLET}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP_MIN}px)`
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  MAX_ITEMS_VISIBLE: 3,
  COLLAPSED_STATE: false
} as const
