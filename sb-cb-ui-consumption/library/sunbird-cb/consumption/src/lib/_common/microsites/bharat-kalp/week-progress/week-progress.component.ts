import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { NsCardContent } from '../../../../_models/card-content.model'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import moment from 'moment'

export interface WeekData {
  id?: string
  title: string
  topics?: string[]
  course_count?: number
  content_ids?: {
    course?: string[]
    program?: string[]
    event?: string[]
    assessment?: string[]
  }
  progress?: number
}

export interface WeekProgressCard {
  name: string
  identifier?: string
  posterImage?: string
  duration?: string
  category?: string
  org?: string
  orgLogo?: string
  rating?: string
}

export interface WeekProgressTab {
  label: string
  cards?: WeekProgressCard[]
}

export interface WeekProgressContentStrip {
  active?: boolean
  title?: string
  titleDescription?: string
  viewMoreUrl?: { path?: string }
  tabs?: WeekProgressTab[]
}

export interface WeekProgressData {
  enabled: boolean
  startDate?: string
  endDate?: string
  currentWeek?: number
  totalWeeks: number
  viewAllUrl?: string
  containerClass?: string
  contentStrips?: WeekProgressContentStrip[]
  weeks?: { [key: string]: WeekData }       /* legacy object format */
  Weeks?: Array<{                            /* new array format */
    active?: boolean
    weekNumber?: number
    title?: string
    titleDescription?: string
    viewMoreUrl?: { path?: string }
    tabs?: WeekData[]                        /* week metadata objects */
  }>
}

type WeekStatus = 'completed' | 'in-progress' | 'not-started' | 'upcoming'

@Component({
  selector: 'sb-uic-week-progress',
  templateUrl: './week-progress.component.html',
  styleUrls: ['./week-progress.component.scss'],
  standalone: false,
})
export class WeekProgressComponent implements OnInit, AfterViewInit {
  @Input() programData!: WeekProgressData
  @Input() bkConfig?: { startDate?: string; endDate?: string;[key: string]: any }

  /** Emits computed stats once all per-week enrollment calls complete */
  @Output() progressStats = new EventEmitter<{ completedCount: number; learningHoursFormatted: string }>()

  currentWeek = 1
  selectedWeek = 1
  activeTabIndex = 0
  showAllWeeksPopup = false

  /* ── Dynamic week content strip ── */
  readonly STRIP_TABS = ['Courses', 'Programs', 'Events', 'Assessment']
  /* Stable tab objects — same references every change detection cycle (fixes NG0956) */
  private readonly _stableTabs: WeekProgressTab[] = this.STRIP_TABS.map(label => ({ label, cards: [] }))
  weekContentCards: { [tab: string]: NsCardContent.ICard[] } = {}
  weekContentLoading = false

  weekCardsLoading = false
  weekCardLoading: { [week: number]: boolean } = {}
  readonly skeletonCards = [1, 2, 3, 4]

  /* Accumulated enrollment data from per-week API calls */
  private _enrolledMap: { [id: string]: { pct: number; durSec: number } } = {}
  private _weekCallsTotal  = 0
  private _weekCallsDone   = 0

