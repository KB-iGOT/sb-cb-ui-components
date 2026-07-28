import { Injectable } from '@angular/core'
import { CardType } from '../models/content-section.model'
import { CardViewModel } from '../models/card.model'
import dayjs from 'dayjs'
import { NsCardContent } from '../../../_models/card-content-v2.model'

@Injectable({ providedIn: 'root' })
export class CardTransformerService {

  transformCards(response: unknown, cardType: CardType, apiDetailsKey?: string): any[] {
    if (!response) {
      return []
    }

    switch (cardType) {
      case CardType.CourseCard:
        return this.processCourseCards(response, apiDetailsKey)
      case CardType.AssessmentCard:
        return this.processAssessmentCards(response)
      case CardType.ProgramCard:
        return this.processProgramCards(response)
      default:
        return []
    }
  }

  processCourseCards(response: unknown, apiDetailsKey?: string): any[] {
    const data = this.extractResultArray(response)
    if (apiDetailsKey) {
      return this.mapTheData(data, apiDetailsKey)
    }
    return data.map((item: Record<string, unknown>) => ({
      identifier: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? (item?.['posterImage'] as string) ?? '',
      tags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['duration'] as string) ?? '',
      status: (item?.['status'] as string) ?? '',
      rating: this.resolveRating(item),
      provider: (item?.['sourceName'] as string) ?? (item?.['source'] as string) ?? '',
      difficultyLevel: (item?.['complexityLevel'] as string) ?? '',
      metadata: item ?? {}
    }))
  }

  mapTheData(data: any, apiDetailsKey?: string): CardViewModel[] {
    const mapedData: CardViewModel[] = []
    switch (apiDetailsKey) {
      case 'aparApi':
        const todayDate = dayjs().format('YYYY-MM-DD')
        const filteredData = data.filter((item: any) => item?.isApar === true)
        filteredData.forEach((item: any) => {
          const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
          const daysCount = dayjs(endDate).diff(todayDate, 'day')
          item['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
            ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
          item['parentId'] = item.identifier
          item['planType'] = 'cbPlan'
          item['contentStatus'] = 0
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [], // not found
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: (item?.['sourceName'] as string),
            difficultyLevel: (item?.['complexityLevel'] as string) ?? '',
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'] as string,
            primaryCategory: item['primaryCategory'] as string,
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'trainingPlanApi':
        const todaysDate = dayjs().format('YYYY-MM-DD')
        data.forEach((item: any) => {
          const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
          const daysCount = dayjs(endDate).diff(todaysDate, 'day')
          item['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
            ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
          item['parentId'] = item.identifier
          item['planType'] = 'cbPlan'
          item['contentStatus'] = 0
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [], // not found
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: (item?.['sourceName'] as string),
            difficultyLevel: (item?.['complexityLevel'] as string) ?? '',
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'trendingOnIGOTApi':
        data.forEach((item: any) => {
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['appIcon'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['additionalTags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: (item?.['source'] as string) ?? (item?.['sourceName'] as string) ?? '',
            difficultyLevel: (item?.['difficultyLevel'] as string) ?? '',
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'featuredAiCoursesApi':
        data.forEach((item: any) => {
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: (item?.['sourceName'] as string) ?? (item?.['sourceName'] as string) ?? '',
            difficultyLevel: (item?.['difficultyLevel'] as string) ?? '',
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      default:
        data.forEach((item: any) => {
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: (item?.['sourceName'] as string) ?? (item?.['source'] as string) ?? '',
            difficultyLevel: (item?.['complexityLevel'] as string) ?? '',
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })

    }
    return mapedData
  }

  processAssessmentCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      identifier: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      additionalTags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['expectedDuration'] as string) ?? '',
      status: (item?.['assessmentStatus'] as string) ?? '',
      rating: this.resolveRating(item),
      provider: (item?.['sourceName'] as string) ?? '',
      difficultyLevel: (item?.['difficultyLevel'] as string) ?? '',
      planDuration: (item?.['planDuration'] as string) ?? '',
      contentStatus: (item?.['contentStatus'] as number) ?? 0,
      courseCategory: item['courseCategory'] as string,
      primaryCategory: item['primaryCategory'] as string,
      metadata: item ?? {}
    }))
  }

  processProgramCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      identifier: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      additionalTags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['duration'] as string) ?? '',
      status: (item?.['programStatus'] as string) ?? '',
      rating: this.resolveRating(item),
      provider: (item?.['sourceName'] as string) ?? '',
      difficultyLevel: '',
      planDuration: (item?.['planDuration'] as string) ?? '',
      contentStatus: (item?.['contentStatus'] as number) ?? 0,
      courseCategory: item['courseCategory'] as string,
      primaryCategory: item['primaryCategory'] as string,
      metadata: item ?? {}
    }))
  }

  private resolveRating(item: Record<string, unknown>): number {
    const raw = item?.['avgRating'] ?? item?.['averageRating']
    const rating = Number(raw)
    return Number.isFinite(rating) ? rating : 0
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
    if (res?.['response'] && typeof res['response'] === 'object') {
      const responseObj = res?.['response'] as Record<string, unknown> | undefined
      if (responseObj?.['courses'] && Array.isArray(responseObj['courses'])) {
        return responseObj['courses'] as Record<string, unknown>[]
      } else if (responseObj?.['under_30_mins'] && Array.isArray(responseObj['under_30_mins'])) {
        return responseObj['under_30_mins'] as Record<string, unknown>[]
      }
    }
    return []
  }
}
