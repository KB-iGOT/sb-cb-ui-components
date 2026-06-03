import { Injectable } from '@angular/core'
import { CardType } from '../models/content-section.model'
import { CardViewModel } from '../models/card.model'

@Injectable({ providedIn: 'root' })
export class CardTransformerService {

  transformCards(response: unknown, cardType: CardType): CardViewModel[] {
    if (!response) {
      return []
    }

    switch (cardType) {
      case CardType.CourseCard:
        return this.processCourseCards(response)
      case CardType.SpotlightCard:
        return this.processSpotlightCards(response)
      case CardType.AssessmentCard:
        return this.processAssessmentCards(response)
      case CardType.ProgramCard:
        return this.processProgramCards(response)
      default:
        return []
    }
  }

  processCourseCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      id: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? (item?.['posterImage'] as string) ?? '',
      tags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['duration'] as string) ?? '',
      status: (item?.['status'] as string) ?? '',
      rating: (item?.['averageRating'] as number) ?? 0,
      provider: (item?.['sourceName'] as string) ?? (item?.['source'] as string) ?? '',
      level: (item?.['complexityLevel'] as string) ?? '',
      metadata: item ?? {}
    }))
  }

  processSpotlightCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      id: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      tags: [],
      duration: '',
      status: '',
      rating: 0,
      provider: (item?.['sourceName'] as string) ?? '',
      level: '',
      metadata: item ?? {}
    }))
  }

  processAssessmentCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      id: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      tags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['expectedDuration'] as string) ?? '',
      status: (item?.['assessmentStatus'] as string) ?? '',
      rating: 0,
      provider: (item?.['sourceName'] as string) ?? '',
      level: (item?.['difficultyLevel'] as string) ?? '',
      metadata: item ?? {}
    }))
  }

  processProgramCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      id: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      tags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['duration'] as string) ?? '',
      status: (item?.['programStatus'] as string) ?? '',
      rating: (item?.['averageRating'] as number) ?? 0,
      provider: (item?.['sourceName'] as string) ?? '',
      level: '',
      metadata: item ?? {}
    }))
  }

  private extractResultArray(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) {
      return response
    }
    const res = response as Record<string, unknown> | null
    if (res?.['result'] && Array.isArray(res['result'])) {
      return res['result'] as Record<string, unknown>[]
    }
    if (res?.['result'] && typeof res['result'] === 'object') {
      const result = res['result'] as Record<string, unknown>
      if (result?.['content'] && Array.isArray(result['content'])) {
        return result['content'] as Record<string, unknown>[]
      }
      if (result?.['data'] && Array.isArray(result['data'])) {
        return result['data'] as Record<string, unknown>[]
      }
    }
    if (res?.['data'] && Array.isArray(res['data'])) {
      return res['data'] as Record<string, unknown>[]
    }
    return []
  }
}
