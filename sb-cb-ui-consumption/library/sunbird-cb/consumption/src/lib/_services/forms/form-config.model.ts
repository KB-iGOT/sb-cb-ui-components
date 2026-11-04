/** A criterion value: '*' (any), a single value, or a list of accepted values */
export type FormCriterionValue = string | string[]

export interface FormRule {
  id: number
  name: string
  type?: string
  subType: string
  clientVersion: number
  /** A criterion left out means "any" */
  criteria: { [criterion: string]: FormCriterionValue }
}

/** The result of readFormDetails/<portal>: that portal's forms for the logged-in user's role */
export interface FormLookup {
  /** criteria names, highest priority first */
  rulePriority: string[]
  /** criterion name -> dot path in the user read response (array indexes allowed, e.g. "a.0.b") */
  userFields: { [criterion: string]: string }
  /**
   * criterion name -> its values, highest priority first. Used when the user's own value for the
   * criterion decides nothing but the forms matching the other criteria cover several values.
   */
  valuePriority?: { [criterion: string]: string[] }
  forms: FormRule[]
}
