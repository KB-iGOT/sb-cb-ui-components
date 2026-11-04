import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { of } from 'rxjs'
import { NsCampaignMilestone } from '../campaign-microsite.model'
import { MilestoneCardComponent } from './milestone-card.component'

const baseMilestone: NsCampaignMilestone.IMilestone = {
  order: 1,
  type: 'assessment',
  identifier: 'do_pre',
  batchId: 'b1',
  milestoneLabel: 'Milestone 1',
  headline: 'Know where you stand',
  bigNumber: '01',
  theme: 'blue',
  posterImage: '',
  durationLabel: '30 mins',
  categoryLabel: 'Assessment',
  name: 'Pre-Assessment: Baseline Leadership Check',
  tags: ['20 questions', 'MCQ', 'Online'],
  provider: { name: 'Karmayogi Bharat', logo: '<KARMAYOGI_BHARAT_LOGO_URL>' },
  dueDate: '14-11-2026',
  redirectUrl: '',
}

/** Same text as the portal's assets/i18n/en.json */
const EN = {
  campaignMicrosite: {
    milestoneCard: {
      availableNow: 'Available now',
      locked: 'Locked',
      due: 'Due {{date}}',
      overdue: 'Overdue',
      inProgress: 'In progress',
      completed: 'Completed',
      resume: 'Resume',
      view: 'View',
      startAssessment: 'Start assessment',
      startEvent: 'Register',
      startSurvey: 'Take pledge',
    },
  },
}

/** Everything but Date stays real, so only "today" is faked */
const FAKE_DATE_ONLY: Parameters<typeof jest.useFakeTimers>[0] = {
  doNotFake: [
    'nextTick', 'setImmediate', 'clearImmediate', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'queueMicrotask',
    'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback', 'hrtime', 'performance',
  ],
}

