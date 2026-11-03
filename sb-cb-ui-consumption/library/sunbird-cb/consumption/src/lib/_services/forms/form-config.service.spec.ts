import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { FormConfigService } from './form-config.service'
import { FormLookup, FormRule } from './form-config.model'

const ROOT_ORG_ID = '01392275379456409617'
const LOOKUP_URL = (portal: string) => `/apis/proxies/v8/formsConfig/v1/readFormDetails/${portal}`
const READ_URL = (formId: number) => `/apis/proxies/v8/formsConfig/v1/readById/${formId}`

// A readFormDetails/portal result, trimmed to the forms these tests use
const API_LOOKUP: FormLookup = {
  rulePriority: ['rootOrg', 'designation', 'ministryOrStateType'],
  userFields: {
    rootOrg: 'rootOrgId',
    designation: 'profileDetails.professionalDetails.0.designation',
    ministryOrStateType: 'profileDetails.ministryOrStateType',
  },
  valuePriority: { ministryOrStateType: ['ministry', 'state'] },
  forms: [
    { id: 28, name: 'portal_page_global-web-v2_public', type: 'page', subType: 'global-web', clientVersion: 2, criteria: { rootOrg: '*' } },
    { id: 55, name: 'portal_global_env_config', type: 'page', subType: 'globalenv', clientVersion: 1, criteria: {} },
    { id: 30, name: 'portal_page_home_v2_public', type: 'page', subType: 'home', clientVersion: 2, criteria: { rootOrg: '*' } },
    { id: 40, name: 'portal_page_home_designation_sheet_1_ministry', type: 'page', subType: 'home', clientVersion: 2,
      criteria: { rootOrg: '*', designation: ['Director', 'Deputy Secretary'], ministryOrStateType: ['ministry'] } },
    { id: 43, name: 'portal_page_home_designation_sheet_2_state', type: 'page', subType: 'home', clientVersion: 2,
      criteria: { rootOrg: '*', designation: ['Principal Secretary', 'Chief Secretary'], ministryOrStateType: ['state'] } },
    { id: 4, name: 'portal_page_toc_public', type: 'page', subType: 'toc', clientVersion: 1, criteria: { rootOrg: '*' } },
  ],
}

// a fresh copy per response, so a test's changes never leak into the next one
const copyOf = (lookup: any): FormLookup => JSON.parse(JSON.stringify(lookup))

// Shape of the real user read response
const buildUser = (designation?: string, ministryOrStateType?: string, rootOrgId = ROOT_ORG_ID) => {
  const profileDetails: any = {
    professionalDetails: [{ group: 'Group C', designation }],
  }
  if (ministryOrStateType !== undefined) {
    profileDetails.ministryOrStateType = ministryOrStateType
  }
  return {
    roles: ['PUBLIC'],
    rootOrgId,
    // not used for matching, profileDetails.ministryOrStateType is
    rootOrg: { ministryOrStateType: 'SPV' },
    profileDetails,
  }
}

