import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { Router } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { NsSpotlightCards } from './spotlight-cards.model'

@Component({
  selector: 'ws-widget-spotlight-cards',
  templateUrl: './spotlight-cards.component.html',
  styleUrls: ['./spotlight-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WsWidgetSpotlightCardsComponent implements OnChanges {

  /** Section heading shown at the top-left. */
  @Input() heading = 'In Spotlight'

  /** Cards to render. */
  @Input() cards: NsSpotlightCards.ISpotlightCard[] = []

  /** Whether the accordion toggle button is visible. */
  @Input() showToggle = true

  /** Initial collapsed state. */
  @Input() collapsed = false

  /** Accept the full config object as an alternative to individual inputs. */
  @Input() config: NsSpotlightCards.ISpotlightCardsConfig | null = null

  /** Show skeleton loading state instead of real cards. */
  @Input() isLoading = false

  /** Number of skeleton placeholder cards to render while loading. */
  @Input() skeletonCount = 4

  isCollapsed = false

  /** Array used to render skeleton card placeholders with @for. */
  get skeletonItems(): number[] {
    return Array.from({ length: this.skeletonCount }, (_, i) => i)
  }

  constructor(
    private readonly router: Router,
    private readonly events: EventService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.heading = this.config.heading ?? this.heading
      this.cards = this.config.cards ?? this.cards
      this.showToggle = this.config.showToggle ?? true
      this.isCollapsed = this.config.collapsed ?? false
      this.isLoading = this.config.isLoading ?? false
    }
    if (changes['collapsed']) {
      this.isCollapsed = this.collapsed
    }
  }

  toggle(): void {
    this.isCollapsed = !this.isCollapsed
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: 'spotlight-toggle',
        id: this.isCollapsed ? 'collapse' : 'expand',
      },
      {
        id: this.heading,
        type: 'spotlight-section',
      },
      { module: WsEvents.EnumTelemetrymodules.HOME },
    )
  }

  navigate(card: NsSpotlightCards.ISpotlightCard): void {
    if (!card.redirectionUrl) {
      return
    }
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: 'spotlight-card',
        id: card.label,
      },
      {
        id: card.redirectionUrl,
        type: 'spotlight-card',
      },
      { module: WsEvents.EnumTelemetrymodules.HOME },
    )
    if (card.externalUrl) {
      window.open(card.redirectionUrl, '_blank', 'noopener,noreferrer')
    } else {
      this.router.navigateByUrl(card.redirectionUrl)
    }
  }
}
