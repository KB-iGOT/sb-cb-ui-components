import { Component, Input, Output, EventEmitter, signal, computed, effect, HostListener, Signal, ChangeDetectionStrategy, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SidebarConfig, SidebarCardType, SidebarStateChange, SidebarSection, InfoCardItem, StatCardItem, NavListItem } from '../../models/sidebar.models'
import { SIDEBAR_ANIMATION, BREAKPOINT_QUERIES } from '../../constants/sidebar.constants'
import { MultilingualTranslationsService } from '../../../../_services/multilingual-translations.service'
import { SidebarNavListSectionComponent } from '../sidebar-nav-list-section/sidebar-nav-list-section.component'
import { SidebarStatCardsSectionComponent } from '../sidebar-stat-cards-section/sidebar-stat-cards-section.component'
import { SidebarInfoCardsSectionComponent } from '../sidebar-info-cards-section/sidebar-info-cards-section.component'
import { SidebarFooterComponent } from '../sidebar-footer/sidebar-footer.component'

/**
 * Dynamic Sidebar Component
 *
 * A reusable, configurable sidebar component that dynamically renders
 * different section types based on configuration input.
 *
 * Features:
 * - Collapsible/expandable with smooth animations
 * - Dynamic section rendering based on cardType
 * - Responsive mobile support
 * - Signal-based state management
 * - Material Design integration
 *
 * @example
 * <sb-uic-dynamic-sidebar [menuBarDetails]="sidebarConfig" />
 */
@Component({
  selector: 'sb-uic-dynamic-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    SidebarNavListSectionComponent,
    SidebarStatCardsSectionComponent,
    SidebarInfoCardsSectionComponent,
    SidebarFooterComponent
  ],
  templateUrl: './dynamic-sidebar.component.html',
  styleUrls: ['./dynamic-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sidebarAnimation', [
      state('open', style({
        width: '328px'
      })),
      state('closed', style({
        width: '72px'
      })),
      transition('open <=> closed', [
        animate(`${SIDEBAR_ANIMATION.DURATION} ${SIDEBAR_ANIMATION.EASING}`)
      ])
    ])
  ]
})
export class DynamicSidebarComponent implements OnDestroy, OnChanges {
  /**
   * Sidebar configuration input
   */
  @Input({ required: true }) menuBarDetails!: SidebarConfig
  @Input({ required: true }) detailsChanged!: boolean
  @Input({ required: true }) otherDetailsChanged!: boolean
  @Input() navBarOpenStatus: boolean = true

  /**
   * Event emitted when sidebar state changes (open/closed)
   * Emits object with isOpen status and current width
   */
  @Output() sidebarStateChange = new EventEmitter<SidebarStateChange>();
  @Output() navItemClicked = new EventEmitter<{ code: string; subType: string }>();

  isOpen = signal<boolean>(true);// Signal to track sidebar open/close state

  // Signal to control content visibility with delayed hiding
  // Shows immediately when opening, hides with 300ms delay when closing
  showContent = signal<boolean>(true);
  private hideContentTimer?: ReturnType<typeof setTimeout> // Timer reference for delayed content hiding
  readonly SidebarCardType = SidebarCardType; // Expose SidebarCardType enum to template
  navSections: SidebarSection[] = [];
  footerSections: any[] = [];

  // Responsive breakpoint signals, kept in sync with viewport resize via BreakpointObserver
  private breakpointMatches!: Signal<BreakpointState | undefined>
  isMobile = computed(() => !!this.breakpointMatches()?.breakpoints[BREAKPOINT_QUERIES.MOBILE])
  isTablet = computed(() => !!this.breakpointMatches()?.breakpoints[BREAKPOINT_QUERIES.TABLET])
  isDesktop = computed(() => this.breakpointMatches() === undefined ? true : !!this.breakpointMatches()!.breakpoints[BREAKPOINT_QUERIES.DESKTOP])
  // Tablet and mobile both render the sidebar as a fixed overlay drawer instead of pushing content
  isOverlayMode = computed(() => this.isTablet() || this.isMobile())
  private previousMode: 'mobile' | 'tablet' | 'desktop' | null = null

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointMatches = toSignal(
      this.breakpointObserver.observe([BREAKPOINT_QUERIES.MOBILE, BREAKPOINT_QUERIES.TABLET, BREAKPOINT_QUERIES.DESKTOP]),
      { initialValue: undefined }
    )

