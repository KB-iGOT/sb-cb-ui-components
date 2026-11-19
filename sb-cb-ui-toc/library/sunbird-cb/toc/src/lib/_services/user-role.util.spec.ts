import { isVolunteerUser } from './user-role.util'

describe('isVolunteerUser', () => {
  it('is false without a config service or a volunteer role', () => {
    expect(isVolunteerUser(null)).toBe(false)
    expect(isVolunteerUser({})).toBe(false)
    expect(isVolunteerUser({ userRoles: new Set(['public']), userProfileV2: { userRoles: ['PUBLIC'] } })).toBe(false)
  })

  it('detects the role from configSvc.userRoles', () => {
    expect(isVolunteerUser({ userRoles: new Set(['volunteer']) })).toBe(true)
  })

  it('detects the role from userProfileV2.userRoles as strings or objects', () => {
    expect(isVolunteerUser({ userProfileV2: { userRoles: ['VOLUNTEER'] } })).toBe(true)
    expect(isVolunteerUser({ userProfileV2: { userRoles: [{ role: 'volunteer' }] } })).toBe(true)
  })
})
