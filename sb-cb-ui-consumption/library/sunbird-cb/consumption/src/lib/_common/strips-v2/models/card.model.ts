export interface CardViewModel {
  identifier: string
  title: string
  image: string
  additionalTags: string[]
  duration: string
  status: string
  rating: number
  provider: string
  difficultyLevel: string
  planDuration: string
  contentStatus: number
  metadata: Record<string, unknown>
  courseCategory: string
  primaryCategory: string
}
