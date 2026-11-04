export namespace NsCampaignMilestone {
  export type TMilestoneType = 'assessment' | 'event' | 'survey'
  export type TMilestoneTheme = 'blue' | 'purple' | 'orange' | 'image'
  /** UI state of a milestone card, resolved by the host page from enrollment/survey APIs */
  export type TMilestoneState = 'locked' | 'notStarted' | 'inProgress' | 'completed'

  /** One entry of `individualSection.programmeMilestones.items` in the microsite page config */
  export interface IMilestone {
    order: number
    /** `false` greys the card out and makes it inactive; defaults to `true` */
    enabled?: boolean
    /** `true` shows the card as Locked; availability comes from config, not from `order` */
    locked?: boolean
    type: TMilestoneType
    identifier?: string
    batchId?: string
    formId?: string
    milestoneLabel: string
    headline?: string
    bigNumber?: string
    theme: TMilestoneTheme
    posterImage?: string
    durationLabel: string
    categoryLabel: string
    name: string
    tags: string[]
    provider: IProvider
    /** DD-MM-YYYY */
    dueDate?: string
    redirectUrl?: string
  }

  export interface IProvider {
    name: string
    logo: string
  }
}
