import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { NsContent } from '../../../_models/widget-content.model'
import { ContentLanguageService } from '../../../_services/content-language.service'
import { CommonMethodsService } from '../../../_services/common-methods.service'
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service'

@Component({
  selector: 'sb-uic-card-course',
  templateUrl: './card-course.component.html',
  styleUrls: ['./card-course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CardCourseComponent implements OnInit, AfterViewInit {

  /** Full content object from the Sunbird search / course-list API. */
  @Input() content!: NsContent.IContent

  /** Optional: CBP plan map keyed by content identifier. */
  @Input() cbPlanMapData: Record<string, any> = {}

  /**
   * Set by the parent strip/context (e.g. forYou + microSearch pill).
   * Mirrors how card-portrait receives it from content-strip-with-tabs-pills-new.
   * content.additionalTags must also include 'iGOT Specialization'.
   */
  @Input() isiGOTSpecialization = false

  /** Show card in loading / skeleton state. */
  @Input() isLoading = false

  /** Whether the content is live (not deleted / expired). */
  @Input() isLiveOrMarkForDeletion = true

  /** Emits the content object when the card is clicked (for navigation / telemetry). */
  @Output() contentData = new EventEmitter<NsContent.IContent>()

  @ViewChild('titleEl') titleElRef?: ElementRef<HTMLElement>
  @ViewChild('orgEl') orgElRef?: ElementRef<HTMLElement>

  isTitleTruncated = false
  isOrgTruncated = false

  defaultThumbnail = ''
  defaultSLogo = ''
  languageCount = 0
  caCourseUnitIds: any = []

  constructor(
    private readonly router: Router,
    private readonly configSvc: ConfigurationsService,
    private readonly events: EventService,
    private readonly cdr: ChangeDetectorRef,
    private readonly contentLangSvc: ContentLanguageService,
    private readonly commonSvc: CommonMethodsService,
    private readonly translate: TranslateService,
    private readonly langtranslations: MultilingualTranslationsService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
        this.cdr.markForCheck()
      }
    })
  }

  ngOnInit(): void {
    const cfg = this.configSvc.instanceConfig
    if (cfg) {
      this.defaultThumbnail = cfg.logos.defaultContent || ''
      this.defaultSLogo = cfg.logos.defaultSourceLogo || ''
    } else {
      this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
      this.defaultSLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }

    this.caCourseUnitIds = JSON.parse(this.commonSvc.getCourseUnitIds() || '[]')

    if (this.content) {
      const langs = this.contentLangSvc.getAllContentLanguages(this.content)
      this.languageCount = langs.length
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const t = this.titleElRef?.nativeElement
      const o = this.orgElRef?.nativeElement

      if (t) {
        // -webkit-line-clamp collapses scrollHeight to the visible (clamped) height,
        // so scrollHeight > clientHeight is always false with the clamp active.
        //
        // Fix: record the clamped clientHeight, then temporarily remove the clamp
        // (via inline style overrides) so scrollHeight reflects the full text height,
        // compare the two, and immediately restore the original styles — all
        // synchronous so no visual flash occurs in any browser.
        const clampedHeight = t.clientHeight

        if (clampedHeight > 0) {
          // Override the component stylesheet's -webkit-line-clamp and display values
          t.style.setProperty('-webkit-line-clamp', 'none')
          t.style.display = 'block'

          const naturalHeight = t.scrollHeight   // full unwrapped height

          // Clear inline overrides → browser falls back to stylesheet values
          t.style.removeProperty('-webkit-line-clamp')
          t.style.display = ''

          this.isTitleTruncated = naturalHeight > clampedHeight
        } else {
          // Element not laid out yet (e.g. inside an off-screen slider panel)
          this.isTitleTruncated = false
        }
      }

      this.isOrgTruncated = !!o && o.scrollWidth > o.clientWidth
      this.cdr.markForCheck()
    })
  }

  get thumbnailUrl(): string {
    return this.content?.posterImage || this.content?.appIcon || this.defaultThumbnail
  }

  get displayType(): string {
    return this.content?.courseCategory || this.content?.primaryCategory || 'Course'
  }

  get orgName(): string {
    const orgs = this.content?.organisation
    if (orgs && orgs.length) { return orgs[0] }
    return this.content?.sourceName || 'Karmayogi Bharat'
  }

  /** 'Most popular' tag only — not merged with mostEnrolled/mostTrending */
  get isPopular(): boolean {
    return (this.content?.additionalTags || []).includes('Most popular')
  }

  /** Most Enrolled badge — separate tag, checked independently */
  get isMostEnrolled(): boolean {
    return (this.content?.additionalTags || []).includes('mostEnrolled')
  }

  /** Trending badge — separate tag, checked independently */
  get isMostTrending(): boolean {
    return (this.content?.additionalTags || []).includes('mostTrending')
  }

  /**
   * iGOT Specialization badge:
   * Parent flag (strip context) AND content.additionalTags must both be true.
   * Matches card-portrait: isiGOTSpecialization && additionalTags.includes('iGOT Specialization')
   */
  get isIgotSpecialization(): boolean {
    return this.isiGOTSpecialization && (this.content?.additionalTags || []).includes('iGOT Specialization')
  }

  get isApar(): boolean {
    return !!this.content?.isApar
  }

  get isCa(): boolean {
    return this.caCourseUnitIds.includes(this.content?.identifier) || !!(this.content as any)?.isCA
  }

  get hasChips(): boolean {
    return this.isApar || this.isCa || !!this.content?.difficultyLevel
  }

  get cbpStatus(): string | null {
    if (!this.content?.identifier) { return null }
    const plan = this.cbPlanMapData?.[this.content.identifier]
    if (!plan) { return null }
    if (plan.contentStatus < 2) { return 'Overdue' }
    if (plan.contentStatus === 2) { return 'Completed' }
    return null
  }

  get durationSeconds(): number {
    return this.content?.programDuration ? 0 : (this.content?.duration || 0)
  }

  get programDurationDays(): number {
    return this.content?.programDuration || 0
  }

  onCardClick(): void {
    if (!this.isLiveOrMarkForDeletion) { return }
    this.raiseTelemetry()
    this.contentData.emit(this.content)
    this.navigate()
  }

  private raiseTelemetry(): void {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: 'course-card',
        id: 'card-content',
      },
      {
        id: this.content?.identifier,
        type: this.content?.primaryCategory,
      },
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      },
    )
  }

  private navigate(): void {
    const id = this.content?.identifier
    if (!id) { return }

    // External content (partner-hosted)
    if (id.startsWith('ext_')) {
      this.router.navigateByUrl(`/app/toc/ext/${id}`)
      return
    }

    // Event / Offline Session → event-hub
    const category = this.content?.primaryCategory || ''
    if (category === 'Offline Session') {
      this.router.navigate([`/app/event-hub/home/${id}`])
      return
    }

    // Course, Program, Blended Program, Curated Program,
    // Standalone Assessment, and all other do_ identifiers → TOC
    this.router.navigate(['/app/toc', id, 'overview'])
  }
}
