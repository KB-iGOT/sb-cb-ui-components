import { Component, Input, Output, EventEmitter, signal, effect, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SidebarConfig, SidebarCardType, SidebarStateChange } from '../../models/sidebar.models'
import { SIDEBAR_ANIMATION } from '../../constants/sidebar.constants'
import { MultilingualTranslationsService } from '../../../../_services/multilingual-translations.service'
import { SidebarNavListSectionComponent } from '../sidebar-nav-list-section/sidebar-nav-list-section.component'
import { SidebarStatCardsSectionComponent } from '../sidebar-stat-cards-section/sidebar-stat-cards-section.component'
import { SidebarInfoCardsSectionComponent } from '../sidebar-info-cards-section/sidebar-info-cards-section.component'

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
 * <app-dynamic-sidebar [menuBarDetails]="sidebarConfig" />
 */
@Component({
  selector: 'app-dynamic-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    SidebarNavListSectionComponent,
    SidebarStatCardsSectionComponent,
    SidebarInfoCardsSectionComponent
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
export class DynamicSidebarComponent implements OnDestroy {
  /**
   * Sidebar configuration input
   */
  @Input({ required: true }) menuBarDetails!: SidebarConfig

  /**
   * Event emitted when sidebar state changes (open/closed)
   * Emits object with isOpen status and current width
   */
  @Output() sidebarStateChange = new EventEmitter<SidebarStateChange>();
  @Output() navItemClicked = new EventEmitter<string>();

  /**
   * Signal to track sidebar open/close state
   */
  isOpen = signal<boolean>(true);

  /**
   * Signal to control content visibility with delayed hiding
   * Shows immediately when opening, hides with 300ms delay when closing
   */
  showContent = signal<boolean>(true);

  /**
   * Timer reference for delayed content hiding
   */
  private hideContentTimer?: ReturnType<typeof setTimeout>

  /**
   * Expose SidebarCardType enum to template
   */
  readonly SidebarCardType = SidebarCardType;

  constructor(
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

    // Set initial state based on config when component initializes
    effect(() => {
      if (this.menuBarDetails?.defaultOpen !== undefined) {
        this.isOpen.set(this.menuBarDetails.defaultOpen)
      }
    }, { allowSignalWrites: true })

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
        }, 300)
      }
    }, { allowSignalWrites: true })
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
   * Track by function for navSections to optimize rendering
   */
  trackByCardType(index: number, section: any): string {
    return `${section.cardType}-${index}`
  }

  onNavItemClicked(code: string) {
    this.navItemClicked.emit(code)
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
