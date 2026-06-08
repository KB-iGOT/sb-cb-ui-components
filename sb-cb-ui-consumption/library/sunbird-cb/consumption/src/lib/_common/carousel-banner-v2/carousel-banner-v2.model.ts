/**
 * Namespace following sunbird-cb-portal ws-widget conventions.
 * All model types, enums, and interfaces for the Carousel Banner widget.
 */
export namespace NsCarouselBannerV2 {
  /**
   * Size variants for the banner height.
   * - xs : 140px  (extra-compact, inline teasers)
   * - sm : 200px  (compact banners, inline blocks)
   * - md : 320px  (medium promotional strips)
   * - lg : 480px  (full hero banners)
   * - xl : 600px  (full-bleed splash banners)
   */
  export type BannerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Position of the overlay content (title / subtitle / CTA) inside the slide.
   */
  export type ContentPosition =
    | 'top-left'    | 'top-middle'    | 'top-right'
    | 'middle-left' | 'middle'        | 'middle-right'
    | 'bottom-left' | 'bottom-middle' | 'bottom-right'

  /**
   * Slide transition animation effect.
   * - 'none'  : instant cut (default)
   * - 'slide' : smooth horizontal slide
   * - 'fade'  : cross-fade between slides
   */
  export type TransitionEffect = 'none' | 'slide' | 'fade'

  /**
   * Alignment of the dots row when navButtonPosition is middle-inside or middle-outside.
   */
  export type DotsPosition = 'bottom-left' | 'bottom-middle' | 'bottom-right'

  /**
   * Position of the CTA button within the overlay content block.
   */
  export type CtaPosition =
    | 'top-left'    | 'top-middle'    | 'top-right'
    | 'bottom-left' | 'bottom-middle' | 'bottom-right'

  /**
   * Position of the previous / next navigation arrow buttons.
   */
  export type NavButtonPosition =
    | 'top-left'      | 'top-middle'    | 'top-right'
    | 'middle-inside' | 'middle-outside'
    | 'bottom-left'   | 'bottom-middle' | 'bottom-right'

  /** A single slide in the carousel. */
  export interface IBannerItem {
    /** URL of the banner background image. */
    bannerUrl: string
    /** Optional navigation target when the banner is clicked. */
    redirectionUrl?: string
    /** Alt text for the banner image (accessibility). */
    altText?: string
    /** Optional overlay title rendered on top of the banner. */
    title?: string
    /** Optional overlay subtitle rendered on top of the banner. */
    subtitle?: string
    /** Optional CTA button label rendered on the banner. */
    ctaLabel?: string
    /** Per-slide CTA position — overrides component-level ctaPosition. */
    ctaPosition?: CtaPosition
    /** Per-slide overlay position — overrides component-level contentPosition. */
    contentPosition?: ContentPosition
  }

  /** Root configuration object accepted by <ws-widget-carousel-banner>. */
  export interface ICarouselConfig {
    banners: IBannerItem[]
    size?: BannerSize
    navButtonPosition?: NavButtonPosition
    autoPlay?: boolean
    autoPlayInterval?: number
    showDots?: boolean
    showArrows?: boolean
    contentPosition?: ContentPosition
    transitionEffect?: TransitionEffect
    dotsPosition?: DotsPosition
    scrollNavigation?: boolean
    ctaPosition?: CtaPosition
    /** When true, renders a skeleton loader in place of the carousel (default: false). */
    loading?: boolean
    /**
     * Percentage (0–49) of the next slide to peek into the viewport.
     * E.g. 25 means the next slide is 25% visible on the right edge.
     * When 0 (default) the carousel shows one full slide at a time.
     */
    peekPercent?: number
  }
}
