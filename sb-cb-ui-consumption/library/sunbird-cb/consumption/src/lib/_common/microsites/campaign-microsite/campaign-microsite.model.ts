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
    /** `true` keeps the card closed until `eventDetails.startDate` */
    lockUntilEventStart?: boolean
    type: TMilestoneType
    identifier?: string
    batchId?: string
    /** Assessment only: sent as `?language=` to the auto-enrollment API and fills `{language}` in the player route */
    language?: string
    /** Assessment only: player route opened after enrollment */
    player?: IPlayerRoute
    formId?: string
    milestoneLabel: string
    headline?: string
    bigNumber?: string
    /** Header gradient, used when there is no usable `posterImage` */
    theme: TMilestoneTheme
    /** Header image for any card type. When it is set and loads, it replaces the gradient, headline and big number */
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

  /**
   * Player route split into path + query params. Tokens in braces are filled at click time:
   * `{resourceId}`, `{identifier}`, `{name}`, `{batchId}`, `{language}`.
   */
  export interface IPlayerRoute {
    path: string
    resourceId: string
    queryParams?: Record<string, string>
  }

  export interface IProvider {
    name: string
    logo: string
  }
}
