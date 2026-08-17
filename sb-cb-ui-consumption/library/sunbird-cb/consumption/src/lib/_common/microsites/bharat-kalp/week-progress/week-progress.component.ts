import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core'
import { NsCardContent } from '../../../../_models/card-content.model'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable, forkJoin, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import moment from 'moment'
import { NsContent } from '@sunbird-cb/utils-v2'
import { VIEWER_ROUTE_FROM_MIME } from '../../../../_services/viewer-route-util'

export interface WeekData {
  id?: string
  name?: string
  title: string
  stripTitle?: string
  stripDesc?: string
  stripBadge?: { enabled?: boolean; text?: string; background?: string; textColor?: string }
  topics?: string[]
  course_count?: number

  content_ids?: { [contentType: string]: string[] | undefined }
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
  key: string
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
  enableTitlePill?: boolean
  endedEventPillText?: string
  startDate?: string
  endDate?: string
  currentWeek?: number
  totalWeeks: number
  viewAllUrl?: string
  containerClass?: string
  contentStrips?: WeekProgressContentStrip[]
  weeks?: {
    active?: boolean
    weekNumber?: number
    title?: string
    titleDescription?: string
    viewMoreUrl?: { path?: string }
    tabs?: WeekData[]                        /* week metadata objects */
  } | { [key: string]: WeekData }
  /* Authored labels for the content-type tabs, matched to a content_ids key by `id`.
     Text is held per language as `<lang>Text` (enText, hiText, ...) keyed by the
     websiteLanguage code. */
  exploreContent?: {
    displayContentCategories?: string[]
    tabs?: ExploreContentTab[]
  }
}

export interface ExploreContentTab {
  id: string
  [langText: string]: string               /* enText, hiText, ... */
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
  /* Stable tab objects per content-type key — same references every change detection cycle (fixes NG0956) */
  private readonly _tabCache: { [contentType: string]: WeekProgressTab } = {}
  weekContentCards: { [tab: string]: NsCardContent.ICard[] } = {}
  weekContentLoading = false
  /** Which week's content is displayed in the bottom strip */
  selectedDisplayWeek = 1

  weekCardsLoading = false
  weekCardLoading: { [week: number]: boolean } = {}
  readonly skeletonCards = [1, 2, 3, 4]

  /* Accumulated enrollment data from per-week API calls */
  private _enrolledMap: { [id: string]: { pct: number; durSec: number } } = {}
  private _weekCallsTotal = 0
  private _weekCallsDone = 0

  /** Flattened, deduped list of every id across all content_ids keys (course, program, event, resources, ...) */
  private _allContentIds(wd: WeekData | null | undefined, excludeKeys: string[] = []): string[] {
    const ids = wd?.content_ids
    if (!ids) return []
    const all: string[] = []
    Object.keys(ids).forEach(key => {
      if (excludeKeys.includes(key)) return
        ; (ids[key] || []).forEach(id => { if (id && !all.includes(id)) all.push(id) })
    })
    return all
  }

  /**
   * Stable WeekProgressTab reference for a content-type key — same object across change
   * detection cycles, so the tab list does not churn on every pass.
   *
   * Scoped per week on purpose. Caching by key alone handed the same object to every week,
   * so mat-tab-group reused the tab instance when the week changed and kept its selection
   * on it: switching from a week with only External Course to one with Courses + External
   * Course left the highlight on External Course while activeTabIndex had been reset to 0,
   * showing course cards under the external tab.
   */
  private _getTab(key: string, week: number): WeekProgressTab {
    const cacheKey = `${week}:${key}`
    if (!this._tabCache[cacheKey]) {
      this._tabCache[cacheKey] = { key, label: this._tabLabel(key), cards: [] }
    }
    return this._tabCache[cacheKey]
  }

