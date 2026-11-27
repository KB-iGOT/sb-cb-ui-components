import { Injectable, computed, signal } from '@angular/core'
import { WsEvents } from './event.model'

export interface ISearchJourney {
  journeyId: string
  contentId: string
}

const STORAGE_KEY = 'searchJourney'
const CDATA_TYPE = 'global-search'
const EMPTY_JOURNEY: ISearchJourney = { journeyId: '', contentId: '' }

@Injectable({
  providedIn: 'root',
})
export class SearchJourneyService {
  private readonly journey = signal<ISearchJourney>(this.restore())
  readonly journeyId = computed(() => this.journey().journeyId)
  readonly clickedContentId = computed(() => this.journey().contentId)

  startJourney(): string {
    const journeyId = crypto.randomUUID()
    this.update({ journeyId, contentId: '' })
    return journeyId
  }

  setClickedContent(contentId: string) {
    const journeyId = this.journeyId() || this.startJourney()
    this.update({ journeyId, contentId })
  }

  endJourney() {
    this.update(EMPTY_JOURNEY)
  }

  getCdata(): WsEvents.ITelemetryCdata {
    const journeyId = this.journeyId() || this.startJourney()
    return { id: journeyId, type: CDATA_TYPE }
  }

  getCdataForContent(contentId: string | undefined): WsEvents.ITelemetryCdata | null {
    const { journeyId, contentId: clickedContentId } = this.journey()
    if (!journeyId || !contentId || contentId !== clickedContentId) {
      return null
    }
    return { id: journeyId, type: CDATA_TYPE }
  }

  private update(journey: ISearchJourney) {
    this.journey.set(journey)
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(journey))
    } catch {
    }
  }

  private restore(): ISearchJourney {
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
      if (stored && typeof stored.journeyId === 'string' && typeof stored.contentId === 'string') {
        return { journeyId: stored.journeyId, contentId: stored.contentId }
      }
    } catch {
    }
    return EMPTY_JOURNEY
  }
}
