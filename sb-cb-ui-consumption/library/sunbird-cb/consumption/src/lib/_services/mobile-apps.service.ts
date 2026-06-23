import { computed, inject, Injectable, signal } from '@angular/core'
import { Router } from '@angular/router'
import { NsContent } from '../_models/widget-content.model'

// ---------------------------------------------------------------------------
// Mobile bridge event constants
// ---------------------------------------------------------------------------
const NAVIGATION_DATA_INCOMING = 'navigation_data_incoming' as const
const DISPLAY_SETTING = 'displaySettings' as const
const GO_OFFLINE = 'goOffline' as const
const GET_PLAYERCONTENT_JSON = 'getPlayerContentJson' as const
const DOWNLOAD_REQUESTED = 'downloadRequested' as const
const CHAT_BOT_VISIBILITY = 'chatBotVisibility' as const
const IOS_OPEN_IN_BROWSER = 'iosOpenInBrowser' as const

// ---------------------------------------------------------------------------
// Window bridge interface
// ---------------------------------------------------------------------------
interface IWindowMobileApp extends Window {
  appRef?: Record<string, (...args: string[]) => void>
  webkit?: {
    messageHandlers?: {
      appRef?: { postMessage: (data: string) => void }
    }
  }
  navigateTo?: (url: string, params?: Record<string, unknown>) => void
  dispatchEventFlag?: boolean
}

declare const window: IWindowMobileApp

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
@Injectable({ providedIn: 'root' })
export class MobileAppsService {
  private readonly router = inject(Router)

  // ── Bridge refs as signals ────────────────────────────────────────────────
  private readonly _androidRef =
    signal<Record<string, (...args: string[]) => void> | null>(null)

  private readonly _iosRef =
    signal<{ postMessage: (data: string) => void } | null>(null)

  // ── Public computed signals ───────────────────────────────────────────────
  readonly isAndroidApp = computed(() => Boolean(this._androidRef()))
  readonly isMobile = computed(() => Boolean(this._androidRef()) || Boolean(this._iosRef()))
  readonly canShowSettings = computed(() =>
    Boolean(this._androidRef()?.[DISPLAY_SETTING]) || Boolean(this._iosRef())
  )

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  init(): void {
    this._syncRefs()
    this._setupGlobalMethods()
    this._setupNavigationListener()
  }

  simulateMobile(): void {
    window.appRef = {} as Record<string, (...args: string[]) => void>
    window.webkit = {}
    this._syncRefs()
  }

  // ── Public API ────────────────────────────────────────────────────────────
  goOffline(): void {
    this._send(GO_OFFLINE, {})
  }

  viewSettings(): void {
    this._send(DISPLAY_SETTING, {})
  }

  sendViewerData(viewerData: NsContent.IContent): void {
    this._send(GET_PLAYERCONTENT_JSON, viewerData)
  }

  downloadResource(id: string): void {
    this._send(DOWNLOAD_REQUESTED, id)
  }

  appChatbotVisibility(isVisible: 'yes' | 'no'): void {
    this._send(CHAT_BOT_VISIBILITY, isVisible)
  }

  iosOpenInBrowserRequest(url: string): void {
    this._send(IOS_OPEN_IN_BROWSER, { url })
  }

  isFunctionAvailableInAndroid(functionName: string): boolean {
    return Boolean(this._androidRef()?.[functionName])
  }

  sendDataAppToClient(eventName: string, data: unknown): void {
    this._send(eventName, data)
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private _syncRefs(): void {
    this._androidRef.set(window.appRef ?? null)
    this._iosRef.set(window.webkit?.messageHandlers?.appRef ?? null)
  }

  private _send(eventName: string, data: unknown): void {
    const android = this._androidRef()
    const ios = this._iosRef()

    if (android?.[eventName]) {
      eventName === DISPLAY_SETTING
        ? android[eventName]()
        : android[eventName](JSON.stringify(data))
    } else if (ios) {
      ios.postMessage(JSON.stringify({ eventName, data }))
    } else if (window.dispatchEventFlag) {
      document.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }
  }

  private _setupGlobalMethods(): void {
    window.navigateTo = (url: string, params?: Record<string, unknown>): void => {
      document.dispatchEvent(
        new CustomEvent(NAVIGATION_DATA_INCOMING, { detail: { url, params } })
      )
    }
  }

  private _setupNavigationListener(): void {
    document.addEventListener(NAVIGATION_DATA_INCOMING, (event: Event) => {
      const detail = (event as CustomEvent<{ url: string; params?: Record<string, unknown> }>).detail
      if (detail?.url) {
        this.router.navigate([detail.url], detail.params ? { queryParams: detail.params } : undefined)
      }
    })
  }
}