  private _formatHours(totalHours: number): string {
    if (!totalHours || isNaN(totalHours)) return '0m'
    const h = Math.floor(totalHours)
    const m = Math.round((totalHours - h) * 60)
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}hr`
    return `${h}hr ${m}m`
  }

  /* ── Week card slider ── */
  @ViewChild('cardTrack') cardTrackRef!: ElementRef<HTMLElement>
  _canCardsPrev = false
  _canCardsNext = true

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.currentWeek = this._computeCurrentWeek()
    this.selectedWeek = this.currentWeek
    this._loadWeekProgress()
    this._loadActiveWeekContent()
  }

  /* ── Fetch completion % per week individually + accumulate for overall stats ── */
  private _loadWeekProgress(): void {
    const userId = (this.configSvc as any)?.userProfile?.userId || ''
    if (!userId) {
      setTimeout(() => this._scrollToCurrentWeek(), 100)
      return
    }

    const enrollUrl = `/apis/proxies/v8/learner/course/v4/user/enrollment/details/${userId}`

    /* Count how many weeks actually have IDs to call */
    this._weekCallsTotal = 0
    this._weekCallsDone  = 0
    this._enrolledMap    = {}

    for (let week = 1; week <= this.currentWeek; week++) {
      const wd = this.getWeekData(week)
      const ids = [
        ...(wd?.content_ids?.course      || []),
        ...(wd?.content_ids?.program     || []),
        ...(wd?.content_ids?.event       || []),
        ...(wd?.content_ids?.assessment  || []),
      ].filter(id => !!id)
      if (ids.length) this._weekCallsTotal++
    }

    /* Fire one independent API call per started week */
    for (let week = 1; week <= this.currentWeek; week++) {
      const wd = this.getWeekData(week)
      if (!wd?.content_ids) continue

      const weekIds = [
        ...(wd.content_ids.course     || []),
        ...(wd.content_ids.program    || []),
        ...(wd.content_ids.event      || []),
        ...(wd.content_ids.assessment || []),
      ].filter(id => !!id)

      if (!weekIds.length) continue

      this.weekCardLoading[week] = true

      this.http.post<any>(enrollUrl, { request: { courseId: weekIds } })
        .pipe(catchError(() => of(null)))
        .subscribe(res => {
          const completionMap: { [id: string]: number } = {}
          weekIds.forEach(id => { completionMap[id] = 0 })

          const courses: any[] = res?.result?.courses || []
          courses.forEach((c: any) => {
            const id = c.courseId || c.identifier || c.contentId
            if (id) {
              if (completionMap.hasOwnProperty(id)) completionMap[id] = c.completionPercentage ?? 0
              /* Accumulate for overall stats */
              this._enrolledMap[id] = {
                pct:    c.completionPercentage ?? 0,
                durSec: Number(c.duration || c.content?.duration || 0),
              }
            }
          })

          const sum = weekIds.reduce((acc, id) => acc + (completionMap[id] ?? 0), 0)
          wd.progress = Math.round(sum / weekIds.length)

          this.weekCardLoading[week] = false
          this.cdr.detectChanges()

          if (week === this.currentWeek) setTimeout(() => this._scrollToCurrentWeek(), 100)

          /* Emit overall stats once all week calls are done */
          this._weekCallsDone++
          if (this._weekCallsDone >= this._weekCallsTotal) {
            const entries = Object.values(this._enrolledMap)
            const completedCount = entries.filter(e => e.pct >= 100).length
            const totalSeconds   = entries.reduce((acc, e) => acc + (e.durSec * e.pct / 100), 0)
            this.progressStats.emit({
              completedCount,
              learningHoursFormatted: this._formatHours(totalSeconds / 3600),
            })
          }
        })
    }
  }

  /* ── Load content cards for active week strip via search API ── */
  private _loadActiveWeekContent(): void {
    /* Use currentWeek (computed from bkConfig dates) for live content — always matches current week */
    const weekNum = this.currentWeek
    if (!weekNum) return

    const wd = this.getWeekData(weekNum)
    if (!wd?.content_ids) return

    const idMap: { [tab: string]: string[] } = {
      Courses: wd.content_ids.course || [],
      Programs: wd.content_ids.program || [],
      Events: wd.content_ids.event || [],
      Assessment: wd.content_ids.assessment || [],
    }

    /* Collect all unique IDs for a single API call */
    const allIds: string[] = []
    Object.values(idMap).forEach(ids => {
      ids.forEach(id => { if (id && !allIds.includes(id)) allIds.push(id) })
    })
    if (!allIds.length) return

    this.weekContentLoading = true

    this.http.post<any>('/apis/proxies/v8/sunbirdigot/search', {
      locale: ['en'],
      request: {
        filters: {
          identifier: allIds,          /* search by exact IDs — no status filter needed */
        },
        limit: allIds.length + 10,
      },
    }).pipe(catchError(() => of(null)))
      .subscribe(res => {
        const content: any[] = res?.result?.content || []

        /* Build a lookup by identifier for quick mapping */
        const byId: { [id: string]: any } = {}
        content.forEach(c => { byId[c.identifier] = c })

        /* Distribute as NsCardContent.ICard for sb-uic-card-portrait */
        this.STRIP_TABS.forEach((tab) => {
          const ids = idMap[tab] || []
          this.weekContentCards[tab] = ids
            .filter(id => byId[id])
            .map((id, pos) => ({
              content: byId[id],
              cardSubType: 'standard' as NsCardContent.TCardSubType,
              context: { pageSection: 'bharat-kalp-week-strip', position: pos },
              stateData: {},
            }))
        })

        this.weekContentLoading = false
        this.cdr.detectChanges()
      })
  }

  ngAfterViewInit(): void {
    /* Note: _scrollToCurrentWeek is called after weekCardsLoading=false
       so the #cardTrack element exists in the DOM at that point */
  }

  private _scrollToCurrentWeek(): void {
    const el = this.cardTrackRef?.nativeElement
    if (!el || this.currentWeek <= 1) return
    const cardWidth = (el.offsetWidth - 48) / 4.1
    const pageIndex = Math.floor((this.currentWeek - 1) / 3)
    const scrollPos = pageIndex * 3 * (cardWidth + 16)
    el.scrollLeft = scrollPos
    this._canCardsPrev = scrollPos > 1
    this._canCardsNext = el.scrollLeft < el.scrollWidth - el.offsetWidth - 1
  }

  /* ── Date-based current week computation ── */
  private _computeCurrentWeek(): number {
    const startDate = this.bkConfig?.startDate || this.programData?.startDate
    if (!startDate) return this.programData?.currentWeek || 1
    /* Parse DD-MM-YYYY format from bkConfig */
    const start = moment(startDate, 'DD-MM-YYYY').toDate()
    const now = new Date()
    if (now < start) return 1
    const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
    return Math.min(Math.floor(diffDays / 7) + 1, this.programData.totalWeeks)
  }

  /* Badge / ring: progress-based — 100% = completed, else in-progress, future = upcoming */
  getWeekStatus(week: number): WeekStatus {
    if (week > this.currentWeek) return 'upcoming'
    const progress = this.getWeekData(week)?.progress ?? 0
    if (progress >= 100) return 'completed'
    if (progress > 0)   return 'in-progress'
    return 'not-started'
  }

  /* Line after week W is green when W is before the current week (calendar-based) */
  isWeekCompleted(week: number): boolean {
    return week < this.currentWeek
  }

  /** Total count across all content types (course + program + event + assessment) */
  getTotalContentCount(week: number): number {
    const wd = this.getWeekData(week)
    if (!wd?.content_ids) return wd?.course_count || 0
    return (
      (wd.content_ids.course?.length || 0) +
      (wd.content_ids.program?.length || 0) +
      (wd.content_ids.event?.length || 0) +
      (wd.content_ids.assessment?.length || 0)
    )
  }

  /** Check if a specific week card is still loading its progress */
  isWeekLoading(week: number): boolean {
    return !!this.weekCardLoading[week]
  }

  getWeekData(week: number): WeekData | null {
    /* New format: Weeks[0].tabs array with id matching week_N */
    const weeksArray = this.programData?.Weeks
    if (weeksArray?.length) {
      for (const strip of weeksArray) {
        const found = (strip.tabs || []).find((t: any) => t.id === `week_${week}`)
        if (found) return found as WeekData
      }
    }
    /* Legacy format: weeks object keyed by week_N */
    return this.programData?.weeks?.[`week_${week}`] || null
  }

  getWeekDateRange(weekNum: number): string {
    const startDate = this.bkConfig?.startDate || this.programData?.startDate
    if (!startDate) return ''
    const start = moment(startDate, 'DD-MM-YYYY').toDate()
    const ws = new Date(start.getTime() + (weekNum - 1) * 7 * 86_400_000)
    const we = new Date(ws.getTime() + 6 * 86_400_000)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(ws)} – ${fmt(we)}`
  }

  getRingDash(progress = 0): string {
    const p = Math.min(100, Math.max(0, progress))
    return `${p} ${100 - p}`
  }

  getRingColor(week: number): string {
    const s = this.getWeekStatus(week)
    if (s === 'completed')   return '#1E8A44'
    if (s === 'in-progress') return '#F37400'
    if (s === 'not-started') return '#1B4CA1'
    return '#D0D5DD'
  }

  getRingBgColor(week: number): string {
    const s = this.getWeekStatus(week)
    if (s === 'completed')   return '#E8F5E9'
    if (s === 'in-progress') return '#1B4CA1'
    return '#E2E8F0'
  }

  /* ── Selected week data ── */
  get selectedWeekData(): WeekData | null {
    return this.getWeekData(this.selectedWeek)
  }

  get selectedWeekStatus(): WeekStatus {
    return this.getWeekStatus(this.selectedWeek)
  }

  get allWeeks(): number[] {
    return Array.from({ length: this.programData.totalWeeks }, (_, i) => i + 1)
  }

  /* ── Interactions ── */
  onWeekClick(week: number): void {
    if (week > this.currentWeek) {
      this.snackBar.open('This week has not started yet', 'Dismiss', {
        duration: 3000,
        panelClass: ['wp-snack'],
      })
      return
    }
    this.selectedWeek = week
  }

  openPopup(): void { this.showAllWeeksPopup = true }
  closePopup(): void { this.showAllWeeksPopup = false }

  closeOnOverlay(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('wp-popup-overlay')) {
      this.showAllWeeksPopup = false
    }
  }

  exploreWeekContent(): void {
    const data = this.selectedWeekData
    const firstId = data?.content_ids?.course?.[0]
    if (firstId) {
      this.router.navigate(['/app/toc', firstId, 'overview'])
    } else {
      this.snackBar.open('No content available for this week yet', 'Ok', { duration: 3000 })
    }
  }

  /* ── Content strips / slider ── */
  get activeStrip(): WeekProgressContentStrip | null {
    /* New: read from Weeks array */
    const fromWeeks = (this.programData?.Weeks || []).find((w: any) => w.active) as any
    if (fromWeeks) {
      return {
        active: true,
        title: fromWeeks.title,
        titleDescription: fromWeeks.titleDescription,
        viewMoreUrl: fromWeeks.viewMoreUrl,
        tabs: this.STRIP_TABS.map(label => ({ label, cards: [] })),
      }
    }
    /* Legacy: read from contentStrips */
    return this.programData?.contentStrips?.find(s => s.active) || null
  }

  get activeTabs(): WeekProgressTab[] {
    if ((this.programData?.Weeks || []).some((w: any) => w.active)) {
      return this._stableTabs   /* stable references — no new objects per cycle */
    }
    return this.activeStrip?.tabs || []
  }

  trackTab(_: number, tab: WeekProgressTab): string { return tab.label }

  get activeTabCards(): NsCardContent.ICard[] {
    const label = this.STRIP_TABS[this.activeTabIndex]
    if (label && this.weekContentCards[label]?.length) {
      return this.weekContentCards[label]
    }
    return []
  }

  onTabChange(index: number): void { this.activeTabIndex = index }

  /** Handles (contentData) emitted by sb-uic-card-portrait */
  onCardContentData(content: any): void {
    if (!content?.identifier) return
    const queryParams: { [k: string]: string } = {}
    if (content.batchId) queryParams['batchId'] = content.batchId
    if (content.language?.length) {
      queryParams['ML'] = content.language[0].toLowerCase()
      queryParams['MLId'] = content.identifier
    }
    /* Pass source URL so the portal can restore back-navigation context */
    const sourceUrl = this.programData?.viewAllUrl?.replace('/see-all', '') || '/app/learn/bharat-kalp'
    this.router.navigate(
      ['/app/toc', content.identifier, 'overview'],
      { queryParams, state: { sourceUrl } }
    )
  }

  /* ── Week card slider (scroll-based) ── */
  get canCardsPrev(): boolean { return this._canCardsPrev }
  get canCardsNext(): boolean { return this._canCardsNext }

  private _cardScrollAmount(): number {
    const el = this.cardTrackRef?.nativeElement
    if (!el) return 0
    const cardWidth = (el.offsetWidth - 48) / 4.1  // matches SCSS divisor
    return 3 * (cardWidth + 16)
  }

  cardsPrev(): void {
    this.cardTrackRef?.nativeElement?.scrollBy({ left: -this._cardScrollAmount(), behavior: 'smooth' })
  }

  cardsNext(): void {
    this.cardTrackRef?.nativeElement?.scrollBy({ left: this._cardScrollAmount(), behavior: 'smooth' })
  }

  onTrackScroll(event: Event): void {
    const el = event.target as HTMLElement
    this._canCardsPrev = el.scrollLeft > 1
    this._canCardsNext = el.scrollLeft < el.scrollWidth - el.offsetWidth - 1
  }

  viewWeek(week: number): void {
    /* Navigate to see-all page filtered for this specific week */
    const seeAllUrl = this.programData?.viewAllUrl || '/app/learn/bharat-kalp/see-all'
    this.router.navigate([seeAllUrl], { queryParams: { week } })
  }

  getCardRingBg(week: number): string {
    const s = this.getWeekStatus(week)
    if (s === 'completed')   return '#C8E6C9'
    if (s === 'in-progress') return '#E0E0E0'
    if (s === 'not-started') return '#E3EAF6'
    return '#EEEEEE'
  }

  onViewAll(_strip: WeekProgressContentStrip): void {
    const url = this.programData?.viewAllUrl || '/app/learn/bharat-kalp/see-all'
    this.router.navigate([url])  /* no week param → see-all defaults to All Weeks */
  }
}
