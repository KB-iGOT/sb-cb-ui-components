export interface CardViewModel {
  id: string
  title: string
  image: string
  additionalTags: string[]
  duration: string
  status: string
  rating: number
  provider: string
  level: string
  planDuration: string
  contentStatus: number
  metadata: Record<string, unknown>
}