    // Tablet should start (and re-enter) fully collapsed since it is an overlay drawer;
    // desktop restores the last known open/closed state when returning from tablet/mobile
    effect(() => {
      const mode: 'mobile' | 'tablet' | 'desktop' = this.isMobile() ? 'mobile' : this.isTablet() ? 'tablet' : 'desktop'

      if (mode !== this.previousMode) {
        if (mode === 'tablet') {
          this.isOpen.set(false)
        } else if (mode === 'desktop') {
          this.isOpen.set(this.navBarOpenStatus)
        }
        this.previousMode = mode
      }
    }, { allowSignalWrites: true })

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

    // Set initial state based on config when component initializes
    // effect(() => {
    //   if (this.menuBarDetails?.defaultOpen !== undefined) {
    //     this.isOpen.set(this.menuBarDetails.defaultOpen)
    //   }
    // }, { allowSignalWrites: true })

    // Handle delayed content visibility
    effect(() => {
      const isOpenState = this.isOpen()

      // Clear any existing timer
      if (this.hideContentTimer) {
        clearTimeout(this.hideContentTimer)
        this.hideContentTimer = undefined
      }

      if (isOpenState) {
        // Show content immediately when opening
        this.showContent.set(true)
      } else {
        // Hide content with 300ms delay when closing
        this.hideContentTimer = setTimeout(() => {
          this.showContent.set(false)
        }, 50)
      }
    }, { allowSignalWrites: true })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Manually detect changes when detailsChanged flag is toggled
    if (changes['detailsChanged'] && !changes['detailsChanged'].firstChange) {
      this.cdr.markForCheck()
    }

    if ((changes['menuBarDetails'] && changes['menuBarDetails'].currentValue) || ((changes['detailsChanged'] || changes['otherDetailsChanged']) && this.menuBarDetails)) {
      this.navSections = []

      this.menuBarDetails.navSections.forEach((section: SidebarSection) => {
        if (section.enabled !== false) {

          if (section.items) {
            const filteredItems = section.items?.filter(item => item.enabled !== false) || null
            section.items = filteredItems as
              NavListItem[] |
              StatCardItem[] |
              InfoCardItem[] |
              null
          }
          this.navSections.push(section)
        }
        return false
      })
      if (this.menuBarDetails.footerSections) {
        this.footerSections = this.menuBarDetails.footerSections.filter(section => section.enabled !== false)
      }
    }

    if ((changes['navBarOpenStatus'])) {
      this.isOpen.set(this.navBarOpenStatus)
    }
  }

  /**
   * Emit sidebar state change event
   */
  private emitStateChange(): void {
    const isOpenState = this.isOpen()
    this.sidebarStateChange.emit({
      isOpen: isOpenState,
    })
  }

  /**
   * Toggle sidebar open/close state
   */
  toggleSidebar(): void {
    this.isOpen.update(state => !state)
    // Emit state change only when user clicks toggle button
    this.emitStateChange()
  }

  /**
   * ESC closes the sidebar when it is rendered as an overlay drawer (tablet/mobile)
   */
  @HostListener('document:keydown.escape')
  onEscapeKeydown(): void {
    if (this.isOverlayMode() && this.isOpen()) {
      this.isOpen.set(false)
      this.emitStateChange()
    }
  }

  /**
   * Track by function for navSections to optimize rendering
   */
  trackByCardType(index: number, section: any): string {
    return `${section.cardType}-${index}`
  }

  onNavItemClicked(evnet: { code: string; subType: string }) {
    this.navItemClicked.emit(evnet)
  }

  /**
   * Navigate to the configured navUrl when the sidebar logo is clicked
   */
  onLogoClick(): void {
    if (this.menuBarDetails?.navUrl) {
      this.router.navigate([this.menuBarDetails.navUrl])
    }
  }

  /**
   * Translate a label using MultilingualTranslationsService
   */
  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  /**
   * Clean up timer on component destroy
   */
  ngOnDestroy(): void {
    if (this.hideContentTimer) {
      clearTimeout(this.hideContentTimer)
    }
  }
}
