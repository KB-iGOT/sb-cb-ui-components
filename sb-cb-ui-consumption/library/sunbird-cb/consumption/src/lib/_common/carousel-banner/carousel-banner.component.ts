import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { Router } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { NsCarouselBanner } from './carousel-banner.model'

@Component({
  selector: 'ws-widget-carousel-banner',
  templateUrl: './carousel-banner.component.html',
  styleUrls: ['./carousel-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WsWidgetCarouselBannerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() banners: NsCarouselBanner.IBannerItem[] = []
  @Input() size: NsCarouselBanner.BannerSize = 'lg'
  @Input() navButtonPosition: NsCarouselBanner.NavButtonPosition = 'middle-outside'
  @Input() autoPlay = true
  @Input() autoPlayInterval = 4000
  @Input() showDots = true
  @Input() showArrows = true
  @Input() contentPosition: NsCarouselBanner.ContentPosition = 'middle-left'
  @Input() transitionEffect: NsCarouselBanner.TransitionEffect = 'none'
  @Input() dotsPosition: NsCarouselBanner.DotsPosition = 'bottom-middle'
  @Input() scrollNavigation = true
  @Input() ctaPosition: NsCarouselBanner.CtaPosition = 'bottom-left'

  /**
   * When true, renders a Tailwind animate-pulse skeleton in place of the carousel.
   * Set to false once your API data has loaded.
   */
  @Input() loading = false

  /**
   * Percentage (0–49) of the next slide to peek into the viewport.
   * E.g. 25 means the next slide is 25 % visible on the right edge.
   * When 0 (default) the carousel shows one full slide at a time.
   */
  @Input() peekPercent = 0

  currentIndex = 0
  skipTransition = false

  private autoPlayTimer: ReturnType<typeof setTimeout> | undefined
  private touchStartX = 0
  private touchStartY = 0
  private wheelLocked = false

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly events: EventService,
  ) { }

  ngOnInit(): void {
    this.startAutoPlay()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const relevant = changes['autoPlay'] ?? changes['autoPlayInterval'] ?? changes['banners']
    if (relevant && !relevant.isFirstChange()) {
      this.resetAutoPlay()
    }
  }

  ngOnDestroy(): void {
    this.clearAutoPlay()
  }

  resolvedCtaPosition(item: NsCarouselBanner.IBannerItem): NsCarouselBanner.CtaPosition {
    return item.ctaPosition ?? this.ctaPosition
  }

  isCtaTop(item: NsCarouselBanner.IBannerItem): boolean {
    return this.resolvedCtaPosition(item).startsWith('top')
  }

  prev(): void {
    const wrapping = this.currentIndex === 0
    this.currentIndex = wrapping ? this.banners.length - 1 : this.currentIndex - 1
    wrapping ? this.jumpTransition() : this.resetAutoPlay()
    this.raiseTelemetry('carousel-prev', String(this.currentIndex))
    this.cdr.markForCheck()
  }

  next(): void {
    const wrapping = this.currentIndex === this.banners.length - 1
    this.currentIndex = (this.currentIndex + 1) % this.banners.length
    wrapping ? this.jumpTransition() : this.resetAutoPlay()
    this.raiseTelemetry('carousel-next', String(this.currentIndex))
    this.cdr.markForCheck()
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.banners.length) { return }
    this.currentIndex = index
    this.resetAutoPlay()
    this.raiseTelemetry('carousel-dot', String(index))
    this.cdr.markForCheck()
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.scrollNavigation) { return }
    const t = event.changedTouches[0]
    this.touchStartX = t.clientX
    this.touchStartY = t.clientY
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.scrollNavigation) { return }
    const t = event.changedTouches[0]
    const dx = t.clientX - this.touchStartX
    const dy = t.clientY - this.touchStartY
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) { return }
    if (dx < 0) { this.next() } else { this.prev() }
  }

  onWheel(event: WheelEvent): void {
    if (!this.scrollNavigation) { return }
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) { return }
    if (Math.abs(event.deltaX) < 20) { return }
    event.preventDefault()
    if (this.wheelLocked) { return }
    this.wheelLocked = true
    if (event.deltaX > 0) { this.next() } else { this.prev() }
    setTimeout(() => { this.wheelLocked = false }, 600)
  }

  onBannerClick(item: NsCarouselBanner.IBannerItem): void {
    if (!item.redirectionUrl) { return }
    this.raiseTelemetry('banner-cta-click', item.redirectionUrl, item.title)
    const url = item.redirectionUrl
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      this.router.navigateByUrl(url)
    }
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

  /**
   * CSS transform for the slide track.
   * For peek mode the step is (100 – peekPercent)% (gap cancels out exactly).
   * For full mode the step is (100% + 12px) to jump over the slide + gap.
   */
  get trackTransform(): string {
    if (this.transitionEffect === 'fade') { return 'none' }
    if (this.peekPercent > 0 && this.banners.length > 1) {
      // At the last slide, clamp so its right edge is flush with the container
      // right edge (no empty gap) and the previous slide peeks from the left.
      // Max translate = n*(100-p)% - 12px - 100% = (n-1)*(100-p)% - p% - 12px
      if (this.currentIndex === this.banners.length - 1 && this.banners.length > 1) {
        const n = this.banners.length
        const p = this.peekPercent
        return `translateX(calc(-1 * (${n - 1} * ${100 - p}% - ${p}% - 12px)))`
      }
      return `translateX(calc(-${this.currentIndex} * ${100 - this.peekPercent}%))`
    }
    return `translateX(calc(-${this.currentIndex} * (100% + 12px)))`
  }

  /**
   * Flex shorthand for each slide when peek is active.
   * slide-width = (100 – peek)% − 12 px  so that the gap fills exactly the
   * remaining peek space and one clean step = (100 – peek)%.
   * Returns null when peek is disabled so the default SCSS rule applies.
   */
  get slideFlexBasis(): string | null {
    if (this.peekPercent <= 0 || this.banners.length <= 1) { return null }
    return `0 0 calc(${100 - this.peekPercent}% - 12px)`
  }

  get hostClasses(): Record<string, boolean> {
    return {
      [`ws-carousel--size-${this.size}`]: true,
      [`ws-carousel--nav-${this.navButtonPosition}`]: true,
      [`ws-carousel--fx-${this.transitionEffect}`]: true,
      'ws-carousel--peek': this.peekPercent > 0 && this.banners.length > 1,
    }
  }

  get isOutside(): boolean {
    return this.navButtonPosition === 'middle-outside'
  }

  get isMiddleInside(): boolean {
    return this.navButtonPosition === 'middle-inside'
  }

  get isMiddlePosition(): boolean {
    return (
      this.navButtonPosition === 'middle-inside' ||
      this.navButtonPosition === 'middle-outside'
    )
  }

  get isTop(): boolean {
    return (
      this.navButtonPosition === 'top-left' ||
      this.navButtonPosition === 'top-middle' ||
      this.navButtonPosition === 'top-right'
    )
  }

  get isBottom(): boolean {
    return (
      this.navButtonPosition === 'bottom-left' ||
      this.navButtonPosition === 'bottom-middle' ||
      this.navButtonPosition === 'bottom-right'
    )
  }

  get navAlignClass(): string {
    return this.navButtonPosition
  }

  overlayClass(item: NsCarouselBanner.IBannerItem): string {
    return `ws-carousel__overlay--${item.contentPosition ?? this.contentPosition}`
  }

  /** Maps the size input to a fixed Tailwind height class for the skeleton. */
  get skeletonHeightClass(): string {
    const map: Record<NsCarouselBanner.BannerSize, string> = {
      xs: 'h-36',
      sm: 'h-52',
      md: 'h-80',
      lg: 'h-[480px]',
      xl: 'h-[600px]',
    }
    return map[this.size] ?? 'h-[480px]'
  }

  /** Tailwind justify class for top-* / bottom-* skeleton ctrl-bar. */
  get skeletonCtrlBarJustify(): string {
    const p = this.navButtonPosition
    if (p === 'top-left' || p === 'bottom-left') { return 'justify-start' }
    if (p === 'top-right' || p === 'bottom-right') { return 'justify-end' }
    return 'justify-center'
  }

  /** Tailwind justify class for dots in middle-inside / middle-outside skeleton. */
  get skeletonDotsJustify(): string {
    if (this.dotsPosition === 'bottom-left') { return 'justify-start' }
    if (this.dotsPosition === 'bottom-right') { return 'justify-end' }
    return 'justify-center'
  }

  private startAutoPlay(): void {
    if (!this.autoPlay || this.banners.length <= 1) { return }
    const tick = () => {
      this.autoPlayTimer = setTimeout(() => {
        const wrapping = this.currentIndex === this.banners.length - 1
        this.currentIndex = (this.currentIndex + 1) % this.banners.length
        if (wrapping && this.transitionEffect === 'slide') {
          this.skipTransition = true
          this.cdr.markForCheck()
          requestAnimationFrame(() => requestAnimationFrame(() => {
            this.skipTransition = false
            this.cdr.markForCheck()
            tick()
          }))
        } else {
          this.cdr.markForCheck()
          tick()
        }
      }, this.autoPlayInterval)
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
    this.skipTransition = true
    this.resetAutoPlay()
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.skipTransition = false
      this.cdr.markForCheck()
    }))
  }
}