describe('MilestoneCardComponent', () => {
  afterEach(() => jest.useRealTimers())

  let fixture: ComponentFixture<MilestoneCardComponent>
  let component: MilestoneCardComponent
  let el: HTMLElement

  function render(state: NsCampaignMilestone.TMilestoneState, overrides: Partial<NsCampaignMilestone.IMilestone> = {}) {
    fixture.componentRef.setInput('milestone', { ...baseMilestone, ...overrides })
    fixture.componentRef.setInput('state', state)
    fixture.detectChanges()
  }
  const text = (selector: string) => el.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim()
  const card = () => el.querySelector('.mc-card') as HTMLElement

  beforeEach(() => {
    // Fixed "today" before the 14 Nov due date
    jest.useFakeTimers(FAKE_DATE_ONLY)
    jest.setSystemTime(new Date(2026, 10, 1))
    TestBed.configureTestingModule({
      imports: [
        MilestoneCardComponent,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(EN) } } }),
      ],
    })
    TestBed.inject(TranslateService).use('en')
    fixture = TestBed.createComponent(MilestoneCardComponent)
    component = fixture.componentInstance
    el = fixture.nativeElement
  })

  describe('loading', () => {
    it('renders the skeleton and no content', () => {
      fixture.componentRef.setInput('isLoading', true)
      fixture.componentRef.setInput('milestone', baseMilestone)
      fixture.detectChanges()
      expect(el.querySelector('.mc-card--skeleton')).toBeTruthy()
      expect(el.querySelector('.mc-card__title')).toBeNull()
    })

    it('renders nothing without a milestone', () => {
      fixture.detectChanges()
      expect(card()).toBeNull()
    })
  })

  describe('states', () => {
    it('notStarted: available now, due date, start CTA, focusable', () => {
      render('notStarted')
      expect(text('.mc-card__available')).toBe('Available now')
      expect(text('.mc-card__status')).toBe('Due 14 Nov')
      expect(el.querySelector('.mc-card__status--warning')).toBeTruthy()
      expect(text('.mc-card__cta')).toBe('Start assessment')
      expect(card().getAttribute('tabindex')).toBe('0')
    })

    it('notStarted on the due date is still "Due", not overdue', () => {
      jest.setSystemTime(new Date(2026, 10, 14, 23, 59))
      render('notStarted')
      expect(text('.mc-card__status')).toBe('Due 14 Nov')
    })

    it.each(['notStarted', 'inProgress'])('%s past the due date: red "Overdue", CTA unchanged', state => {
      jest.setSystemTime(new Date(2026, 10, 15))
      render(state as NsCampaignMilestone.TMilestoneState)
      expect(text('.mc-card__status')).toBe('Overdue')
      expect(el.querySelector('.mc-card__status--error')).toBeTruthy()
      expect(el.querySelector('.mc-card__cta')).toBeTruthy()
    })

    it.each(['completed', 'locked'])('%s past the due date is not overdue', state => {
      jest.setSystemTime(new Date(2026, 10, 15))
      render(state as NsCampaignMilestone.TMilestoneState)
      expect(text('.mc-card__status')).not.toBe('Overdue')
    })

    it('notStarted without dueDate shows no footer status', () => {
      render('notStarted', { dueDate: '' })
      expect(el.querySelector('.mc-card__status')).toBeNull()
    })

    it('inProgress: resume CTA, no "available now"', () => {
      render('inProgress')
      expect(text('.mc-card__status')).toBe('In progress')
      expect(text('.mc-card__cta')).toBe('Resume')
      expect(el.querySelector('.mc-card__available')).toBeNull()
    })

    it('completed: view CTA, green status', () => {
      render('completed')
      expect(text('.mc-card__status')).toBe('Completed')
      expect(el.querySelector('.mc-card__status--success')).toBeTruthy()
      expect(text('.mc-card__cta')).toBe('View')
    })

    it('locked: red status, no CTA, aria-disabled, not focusable', () => {
      render('locked')
      expect(text('.mc-card__status')).toBe('Locked')
      expect(el.querySelector('.mc-card__status--error')).toBeTruthy()
      expect(el.querySelector('.mc-card__cta')).toBeNull()
      expect(card().getAttribute('aria-disabled')).toBe('true')
      expect(card().hasAttribute('tabindex')).toBe(false)
    })

    it.each(['notStarted', 'inProgress', 'completed'])('enabled: false greys out a %s card with a disabled "Locked" CTA', state => {
      jest.setSystemTime(new Date(2026, 10, 15))
      render(state as NsCampaignMilestone.TMilestoneState, { enabled: false })
      expect(card().classList).toContain('mc-card--disabled')
      expect(text('.mc-card__status')).toBe('Locked')
      expect(el.querySelector('.mc-card__status--muted')).toBeTruthy()
      expect(el.querySelector('.mc-card__available')).toBeNull()
      expect(text('.mc-card__cta')).toBe('Locked')
      expect(el.querySelector<HTMLButtonElement>('.mc-card__cta')?.disabled).toBe(true)
      expect(card().getAttribute('aria-disabled')).toBe('true')
      expect(card().hasAttribute('tabindex')).toBe(false)
    })

    it('enabled defaults to true', () => {
      render('notStarted', { enabled: undefined })
      expect(card().classList).not.toContain('mc-card--disabled')
    })

    it.each([
      ['assessment', 'Start assessment'],
      ['event', 'Register'],
      ['survey', 'Take pledge'],
    ])('%s start label is "%s"', (type, label) => {
      render('notStarted', { type: type as NsCampaignMilestone.TMilestoneType })
      expect(text('.mc-card__cta')).toBe(label)
    })
  })

  describe('interaction', () => {
    let emitted: NsCampaignMilestone.IMilestone[]

    beforeEach(() => {
      emitted = []
      component.milestoneClick.subscribe(m => emitted.push(m))
    })

    it('emits from card click, Enter and Space when unlocked', () => {
      render('notStarted')
      card().click()
      card().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      card().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
      expect(emitted.length).toBe(3)
      expect(emitted[0].identifier).toBe('do_pre')
    })

    it('CTA click emits exactly once', () => {
      render('notStarted')
      el.querySelector<HTMLElement>('.mc-card__cta')?.click()
      expect(emitted.length).toBe(1)
    })

    it('does not emit when locked', () => {
      render('locked')
      card().click()
      card().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      expect(emitted.length).toBe(0)
    })

    it('does not emit when disabled, even with an open state', () => {
      render('notStarted', { enabled: false })
      card().click()
      card().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      el.querySelector<HTMLElement>('.mc-card__cta')?.click()
      expect(emitted.length).toBe(0)
    })
  })

  describe('header', () => {
    it('gradient theme shows headline, big number and pills', () => {
      render('notStarted', { theme: 'purple' })
      expect(el.querySelector('.mc-card__header--purple')).toBeTruthy()
      expect(text('.mc-card__headline')).toBe('Know where you stand')
      expect(text('.mc-card__big-number')).toBe('01')
      expect(text('.mc-card__pill--label')).toBe('Milestone 1')
      expect(text('.mc-card__pill--duration')).toBe('30 mins')
    })

    it('image theme shows the poster', () => {
      render('locked', { theme: 'image', posterImage: 'https://host/poster.jpg', headline: '' })
      expect(el.querySelector('.mc-card__header--image')).toBeTruthy()
      expect(el.querySelector('.mc-card__poster')?.getAttribute('src')).toBe('https://host/poster.jpg')
    })

    it('image theme falls back to gradient for a placeholder poster', () => {
      render('locked', { theme: 'image', posterImage: '<NATIONAL_WORKSHOP_POSTER_URL>' })
      expect(el.querySelector('.mc-card__poster')).toBeNull()
      expect(el.querySelector('.mc-card__header--blue')).toBeTruthy()
    })

    it('image theme falls back to gradient when the poster fails to load', () => {
      render('locked', { theme: 'image', posterImage: 'https://host/broken.jpg' })
      el.querySelector('.mc-card__poster')?.dispatchEvent(new Event('error'))
      fixture.detectChanges()
      expect(el.querySelector('.mc-card__poster')).toBeNull()
      expect(el.querySelector('.mc-card__header--blue')).toBeTruthy()
    })
  })

  describe('body and footer', () => {
    it('renders category, title and tags', () => {
      render('notStarted')
      expect(text('.mc-card__category')).toBe('Assessment')
      expect(text('.mc-card__title')).toBe('Pre-Assessment: Baseline Leadership Check')
      expect(Array.from(el.querySelectorAll('.mc-card__tag')).map(t => t.textContent)).toEqual(['20 questions', 'MCQ', 'Online'])
    })

    it('hides a placeholder provider logo but keeps the name', () => {
      render('notStarted')
      expect(el.querySelector('.mc-card__provider-logo')).toBeNull()
      expect(text('.mc-card__provider-name')).toBe('Karmayogi Bharat')
    })

    it('shows a real provider logo', () => {
      render('notStarted', { provider: { name: 'NITI Aayog', logo: 'https://host/logo.png' } })
      expect(el.querySelector('.mc-card__provider-logo')?.getAttribute('src')).toBe('https://host/logo.png')
    })
  })
})
