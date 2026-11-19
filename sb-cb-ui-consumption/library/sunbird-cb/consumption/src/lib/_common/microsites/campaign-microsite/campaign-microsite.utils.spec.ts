import { isUsableUrl, parseDdMmYyyy } from './campaign-microsite.utils'

describe('parseDdMmYyyy', () => {
  it.each(['14-11-2026', '14-11-2026 ', '5-7-2026'])('parses %p strictly by parts', value => {
    const date = parseDdMmYyyy(value)
    expect(date).toBeInstanceOf(Date)
    expect(date?.getFullYear()).toBe(2026)
  })

  it('reads day and month in DD-MM order as a local date', () => {
    const date = parseDdMmYyyy('14-11-2026')
    expect(date?.getMonth()).toBe(10)
    expect(date?.getDate()).toBe(14)
    expect(date?.getHours()).toBe(0)
  })

  it.each(['', undefined, null, '2026-11-14', '14/11/2026', '31-02-2026', '00-01-2026', '14-13-2026'])(
    'rejects %p', value => {
      expect(parseDdMmYyyy(value as any)).toBeUndefined()
    })
})

describe('isUsableUrl', () => {
  it.each([
    ['https://host/a.png', true],
    ['http://host/a.png', true],
    ['/assets/a.png', true],
    ['<KARMAYOGI_BHARAT_LOGO_URL>', false],
    ['', false],
    [undefined, false],
  ])('%p → %p', (url, expected) => {
    expect(isUsableUrl(url as any)).toBe(expected)
  })
})
