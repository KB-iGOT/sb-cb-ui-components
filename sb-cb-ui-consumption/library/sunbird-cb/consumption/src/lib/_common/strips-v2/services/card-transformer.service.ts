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

  mapTheData(data: any, apiDetailsKey?: string): CardViewModel[] {
    const mapedData: CardViewModel[] = []
    switch (apiDetailsKey) {
      case 'aparApi':
        const todayDate = dayjs().format('YYYY-MM-DD')
        const filteredData = data.filter((item: any) => item?.isApar === true)
        filteredData.forEach((item: any) => {
          item.contentList.forEach((childData: any) => {
            const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
            const daysCount = dayjs(endDate).diff(todayDate, 'day')
            childData['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
              ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
            childData['endDate'] = item.endDate
            childData['parentId'] = item.id
            childData['planType'] = 'cbPlan'
            childData['contentStatus'] = 0
            childData['isApar'] = item.isApar
            const card: CardViewModel = {
              id: (item?.['id'] as string) ?? '',
              title: (childData?.['name'] as string) ?? '',
              image: (childData?.['posterImage'] as string) ?? (childData?.['posterImage'] as string) ?? '',
              tags: (childData?.['tags'] as string[]) ?? [],
              duration: (childData?.['duration'] as string) ?? '',
              status: (childData?.['status'] as string) ?? '',
              rating: (childData?.['averageRating'] as number) ?? 0,
              provider: (childData?.['sourceName'] as string) ?? (childData?.['source'] as string) ?? '',
              level: (childData?.['complexityLevel'] as string) ?? '',
              metadata: childData ?? {}
            }
            mapedData.push(card)
            // contentIds.push(childData.identifier)
            // if (childData.status !== NsCardContent.IGOTConst.RETIRED) {
            //   cbpContentData.push(childData)
            // }
          })
        })
        break
      case 'trainingPlanApi':
        const todaysDate = dayjs().format('YYYY-MM-DD')
        data.forEach((item: any) => {
          item.contentList.forEach((childData: any) => {
            const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
            const daysCount = dayjs(endDate).diff(todaysDate, 'day')
            childData['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
              ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
            childData['endDate'] = item.endDate
            childData['parentId'] = item.id
            childData['planType'] = 'cbPlan'
            childData['contentStatus'] = 0
            childData['isApar'] = item.isApar
            const card: CardViewModel = {
              id: (item?.['id'] as string) ?? '',
              title: (childData?.['name'] as string) ?? '',
              image: (childData?.['posterImage'] as string) ?? (childData?.['posterImage'] as string) ?? '',
              tags: (childData?.['tags'] as string[]) ?? [],
              duration: (childData?.['duration'] as string) ?? '',
              status: (childData?.['status'] as string) ?? '',
              rating: (childData?.['averageRating'] as number) ?? 0,
              provider: (childData?.['sourceName'] as string) ?? (childData?.['source'] as string) ?? '',
              level: (childData?.['complexityLevel'] as string) ?? '',
              metadata: childData ?? {}
            }
            mapedData.push(card)
          })
        })
        break
      case 'trendingOnIGOTApi':
        data.forEach((item: any) => {
          const card: CardViewModel = {
            id: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['appIcon'] as string) ?? (item?.['posterImage'] as string) ?? '',
            tags: (item?.['additionalTags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: (item?.['avgRating'] as number) ?? (item?.['averageRating'] as number) ?? 0,
            provider: (item?.['source'] as string) ?? (item?.['sourceName'] as string) ?? '',
            level: (item?.['difficultyLevel'] as string) ?? '',
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'featuredAiCoursesApi':
        data.forEach((item: any) => {
          const card: CardViewModel = {
            id: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            tags: (item?.['tags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: (item?.['averageRating'] as number) ?? 0,
            provider: (item?.['sourceName'] as string) ?? (item?.['sourceName'] as string) ?? '',
            level: (item?.['difficultyLevel'] as string) ?? '',
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      default:
        data.forEach((item: any) => {
          const card: CardViewModel = {
            id: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            tags: (item?.['tags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: (item?.['averageRating'] as number) ?? 0,
            provider: (item?.['sourceName'] as string) ?? (item?.['source'] as string) ?? '',
            level: (item?.['complexityLevel'] as string) ?? '',
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
