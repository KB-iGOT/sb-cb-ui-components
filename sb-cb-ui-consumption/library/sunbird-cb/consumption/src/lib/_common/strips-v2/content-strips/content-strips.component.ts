import { Component, computed, effect, input, inject, signal, ChangeDetectionStrategy, DestroyRef, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import { forkJoin, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ContentConfig, CardType } from '../models/content-section.model'
import { CardViewModel, PlanCardViewModel } from '../models/card.model'
import { ContentApiService } from '../services/content-api.service'
import { CardTransformerService } from '../services/card-transformer.service'
import { CarouselComponent } from '../../carousel/carousel.component'
import { CardCourseV2Component, CardPlanV2Component, ContentDictionaryService } from '../../../../public-api'
import { CbpPlanCacheService } from '../../../_services/cbp-plan-cache.service'
import { Router } from '@angular/router'

/**
 * The plan listing's `planType` key for each plan strip, by the strip's own API key.
 *
 * Covers both plan sources: the CBPlan V4 dictionary trio (aparApi / trainingPlanApi /
 * draftCBPplanApi) and the V2 plan-search trio (*PlanListApi). A key that is absent here
 * is not a plan strip, and its View All is left exactly as configured.
 */
const PLAN_TYPE_BY_API_KEY: Record<string, string> = {
  aparApi: 'apar',
  aparPlanListApi: 'apar',
  trainingPlanApi: 'cbp',
  trainingPlanListApi: 'cbp',
  draftCBPplanApi: 'aicbp',
  draftCBPplanListApi: 'aicbp',
}

@Component({
  selector: 'sb-uic-content-strips',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    CardCourseV2Component,
    CardPlanV2Component],
  templateUrl: './content-strips.component.html',
  styleUrl: './content-strips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripsComponent implements OnInit {
  contentConfig = input.required<ContentConfig>();
  sectionKey = input<string>('');
  // When true, skips fetching and stays on the skeleton state — used for the pills section's
  // upfront skeleton before a pill (and its real contentConfig) has actually been selected.
  forceLoading = input<boolean>(false);

  // Expose CardType enum so the template can use it in @switch
  CardType = CardType;
  // A signal, not a plain field: this component is OnPush and the plan map arrives
  // asynchronously from the IndexedDB cache, so a plain assignment would leave the
  // card binding stale until some unrelated event marked this view dirty.
  cbPlanMapData = signal<Record<string, any>>({})

  private apiService = inject(ContentApiService);
  private cardTransformer = inject(CardTransformerService);
  private dictionarySvc = inject(ContentDictionaryService);
  private cbpCacheSvc = inject(CbpPlanCacheService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  cards = signal<(CardViewModel | PlanCardViewModel)[]>([]);
  skeletonArray = signal<number[]>([]);
  loading = signal<boolean>(true);

  /**
   * The financial year the plans on screen actually belong to, read off the cards rather
   * than asked of the config or recomputed from today's date.
   *
   * Both plan sources stamp it on — UserCbpPlansService from the year slice the V4 response
   * came back under, the V2 plan search from the plan itself — and it is the only place the
   * answer is reliable: CBPlan falls back to an earlier year when the user has no plans for
   * the year that was requested (ask for 2026-27, receive 2025-26). Scanning for the first
   * card that carries one keeps a card mapped without it from blanking the year.
   */
  private readonly loadedPlanYear = computed<string>(() => {
    const dated = this.cards().find(card => !!(card as PlanCardViewModel).planYear)
    return (dated as PlanCardViewModel | undefined)?.planYear ?? ''
  });

  // Dummy cards for carousel testing
  dummyCards = signal([
    { id: 1, title: 'High-Speed Rail Development: Context and...', image: 'https://picsum.photos/seed/1/400/240', rating: 4.3, provider: 'Indian Cybercrime...', duration: '1h 14m', level: 'Beginner', tags: ['APAR', 'CA'], badge: 'Most popular', overdue: true },
    { id: 2, title: 'Stay Safe in Cyber Space', image: 'https://picsum.photos/seed/2/400/240', rating: 4.3, provider: 'Indian Cybercrime...', duration: '1h 14m', level: 'Beginner', tags: ['APAR', 'CA'], badge: 'Most popular', overdue: true },
    { id: 3, title: 'Digital Forensics Fundamentals', image: 'https://picsum.photos/seed/3/400/240', rating: 4.1, provider: 'Karmayogi Bharat', duration: '55m 30s', level: 'Intermediate', tags: ['APAR'], badge: '', overdue: false },
    { id: 4, title: 'Cyber Law and Ethics', image: 'https://picsum.photos/seed/4/400/240', rating: 3.9, provider: 'Karmayogi Bharat', duration: '28m 38s', level: 'Beginner', tags: ['CA'], badge: '', overdue: true },
    { id: 5, title: 'CRS ADV - Community Services', image: 'https://picsum.photos/seed/5/400/240', rating: 5, provider: 'Karmayogi Bharat', duration: '45m', level: 'Advanced', tags: ['APAR'], badge: '', overdue: true },
    { id: 6, title: 'Healthcare Representative - C467950', image: 'https://picsum.photos/seed/6/400/240', rating: 4.5, provider: 'Karmayogi Bharat', duration: '55m 54s', level: 'Beginner', tags: ['APAR'], badge: '', overdue: true },
    { id: 7, title: 'Technology Technician - C822364', image: 'https://picsum.photos/seed/7/400/240', rating: 4.0, provider: 'Karmayogi Bharat', duration: '1h 14m', level: 'Intermediate', tags: ['CA'], badge: '', overdue: false },
    { id: 8, title: 'Data Privacy and Security', image: 'https://picsum.photos/seed/8/400/240', rating: 4.2, provider: 'Indian Cybercrime...', duration: '38m', level: 'Beginner', tags: ['APAR', 'CA'], badge: 'Most popular', overdue: false },
    { id: 9, title: 'Cloud Computing Basics', image: 'https://picsum.photos/seed/9/400/240', rating: 4.4, provider: 'Karmayogi Bharat', duration: '1h 02m', level: 'Beginner', tags: ['CA'], badge: '', overdue: false },
    { id: 10, title: 'AI and Machine Learning Overview', image: 'https://picsum.photos/seed/10/400/240', rating: 4.7, provider: 'Karmayogi Bharat', duration: '1h 30m', level: 'Intermediate', tags: ['APAR'], badge: 'Most popular', overdue: false },
    { id: 11, title: 'Project Management Essentials', image: 'https://picsum.photos/seed/11/400/240', rating: 3.8, provider: 'Karmayogi Bharat', duration: '42m', level: 'Beginner', tags: ['CA'], badge: '', overdue: true },
    { id: 12, title: 'Leadership and Governance', image: 'https://picsum.photos/seed/12/400/240', rating: 4.6, provider: 'Karmayogi Bharat', duration: '58m', level: 'Advanced', tags: ['APAR', 'CA'], badge: '', overdue: false },
  ]);

  constructor() {
    // Keyed on the input, not run once on init: the pills section swaps `contentConfig` in
    // place when the active pill changes, and it only gets away with re-creating this
    // component because it toggles an @if off and on again around it in two separate
    // change-detection passes. Whenever that re-create does not happen — the host reuses the
    // instance, or the two signal writes land in one pass — an init-only fetch leaves the
    // previous pill's cards on screen, or none at all. Following the input removes the
    // dependency on that timing entirely.
    effect(() => {
      const config = this.contentConfig()
      this.initializeSkeletons(config)
      if (this.forceLoading()) {
        this.loading.set(true)
        return
      }
      this.fetchContent(config)
    })
  }

  ngOnInit(): void {
    this.getCbPlanData()
  }

  initializeSkeletons(config: ContentConfig | undefined = this.contentConfig()): void {
    const max = config?.maxCardsToShow ?? 4
    this.skeletonArray.set(new Array(max).fill(0).map((_, i) => i))
  }

  async fetchContent(config: ContentConfig | undefined = this.contentConfig()): Promise<void> {
    if (config?.contentIds?.length) {
      this.loadFromDictionary(config)
      return
    }
    if (!config?.apiDetailsKey) {
      // Cleared, not left as-is: this runs on a config swap too, and keeping the previous
      // pill's cards under a pill that has no source is worse than an empty strip.
      this.cards.set([])
      this.loading.set(false)
      return
    }

    this.loading.set(true);
    (await this.apiService.loadContent(config.apiDetailsKey))
      .subscribe({
        next: (response) => {
          const transformed = this.cardTransformer.transformCards(response, config.cardType, config.apiDetailsKey)
          const limited = transformed.slice(0, config.maxCardsToShow ?? 4)
          this.cards.set(limited)
          this.loading.set(false)
          if (!limited.length && this.sectionKey()) {
            this.apiService.reportEmptySection(this.sectionKey())
          }
        },
        error: () => {
          this.cards.set([])
          this.loading.set(false)
          if (this.sectionKey()) {
            this.apiService.reportEmptySection(this.sectionKey())
          }
        }
      })
  }

  private loadFromDictionary(config: ContentConfig): void {
    this.loading.set(true)
    const ids = (config.contentIds ?? []).filter(Boolean)
    if (!ids.length) {
      this.cards.set([])
      this.loading.set(false)
      if (this.sectionKey()) {
        this.apiService.reportEmptySection(this.sectionKey())
      }
      return
    }
    forkJoin(ids.map(id => this.dictionarySvc.getContent(id)))
      .pipe(catchError(() => of([])))
      .subscribe({
        next: (contents) => {
          const enriched = (contents ?? []).filter(Boolean)
          const transformed = this.cardTransformer.transformCards(enriched, config.cardType)
          const limited = transformed.slice(0, config.maxCardsToShow ?? 4)
          this.cards.set(limited)
          this.loading.set(false)
          if (!limited.length && this.sectionKey()) {
            this.apiService.reportEmptySection(this.sectionKey())
          }
        },
      })
  }

  /**
   * CBP plan data comes from the IndexedDB cache (iGotAppDB/cbpPlans), not
   * localStorage['cbpData']. watchPlanMap() emits the cached map immediately and again
   * whenever the plan cache for the year is rewritten.
   */
  getCbPlanData() {
    this.cbpCacheSvc.watchPlanMap()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((planMap: Record<string, any>) => this.cbPlanMapData.set(planMap))
  }

  getViewAllUrl(): { path: string, queryParams?: Record<string, any>, f?: any } | null {
    const config = this.contentConfig()
    const viewMoreUrl = config?.viewMoreUrl ?? null
    if (!viewMoreUrl) {
      return null
    }

    const planType = PLAN_TYPE_BY_API_KEY[config?.apiDetailsKey ?? '']
    if (!planType) {
      return viewMoreUrl
    }

    // A plan strip's View All opens the plan listing (/app/plans) on the pill the user is
    // looking at, and the listing takes both of those off the URL.
    //
    // `planType` is derived from the strip's own API key rather than trusted from the
    // config. The two have to agree — a pill fetching CBP plans and linking to planType=apar
    // lands the user on somebody else's list — and the API key is the half that also decides
    // which plans the strip shows, so it is the half that cannot be wrong.
    //
    // `planYear` is the year the plans on screen ARE, not the year that was asked for; see
    // loadedPlanYear. It is omitted when no card carries one, which leaves the listing on
    // its own default rather than sending it an empty param to fall back from.
    const planYear = this.loadedPlanYear()
    return {
      ...viewMoreUrl,
      queryParams: {
        ...(viewMoreUrl.queryParams ?? {}),
        planType,
        ...(planYear ? { planYear } : {}),
      },
    }
  }

  redirectViewAll(path: string, queryParamsData: any, filters?: any) {
    let queryParams = queryParamsData
    if (filters) {
      queryParams = {
        f: JSON.stringify(filters),
        queryParamsData
      }
    }
    this.navigateToRoute(path, queryParams)
  }

  private navigateToRoute(path: string, queryParamsData: any): void {
    this.router.navigate([path], { queryParams: queryParamsData })
  }

  shouldShowViewAll(): boolean {
    return (this.contentConfig()?.showViewAll) ?? false
  }

  getCardType(): CardType {
    return this.contentConfig()?.cardType ?? CardType.CourseCard
  }
}
