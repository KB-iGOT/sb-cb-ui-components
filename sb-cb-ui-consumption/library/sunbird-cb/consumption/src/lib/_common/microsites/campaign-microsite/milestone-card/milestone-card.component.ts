import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core'
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
  imports: [TranslateModule],
})
export class MilestoneCardComponent {

  milestone = input<NsCampaignMilestone.IMilestone | null>(null)
  state = input<NsCampaignMilestone.TMilestoneState>('locked')
  isLoading = input<boolean>(false)

  milestoneClick = output<NsCampaignMilestone.IMilestone>()

  private readonly translate = inject(TranslateService)

  readonly posterFailed = signal(false)
  readonly logoFailed = signal(false)

  readonly isDisabled = computed(() => this.milestone()?.enabled === false)
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
  }

  onCardClick(): void {
    const m = this.milestone()
    if (m && !this.isInactive()) {
      this.milestoneClick.emit(m)
    }
  }

  onCtaClick(event: Event): void {
    event.stopPropagation()
    this.onCardClick()
  }
}
