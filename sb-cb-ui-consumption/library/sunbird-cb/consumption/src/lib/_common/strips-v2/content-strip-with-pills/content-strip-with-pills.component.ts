import { Component, input, signal, ChangeDetectionStrategy, computed, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PillConfig, ContentConfig, ContentSectionConfig, CardType } from '../models/content-section.model'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatIconModule } from '@angular/material/icon'
import { filterVisiblePills } from '../utils/visibility.util'
import { ContentStripsComponent } from '../content-strips/content-strips.component'

const SKELETON_PILLS_COUNT = 6

@Component({
  selector: 'sb-uic-content-strip-with-pills',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule, ContentStripsComponent],
  templateUrl: './content-strip-with-pills.component.html',
  styleUrls: ['./content-strip-with-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripWithPillsComponent implements AfterViewInit {
  @ViewChild('pillsContainer') pillsContainerRef?: ElementRef<HTMLDivElement>;

  pills = input.required<PillConfig[]>();
  defaultPillKey = input<string>('');
  section = input<ContentSectionConfig>();

  activePillKey = signal<string>('');
  showContent = signal<boolean>(false);
  canScrollLeft = signal<boolean>(false);
  canScrollRight = signal<boolean>(false);

  visiblePills = computed(() => filterVisiblePills(this.pills()));

  isSectionLoading = computed(() => this.section()?.sectionLoading === true);
  skeletonPills = computed(() => new Array(SKELETON_PILLS_COUNT).fill(0).map((_, i) => i));

  // Minimal placeholder so sb-uic-content-strips can render its own card skeletons before any
  // pill (and its real contentConfig) has been resolved.
  readonly skeletonContentConfig: ContentConfig = {
    cardType: CardType.CourseCard,
    maxCardsToShow: SKELETON_PILLS_COUNT,
    cardClickDetails: { courseCategory: '' },
    viewMoreUrl: { path: '' },
    showViewAll: false,
  };

  resolvedDefaultPillKey = computed<string>(() => {
    const key = this.defaultPillKey()
    const visible = this.visiblePills()
    if (key && visible?.some(p => p?.pillKey === key)) {
      return key
    }
    return visible?.[0]?.pillKey ?? ''
  });

  activeContentConfig = computed<ContentConfig | null>(() => {
    const key = this.activePillKey() || this.resolvedDefaultPillKey()
    const pill = this.visiblePills()?.find(p => p?.pillKey === key) ?? this.visiblePills()?.[0]
    const config = pill?.contentConfig
    if (!config) {
      return null
    }
    // `showNoData` and `noDataMessage` are configured one level up, on the pill, but the
    // strip only ever receives a contentConfig — so without this a pill that resolves to
    // zero cards renders nothing at all: no cards, and no "No data found" either. Anything
    // set inside contentConfig still wins, so a config that states it there keeps working.
    return {
      ...config,
      showNoData: config.showNoData ?? pill?.showNoData,
      noDataMessage: config.noDataMessage ?? pill?.noDataMessage,
    }
  });

  constructor() {
    setTimeout(() => {
      if (!this.activePillKey()) {
        this.activePillKey.set(this.resolvedDefaultPillKey())
      }
      this.showContent.set(true)
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateScrollFade())
  }

  @HostListener('window:resize')
  updateScrollFade(): void {
    const el = this.pillsContainerRef?.nativeElement
    if (!el) {
      return
    }
    this.canScrollLeft.set(el.scrollLeft > 0)
    this.canScrollRight.set(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth)
  }

  scrollByAmount(amount: number): void {
    this.pillsContainerRef?.nativeElement.scrollBy({ left: amount, behavior: 'smooth' })
  }

  selectPill(pillKey: string): void {
    this.showContent.set(false)
    this.activePillKey.set(pillKey)
    setTimeout(() => this.showContent.set(true))
  }

  isPillActive(pillKey: string): boolean {
    const pills = this.visiblePills()
    const active = this.activePillKey() || this.resolvedDefaultPillKey()
    return (pills.find(pill => pill?.pillKey === active) ?? pills[0])?.pillKey === pillKey
  }

  getActivePill(): PillConfig | undefined {
    const active = this.activePillKey() || this.resolvedDefaultPillKey()
    return this.visiblePills()?.find(p => p?.pillKey === active)
  }
}