describe('FormConfigService', () => {
  let service: FormConfigService
  let httpMock: HttpTestingController
  // the lookup the readFormDetails/portal API returns in these tests
  let lookup: FormLookup

  // clears the service and answers its portal lookup read with `lookup`
  const reloadLookup = () => {
    service.clearCache()
    service.loadLookup('portal').subscribe()
    httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
  }

  const withTempForm = (form: FormRule, run: () => void) => {
    lookup.forms.push(form)
    reloadLookup()
    try {
      run()
    } finally {
      lookup.forms.splice(lookup.forms.indexOf(form), 1)
      reloadLookup()
    }
  }

  const pick = (user: any, subType: string, clientVersion: number) => {
    const form = service.findForm(user, 'portal', subType, clientVersion)
    return form ? form.id : null
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(FormConfigService)
    httpMock = TestBed.inject(HttpTestingController)
    lookup = copyOf(API_LOOKUP)
    reloadLookup()
  })

  afterEach(() => {
    httpMock.verify()
  })

  describe('findForm portal home, clientVersion 2', () => {
    const cases: [string, any, number | null][] = [
      ['Sales Tax Officer, ministry', buildUser('Sales Tax Officer', 'ministry'), 30],
      ['Director, ministry', buildUser('Director', 'ministry'), 40],
      ['"director " lowercase with trailing space, Ministry', buildUser('director ', 'Ministry'), 40],
      ['Principal Secretary, state', buildUser('Principal Secretary', 'state'), 43],
      ['Director, ministryOrStateType missing', buildUser('Director'), 30],
      ['no designation', buildUser(), 30],
      ['no user', null, 30],
    ]

    cases.forEach(([label, user, expected]) => {
      it(`${label} -> ${expected}`, () => {
        expect(pick(user, 'home', 2)).toBe(expected)
      })
    })
  })

  describe('findForm portal toc', () => {
    it('clientVersion 1 -> 4', () => {
      expect(pick(buildUser('Director', 'ministry'), 'toc', 1)).toBe(4)
    })

    it('clientVersion 2 -> null (exact version, no fallback)', () => {
      expect(pick(buildUser('Director', 'ministry'), 'toc', 2)).toBeNull()
    })
  })

  describe('generic engine', () => {
    it('a rootOrg specific form beats lower priority criteria, only for that org', () => {
      const tempForm: FormRule = {
        id: 99, name: 'temp_root_org_form', subType: 'home', clientVersion: 2, criteria: { rootOrg: ROOT_ORG_ID },
      }
      withTempForm(tempForm, () => {
        expect(pick(buildUser('Director', 'ministry'), 'home', 2)).toBe(99)
        expect(pick(buildUser('Director', 'ministry', 'other-org'), 'home', 2)).toBe(40)
      })
    })

    it('a criterion name in another case ("ROOTORG") still counts as that criterion', () => {
      const tempForm: FormRule = {
        id: 95, name: 'temp_upper_case_criterion', subType: 'home', clientVersion: 2, criteria: { ROOTORG: ROOT_ORG_ID },
      }
      withTempForm(tempForm, () => {
        expect(pick(buildUser('Director', 'ministry'), 'home', 2)).toBe(95)
        expect(pick(buildUser('Director', 'ministry', 'other-org'), 'home', 2)).toBe(40)
      })
    })

    describe('designation on both the ministry and the state sheet', () => {
      // state form added first, so ministry winning comes from valuePriority, not lookup order
      const stateForm: FormRule = {
        id: 97, name: 'temp_both_sheets_state', subType: 'home', clientVersion: 2,
        criteria: { rootOrg: '*', designation: ['Both Sheets Officer'], ministryOrStateType: ['state'] },
      }
      const ministryForm: FormRule = {
        id: 96, name: 'temp_both_sheets_ministry', subType: 'home', clientVersion: 2,
        criteria: { rootOrg: '*', designation: ['Both Sheets Officer'], ministryOrStateType: ['ministry'] },
      }
      const pickBoth = (type?: string) => {
        let id: number | null = null
        withTempForm(stateForm, () => withTempForm(ministryForm, () => {
          id = pick(buildUser('Both Sheets Officer', type), 'home', 2)
        }))
        return id
      }

      it('ministryOrStateType missing -> ministry form', () => {
        expect(pickBoth()).toBe(96)
      })

      it('ministryOrStateType matching neither sheet -> ministry form', () => {
        expect(pickBoth('SPV')).toBe(96)
      })

      it('ministryOrStateType state -> state form', () => {
        expect(pickBoth('state')).toBe(97)
      })

      it('ministryOrStateType ministry -> ministry form', () => {
        expect(pickBoth('ministry')).toBe(96)
      })
    })
  })

  describe('lookup from the readFormDetails API', () => {
    it('uses the form ids of the lookup the API returns', () => {
      expect(pick(buildUser(), 'global-web', 2)).toBe(28)
      expect(pick(buildUser(), 'globalenv', 1)).toBe(55)

      lookup.forms[0].id = 80
      reloadLookup()
      expect(pick(buildUser(), 'global-web', 2)).toBe(80)
    })

    it('reads each portal\'s own lookup', () => {
      service.loadLookup('mobile').subscribe()
      httpMock.expectOne(LOOKUP_URL('mobile')).flush({ result: { ...copyOf(lookup),
        forms: [{ id: 89, name: 'mobile-page-home_Public_v2', subType: 'home', clientVersion: 2, criteria: { rootOrg: '*' } }] } })

      expect(service.findForm(buildUser(), 'mobile', 'home', 2)?.id).toBe(89)
      expect(service.findForm(buildUser(), 'portal', 'home', 2)?.id).toBe(30)
      expect(service.findForm(buildUser(), 'other', 'home', 2)).toBeNull()
    })

    it('has no forms before the lookup has loaded, or when the response has no forms list', () => {
      service.clearCache()
      expect(pick(buildUser(), 'global-web', 2)).toBeNull()

      service.loadLookup('portal').subscribe()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: {} })
      expect(pick(buildUser(), 'global-web', 2)).toBeNull()

      // the old shape, forms grouped by role, is not a list
      service.clearCache()
      service.loadLookup('portal').subscribe()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: { ...copyOf(lookup), forms: { public: { portal: lookup.forms } } } })
      expect(pick(buildUser(), 'global-web', 2)).toBeNull()
    })

    it('reads the lookup once for all getForm calls', () => {
      service.clearCache()
      const user = buildUser()
      service.getForm(user, 'portal', 'globalenv', 1).subscribe()
      service.getForm(user, 'portal', 'globalenv', 1).subscribe()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
      httpMock.expectOne(READ_URL(55)).flush({})
    })

    it('a failed lookup read errors getForm, and the next call reads it again', () => {
      service.clearCache()
      const user = buildUser()
      let failed = false
      service.getForm(user, 'portal', 'globalenv', 1).subscribe({ error: () => { failed = true } })
      httpMock.expectOne(LOOKUP_URL('portal')).flush(null, { status: 500, statusText: 'Server Error' })
      expect(failed).toBe(true)

      service.getForm(user, 'portal', 'globalenv', 1).subscribe()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
      httpMock.expectOne(READ_URL(55)).flush({})
    })
  })

  describe('getForm', () => {
    const tempForm: FormRule = {
      id: 98, name: 'temp_get_form', subType: 'getFormTest', clientVersion: 1, criteria: {},
    }
    const user = buildUser('Director', 'ministry')

    it('calls the read API once per form id and returns the cached response after that', () => {
      withTempForm(tempForm, () => {
        const response = { result: { data: { homeSection: [] } } }
        const received: any[] = []

        service.getForm(user, 'portal', 'getFormTest', 1).subscribe(res => received.push(res))
        const req = httpMock.expectOne(READ_URL(98))
        expect(req.request.method).toBe('GET')
        req.flush(response)

        service.getForm(user, 'portal', 'getFormTest', 1).subscribe(res => received.push(res))
        httpMock.expectNone(READ_URL(98))

        expect(received).toEqual([response, response])
      })
    })

    it('calls the read API again after clearCache', () => {
      withTempForm(tempForm, () => {
        service.getForm(user, 'portal', 'getFormTest', 1).subscribe()
        httpMock.expectOne(READ_URL(98)).flush({})

        service.clearCache()
        service.getForm(user, 'portal', 'getFormTest', 1).subscribe()
        httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
        httpMock.expectOne(READ_URL(98)).flush({})
      })
    })

    it('errors with portal, subType and clientVersion when no form is found', done => {
      service.getForm(user, 'portal', 'noSuchPage', 7).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('portal')
          expect(err.message).toContain('noSuchPage')
          expect(err.message).toContain('7')
          done()
        },
      })
    })
  })
})
