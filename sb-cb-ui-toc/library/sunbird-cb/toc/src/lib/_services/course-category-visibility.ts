/**
 * TOC sections that config can switch off per course category, e.g. in the TOC page config:
 *   "disableCertificateCourseCategories": ["Baseline Assessment", "Endline Assessment"],
 *   "disableKarmaPointsCourseCategories": ["Baseline Assessment", "Endline Assessment"]
 * The TOC page config (portal_page_toc) wins; the application config is the fallback.
 */
export const DISABLE_CERTIFICATE_KEY = 'disableCertificateCourseCategories'
export const DISABLE_KARMA_POINTS_KEY = 'disableKarmaPointsCourseCategories'

/**
 * The configured list under `key`: the TOC config's when it has one, else the application config's,
 * else `fallback`.
 */
export function configuredCategories(key: string, tocConfig: any, appConfig: any, fallback: string[] = []): string[] {
  const configured = tocConfig?.[key] ?? appConfig?.[key]
  return Array.isArray(configured) ? configured : fallback
}

/** True when `courseCategory` is in `categories` (ignoring case and surrounding spaces) */
export function isCategoryListed(categories: string[], courseCategory?: string): boolean {
  if (!courseCategory) {
    return false
  }
  const normalise = (value: string) => `${value}`.trim().toLowerCase()
  return categories.some(category => !!category && normalise(category) === normalise(courseCategory))
}

/**
 * Categories whose Karma Points are hidden: `disableKarmaPointsCourseCategories` when configured,
 * otherwise the same list as the certificate (`disableCertificateCourseCategories`), so one key covers
 * both. Neither configured: none (the widget still hides Case Study on its own, as before).
 */
export function karmaPointsDisabledCategories(tocConfig: any, appConfig: any): string[] {
  const own = configuredCategories(DISABLE_KARMA_POINTS_KEY, tocConfig, appConfig, [])
  const ownConfigured = Array.isArray(tocConfig?.[DISABLE_KARMA_POINTS_KEY]) || Array.isArray(appConfig?.[DISABLE_KARMA_POINTS_KEY])
  return ownConfigured ? own : configuredCategories(DISABLE_CERTIFICATE_KEY, tocConfig, appConfig, [])
}
