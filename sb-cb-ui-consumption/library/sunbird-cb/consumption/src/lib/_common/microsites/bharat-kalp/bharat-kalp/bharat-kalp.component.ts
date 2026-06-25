import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core'
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
  @Input() communityCardsTemplate: TemplateRef<any> | null = null
  @Output() communitiesLoaded = new EventEmitter<any[]>()

  providerId = '123456789'
  descriptionMaxLength = 500
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
  recommendedItems: any[] = []
  recPage = 0
  readonly recPerView = 3

  /* ── Community state ── */
  communities: any[] = []
  communitiesLoading = true

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
  }

  /* ── Recommended API ── */
  private _loadRecommended(): void {
    const cfg = this.individualSection?.recommended?.apiConfig
    if (!cfg || this.individualSection?.recommended?.enabled === false) return
    const url = cfg.url || '/apis/proxies/v8/sunbirdigot/search'
    const body = JSON.parse(JSON.stringify(cfg.requestBody || {}))
    this.http.post<any>(url, body)
      .pipe(catchError(() => of(null)))
      .subscribe(res => {
        const results = res?.result?.content || res?.result?.Course || []
        this.recommendedItems = results
      })
  }

  get visibleRecItems(): any[] {
    const start = this.recPage * this.recPerView
    return this.recommendedItems.slice(start, start + this.recPerView)
  }

  get recTotalDots(): number[] {
    const pages = Math.ceil(this.recommendedItems.length / this.recPerView) || 1
    return Array.from({ length: pages }, (_, i) => i)
  }

  get canRecPrev(): boolean { return this.recPage > 0 }
  get canRecNext(): boolean { return this.recPage < this.recTotalDots.length - 1 }

  recPrev(): void { if (this.canRecPrev) this.recPage-- }
  recNext(): void { if (this.canRecNext) this.recPage++ }
  goToRecPage(p: number): void { this.recPage = p }

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
