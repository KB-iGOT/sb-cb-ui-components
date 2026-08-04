export namespace NsSpotlightCardsV2 {

  export interface ISpotlightCard {
    /** URL of the card icon / illustration image. */
    iconUrl: string
    /** Alt text for the icon image (accessibility). */
    iconAlt?: string
    /** Label text displayed below the icon. */
    label: string
    /** Router link or external URL to navigate to on card click. */
    redirectionUrl: string
    /** When true the URL is treated as external and opened in a new tab. */
    externalUrl?: boolean
    /**
     * Card background. Accepts either:
     *  - a CSS variable — `--color-accents-cyan` or `var(--color-accents-cyan, #00bcd4)` —
     *    used as-is in both themes, since the variable resolves per theme itself; or
     *  - plain colours, comma separated as `light,dark` (`#E6F7FF,#0B3A4A`). A single colour
     *    is used for both themes.
     * Omitted → the default cyan.
     */
    cardBackgroundColor?: string
    cardClickDetails: cardClickDetails
  }

  export interface cardClickDetails {
    id: string,
    subType: string,
  }

  /** Root configuration object accepted by <ws-widget-spotlight-cards>. */
  export interface ISpotlightCardsConfig {
    /** Section heading displayed on the top-left of the widget. */
    heading: string
    /** Cards to render. */
    cards: ISpotlightCard[]
    /** Whether the accordion/collapse toggle button is shown. Default: true. */
    showToggle?: boolean
    /** Start in collapsed state. Default: false. */
    collapsed?: boolean
    /** Show skeleton loading placeholders instead of real cards. */
    isLoading?: boolean
  }
}
