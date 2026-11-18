import { Injectable } from '@angular/core'
import { TelemetryService, UtilityService } from '@sunbird-cb/utils-v2'

declare var $t: any

export interface IJagoInteractData {
  type: string
  subtype?: string
  id: string
}

export interface IJagoImpressionData {
  subtype?: string
}

/** Entry of the telemetry `context.cdata` list. */
export interface IJagoTelemetryCdata {
  id: string
  type: string
}

/**
 * Raises the Jago chatbot's telemetry through the portal's logged-in telemetry session:
 * INTERACT events for the launcher and the language menu, and a subtyped IMPRESSION on open.
 *
 * Events go straight to the telemetry SDK with the context the utils-v2 library uses (portal
 * pdata, page id and env from the current route). The library cannot be used for them: its
 * `impression()` cannot set `edata.subtype`, and its interact listener sets neither `cdata`
 * nor the route's module as `env`.
 */
@Injectable({
  providedIn: 'root',
})
export class JagoChatbotTelemetryService {
  constructor(
    private telemetrySvc: TelemetryService,
    private utilitySvc: UtilityService,
  ) {}

  /** INTERACT event; `cdata` is added to the event context when given. */
  raiseInteract(edata: IJagoInteractData, cdata?: IJagoTelemetryCdata[]) {
    this.send(
      (pageid, options) => $t.interact(
        { type: edata.type, subtype: edata.subtype, id: edata.id, pageid },
        options,
      ),
      cdata,
    )
  }

  /** IMPRESSION event. Without a subtype this is the library's plain page impression. */
  raiseImpression(edata: IJagoImpressionData = {}) {
    if (!edata.subtype) {
      this.telemetrySvc.impression()
      return
    }
    this.send((pageid, options) => $t.impression(
      { type: 'page', subtype: edata.subtype, pageid, uri: window.location.pathname },
      options,
    ))
  }

  private send(raise: (pageid: string, options: any) => void, cdata?: IJagoTelemetryCdata[]) {
    try {
      if (typeof $t === 'undefined') {
        return
      }
      const pageContext = this.utilitySvc.routeData || {}
      raise(pageContext.pageId || window.location.pathname, {
        context: {
          pdata: { ...this.telemetrySvc.pData },
          ...(pageContext.module ? { env: pageContext.module } : null),
          ...(cdata && cdata.length ? { cdata } : null),
        },
        object: {},
      })
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in Jago chatbot telemetry', e)
    }
  }
}
