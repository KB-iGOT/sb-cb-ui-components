import { FormLookup } from './form-config.model'

/*
 * Form selection rules. FormConfigService reads them from the readFormDetails API
 * (/apis/proxies/v8/formsConfig/v1/readFormDetails/<portal>, the lookup in `result`), once per
 * portal per session and again after clearCache(). The server returns the forms for the logged-in
 * user's role, so the client doesn't check roles. The shape is rulePriority, userFields,
 * valuePriority, forms (a list). FormConfigService is a generic engine that reads it.
 * This file only documents it.
 *
 * If the lookup can't be read, or has no forms list, getForm() errors and each page falls back
 * to its local JSON config.
 *
 * How a form is picked:
 *   1. Lookup: readFormDetails/<portal>, already narrowed to the user's role by the server.
 *   2. Candidates: the forms with the exact subType and clientVersion (1.0 and 1 are equal).
 *   3. Eligible: every criterion in the form matches the user ('*' or missing = any,
 *      otherwise trimmed, case-insensitive equality or membership in the list). Criterion names
 *      are case-insensitive too ("rootorg" is rootOrg); one not in userFields never matches.
 *   4. Best: the most specific eligible form. A specific (non-'*') value on the criterion at
 *      index i of `rulePriority` is worth 2^(n-1-i), so higher priority always wins.
 *   5. Value priority: if the user's own value for a criterion in `valuePriority` decided nothing
 *      (missing, or matches no form) and the forms matching every other criterion cover more than
 *      one of its values, the form with the first listed value wins over the step 4 result.
 *      e.g. a designation on both the ministry and the state sheet, with no ministryOrStateType,
 *      gets the ministry form. A designation on only one sheet still needs the type to match.
 *
 * To add a form:
 *   Add { id, name, type, subType, clientVersion, criteria } to that portal's forms for the role(s)
 *   in the API. Its config is read from /apis/proxies/v8/formsConfig/v1/readById/<id>.
 *
 * To add a criterion (in every environment's lookup):
 *   1. Add its name to `rulePriority` at the right priority.
 *   2. Add its dot path in the user read response to `userFields`.
 *   3. Use it in the `criteria` of the forms that need it.
 *
 * Forms with the same subType, clientVersion and specificity: the first one in the response wins.
 */
/** Used when the lookup can't be read or has no forms list: nothing matches */
export const EMPTY_FORM_LOOKUP: FormLookup = { rulePriority: [], userFields: {}, forms: [] }
