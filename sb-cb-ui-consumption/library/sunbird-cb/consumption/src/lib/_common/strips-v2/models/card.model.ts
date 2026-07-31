export interface CardViewModel {
  identifier: string
  title: string
  image: string
  additionalTags: string[]
  duration: string
  status: string
  rating: number
  provider: string
  // Provider org names as the content APIs return them; the card footer shows organisation[0].
  organisation: string[]
  creatorLogo: string
  sourceName: string
  resourceType: string
  // Multilingual data the "available in N languages" pill is derived from.
  languageMapV1: Record<string, any>
  language: string[]
  difficultyLevel: string
  planDuration: string
  contentStatus: number
  metadata: Record<string, unknown>
  courseCategory: string
  primaryCategory: string
}
