import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import dayjs from 'dayjs'
import { NsCampaignMilestone } from '../campaign-microsite.model'
import { isUsableUrl, parseDdMmYyyy } from '../campaign-microsite.utils'

type TStatusTone = 'error' | 'warning' | 'success' | 'muted'

const LABELS = {
  availableNow: 'campaignMicrosite.milestoneCard.availableNow',
  locked: 'campaignMicrosite.milestoneCard.locked',
  due: 'campaignMicrosite.milestoneCard.due',
  overdue: 'campaignMicrosite.milestoneCard.overdue',
  inProgress: 'campaignMicrosite.milestoneCard.inProgress',
  completed: 'campaignMicrosite.milestoneCard.completed',
  resume: 'campaignMicrosite.milestoneCard.resume',
  view: 'campaignMicrosite.milestoneCard.view',
  start: {
    assessment: 'campaignMicrosite.milestoneCard.startAssessment',
    event: 'campaignMicrosite.milestoneCard.startEvent',
    survey: 'campaignMicrosite.milestoneCard.startSurvey',
  } as Record<NsCampaignMilestone.TMilestoneType, string>,
}

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

  readonly labels = LABELS
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

  /** `label` is a translation key, `params` its interpolation values */
  readonly status = computed<{ label: string, params?: Record<string, string>, tone: TStatusTone } | null>(() => {
    if (this.isDisabled()) {
      return { label: this.labels.locked, tone: 'muted' }
    }
    if (this.isOverdue()) {
      return { label: this.labels.overdue, tone: 'error' }
    }
    switch (this.state()) {
      case 'locked':
        return { label: this.labels.locked, tone: 'error' }
      case 'inProgress':
        return { label: this.labels.inProgress, tone: 'warning' }
      case 'completed':
        return { label: this.labels.completed, tone: 'success' }
      default: {
        const dueDate = parseDdMmYyyy(this.milestone()?.dueDate)
        return dueDate
          ? { label: this.labels.due, params: { date: dayjs(dueDate).format('D MMM') }, tone: 'warning' }
          : null
      }
    }
  })

  /** Translation key; a disabled card keeps a greyed-out, non-clickable "Locked" button */
  readonly ctaLabel = computed<string | null>(() => {
    const m = this.milestone()
    if (this.isDisabled()) {
      return this.labels.locked
    }
    switch (this.state()) {
      case 'notStarted':
        return (m && this.labels.start[m.type]) || null
      case 'inProgress':
        return this.labels.resume
      case 'completed':
        return this.labels.view
      default:
        return null
    }
  })

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
