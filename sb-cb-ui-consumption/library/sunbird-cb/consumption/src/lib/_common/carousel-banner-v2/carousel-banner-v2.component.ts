import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core'
import { NgClass } from '@angular/common'
import { Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { NsCarouselBannerV2 } from './carousel-banner-v2.model'

@Component({
  selector: 'ws-widget-carousel-banner-v2',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './carousel-banner-v2.component.html',
  styleUrls: ['./carousel-banner-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsWidgetCarouselBannerV2Component implements OnDestroy {

  // Signal inputs
  banners = input<NsCarouselBannerV2.IBannerItem[]>([])
  size = input<NsCarouselBannerV2.BannerSize>('lg')
  navButtonPosition = input<NsCarouselBannerV2.NavButtonPosition>('middle-outside')
  autoPlay = input<boolean>(true)
  autoPlayInterval = input<number>(4000)
  showDots = input<boolean>(true)
  showArrows = input<boolean>(true)
  contentPosition = input<NsCarouselBannerV2.ContentPosition>('middle-left')
  transitionEffect = input<NsCarouselBannerV2.TransitionEffect>('none')
  dotsPosition = input<NsCarouselBannerV2.DotsPosition>('bottom-middle')
  scrollNavigation = input<boolean>(true)
  ctaPosition = input<NsCarouselBannerV2.CtaPosition>('bottom-left')
  /** When true, renders a Tailwind animate-pulse skeleton. Set false once API data loads. */
  loading = input<boolean>(false)
  /** Percentage (0–49) of the next slide to peek into the viewport. */
  peekPercent = input<number>(0)

  // Internal state signals
  currentIndex = signal(0)
  skipTransition = signal(false)

  private autoPlayTimer: ReturnType<typeof setTimeout> | undefined
  private touchStartX = 0
  private touchStartY = 0
  private wheelLocked = false

  // Computed signals
  resolvedBanners = computed(() => this.banners() ?? [])

  isOutside = computed(() => this.navButtonPosition() === 'middle-outside')

  isMiddleInside = computed(() => this.navButtonPosition() === 'middle-inside')

  isMiddlePosition = computed(() =>
    this.navButtonPosition() === 'middle-inside' ||
    this.navButtonPosition() === 'middle-outside'
  )

  isTop = computed(() => {
    const p = this.navButtonPosition()
    return p === 'top-left' || p === 'top-middle' || p === 'top-right'
  })

  isBottom = computed(() => {
    const p = this.navButtonPosition()
    return p === 'bottom-left' || p === 'bottom-middle' || p === 'bottom-right'
  })

  hostClasses = computed<Record<string, boolean>>(() => ({
    [`ws-carousel--size-${this.size()}`]: true,
    [`ws-carousel--nav-${this.navButtonPosition()}`]: true,
    [`ws-carousel--fx-${this.transitionEffect()}`]: true,
    'ws-carousel--peek': this.peekPercent() > 0 && this.resolvedBanners().length > 1,
  }))

  trackTransform = computed(() => {
    if (this.transitionEffect() === 'fade') { return 'none' }
    const banners = this.resolvedBanners()
    const idx = this.currentIndex()
    const peek = this.peekPercent()
    if (peek > 0 && banners.length > 1) {
      if (idx === banners.length - 1 && banners.length > 1) {
        const n = banners.length
        const p = peek
        return `translateX(calc(-1 * (${n - 1} * ${100 - p}% - ${p}% - 12px)))`
      }
      return `translateX(calc(-${idx} * ${100 - peek}%))`
    }
    return `translateX(calc(-${idx} * (100% + 12px)))`
  })

  slideFlexBasis = computed(() => {
    const peek = this.peekPercent()
    if (peek <= 0 || this.resolvedBanners().length <= 1) { return null }
    return `0 0 calc(${100 - peek}% - 12px)`
  })

  skeletonHeightClass = computed(() => {
    const map: Record<NsCarouselBannerV2.BannerSize, string> = {
      xs: 'h-36',
      sm: 'h-52',
      md: 'h-80',
      lg: 'h-[480px]',
      xl: 'h-[600px]',
    }
    return map[this.size()] ?? 'h-[480px]'
  })

  skeletonCtrlBarJustify = computed(() => {
    const p = this.navButtonPosition()
    if (p === 'top-left' || p === 'bottom-left') { return 'justify-start' }
    if (p === 'top-right' || p === 'bottom-right') { return 'justify-end' }
    return 'justify-center'
  })

  skeletonDotsJustify = computed(() => {
    if (this.dotsPosition() === 'bottom-left') { return 'justify-start' }
    if (this.dotsPosition() === 'bottom-right') { return 'justify-end' }
    return 'justify-center'
  })

  constructor(
    private readonly router: Router,
    private readonly events: EventService,
  ) {
    // Reactively restart autoplay whenever banners, autoPlay, or interval changes
    effect(() => {
      const _banners = this.resolvedBanners()
      const _auto = this.autoPlay()
      const _interval = this.autoPlayInterval()
      untracked(() => this.resetAutoPlay())
    })
  }

  ngOnDestroy(): void {
    this.clearAutoPlay()
  }

  resolvedCtaPosition(item: NsCarouselBannerV2.IBannerItem): NsCarouselBannerV2.CtaPosition {
    return item.ctaPosition ?? this.ctaPosition()
  }

  isCtaTop(item: NsCarouselBannerV2.IBannerItem): boolean {
    return this.resolvedCtaPosition(item).startsWith('top')
  }

  prev(): void {
    const banners = this.resolvedBanners()
    const idx = this.currentIndex()
    const wrapping = idx === 0
    this.currentIndex.set(wrapping ? banners.length - 1 : idx - 1)
    wrapping ? this.jumpTransition() : this.resetAutoPlay()
    this.raiseTelemetry('carousel-prev', String(this.currentIndex()))
  }

  next(): void {
    const banners = this.resolvedBanners()
    const idx = this.currentIndex()
    const wrapping = idx === banners.length - 1
    this.currentIndex.set((idx + 1) % banners.length)
    wrapping ? this.jumpTransition() : this.resetAutoPlay()
    this.raiseTelemetry('carousel-next', String(this.currentIndex()))
  }

  goTo(index: number): void {
    const banners = this.resolvedBanners()
    if (index < 0 || index >= banners.length) { return }
    this.currentIndex.set(index)
    this.resetAutoPlay()
    this.raiseTelemetry('carousel-dot', String(index))
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.scrollNavigation()) { return }
    const t = event.changedTouches[0]
    this.touchStartX = t.clientX
    this.touchStartY = t.clientY
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.scrollNavigation()) { return }
    const t = event.changedTouches[0]
    const dx = t.clientX - this.touchStartX
    const dy = t.clientY - this.touchStartY
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) { return }
    if (dx < 0) { this.next() } else { this.prev() }
  }

  onWheel(event: WheelEvent): void {
    if (!this.scrollNavigation()) { return }
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) { return }
    if (Math.abs(event.deltaX) < 20) { return }
    event.preventDefault()
    if (this.wheelLocked) { return }
    this.wheelLocked = true
    if (event.deltaX > 0) { this.next() } else { this.prev() }
    setTimeout(() => { this.wheelLocked = false }, 600)
  }

  onBannerClick(item: NsCarouselBannerV2.IBannerItem): void {
    if (!item.redirectionUrl) { return }
    this.raiseTelemetry('banner-cta-click', item.redirectionUrl, item.title)
    const url = item.redirectionUrl
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      this.router.navigateByUrl(url)
    }
  }

  overlayClass(item: NsCarouselBannerV2.IBannerItem): string {
    return `ws-carousel__overlay--${item.contentPosition ?? this.contentPosition()}`
  }

  private raiseTelemetry(subType: string, id: string, label?: string): void {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType,
        id: label ? `banner-${label}` : 'carousel-nav',
      },
      {
        id,
        type: 'carousel-banner',
      },
      {
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      },
    )
  }

  private startAutoPlay(): void {
    const banners = this.resolvedBanners()
    if (!this.autoPlay() || banners.length <= 1) { return }
    const interval = this.autoPlayInterval()
    const tick = () => {
      this.autoPlayTimer = setTimeout(() => {
        const currentBanners = this.resolvedBanners()
        const idx = this.currentIndex()
        const wrapping = idx === currentBanners.length - 1
        this.currentIndex.set((idx + 1) % currentBanners.length)
        if (wrapping && this.transitionEffect() === 'slide') {
          this.skipTransition.set(true)
          requestAnimationFrame(() => requestAnimationFrame(() => {
            this.skipTransition.set(false)
            tick()
          }))
        } else {
          tick()
        }
      }, interval)
    }
    tick()
  }

  private clearAutoPlay(): void {
    if (this.autoPlayTimer !== undefined) {
      clearTimeout(this.autoPlayTimer)
      this.autoPlayTimer = undefined
    }
  }

  private resetAutoPlay(): void {
    this.clearAutoPlay()
    this.startAutoPlay()
  }

  private jumpTransition(): void {
    this.skipTransition.set(true)
    this.resetAutoPlay()
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.skipTransition.set(false)
    }))
  }
}
