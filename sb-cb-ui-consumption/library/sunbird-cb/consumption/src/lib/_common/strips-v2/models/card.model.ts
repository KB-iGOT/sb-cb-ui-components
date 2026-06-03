export interface CardViewModel {
  id: string
  title: string
  image: string
  tags: string[]
  duration: string
  status: string
  rating: number
  provider: string
  level: string
  metadata: Record<string, unknown>
}
