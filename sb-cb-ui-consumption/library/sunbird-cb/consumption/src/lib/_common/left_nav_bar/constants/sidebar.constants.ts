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
 * Mobile:  < 600px            (no sidebar; the host renders a bottom nav instead)
 * Tablet:  600px - 1024px     (overlay-drawer behavior)
 * Desktop: > 1024px           (push/shift behavior)
 *
 * The 600px boundary is Angular Material's Breakpoints.XSmall edge (599.98px), which is what
 * the host app's isXSmall$ / isTabView$ use to pick which sidebar to render. Tablet used to
 * start at 768px, which left 600px-767.98px unclaimed: the host rendered the desktop sidebar
 * there while this component still reported isMobile(), so the drawer was pinned to 320px by
 * the mobile CSS and the open/closed toggle only resized the container behind it.
 */
export const BREAKPOINTS = {
  MOBILE: 599.98,
  TABLET_MIN: 600,
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
