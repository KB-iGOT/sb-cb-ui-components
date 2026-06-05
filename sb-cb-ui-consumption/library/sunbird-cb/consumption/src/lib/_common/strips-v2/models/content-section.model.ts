export enum VisibilityMode {
  Visible = 'visible',
  Hidden = 'hidden',
  Disabled = 'disabled'
}

export enum DisplayType {
  Tabs = 'tabs',
  Pills = 'pills',
  Cards = 'cards'
}

export enum CardType {
  CourseCard = 'courseCard',
  SpotlightCard = 'spotlightCard',
  AssessmentCard = 'assessmentCard',
  ProgramCard = 'programCard'
}

export enum ApiMethod {
  Get = 'GET',
  Post = 'POST'
}

export interface ContentConfig {
  apiDetailsKey: string
  cardType: CardType
  maxCardsToShow: number
  cardClickUrl: string
  viewAllUrl: string | null
  showViewAll: boolean
}

export interface PillConfig {
  pillKey: string
  pillLabel: string
  translateLabel: boolean
  visibilityMode: VisibilityMode
  contentConfig: ContentConfig
  pillDescription?: string[]
  pillImageUrl?: string
}

export interface TabConfig {
  tabKey: string
  tabLabel: string
  translateLabel: boolean
  visibilityMode: VisibilityMode
  hasPills: boolean
  defaultPillKey?: string
  pills?: PillConfig[]
  contentConfig?: ContentConfig
}

export interface ContentSectionConfig {
  sectionKey: string
  header: string
  translateHeader: boolean
  visibilityMode: VisibilityMode
  displayType: DisplayType
  defaultTabKey?: string
  tabs?: TabConfig[]
  defaultPillKey?: string
  pills?: PillConfig[]
  contentConfig?: ContentConfig
}

export interface DynamicTab {
  key: string
  label: string
  translateLabel: boolean
  context: TabConfig
}

export interface ApiRegistryEntry {
  endpoint: string
  method: ApiMethod
  queryParams?: Record<string, string>
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

export interface ApiRegistryConfig {
  [key: string]: ApiRegistryEntry
}
