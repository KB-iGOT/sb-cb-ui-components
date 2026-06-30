import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { NsCardContent } from '../../../../_models/card-content.model'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { EventService, UtilityService } from '@sunbird-cb/utils-v2'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
  selector: 'sb-uic-bharat-kalp',
  templateUrl: './bharat-kalp.component.html',
  styleUrls: ['./bharat-kalp.component.scss'],
  standalone: false,
})
export class BharatKalpComponent implements OnInit {
  @Input() sectionList: any[] = []
  @Input() configDetails: any
  @Input() bkConfiguration: any = {}
  @Input() individualSection: any = {}
  @Input() communityCardsTemplate: any = null
  @Output() communitiesLoaded = new EventEmitter<any[]>()

  providerId = '123456789'
  environment: any
  isMobile = false

  /* ── Top Carousel state ── */
  carouselIndex = 0

  private readonly _carouselHeights: { [k: string]: string } = {
    xs: '200px', sm: '250px', md: '300px', lg: '380px', xl: '450px', xxl: '50vh',
  }

  getCarouselHeight(size: string): string {
    return this._carouselHeights[size] || '300px'
  }

  carouselPrev(total: number): void {
    this.carouselIndex = (this.carouselIndex - 1 + total) % total
  }

  carouselNext(total: number): void {
    this.carouselIndex = (this.carouselIndex + 1) % total
  }

  goToCarouselSlide(index: number): void {
    this.carouselIndex = index
  }

