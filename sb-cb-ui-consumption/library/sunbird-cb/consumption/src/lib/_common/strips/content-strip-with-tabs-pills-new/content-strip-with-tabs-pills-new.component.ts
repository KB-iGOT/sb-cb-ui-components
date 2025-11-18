import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service'

// Interfaces matching your widgetData structure
interface IPillRequest {
  microSearch?: any
  nanoSearch?: any
  trendingSearch?: any
  searchV6?: any
}

interface IPillData {
  label: string
  value: string
  computeDataOnClick: boolean
  computeDataOnClickKey: string
  requestRequired: boolean
  showTabDataCount: boolean
  maxWidgets: number
  selected: boolean
  hideTab: boolean
  nodataMsg: string
  request?: IPillRequest
  widgets?: any[]
  fetchStatus?: 'loading' | 'done' | 'error' | 'empty'
}

interface ITabData {
  label: string
  value: string
  pillsData: IPillData[]
}

interface IViewMoreUrl {
  path: string
  viewMoreText: string
  queryParams?: any
  loaderConfig?: any
  stripConfig?: any
}

interface ISliderConfig {
  showNavs: boolean
  showDots: boolean
  maxWidgets: number
  showNavsSpacing: boolean
}

interface IStripConfig {
  cardSubType: string
  intranetMode?: boolean
  deletedMode?: boolean
  contentTags?: string[]
}

interface IStripData {
  active: boolean
  key: string
  title: string
  type: string
  disableTranslate: boolean
  stripTitleLink: {
    link: string
    icon: string
  }
  sliderConfig: ISliderConfig
  stripConfig: IStripConfig
  viewMoreUrl: IViewMoreUrl
  loader: boolean
  loaderConfig: {
    cardSubType: string
  }
  tabs: ITabData[]
}

interface IWidgetData {
  order: number
  stripType: string
  stripVisable: string
  strips: IStripData[]
}

@Component({
  selector: 'sb-uic-content-strip-with-tabs-pills-new',
  templateUrl: './content-strip-with-tabs-pills-new.component.html',
  styleUrls: ['./content-strip-with-tabs-pills-new.component.scss'],
})
export class ContentStripWithTabsPillsNewComponent implements OnInit, OnDestroy {

  @Input() widgetData: IWidgetData | null = null
  @Output() tabChanged = new EventEmitter<any>()
  @Output() pillChanged = new EventEmitter<any>()
  @Output() contentLoaded = new EventEmitter<any>()

  // Component state management
  activeTabIndices: { [stripKey: string]: number } = {}
  activePillIndices: { [key: string]: number } = {}

