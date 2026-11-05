import {
  ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, inject, input, output, signal, viewChild,
} from '@angular/core'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import dayjs from 'dayjs'
import { NsCampaignMilestone } from '../campaign-microsite.model'
import { isUsableUrl, parseDdMmYyyy } from '../campaign-microsite.utils'

type TStatusTone = 'error' | 'warning' | 'success' | 'muted'

type TStatusKind = 'locked' | 'overdue' | 'inProgress' | 'completed' | 'due'
type TCta = 'locked' | 'start' | 'resume' | 'view'

@Component({
  selector: 'sb-uic-milestone-card',
  templateUrl: './milestone-card.component.html',
  styleUrls: ['./milestone-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateModule, MatMenuModule],
})
export class MilestoneCardComponent {

  milestone = input<NsCampaignMilestone.IMilestone | null>(null)
  state = input<NsCampaignMilestone.TMilestoneState>('locked')
  isLoading = input<boolean>(false)
  /** `true` while the host is acting on a click (e.g. enrolling); disables the CTA to block repeat clicks */
  isBusy = input<boolean>(false)
  /** Host-provided button text; replaces the default label whenever the card shows a button (e.g. event phases) */
  ctaLabel = input<string | null>(null)
  /** `true` shows the button but blocks clicks (e.g. "Event yet to start") */
  ctaDisabled = input<boolean>(false)
  /**
   * Host-provided text (e.g. "Available from 17th Nov") shown next to the category chip in place of
   * "Available now". Informational only: the button and clicks stay as usual. Ignored once completed.
   */
  availableFrom = input<string | null>(null)

  milestoneClick = output<NsCampaignMilestone.IMilestone>()

  private readonly translate = inject(TranslateService)

  /** Visible tag row and an invisible copy of every tag (plus a "+N" sample) used to measure widths */
  private readonly tagRow = viewChild<ElementRef<HTMLElement>>('tagRow')
  private readonly tagMeasure = viewChild<ElementRef<HTMLElement>>('tagMeasure')
  /** Tags that fit on one row; `null` until measured (shows all) */
  private readonly visibleTagCount = signal<number | null>(null)
  private readonly tags = computed(() => this.milestone()?.tags || [])
  readonly visibleTags = computed(() => {
    const count = this.visibleTagCount()
    return count === null ? this.tags() : this.tags().slice(0, count)
  })
  /** Tags behind the "+N" chip, listed in its popover */
  readonly hiddenTags = computed(() => this.tags().slice(this.visibleTags().length))

  readonly posterFailed = signal(false)
  readonly logoFailed = signal(false)

  readonly isDisabled = computed(() => this.milestone()?.enabled === false)
  /** Waiting for a host-provided date (see `availableFrom`) */
  readonly isWaiting = computed(() => !!this.availableFrom() && !this.isDisabled() && this.state() !== 'completed')
  readonly isInactive = computed(() => this.isDisabled() || this.state() === 'locked')

  readonly showPoster = computed(() => {
    const m = this.milestone()
    return m?.theme === 'image' && isUsableUrl(m.posterImage) && !this.posterFailed()
  })

  readonly headerTheme = computed<NsCampaignMilestone.TMilestoneTheme>(() => {
    const theme = this.milestone()?.theme || 'blue'
    if (theme === 'image') {
      return this.showPoster() ? 'image' : 'blue'
    }
    return theme
  })

  /** Open (enabled, not locked, not completed) and the due date is before today */
  readonly isOverdue = computed(() => {
    const dueDate = parseDdMmYyyy(this.milestone()?.dueDate)
    const open = this.state() === 'notStarted' || this.state() === 'inProgress'
    return open && !this.isDisabled() && !!dueDate && dayjs().isAfter(dueDate, 'day')
  })

  readonly showProviderLogo = computed(() => isUsableUrl(this.milestone()?.provider?.logo) && !this.logoFailed())

  /** The template maps `kind` to its translation key */
  readonly status = computed<{ kind: TStatusKind, tone: TStatusTone, date?: string } | null>(() => {
    if (this.isDisabled()) {
      return { kind: 'locked', tone: 'muted' }
    }
    if (this.isOverdue()) {
      return { kind: 'overdue', tone: 'error' }
    }
    switch (this.state()) {
      case 'locked':
        return { kind: 'locked', tone: 'error' }
      case 'inProgress':
        return { kind: 'inProgress', tone: 'warning' }
      case 'completed':
        return { kind: 'completed', tone: 'success' }
      default: {
        const dueDate = parseDdMmYyyy(this.milestone()?.dueDate)
        return dueDate ? { kind: 'due', date: dayjs(dueDate).format('D MMM'), tone: 'warning' } : null
      }
    }
  })

  /** A disabled card keeps a greyed-out, non-clickable "Locked" button */
  readonly cta = computed<TCta | null>(() => {
    if (this.isDisabled()) {
      return 'locked'
    }
    switch (this.state()) {
      case 'notStarted':
        return this.milestone() ? 'start' : null
      case 'inProgress':
        return 'resume'
      case 'completed':
        return 'view'
      default:
        return null
    }
  })

  constructor() {
    if (!this.translate.currentLang) {
      this.translate.setDefaultLang('en')
      this.translate.use(localStorage.getItem('websiteLanguage') || 'en')
    }
    // Re-measure after the tags render and whenever the row is resized (card width follows the grid)
    afterRenderEffect(onCleanup => {
      this.tags()
      const row = this.tagRow()?.nativeElement
      if (!row) {
        return
      }
      this.measureTags()
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => this.measureTags())
        observer.observe(row)
        onCleanup(() => observer.disconnect())
      }
    })
  }

  /** Largest number of tags that fits on one row, leaving room for the "+N" chip when some are left out */
  private measureTags(): void {
    const row = this.tagRow()?.nativeElement
    const measure = this.tagMeasure()?.nativeElement
    const available = row?.clientWidth || 0
    if (!row || !measure || !available) {
      return
    }
    const items = Array.from(measure.children) as HTMLElement[]
    const moreWidth = items.pop()?.offsetWidth || 0
    const widths = items.map(item => item.offsetWidth)
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0
    const widthOf = (count: number) => widths.slice(0, count).reduce((sum, width) => sum + width, 0)
      + gap * Math.max(count - 1, 0)
      + (count < widths.length ? gap + moreWidth : 0)
    let count = widths.length
    while (count > 0 && widthOf(count) > available) {
      count -= 1
    }
    if (count !== this.visibleTagCount()) {
      this.visibleTagCount.set(count)
    }
  }

  onCardClick(): void {
    const m = this.milestone()
    if (m && !this.isInactive() && !this.isBusy() && !this.ctaDisabled()) {
      this.milestoneClick.emit(m)
    }
  }

  onCtaClick(event: Event): void {
    event.stopPropagation()
    this.onCardClick()
  }
}