  /**
   * Display label for a content-type tab.
   *
   * Prefers the authored exploreContent.tabs entry matched on `id`, so the label reads
   * as configured per language — "extCourses" is meant to show "External Course", not
   * the key-derived "ExtCourses". Falls back to deriving from the key so a content type
   * that has no entry yet still gets a usable tab instead of a blank one.
   */
  private _tabLabel(key: string): string {
    const configured = (this.programData?.exploreContent?.tabs || []).find(t => t?.id === key)
    if (configured) {
      const lang = localStorage.getItem('websiteLanguage') || 'en'
      const label = configured[`${lang}Text`] || configured['enText']
      if (label) return label
    }
    const capitalized = key.charAt(0).toUpperCase() + key.slice(1)
    return capitalized.endsWith('s') ? capitalized : `${capitalized}s`
  }

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
  @ViewChild('wpStrip') wpStripRef!: ElementRef<HTMLElement>
  _canCardsPrev = false
  _canCardsNext = true

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    private cdr: ChangeDetectorRef,
  ) { }

  /** Week count derived from bkConfig startDate/endDate (DD-MM-YYYY); falls back to configured totalWeeks */
  get totalWeeks(): number {
    const start = this.bkConfig?.startDate
    const end = this.bkConfig?.endDate
    if (start && end) {
      const s = moment(start, 'DD-MM-YYYY')
      const e = moment(end, 'DD-MM-YYYY')
      if (s.isValid() && e.isValid() && e.isSameOrAfter(s)) {
        return Math.ceil((e.diff(s, 'days') + 1) / 7)
      }
    }
    return this.bkConfig?.totalWeeks || this.programData?.totalWeeks || 16
  }

  ngOnInit(): void {
    this.currentWeek = this._computeCurrentWeek()
    this.selectedWeek = this.currentWeek
    this.selectedDisplayWeek = this.currentWeek
    this._loadWeekProgress()
    this._loadActiveWeekContent(this.currentWeek)
  }

  /* ── Fetch completion % per week individually + accumulate for overall stats ── */
  private _loadWeekProgress(): void {
    const userId = (this.configSvc as any)?.userProfile?.userId || ''
    if (!userId) {
      setTimeout(() => this._scrollToCurrentWeek(), 100)
      return
    }

    const enrollUrl = `/apis/proxies/v8/learner/course/v4/user/enrollment/details/${userId}`
    /* External (CIOS) courses — ids prefixed 'ext_' — carry only a completion %, no duration */
    const extEnrollUrl = (courseId: string) => `/apis/proxies/v8/cios-enroll/v1/readby/useridcourseid/${courseId}`

    /* Count how many weeks actually have IDs to call (all weeks with content) */
    this._weekCallsTotal = 0
    this._weekCallsDone = 0
    this._enrolledMap = {}

    const totalWeeks = this.totalWeeks
    for (let week = 1; week <= totalWeeks; week++) {
      const wd = this.getWeekData(week)
      /* resources aren't trackable/enrollable content — exclude from progress calculation */
      if (this._allContentIds(wd, ['resources']).length) this._weekCallsTotal++
    }

    /* Fire one independent API call per week that has content */
    for (let week = 1; week <= totalWeeks; week++) {
      const wd = this.getWeekData(week)
      if (!wd?.content_ids) continue

      const weekIds = this._allContentIds(wd, ['resources'])

      if (!weekIds.length) continue

      this.weekCardLoading[week] = true

      /* 'do_' ids -> existing internal enrollment API (unchanged); 'ext_' ids -> external
         CIOS enrollment lookup, one call per id, completion % only (no duration) */
      const doIds = weekIds.filter(id => id.startsWith('do_'))
      const extIds = weekIds.filter(id => id.startsWith('ext_'))

      const completionMap: { [id: string]: number } = {}
      weekIds.forEach(id => { completionMap[id] = 0 })

      const calls: Observable<void>[] = []

      if (doIds.length) {
        calls.push(
          this.http.post<any>(enrollUrl, { request: { courseId: doIds } })
            .pipe(
              catchError(() => of(null)),
              map(res => {
                const allEnrolled: any[] = [
                  ...(res?.result?.courses || []),
                  ...(res?.result?.programs || []),
                  ...(res?.result?.events || []),
                  ...(res?.result?.assessments || []),
                ]
                allEnrolled.forEach((c: any) => {
                  const id = c.courseId || c.identifier || c.contentId
                  /* Only count IDs that belong to this BK week — ignore unrelated enrolled content */
                  if (id && completionMap.hasOwnProperty(id)) {
                    completionMap[id] = c.completionPercentage ?? 0
                    this._enrolledMap[id] = {
                      pct: c.completionPercentage ?? 0,
                      durSec: Number(c.duration || c.content?.duration || 0),
                    }
                  }
                })
              }),
            ),
        )
      }

      extIds.forEach(id => {
        calls.push(
          this.http.get<any>(extEnrollUrl(id))
            .pipe(
              catchError(() => of(null)),
              map(res => {
                /* CIOS enrollment record for this id — only completion % is available, no duration */
                const pct = res?.result?.completionPercentage ?? res?.result?.completionpercentage
                  ?? res?.completionPercentage ?? res?.completionpercentage ?? 0
                completionMap[id] = pct
                this._enrolledMap[id] = { pct, durSec: 0 }
              }),
            ),
        )
      })

      forkJoin(calls.length ? calls : [of(null)]).subscribe(() => {
        const sum = weekIds.reduce((acc, id) => acc + (completionMap[id] ?? 0), 0)
        wd.progress = Math.round(sum / weekIds.length)

        this.weekCardLoading[week] = false
        this.cdr.detectChanges()

        /* Card widths change as skeletons swap for real cards — refresh arrow state */
        setTimeout(() => this._updateCardNav(), 100)

        if (week === this.currentWeek) setTimeout(() => this._scrollToCurrentWeek(), 100)

        /* Emit overall stats once all week calls are done */
        this._weekCallsDone++
        if (this._weekCallsDone >= this._weekCallsTotal) {
          const entries = Object.values(this._enrolledMap)
          const completedCount = entries.filter(e => e.pct >= 100).length
          const totalSeconds = entries.reduce((acc, e) => acc + (e.durSec * e.pct / 100), 0)
          this.progressStats.emit({
            completedCount,
            learningHoursFormatted: this._formatHours(totalSeconds / 3600),
          })
        }
      })
    }
  }

  /* ── Load content cards for active week strip via search API ── */
  private _loadActiveWeekContent(weekNum: number): void {
    if (!weekNum) return

    const wd = this.getWeekData(weekNum)
    if (!wd?.content_ids) return
    let idMap = wd.content_ids
    let exIdMap: any = {}
    if (wd.content_ids && wd.content_ids.extCourses) {
      exIdMap["extCourses"] = wd.content_ids.extCourses
    }
    /* Collect all unique IDs for a single API call */
    const allIds = this._allContentIds(wd, ['extCourses'])
    const hasExternal = Object.keys(exIdMap).length > 0

    /* A week can be made up purely of external courses - course/program empty with
       extCourses populated. allIds excludes extCourses, so returning outright here
       skipped loadExternalCourses entirely and the content-partner search never
       fired, leaving the strip empty. Go straight to the external call instead. */
    if (!allIds.length) {
      if (hasExternal) {
        this.weekContentLoading = true
        this.loadExternalCourses(wd, exIdMap)
      }
      return
    }

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

        /* Distribute as NsCardContent.ICard for sb-uic-card-portrait, keyed by content-type */
        Object.keys(idMap).forEach((key) => {
          const ids = idMap[key] || []
          this.weekContentCards[key] = ids
            .filter(id => byId[id])
            .map((id, pos) => ({
              content: byId[id],
              cardSubType: 'standard' as NsCardContent.TCardSubType,
              context: { pageSection: 'bharat-kalp-week-strip', position: pos },
              stateData: {},
            }))
        })

        if (hasExternal) {
          this.loadExternalCourses(wd, exIdMap)
        } else {
          this.weekContentLoading = false
          this.cdr.detectChanges()
        }

      })
  }

  loadExternalCourses(wd: any, exIdMap: any): void {
    const allIds = this._allContentIds(wd, ['course', 'program', 'event', 'resources'])
    this.http.post<any>('/apis/proxies/v8/cios/v1/search/content', {
      filterCriteriaMap: {
        "contentPartner.isActive": true,
        contentId: allIds,
      },
      requestedFields: [],
      pageNumber: 0,
      pageSize: allIds.length + 10,
      orderBy: "createdOn",
      searchString: "",
      facets: [
        "topic",
        "contentPartner.contentPartnerName",
        "competencies_v6.competencyAreaName",
        "competencies_v6.competencyThemeName",
        "competencies_v6.competencySubThemeName"
      ],
    }).pipe(catchError(() => of(null)))
      .subscribe(res => {
        const content: any[] = res?.data || []
        const byId: { [id: string]: any } = {}
        content.forEach(c => { byId[c.contentId] = c })

        /* Assigned unconditionally: on an empty or failed response this writes [] and
           clears the previous week's cards. Skipping the write when nothing came back
           left the last week's external cards on screen - only reachable now that a
           week with no internal ids goes straight here without the internal search
           pass, which used to blank these keys on its way through. */
        Object.keys(exIdMap).forEach((key) => {
          const ids = exIdMap[key] || []
          this.weekContentCards[key] = ids
            .filter((id: any) => byId[id])
            .map((id: any, pos: any) => ({
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
    if (!el) return
    if (this.currentWeek > 1) {
      const cardWidth = (el.offsetWidth - 48) / 4.1
      const pageIndex = Math.floor((this.currentWeek - 1) / 3)
      el.scrollLeft = pageIndex * 3 * (cardWidth + 16)
    }
    this._updateCardNav()
  }

  /** Arrows reflect actual overflow: both disabled when the track has nothing to scroll */
  private _updateCardNav(): void {
    const el = this.cardTrackRef?.nativeElement
    if (!el) return
    this._canCardsPrev = el.scrollLeft > 1
    this._canCardsNext = el.scrollLeft < el.scrollWidth - el.offsetWidth - 1
    this.cdr.detectChanges()
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this._updateCardNav()
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
    return Math.min(Math.floor(diffDays / 7) + 1, this.totalWeeks)
  }

  /** Program has ended when bkConfig endDate (DD-MM-YYYY) is in the past */
  /** Display label for a week — configured `name` from week data (e.g. "Week 0"), falls back to "Week N" */
  weekLabel(week: number): string {
    return this.getWeekData(week)?.name || `Week ${week}`
  }

  /** Compact stepper form of the label — "Week 0" → "W0" */
  weekLabelShort(week: number): string {
    return this.weekLabel(week).replace(/^week\s*/i, 'W')
  }

  get isProgramEnded(): boolean {
    const endDate = this.bkConfig?.endDate || this.programData?.endDate
    if (!endDate) return false
    const end = moment(endDate, 'DD-MM-YYYY')
    return end.isValid() && moment().isAfter(end, 'day')
  }

  /* Badge / ring: weeks beyond currentWeek are locked only if they have no content */
  getWeekStatus(week: number): WeekStatus {
    if (week > this.currentWeek && !this._weekHasContent(week)) return 'upcoming'
    const progress = this.getWeekData(week)?.progress ?? 0
    if (progress >= 100) return 'completed'
    if (progress > 0) return 'in-progress'
    return 'not-started'
  }

  private _weekHasContent(week: number): boolean {
    return this._allContentIds(this.getWeekData(week)).length > 0
  }

  /* Line after week W is green when W is before the current week (calendar-based) */
  isWeekCompleted(week: number): boolean {
    return week < this.currentWeek
  }

  /** Total count across all content types present in content_ids (course, program, event, resources, ...) */
  getTotalContentCount(week: number): number {
    const wd = this.getWeekData(week)
    if (!wd?.content_ids) return wd?.course_count || 0
    return this._allContentIds(wd).length
  }

  /** Check if a specific week card is still loading its progress */
  isWeekLoading(week: number): boolean {
    return !!this.weekCardLoading[week]
  }

  getWeekData(week: number): WeekData | null {
    /* Current format: weeks.tabs array with id matching week_N */
    const weekGroup = this.programData?.weeks as any
    if (weekGroup?.tabs?.length) {
      const found = weekGroup.tabs.find((t: any) => t.id === `week_${week}`)
      if (found) return found as WeekData
    }
    /* Legacy format: weeks object keyed directly by week_N */
    return weekGroup?.[`week_${week}`] || null
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
    if (s === 'completed') return '#1E8A44'
    if (s === 'in-progress') return '#F37400'
    if (s === 'not-started') return '#1B4CA1'
    return '#D0D5DD'
  }

  getRingBgColor(week: number): string {
    const s = this.getWeekStatus(week)
    if (s === 'completed') return '#E8F5E9'
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
    return Array.from({ length: this.totalWeeks }, (_, i) => i + 1)
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
    /* Current: read from the single weeks group object */
    const weekGroup = this.programData?.weeks as any
    if (weekGroup?.active) {
      return {
        active: true,
        title: weekGroup.title,
        titleDescription: weekGroup.titleDescription,
        viewMoreUrl: weekGroup.viewMoreUrl,
        tabs: [], /* unused for rendering — actual tabs come from activeTabs getter below */
      }
    }
    /* Legacy: read from contentStrips */
    return this.programData?.contentStrips?.find(s => s.active) || null
  }

  /** Heading for the content strip — from per-week stripTitle config, else default */
  get activeStripTitle(): string {
    const wd = this.getWeekData(this.selectedDisplayWeek)
    return wd?.stripTitle || `Learning Content For Week ${this.selectedDisplayWeek}`
  }

  /** Subheading for the content strip — from per-week stripDesc config, else default */
  get activeStripDesc(): string {
    const wd = this.getWeekData(this.selectedDisplayWeek)
    return wd?.stripDesc || `Content curated for Week ${this.selectedDisplayWeek}`
  }

  /** Optional badge shown next to strip title — null if disabled or not configured */
  get activeStripBadge(): WeekData['stripBadge'] | null {
    const badge = this.getWeekData(this.selectedDisplayWeek)?.stripBadge
    return badge?.enabled ? badge : null
  }

  get activeTabs(): WeekProgressTab[] {
    if ((this.programData?.weeks as any)?.active) {
      /* Tab set is derived from whichever content_ids keys have entries for the displayed week —
         new keys (added to the config tomorrow) automatically get their own tab, no code change needed */
      const ids = this.getWeekData(this.selectedDisplayWeek)?.content_ids
      if (!ids) return []
      return Object.keys(ids)
        .filter(key => (ids[key]?.length || 0) > 0)
        .map(key => this._getTab(key, this.selectedDisplayWeek))
    }
    return this.activeStrip?.tabs || []
  }

  /* Week-scoped so the mat-tab views are rebuilt when the displayed week changes. Tracking
     by key alone kept the reused tab (and mat-tab-group's selection with it) across weeks. */
  trackTab(_: number, tab: WeekProgressTab): string { return `${this.selectedDisplayWeek}:${tab.key}` }

  /* Identity of the mat-tab-group wrapper — changing week destroys and recreates the group so
     it re-reads [selectedIndex] instead of holding the previous week's internal selection. */
  trackTabGroup(_: number, week: number): number { return week }

  /** content_ids key behind the selected tab — decides which card component renders it */
  get activeTabKey(): string {
    return this.activeTabs[this.activeTabIndex]?.key || ''
  }

  /**
   * Cards under the selected tab come from the content-partner (cios) search, whose items
   * are shaped around contentId/contentPartner and carry no externalId - that field belongs
   * to the internal search. Keying the card component off the tab is what the see-all page
   * does, and it cannot drift the way a per-item field check did.
   */
  get isActiveTabExternal(): boolean {
    return this.activeTabKey === 'extCourses'
  }

  get activeTabCards(): NsCardContent.ICard[] {
    const key = this.activeTabKey
    if (key && this.weekContentCards[key]?.length) {
      return this.weekContentCards[key]
    }
    return []
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index
  }

  onCardContentDataExt(content: any): void {
    this.router.navigate(['/app/toc/ext/', content?.contentId], {})
  }

  /** Handles (contentData) emitted by sb-uic-card-portrait */
  onCardContentData(content: any): void {
    if (content?.primaryCategory === NsContent.EPrimaryCategory.RESOURCE) {
      const url = `app/amrit-gyaan-kosh/player/${VIEWER_ROUTE_FROM_MIME(content?.mimeType)}/${content?.identifier}`
      const queryParams = {
        primaryCategory: content?.primaryCategory
      }
      history.pushState(history.state, '', this.router.url)
      this.router.navigate([url], { queryParams, state: { sourceUrl: this.router.url } })
    } else {
      if (!content?.identifier) return
      const queryParams: { [k: string]: string } = {}
      if (content.batchId) queryParams['batchId'] = content.batchId
      /* ML/MLId omitted — setting MLId = identifier confuses the viewer for non-collection content */
      const sourceUrl = this.programData?.viewAllUrl?.replace('/see-all', '') || '/app/learn/bharat-kalp'
      this.router.navigate(
        ['/app/toc', content.identifier, 'overview'],
        { queryParams, state: { sourceUrl } }
      )
    }
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

  /** View button on a week card — updates the bottom strip and scrolls to it */
  viewWeek(week: number): void {
    this.selectedDisplayWeek = week
    this.activeTabIndex = 0
    this._loadActiveWeekContent(week)
    setTimeout(() => {
      const el = this.wpStripRef?.nativeElement
      if (!el) return
      /* Scroll so strip heading sits just below the sticky portal header (~72px) */
      const top = el.getBoundingClientRect().top + window.pageYOffset - 160
      window.scrollTo({ top, behavior: 'smooth' })
    }, 150)
  }

  getCardRingBg(week: number): string {
    const s = this.getWeekStatus(week)
    if (s === 'completed') return '#C8E6C9'
    if (s === 'in-progress') return '#E0E0E0'
    if (s === 'not-started') return '#E3EAF6'
    return '#EEEEEE'
  }

  viewAllWeeks(): void {
    const url = this.programData?.viewAllUrl || '/app/learn/bharat-kalp/see-all'
    this.router.navigate([url])
  }

  onViewAll(_strip: WeekProgressContentStrip): void {
    const url = this.programData?.viewAllUrl || '/app/learn/bharat-kalp/see-all'
    this.router.navigate([url])  /* no week param → see-all defaults to All Weeks */
  }
}
