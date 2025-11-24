import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { WidgetContentLibService } from '../../../_services/widget-content-lib.service'
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service'
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

  activeTabIndices: { [stripKey: string]: number } = {}
  activePillIndices: { [key: string]: number } = {}

  private skeletonCache: { [key: string]: any[] } = {}
  private isUserInitiatedTabClick: boolean = false
  private loadingTabs: Set<string> = new Set()

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private configSvc: ConfigurationsService,
    private contentSvc: WidgetContentLibService,
    private langtranslations: MultilingualTranslationsService,
  ) { }

  ngOnInit(): void {
    this.initializeComponent()
  }

  ngOnDestroy(): void {
    this.skeletonCache = {}
  }

  initializeComponent(): void {
    if (this.widgetData?.strips) {
      this.widgetData.strips.forEach((strip) => {
        this.activeTabIndices[strip.key] = 0
        strip.tabs.forEach((tab, tabIndex) => {
          const key = `${strip.key}-${tabIndex}`
          this.activePillIndices[key] = 0
          if (tab.pillsData?.length > 0) {
            tab.pillsData.forEach((pill, pillIndex) => {
              pill.selected = pillIndex === 0
            })
            if (tabIndex === 0) {
              this.isUserInitiatedTabClick = false
              this.loadPillContent(tab.pillsData[0], tab, strip, 0, tabIndex)
            }
          }
        })
      })
    }
  }

  getActiveTabIndex(strip: IStripData): number {
    return this.activeTabIndices[strip.key] || 0
  }

  onTabChange(tabIndex: number, strip: IStripData, stripIndex: number, isUserClick: boolean = true): void {
    this.isUserInitiatedTabClick = isUserClick
    this.activeTabIndices[strip.key] = tabIndex
    const tab = strip.tabs[tabIndex]
    const key = `${strip.key}-${tabIndex}`
    if (tab?.pillsData?.length > 0) {
      tab.pillsData.forEach((pill, pillIndex) => {
        pill.selected = pillIndex === 0
      })
      this.activePillIndices[key] = 0
      const firstPill = tab.pillsData[0]
      if (firstPill.requestRequired) {
        firstPill.widgets = undefined
        firstPill.fetchStatus = 'loading'
      }
      this.loadPillContent(firstPill, tab, strip, 0, tabIndex)
    }
    this.tabChanged.emit({ tabIndex, strip, stripIndex })
    this.cdr.detectChanges()
  }

  isTabDisabled(tab: ITabData): boolean {
    return !tab.pillsData || tab.pillsData.length === 0
  }

  isTabHidden(tab: ITabData, tabIndex: number): boolean {
    // Check if the first pill has been loaded and has no data
    const firstPill = tab.pillsData?.[0]
    if (!firstPill) {
      return true // Hide if no pills
    }

    // Hide tab if the pill has been loaded and has no widgets
    if (firstPill.fetchStatus === 'empty' ||
      (firstPill.fetchStatus === 'done' && (!firstPill.widgets || firstPill.widgets.length === 0))) {
      return true
    }

    return false
  }

  getTabContentCount(tab: ITabData): number {
    if (!tab.pillsData) return 0

    return tab.pillsData.reduce((total, pill) => {
      return total + (pill.widgets?.length || 0)
    }, 0)
  }

  isPillSelected(pill: IPillData, tab: ITabData, strip: IStripData, pillIndex: number, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    return this.activePillIndices[key] === pillIndex
  }

  onPillClick(pill: IPillData, tab: ITabData, strip: IStripData, pillIndex: number, tabIndex: number, stripIndex: number): void {
    const key = `${strip.key}-${tabIndex}`
    tab.pillsData.forEach((p, index) => {
      p.selected = index === pillIndex
    })
    this.activePillIndices[key] = pillIndex
    this.loadPillContent(pill, tab, strip, pillIndex, tabIndex)
    this.pillChanged.emit({ pill, tab, strip, pillIndex, tabIndex, stripIndex })
    this.cdr.detectChanges()
  }

  isPillLoading(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]
    return pill?.fetchStatus === 'loading'
  }

  isPillEmpty(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]

    if (!pill) {
      return true
    }
    return pill.fetchStatus === 'empty' ||
      (pill.fetchStatus === 'done' && (!pill.widgets || pill.widgets.length === 0))
  }

  hasContentToShow(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]
    return pill ? (pill.fetchStatus === 'done' && pill.widgets && pill.widgets.length > 0) : false
  }

  shouldShowViewMore(tab: ITabData, strip: IStripData, tabIndex: number): boolean {
    if (!strip.viewMoreUrl) {
      return false
    }
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    const pill = tab.pillsData?.[pillIndex]
    return pill ? (pill.widgets && pill.widgets.length >= 4) : false
  }

  getSelectedPillData(tab: ITabData, strip: IStripData, tabIndex: number): IPillData | null {
    const key = `${strip.key}-${tabIndex}`
    const pillIndex = this.activePillIndices[key] || 0
    return tab.pillsData?.[pillIndex] || null
  }

  getContentLength(tab: ITabData, strip: IStripData, tabIndex: number): number {
    const pill = this.getSelectedPillData(tab, strip, tabIndex)
    return pill?.widgets?.length || 0
  }

  getMaxWidgets(tab: ITabData, strip: IStripData, tabIndex: number): number {
    const pill = this.getSelectedPillData(tab, strip, tabIndex)
    return pill?.maxWidgets || strip.sliderConfig.maxWidgets || 12
  }

  getDisplayContent(tab: ITabData, strip: IStripData, tabIndex: number): any[] {
    const pill = this.getSelectedPillData(tab, strip, tabIndex)
    const maxWidgets = this.getMaxWidgets(tab, strip, tabIndex)
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

  getSkeletonWidgets(strip: IStripData, tabIndex: number): any[] {
    const cacheKey = `${strip.key}-${tabIndex}-skeleton-loading`

    if (!this.skeletonCache[cacheKey]) {
      const maxWidgets = strip.tabs[tabIndex]?.pillsData[0]?.maxWidgets || strip.sliderConfig.maxWidgets || 10
      this.skeletonCache[cacheKey] = this.transformSkeletonToWidgets(strip).slice(0, maxWidgets)
    }

    return this.skeletonCache[cacheKey]
  }


  trackWidget(index: number, widget: any): any {
    return widget?.id || widget?.identifier || index
  }

  handleViewMore(strip: IStripData): void {
    if (strip.viewMoreUrl?.path) {
      const activeTabIndex = this.getActiveTabIndex(strip)
      const activeTab = strip.tabs[activeTabIndex]
      const key = `${strip.key}-${activeTabIndex}`
      const activePillIndex = this.activePillIndices[key] || 0
      const activePill = activeTab?.pillsData?.[activePillIndex]
      const queryParams = {
        ...strip.viewMoreUrl.queryParams,
        key: strip.key,
        tabSelected: activeTab?.value || '',
        pillSelected: activePill?.value || ''
      }
      this.router.navigate([strip.viewMoreUrl.path], {
        queryParams: queryParams
      })
    }
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  private loadPillContent(pill: IPillData, tab: ITabData, strip: IStripData, pillIndex: number, tabIndex: number): void {
    if (!pill.requestRequired) {
      pill.fetchStatus = 'done'
      return
    }

    const loadingKey = `${strip.key}-${tabIndex}-${pillIndex}`
    if (this.loadingTabs.has(loadingKey)) {
      console.log('Already loading this pill, skipping:', loadingKey)
      return
    }
    const wasUserInitiated = this.isUserInitiatedTabClick
    console.log('loadPillContent:', { tabIndex, pillIndex, wasUserInitiated, loadingKey })

    this.loadingTabs.add(loadingKey)
    pill.fetchStatus = 'loading'
    this.cdr.detectChanges()

    if (pill.request?.microSearch) {
      this.callMicroSearchAPI(pill, strip, tab, tabIndex, loadingKey, wasUserInitiated)
    } else if (pill.request?.trendingSearch) {
      this.callTrendingSearchAPI(pill, strip, tab, tabIndex, loadingKey, wasUserInitiated)
    } else if (pill.request?.searchV6) {
      this.callSearchV6API(pill, strip, tab, tabIndex, loadingKey, wasUserInitiated)
    } else {
      pill.widgets = []
      pill.fetchStatus = 'empty'
      this.loadingTabs.delete(loadingKey)
      if (!wasUserInitiated) {
        this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
      }
    }

    this.contentLoaded.emit({ pill, tab, strip, pillIndex, tabIndex })
    this.cdr.detectChanges()
  }

  private tryLoadNextTab(strip: IStripData, currentTabIndex: number, wasUserInitiated: boolean = false): void {
    if (wasUserInitiated) {
      return
    }

    const nextTabIndex = currentTabIndex + 1
    if (nextTabIndex < strip.tabs.length) {
      const nextTab = strip.tabs[nextTabIndex]
      if (nextTab?.pillsData?.length > 0) {
        setTimeout(() => {
          this.isUserInitiatedTabClick = false
          this.onTabChange(nextTabIndex, strip, 0, false)
        }, 100)
      } else {
        this.tryLoadNextTab(strip, nextTabIndex, wasUserInitiated)
      }
    } else {
      console.log('No more tabs to try. Staying on last tab:', currentTabIndex)
    }
  }

  private callMicroSearchAPI(pill: IPillData, strip: IStripData, tab: ITabData, tabIndex: number, loadingKey: string, wasUserInitiated: boolean): void {
    let request = pill.request
    if (request?.microSearch) {
      if (request.microSearch &&
        request.microSearch.request?.filters?.organisation &&
        request.microSearch.request.filters.organisation.indexOf('<orgID>') >= 0) {
        let userRootOrgId
        if (this.configSvc.userProfile) {
          userRootOrgId = this.configSvc.userProfile.rootOrgId
        }
        request.microSearch.request.filters.organisation = userRootOrgId
      }

      this.contentSvc.microContentSearch(request.microSearch).subscribe(
        (result) => {
          this.loadingTabs.delete(loadingKey)
          if (result && result.response) {
            let content: any[] = []
            if (result.response.content) {
              content = result.response.content
            } else {
              const firstArrayKey = Object.keys(result.response).find(key => Array.isArray(result.response[key]))
              if (firstArrayKey) {
                content = result.response[firstArrayKey]
              }
            }
            pill.widgets = this.transformContentsToWidgets(content, strip, pill)
            pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()

            if (pill.widgets.length === 0 && !wasUserInitiated) {
              this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
            }
          } else {
            pill.widgets = []
            pill.fetchStatus = 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
            if (!wasUserInitiated) {
              this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
            }
          }
        },
        (error) => {
          this.loadingTabs.delete(loadingKey)
          console.error('MicroSearch API error:', error)
          pill.widgets = []
          pill.fetchStatus = 'empty'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
          if (!wasUserInitiated) {
            this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
          }
        }
      )
    }
  }

  private clearSkeletonCache(strip: IStripData): void {
    Object.keys(this.skeletonCache).forEach(key => {
      if (key.startsWith(strip.key)) {
        delete this.skeletonCache[key]
      }
    })
  }

  private callTrendingSearchAPI(pill: IPillData, strip: IStripData, tab: ITabData, tabIndex: number, loadingKey: string, wasUserInitiated: boolean): void {
    let request = pill.request
    if (request?.trendingSearch) {
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
          this.loadingTabs.delete(loadingKey)

          if (result && result.response) {
            let content: any[] = []
            if (Array.isArray(result.response)) {
              content = result.response
            } else if (result.response[pill.value]) {
              content = result.response[pill.value]
            } else if (result.response.content) {
              content = result.response.content
            } else {
              const firstArrayKey = Object.keys(result.response).find(key => Array.isArray(result.response[key]))
              if (firstArrayKey) {
                content = result.response[firstArrayKey]
              }
            }

            pill.widgets = this.transformContentsToWidgets(content, strip, pill)
            pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
            if (pill.widgets.length === 0 && !wasUserInitiated) {
              this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
            }
          } else {
            pill.widgets = []
            pill.fetchStatus = 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
            if (!wasUserInitiated) {
              this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
            }
          }
        },
        (error) => {
          this.loadingTabs.delete(loadingKey)
          console.error('TrendingSearch API error:', error)
          pill.widgets = []
          pill.fetchStatus = 'empty'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
          if (!wasUserInitiated) {
            this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
          }
        }
      )
    }
  }

  private callSearchV6API(pill: IPillData, strip: IStripData, tab: ITabData, tabIndex: number, loadingKey: string, wasUserInitiated: boolean): void {
    let request = pill.request
    if (request?.searchV6) {
      this.contentSvc.searchV6(request.searchV6).subscribe(
        (resp) => {
          this.loadingTabs.delete(loadingKey)

          if (resp && resp.result && resp.result.content) {
            const content = resp.result.content
            pill.widgets = this.transformContentsToWidgets(content, strip, pill)
            pill.fetchStatus = pill.widgets.length > 0 ? 'done' : 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()

            if (pill.widgets.length === 0 && !wasUserInitiated) {
              this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
            }
          } else {
            pill.widgets = []
            pill.fetchStatus = 'empty'
            this.clearSkeletonCache(strip)
            this.cdr.detectChanges()
            if (!wasUserInitiated) {
              this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
            }
          }
        },
        (error) => {
          this.loadingTabs.delete(loadingKey)
          console.error('SearchV6 API error:', error)
          pill.widgets = []
          pill.fetchStatus = 'empty'
          this.clearSkeletonCache(strip)
          this.cdr.detectChanges()
          if (!wasUserInitiated) {
            this.tryLoadNextTab(strip, tabIndex, wasUserInitiated)
          }
        }
      )
    }
  }

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
