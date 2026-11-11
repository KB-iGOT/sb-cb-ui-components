import { Injectable, inject } from '@angular/core'
import { ConfigurationsService } from './configurations.service'

/**
 * The server's current time (epoch ms). Use it instead of Date.now() for anything that opens, closes or
 * expires by date, so changing the device clock cannot unlock it early.
 *
 * Counts forward from the last API `ts` (ConfigurationsService.serverTime, saved by the portal's HTTP
 * interceptor together with serverTimeAt = performance.now()). performance.now() keeps running at the real rate
 * whatever the device clock is set to. Falls back to Date.now() + serverTimeOffset, then to Date.now() when no
 * API response has carried a `ts` yet.
 */
@Injectable({ providedIn: 'root' })
export class ServerClockService {
  private readonly configSvc = inject(ConfigurationsService)

  now(): number {
    const { serverTime, serverTimeAt, serverTimeOffset } = this.configSvc
    if (serverTime && typeof serverTimeAt === 'number') {
      return serverTime + (performance.now() - serverTimeAt)
    }
    return Date.now() + (serverTimeOffset || 0)
  }
}