  // Cache for skeleton loaders to prevent recreating them on every change detection
  private skeletonCache: { [key: string]: any[] } = {}

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private configSvc: ConfigurationsService,
    private contentSvc: WidgetContentLibService,
  ) { }

  ngOnInit(): void {
    this.initializeComponent()
  }

  ngOnDestroy(): void {
    // Clear skeleton cache to free memory
    this.skeletonCache = {}
  }

  /**
   * Initialize component with default tab and pill selections
   */
  initializeComponent(): void {
    if (this.widgetData?.strips) {
      this.widgetData.strips.forEach((strip) => {
        // Set first tab as active by default
        this.activeTabIndices[strip.key] = 0

        // Initialize pills for each tab
        strip.tabs.forEach((tab, tabIndex) => {
          const key = `${strip.key}-${tabIndex}`
          this.activePillIndices[key] = 0

          // Set first pill as selected
          if (tab.pillsData?.length > 0) {
            tab.pillsData.forEach((pill, pillIndex) => {
              pill.selected = pillIndex === 0
            })

            // Load initial content ONLY for the first tab's first pill
            if (tabIndex === 0) {
              this.loadPillContent(tab.pillsData[0], tab, strip, 0, tabIndex)
            }
          }
        })
      })
    }
  }

  /**
   * Get active tab index for a strip
   */
  getActiveTabIndex(strip: IStripData): number {
    return this.activeTabIndices[strip.key] || 0
  }

  /**
   * Handle tab change event
   * - Triggers on each tab click
   * - Always makes fresh API call for the first pill in the newly selected tab
   * - Clears existing data to force reload
   */
  onTabChange(tabIndex: number, strip: IStripData, stripIndex: number): void {
    this.activeTabIndices[strip.key] = tabIndex

    const tab = strip.tabs[tabIndex]
    const key = `${strip.key}-${tabIndex}`

    // Reset pills for new tab
    if (tab?.pillsData?.length > 0) {
      tab.pillsData.forEach((pill, pillIndex) => {
        pill.selected = pillIndex === 0
      })

      this.activePillIndices[key] = 0

      // Always load content for first pill on tab change (force reload)
      const firstPill = tab.pillsData[0]
      if (firstPill.requestRequired) {
        // Clear existing widgets to force fresh API call
        firstPill.widgets = undefined
        firstPill.fetchStatus = 'loading'
      }
      this.loadPillContent(firstPill, tab, strip, 0, tabIndex)
    }

    this.tabChanged.emit({ tabIndex, strip, stripIndex })
    this.cdr.detectChanges()
  }

  /**
   * Check if a tab is disabled
   */
  isTabDisabled(tab: ITabData): boolean {
    return !tab.pillsData || tab.pillsData.length === 0
  }

  /**
   * Get content count for a tab
   */
  getTabContentCount(tab: ITabData): number {
    if (!tab.pillsData) return 0

    return tab.pillsData.reduce((total, pill) => {
      return total + (pill.widgets?.length || 0)
    }, 0)
  }

  /**
   * Check if a pill is selected
   */
  isPillSelected(pill: IPillData, tab: ITabData, strip: IStripData, pillIndex: number, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    return this.activePillIndices[key] === pillIndex
  }

  /**
   * Handle pill click event
   */
  onPillClick(pill: IPillData, tab: ITabData, strip: IStripData, pillIndex: number, tabIndex: number, stripIndex: number): void {
    const key = `${strip.key}-${tabIndex}`

    // Update pill selection
    tab.pillsData.forEach((p, index) => {
      p.selected = index === pillIndex
    })

    this.activePillIndices[key] = pillIndex

    // Load content for selected pill
    this.loadPillContent(pill, tab, strip, pillIndex, tabIndex)

    this.pillChanged.emit({ pill, tab, strip, pillIndex, tabIndex, stripIndex })
    this.cdr.detectChanges()
  }

  /**
   * Check if pill is currently loading
   */
  isPillLoading(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]
    return pill?.fetchStatus === 'loading'
  }

  /**
   * Check if pill has no data
   */
  isPillEmpty(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]
    return pill ? (pill.fetchStatus === 'done' && (!pill.widgets || pill.widgets.length === 0)) : true
  }

  /**
   * Check if pill has content to show
   */
  hasContentToShow(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]
    return pill ? (pill.fetchStatus === 'done' && pill.widgets && pill.widgets.length > 0) : false
  }

  /**
   * Get selected pill data
   */
  getSelectedPillData(tab: ITabData, strip: IStripData, tabIndex: number): IPillData | null {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    return tab.pillsData?.[pillIndex] || null
  }

  /**
   * Get content length for display
   */
  getContentLength(tab: ITabData, strip: IStripData, tabIndex: number): number {
    const pill = this.getSelectedPillData(tab, strip, tabIndex)
    return pill?.widgets?.length || 0
  }

  /**
   * Get max widgets to display
   */
  getMaxWidgets(tab: ITabData, strip: IStripData, tabIndex: number): number {
    const pill = this.getSelectedPillData(tab, strip, tabIndex)
    return pill?.maxWidgets || strip.sliderConfig.maxWidgets || 12
  }

  /**
   * Get display content for rendering
   */
  getDisplayContent(tab: ITabData, strip: IStripData, tabIndex: number): any[] {
    const pill = this.getSelectedPillData(tab, strip, tabIndex)
    const maxWidgets = this.getMaxWidgets(tab, strip, tabIndex)

    // Show skeleton loaders while loading (cached to prevent recreation)
    if (pill?.fetchStatus === 'loading') {
      const cacheKey = `${strip.key}-${tabIndex}-skeleton`
      if (!this.skeletonCache[cacheKey]) {
        this.skeletonCache[cacheKey] = this.transformSkeletonToWidgets(strip).slice(0, maxWidgets)
      }
      return this.skeletonCache[cacheKey]
    }

    if (pill?.widgets) {
      return pill.widgets.slice(0, maxWidgets)
    }

    return []
  }

  /**
   * Get skeleton loader widgets for a strip
   */
  getSkeletonWidgets(strip: IStripData, tabIndex: number): any[] {
    const cacheKey = `${strip.key}-${tabIndex}-skeleton-loading`

    if (!this.skeletonCache[cacheKey]) {
      const maxWidgets = strip.tabs[tabIndex]?.pillsData[0]?.maxWidgets || strip.sliderConfig.maxWidgets || 10
      this.skeletonCache[cacheKey] = this.transformSkeletonToWidgets(strip).slice(0, maxWidgets)
    }

    return this.skeletonCache[cacheKey]
  }

  /**
   * Track widgets for ngFor performance
   */
  trackWidget(index: number, widget: any): any {
    return widget?.id || widget?.identifier || index
  }

  /**
   * Handle view more button click
   */
  handleViewMore(strip: IStripData): void {
    if (strip.viewMoreUrl?.path) {
      this.router.navigate([strip.viewMoreUrl.path], {
        queryParams: strip.viewMoreUrl.queryParams || {}
      })
    }
  }

  /**
 * Load content for a pill (this would call your actual API service)
 */
  private loadPillContent(pill: IPillData, tab: ITabData, strip: IStripData, pillIndex: number, tabIndex: number): void {
    // If content not required, mark as done
    if (!pill.requestRequired) {
      pill.fetchStatus = 'done'
      return
    }

    // // If already loaded and not forced to reload, skip
    // if (pill.fetchStatus === 'done' && pill.widgets && pill.widgets.length > 0) {
    //   return
    // }

    // Set loading state
    pill.fetchStatus = 'loading'
    this.cdr.detectChanges()

    // Check request type and call appropriate API
    if (pill.request?.microSearch) {
      console.log('microSearch', strip, pill)
      // Call microSearch API
      this.callMicroSearchAPI(pill, strip)
    } else if (pill.request?.nanoSearch) {
      // Call nanoSearch API
      this.callNanoSearchAPI(pill, strip)
    } else if (pill.request?.trendingSearch) {
      // Call trendingSearch API
      this.callTrendingSearchAPI(pill, strip)
    } else if (pill.request?.searchV6) {
      // Call searchV6 API
      this.callSearchV6API(pill, strip)
    } else {
      // No specific request type
      pill.widgets = []
      pill.fetchStatus = 'empty'
    }

    this.contentLoaded.emit({ pill, tab, strip, pillIndex, tabIndex })
    this.cdr.detectChanges()
  }

  /**
   * Call microSearch API (replace with actual implementation)
   */
  private callMicroSearchAPI(pill: IPillData, strip: IStripData): void {
    let request = pill.request
    if (request?.microSearch) {
      // Handle dynamic organization filter
      if (request.microSearch &&
        request.microSearch.request?.filters?.organisation &&
        request.microSearch.request.filters.organisation.indexOf('<orgID>') >= 0) {
        let userRootOrgId
        if (this.configSvc.userProfile) {
          userRootOrgId = this.configSvc.userProfile.rootOrgId
        }
        request.microSearch.request.filters.organisation = userRootOrgId
      }

      this.contentSvc.trendingContentSearch(request.microSearch).subscribe(
        (result) => {
          if (result && result.response) {
            // For microSearch, the content is directly in result.response
            // Not in result.response[pill.value] like trendingSearch
            let content: any[] = []

            // Try different response structures
            if (Array.isArray(result.response)) {
              content = result.response
            } else if (result.response[pill.value]) {
              // If response has pill.value key
              content = result.response[pill.value]
            } else if (result.response.content) {
              // If response has content property
              content = result.response.content
            } else {
              // Take first property that is an array
              const firstArrayKey = Object.keys(result.response).find(key => Array.isArray(result.response[key]))
              if (firstArrayKey) {
                content = result.response[firstArrayKey]
              }
            }

            pill.widgets = this.transformContentsToWidgets(content, strip, pill)
            pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
          } else {
            pill.widgets = []
            pill.fetchStatus = 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
          }
        },
        (error) => {
          console.error('MicroSearch API error:', error)
          pill.widgets = []
          pill.fetchStatus = 'error'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
        }
      )
    }
  }

  /**
   * Clear skeleton cache for a strip to free memory after data loads
   */
  private clearSkeletonCache(strip: IStripData): void {
    Object.keys(this.skeletonCache).forEach(key => {
      if (key.startsWith(strip.key)) {
        delete this.skeletonCache[key]
      }
    })
  }

  /**
   * Call nanoSearch API (replace with actual implementation)
   */

  private callNanoSearchAPI(pill: IPillData, strip: IStripData): void {
    let request = pill.request
    if (request?.nanoSearch) {
      // Handle dynamic organization filter
      if (request.nanoSearch &&
        request.nanoSearch.request?.filters?.organisation &&
        request.nanoSearch.request.filters.organisation.indexOf('<orgID>') >= 0) {
        let userRootOrgId
        if (this.configSvc.userProfile) {
          userRootOrgId = this.configSvc.userProfile.rootOrgId
        }
        request.nanoSearch.request.filters.organisation = userRootOrgId
      }

      this.contentSvc.trendingContentSearch(request.nanoSearch).subscribe(
        (result) => {
          if (result && result.response) {
            // For microSearch, the content is directly in result.response
            // Not in result.response[pill.value] like trendingSearch
            let content: any[] = []

            // Try different response structures
            if (Array.isArray(result.response)) {
              content = result.response
            } else if (result.response[pill.value]) {
              // If response has pill.value key
              content = result.response[pill.value]
            } else if (result.response.content) {
              // If response has content property
              content = result.response.content
            } else {
              // Take first property that is an array
              const firstArrayKey = Object.keys(result.response).find(key => Array.isArray(result.response[key]))
              if (firstArrayKey) {
                content = result.response[firstArrayKey]
              }
            }

            pill.widgets = this.transformContentsToWidgets(content, strip, pill)
            pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
          } else {
            pill.widgets = []
            pill.fetchStatus = 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
          }
        },
        (error) => {
          console.error('NanoSearch API error:', error)
          pill.widgets = []
          pill.fetchStatus = 'error'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
        }
      )
    }
  }


  /**
   * Call trendingSearch API (replace with actual implementation)
   */
  private callTrendingSearchAPI(pill: IPillData, strip: IStripData): void {
    let request = pill.request
    if (request?.trendingSearch) {
      // Handle dynamic organization filter
      if (request.trendingSearch &&
        request.trendingSearch.request?.filters?.organisation &&
        request.trendingSearch.request.filters.organisation.indexOf('<orgID>') >= 0) {
        let userRootOrgId
        if (this.configSvc.userProfile) {
          userRootOrgId = this.configSvc.userProfile.rootOrgId
        }
        request.trendingSearch.request.filters.organisation = userRootOrgId
      }

      this.contentSvc.trendingContentSearch(request.trendingSearch).subscribe(
        (result) => {
          if (result && result.response) {
            // For microSearch, the content is directly in result.response
            // Not in result.response[pill.value] like trendingSearch
            let content: any[] = []

            // Try different response structures
            if (Array.isArray(result.response)) {
              content = result.response
            } else if (result.response[pill.value]) {
              // If response has pill.value key
              content = result.response[pill.value]
            } else if (result.response.content) {
              // If response has content property
              content = result.response.content
            } else {
              // Take first property that is an array
              const firstArrayKey = Object.keys(result.response).find(key => Array.isArray(result.response[key]))
              if (firstArrayKey) {
                content = result.response[firstArrayKey]
              }
            }

            pill.widgets = this.transformContentsToWidgets(content, strip, pill)
            pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
          } else {
            pill.widgets = []
            pill.fetchStatus = 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
          }
        },
        (error) => {
          console.error('TrendingSearch API error:', error)
          pill.widgets = []
          pill.fetchStatus = 'error'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
        }
      )
    }
  }

  /**
   * Call searchV6 API (replace with actual implementation)
   */
  private callSearchV6API(pill: IPillData, strip: IStripData): void {
    let request = pill.request
    if (request?.searchV6) {
      this.contentSvc.searchV6(request.searchV6).subscribe(resp => {
        if (resp && resp.result && resp.result.content) {
          const content = resp.result.content
          pill.widgets = this.transformContentsToWidgets(content, strip, pill)
          pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
        } else {
          pill.widgets = []
          pill.fetchStatus = 'empty'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
        }

      })
    }
  }

  /**
   * Generate mock data for testing (remove when implementing real APIs)
   */
  private generateMockData(pill: IPillData, strip: IStripData, count: number): any[] {
    const mockWidgets = []

    for (let i = 0; i < count; i++) {
      mockWidgets.push({
        id: `widget-${pill.value}-${i}`,
        identifier: `content-${Date.now()}-${i}`,
        widgetType: 'card',
        widgetSubType: strip.stripConfig.cardSubType,
        widgetData: {
          content: {
            name: `${pill.label} Content ${i + 1}`,
            description: `Mock content for ${pill.label}`,
            appIcon: 'assets/icons/default-course.png',
            duration: Math.floor(Math.random() * 120) + 30,
            avgRating: (Math.random() * 2 + 3).toFixed(1),
            identifier: `content-${Date.now()}-${i}`
          }
        }
      })
    }

    return mockWidgets
  }

  /**
   * Transform API content response to widget format
   * This method converts the API response data into the widget structure required by the component
   */
  private transformContentsToWidgets(
    contents: any[],
    strip: IStripData,
    pill?: IPillData
  ): any[] {
    return (contents || []).map((content, idx) => {
      if (!content) {
        return {
          widgetType: 'card',
          widgetSubType: 'cardContent',
          widgetHostClass: 'mb-2',
          widgetData: {},
        }
      }

      return {
        widgetType: 'cardLib',
        widgetSubType: 'cardContentLib',
        widgetHostClass: 'mb-2',
        widgetData: {
          content,
          ...(content.batch && { batch: content.batch }),
          cardSubType: strip.stripConfig?.cardSubType || 'card-portrait-lib',
          cardCustomeClass: '',
          context: {
            pageSection: strip.key,
            position: idx,
            ...(pill && { pill: pill.value })
          },
          intranetMode: strip.stripConfig?.intranetMode || false,
          deletedMode: strip.stripConfig?.deletedMode || false,
          contentTags: strip.stripConfig?.contentTags || [],
        },
      }
    })
  }

  /**
   * Transform skeleton loaders to widgets while data is loading
   * Creates placeholder cards to show loading state
   */
  private transformSkeletonToWidgets(strip: IStripData): any[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(_content => ({
      widgetType: 'cardLib',
      widgetSubType: 'cardContentLib',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.loaderConfig?.cardSubType || 'card-standard-skeleton',
        cardCustomeClass: '',
      },
    }))
  }
}
