import { TestBed } from '@angular/core/testing'
import { ConfigurationsService } from './configurations.service'
import { ServerClockService } from './server-clock.service'

describe('ServerClockService', () => {
  let config: { serverTime: number | null, serverTimeOffset: number, serverTimeAt: number | null }
  let clock: ServerClockService

  beforeEach(() => {
    config = { serverTime: null, serverTimeOffset: 0, serverTimeAt: null }
    TestBed.configureTestingModule({ providers: [{ provide: ConfigurationsService, useValue: config }] })
    clock = TestBed.inject(ServerClockService)
  })

  it('counts forward from the server time and ignores changes to the device clock', () => {
    spyOn(performance, 'now').and.returnValue(61_000)
    spyOn(Date, 'now').and.returnValue(Date.parse('2026-11-06T13:33:00Z'))
    config.serverTime = Date.parse('2026-11-05T13:33:00Z')
    config.serverTimeAt = 1_000
    expect(clock.now()).toBe(Date.parse('2026-11-05T13:34:00Z'))
  })

  it('falls back to the device clock plus the saved offset when there is no anchor', () => {
    spyOn(Date, 'now').and.returnValue(10_000)
    config.serverTimeOffset = 2_500
    expect(clock.now()).toBe(12_500)
  })

  it('uses the device clock before any API response carried a ts', () => {
    spyOn(Date, 'now').and.returnValue(10_000)
    expect(clock.now()).toBe(10_000)
  })
})