  onCarouselClick(slide: any): void {
    if (!slide?.redirectionUrl) return
    const url: string = slide.redirectionUrl
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      this.router.navigate([url])
    }
  }

  /* ── Recommended slider state ── */
  recommendedItems: NsCardContent.ICard[] = []
  recLoading = false

  /* ── Community state ── */
  communities: any[] = []
  communitiesLoading = true

  /* ── Stats fed by week-progress (progressStats) Output — no extra API call ── */
  bkCompletedCount         = 0
  bkLearningHoursFormatted = '0m'

  /** Receives stats emitted by sb-uic-week-progress after all per-week calls finish */
  onProgressStats(stats: { completedCount: number; learningHoursFormatted: string }): void {
    this.bkCompletedCount         = stats.completedCount
    this.bkLearningHoursFormatted = stats.learningHoursFormatted
  }

  /** Merges computed stats into myprogress objectData */
  get myProgressData(): any {
    return {
      ...(this.individualSection?.myprogress?.data || {}),
      completedCoursesCount:    this.bkCompletedCount,
      bkLearningHoursFormatted: this.bkLearningHoursFormatted,
    }
  }

  constructor(
    @Inject('environment') environment: any,
    public router: Router,
    private events: EventService,
    private domSanitizer: DomSanitizer,
    public utilitySvc: UtilityService,
    private http: HttpClient,
  ) {
    this.environment = environment
    this.isMobile = this.utilitySvc.isMobile
  }

  ngOnInit(): void {
    this.getLookerProUrl()
    this._loadCommunities()
    this._loadRecommended()
    this._loadCompletedCount()
  }

  /* ── Recommended API — maps to NsCardContent.ICard for sb-uic-card-portrait ── */
  private _loadRecommended(): void {
    const cfg = this.individualSection?.recommended?.apiConfig
    if (!cfg || this.individualSection?.recommended?.enabled === false) return
    this.recLoading = true
    const url = cfg.url || '/apis/proxies/v8/sunbirdigot/search'
    const body = JSON.parse(JSON.stringify(cfg.requestBody || {}))
    this.http.post<any>(url, body)
      .pipe(catchError(() => of(null)))
      .subscribe(res => {
        const results: any[] = (res?.result?.content || res?.result?.Course || []).slice(2)
        this.recommendedItems = results.map((c: any, i: number) => ({
          content:     c,
          cardSubType: 'standard' as NsCardContent.TCardSubType,
          context:     { pageSection: 'bharat-kalp-recommended', position: i },
          stateData:   {},
        }))
        this.recLoading = false
      })
  }

  /* ── Community API — GET /community/v1/user/communities ── */
  private _loadCommunities(): void {
    const cfg = this.individualSection?.mentorship?.communityApiConfig
    const url = cfg?.url || '/apis/proxies/v8/community/v1/user/communities'
    const method = (cfg?.method || 'GET').toUpperCase()

    const request$ = method === 'GET'
      ? this.http.get<any>(url)
      : this.http.post<any>(url, cfg?.body || {})

    request$.pipe(catchError(() => of(null)))
      .subscribe((res: any) => {
        /* /community/v1/user/communities → result.communityDetails */
        this.communities =
          res?.result?.communityDetails ||
          res?.result?.communities ||
          res?.result?.search_results?.data ||
          res?.communities ||
          []
        this.communitiesLoading = false
        this.communitiesLoaded.emit(this.communities)
      })
  }

  /** Calls enrollment API with all BK content IDs, counts items with 100% completion */
  private _loadCompletedCount(): void {
    const tabs: any[] = this.individualSection?.weekProgress?.Weeks?.[0]?.tabs || []
    const allIds: string[] = []
    tabs.forEach((tab: any) => {
      const ids = tab?.content_ids
      if (!ids) return
      ;(['course', 'program', 'event', 'assessment'] as const).forEach(type => {
        if (ids[type]?.length) allIds.push(...ids[type])
      })
    })
    const uniqueIds = [...new Set(allIds)]
    if (!uniqueIds.length) return

    const userId = this.configDetails?.userId || this.configDetails?.userProfile?.userId
    if (!userId) return

    const url = `/apis/proxies/v8/learner/course/v4/user/enrollment/details/${userId}`
    this.http.post<any>(url, { request: { courseId: uniqueIds } })
      .pipe(catchError(() => of(null)))
      .subscribe((res: any) => {
        /* Merge all content types: course, program, event, assessment */
        const result = res?.result || {}
        const allEnrolled: any[] = [
          ...(result.courses     || []),
          ...(result.programs    || []),
          ...(result.events      || []),
          ...(result.assessments || []),
        ]

        /* Completed count across all content types */
        this.bkCompletedCount = allEnrolled.filter(
          (c: any) => (c.completionPercentage ?? 0) >= 100
        ).length

        /* Learning hours = Σ (duration_in_seconds × completionPercentage / 100) / 3600 */
        let totalSeconds = 0
        allEnrolled.forEach((c: any) => {
          const durationSec = Number(c.duration || c.content?.duration || 0)
          const pct         = Number(c.completionPercentage ?? 0)
          if (durationSec > 0 && pct > 0) {
            totalSeconds += (durationSec * pct) / 100
          }
        })
        this.bkLearningHoursFormatted = this._formatHours(totalSeconds / 3600)
      })
  }

  private _formatHours(hours: number): string {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    if (h > 0 && m > 0) return `${h}h ${m}m`
    if (h > 0) return `${h}h`
    if (m > 0) return `${m}m`
    return '0m'
  }

  hideKeyHighlight(event: any, sectionData: any) {
    if (event) {
      sectionData['hideSection'] = true
    }
  }

  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData.contentStrip['hideSection'] = true
    }
  }

  showAllContent(_stripData: any, columnData: any) {
    if (columnData && columnData.contentStrip && columnData.contentStrip.strips && columnData.contentStrip.strips.length) {
      const stripData: any = _stripData
      const tabSelected = stripData.viewMoreUrl && stripData.viewMoreUrl.queryParams && stripData.viewMoreUrl.queryParams.tabSelected || ''
      this.router.navigate(
        ['app/learn/kalp/bharat-kalp/see-all'],
        { queryParams: { pageDetails: true, tabSelected, key: columnData.sectionKey } },
      )
    } else {
      this.router.navigate(
        ['/app/learn/browse-by/provider'],
        { queryParams: { pageDetails: true } },
      )
    }
  }

  navigateToContent(card: any) {
    if (card?.identifier) {
      this.router.navigate(['/app/toc', card.identifier, 'overview'])
    }
  }

  /** Handles (contentData) from sb-uic-card-portrait — navigates to TOC */
  onCardNavigate(content: any): void {
    if (!content?.identifier) return
    const queryParams: { [k: string]: string } = {}
    if (content.batchId) queryParams['batchId'] = content.batchId
    if (content.language?.length) {
      queryParams['ML']   = content.language[0].toLowerCase()
      queryParams['MLId'] = content.identifier
    }
    /* Pass source so portal can restore back-navigation context */
    this.router.navigate(
      ['/app/toc', content.identifier, 'overview'],
      { queryParams, state: { sourceUrl: '/app/learn/bharat-kalp' } }
    )
  }

  raiseTabClick(event: any) {
    this.events.raiseInteractTelemetry(
      { type: 'click', subType: 'mdo-leaderboard', id: `${event}-tab` },
      {},
      { module: 'Bharat Kalp' },
    )
  }

  raiseTelemetryInteractEvent(event: any) {
    let subType = 'content-strips'
    let id = 'content-strip-card'
    if (event.typeOfTelemetry === 'learningContent') {
      subType = 'explore-learning-content'
      id = 'explore-learning-content-card'
    }
    this.events.raiseInteractTelemetry(
      { type: 'click', subType, id },
      { id: event.identifier, type: event.primaryCategory },
      { pageIdExt: id, module: 'Bharat Kalp' },
    )
  }

  raiseCtaClick(label: string) {
    this.events.raiseInteractTelemetry(
      { type: 'click', subType: 'bharat-kalp-cta', id: label },
      {},
      { module: 'Bharat Kalp' },
    )
  }

  getLookerProUrl() {
    this.sectionList.forEach((section: any) => {
      if (section?.column?.length) {
        section.column.forEach((col: any) => {
          if (col.key === 'lookerSection' && col.data) {
            col.data.sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.isMobile ? col.data.lookerProMobileUrl : col.data.lookerProDesktopUrl,
            )
          }
        })
      }
    })
  }
}
