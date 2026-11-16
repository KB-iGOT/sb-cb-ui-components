/**
 * Volunteer users are outside the API whitelist for some user-scoped learner APIs (the proxy
 * answers 403 "Forbidden: API WHITELIST Access is denied"), e.g. user/totalkarmapoints and
 * cbplan/v4/user/dictionary. The TOC uses this to skip those calls for them.
 *
 * Same check the portal uses for its volunteer search routing: the role is read from
 * `configSvc.userRoles` (lower-cased set) or from `userProfileV2.userRoles` (strings or {role}).
 */
export function isVolunteerUser(configSvc: any): boolean {
  if (!configSvc) {
    return false
  }
  if (configSvc.userRoles && typeof configSvc.userRoles.has === 'function' && configSvc.userRoles.has('volunteer')) {
    return true
  }
  const profileRoles = configSvc.userProfileV2?.userRoles || []
  return Array.isArray(profileRoles) && profileRoles.some(
    (role: any) => `${typeof role === 'string' ? role : role?.role || ''}`.toUpperCase() === 'VOLUNTEER'
  )
}
