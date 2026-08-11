/**
 * Profile dropdown menu configuration.
 *
 * Items are driven by globalConfig.components.profileMenu so a tenant can reorder them, relabel
 * them, or switch individual entries off without a code change. When that config section is
 * absent the component falls back to DEFAULT_PROFILE_MENU_ITEMS below.
 */

/**
 * How an item behaves when clicked.
 *
 * - `route`         in-app navigation via routerLink
 * - `newTab`        opens `target` in a new browser tab (external links, or pages such as the
 *                   public privacy policy that should not replace the current session view)
 * - `logout`        opens the logout confirmation dialog
 * - `accessibility` opens the UserWay accessibility widget
 */
export type ProfileMenuAction = 'route' | 'newTab' | 'logout' | 'accessibility' | 'startTour'

export interface IProfileMenuItem {
  /** Stable identifier, also used as the telemetry id */
  key: string
  /**
   * Translation key resolved through ngx-translate, or the literal text to show when
   * `disableTranslation` is true.
   */
  label: string
  /**
   * `true` prints `label` verbatim instead of running it through the translate pipe. Use for
   * labels that carry no translation key — a tenant-specific link name, for instance.
   * Defaults to false (translate).
   */
  disableTranslation?: boolean
  action: ProfileMenuAction
  /** Route path for `route`, URL for `newTab`. Ignored by the other actions. */
  target?: string
  /** Tenants switch entries off with `false`; absent means enabled */
  enabled?: boolean
}

/**
 * Used when globalConfig has no `components.profileMenu` section, so an unconfigured tenant
 * keeps the menu it had before this became configurable (plus the privacy policy entry).
 */
export const DEFAULT_PROFILE_MENU_ITEMS: IProfileMenuItem[] = [
  {
    key: 'viewProfile',
    label: 'profileDropdown.viewProfile',
    action: 'route',
    target: '/app/person-profile/me',
  },
  {
    key: 'start-tour',
    label: 'profileDropdown.getStarted',
    action: 'startTour',
  },
  {
    key: 'privacyPolicy',
    label: 'profileDropdown.privacyPolicy',
    action: 'newTab',
    target: '/public/privacy-policy',
  },
  {
    key: 'accessibility',
    label: 'profileDropdown.accessibility',
    action: 'accessibility',
  },
  {
    key: 'settings',
    label: 'profileDropdown.settings',
    action: 'route',
    target: '/app/profile/settings',
  },
  {
    key: 'signOut',
    label: 'profileDropdown.signOut',
    action: 'logout',
  },
]
