import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import moment from 'moment'

export interface WeekData {
  title: string
  topics?: string[]
  doIds?: string[]
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
  weeks?: { [key: string]: WeekData }
}

type WeekStatus = 'completed' | 'in-progress' | 'upcoming'

@Component({
  selector: 'sb-uic-week-progress',
  templateUrl: './week-progress.component.html',
  styleUrls: ['./week-progress.component.scss'],
  standalone: false,
})
export class WeekProgressComponent implements OnInit, AfterViewInit {
  @Input() programData!: WeekProgressData
  @Input() bkConfig?: { startDate?: string; endDate?: string; [key: string]: any }

  currentWeek = 1
  selectedWeek = 1
  activeTabIndex = 0
  currentPage = 0
  showAllWeeksPopup = false
  readonly cardsPerView = 4

  /* ── Week card slider ── */
  @ViewChild('cardTrack') cardTrackRef!: ElementRef<HTMLElement>
  _canCardsPrev = false
  _canCardsNext = true

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.currentWeek = this._computeCurrentWeek()
    this.selectedWeek = this.currentWeek
  }

  ngAfterViewInit(): void {
    // Scroll so the current week's card is visible on initial load
    setTimeout(() => this._scrollToCurrentWeek(), 150)
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
    return (this.getWeekData(week)?.progress ?? 0) >= 100 ? 'completed' : 'in-progress'
  }

  /* Line after week W is green when W is before the current week (calendar-based) */
  isWeekCompleted(week: number): boolean {
    return week < this.currentWeek
  }

  getWeekData(week: number): WeekData | null {
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
    if (s === 'completed') return '#1E8A44'
    if (s === 'in-progress') return '#F37400'
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
    if (data?.doIds?.length) {
      this.router.navigate(['/app/toc', data.doIds[0], 'overview'])
    } else {
      this.snackBar.open('No content available for this week yet', 'Ok', { duration: 3000 })
    }
  }

  /* ── Content strips / slider ── */
  get activeStrip(): WeekProgressContentStrip | null {
    return this.programData?.contentStrips?.find(s => s.active) || null
  }

  get activeTabs(): WeekProgressTab[] { return this.activeStrip?.tabs || [] }

  get activeTabCards(): WeekProgressCard[] {
    return this.activeTabs[this.activeTabIndex]?.cards || []
  }

  get visibleCards(): WeekProgressCard[] {
    const start = this.currentPage * this.cardsPerView
    return this.activeTabCards.slice(start, start + this.cardsPerView)
  }

  get totalDotPages(): number[] {
    const pages = Math.ceil(this.activeTabCards.length / this.cardsPerView) || 1
    return Array.from({ length: pages }, (_, i) => i)
  }

  get canGoPrev(): boolean { return this.currentPage > 0 }
  get canGoNext(): boolean { return this.currentPage < this.totalDotPages.length - 1 }

  onTabChange(index: number): void { this.activeTabIndex = index; this.currentPage = 0 }
  prevSlide(): void { if (this.canGoPrev) this.currentPage-- }
  nextSlide(): void { if (this.canGoNext) this.currentPage++ }
  goToPage(page: number): void { this.currentPage = page }

  navigateToCard(card: WeekProgressCard): void {
    if (card?.identifier) this.router.navigate(['/app/toc', card.identifier, 'overview'])
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
    const data = this.getWeekData(week)
    if (data?.doIds?.length) {
      this.router.navigate(['/app/toc', data.doIds[0], 'overview'])
    } else {
      this.snackBar.open('No content available for this week yet', 'Ok', { duration: 3000 })
    }
  }

  getCardRingBg(week: number): string {
    const s = this.getWeekStatus(week)
    if (s === 'completed') return '#C8E6C9'
    if (s === 'in-progress') return '#E0E0E0'
    return '#EEEEEE'
  }

  onViewAll(_strip: WeekProgressContentStrip): void {
    const url = this.programData?.viewAllUrl || '/app/learn/kalp/bharat-kalp/see-all'
    this.router.navigate([url], { queryParams: { week: this.currentWeek } })
  }
}
