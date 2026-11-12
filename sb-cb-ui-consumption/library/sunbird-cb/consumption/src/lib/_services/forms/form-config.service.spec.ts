import { TestBed } from '@angular/core/testing'
import { HttpClient, provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ConfigurationsService, IndexedDbService } from '@sunbird-cb/utils-v2'
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

// lets the IndexedDB reads (promises) run, so the HTTP request they lead to is made
const settle = () => new Promise(resolve => setTimeout(resolve))

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

/** IndexedDbService over a Map, with the same never-rejecting withTimeout */
class MemoryDb {
  stores = new Map<string, Map<string, any>>()
  store(name: string) {
    if (!this.stores.has(name)) {
      this.stores.set(name, new Map())
    }
    return this.stores.get(name) as Map<string, any>
  }
  async get(name: string, key: string) { return this.store(name).get(key) }
  async put(name: string, key: string, value: any) { this.store(name).set(key, value) }
  async clear(name: string) { this.store(name).clear() }
  withTimeout<T>(operation: Promise<T>) { return operation.catch(() => undefined) }
}

describe('FormConfigService', () => {
  let service: FormConfigService
  let httpMock: HttpTestingController
  let appDb: MemoryDb
  let configSvc: { globalConfig: any }
  // the lookup the readFormDetails/portal API returns in these tests
  let lookup: FormLookup

  // clears the service and answers its portal lookup read with `lookup`
  const reloadLookup = async () => {
    service.clearCache()
    service.loadLookup('portal').subscribe()
    await settle()
    httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
    await settle()
  }

  const withTempForm = async (form: FormRule, run: () => void | Promise<void>) => {
    lookup.forms.push(form)
    await reloadLookup()
    try {
      await run()
    } finally {
      lookup.forms.splice(lookup.forms.indexOf(form), 1)
      await reloadLookup()
    }
  }

  const pick = (user: any, subType: string, clientVersion: number) => {
    const form = service.findForm(user, 'portal', subType, clientVersion)
    return form ? form.id : null
  }

  beforeEach(async () => {
    localStorage.clear()
    appDb = new MemoryDb()
    configSvc = { globalConfig: undefined }
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: IndexedDbService, useValue: appDb },
        { provide: ConfigurationsService, useValue: configSvc },
      ],
    })
    service = TestBed.inject(FormConfigService)
    httpMock = TestBed.inject(HttpTestingController)
    lookup = copyOf(API_LOOKUP)
    await reloadLookup()
  })

  afterEach(() => {
    httpMock.verify()
    jest.restoreAllMocks()
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
    it('a rootOrg specific form beats lower priority criteria, only for that org', async () => {
      const tempForm: FormRule = {
        id: 99, name: 'temp_root_org_form', subType: 'home', clientVersion: 2, criteria: { rootOrg: ROOT_ORG_ID },
      }
      await withTempForm(tempForm, () => {
        expect(pick(buildUser('Director', 'ministry'), 'home', 2)).toBe(99)
        expect(pick(buildUser('Director', 'ministry', 'other-org'), 'home', 2)).toBe(40)
      })
    })

    it('a criterion name in another case ("ROOTORG") still counts as that criterion', async () => {
      const tempForm: FormRule = {
        id: 95, name: 'temp_upper_case_criterion', subType: 'home', clientVersion: 2, criteria: { ROOTORG: ROOT_ORG_ID },
      }
      await withTempForm(tempForm, () => {
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
      const pickBoth = async (type?: string) => {
        let id: number | null = null
        await withTempForm(stateForm, () => withTempForm(ministryForm, () => {
          id = pick(buildUser('Both Sheets Officer', type), 'home', 2)
        }))
        return id
      }

      it('ministryOrStateType missing -> ministry form', async () => {
        expect(await pickBoth()).toBe(96)
      })

      it('ministryOrStateType matching neither sheet -> ministry form', async () => {
        expect(await pickBoth('SPV')).toBe(96)
      })

      it('ministryOrStateType state -> state form', async () => {
        expect(await pickBoth('state')).toBe(97)
      })

      it('ministryOrStateType ministry -> ministry form', async () => {
        expect(await pickBoth('ministry')).toBe(96)
      })
    })

    describe('userFields with a list of paths', () => {
      // the org's own type is the fallback when its ministryOrStateType is one no form uses (SPV)
      const orgUser = (designation: string, rootOrg: any) => ({
        rootOrgId: ROOT_ORG_ID,
        rootOrg,
        profileDetails: { professionalDetails: [{ designation }] },
      })

      beforeEach(async () => {
        lookup.userFields.ministryOrStateType = ['rootOrg.ministryOrStateType', 'rootOrg.sbOrgType']
        await reloadLookup()
      })

      const cases: [string, any, number | null][] = [
        ['SPV org of type ministry', orgUser('Deputy Secretary', { ministryOrStateType: 'SPV', sbOrgType: 'ministry' }), 40],
        ['SPV org of type state', orgUser('Principal Secretary', { ministryOrStateType: 'SPV', sbOrgType: 'state' }), 43],
        ['SPV org of a type no form uses', orgUser('Deputy Secretary', { ministryOrStateType: 'SPV', sbOrgType: 'mdo' }), 30],
        ['SPV org without a type', orgUser('Deputy Secretary', { ministryOrStateType: 'SPV' }), 30],
        ['state org: the first known value wins', orgUser('Deputy Secretary', { ministryOrStateType: 'State', sbOrgType: 'ministry' }), 30],
        ['ministryOrStateType missing, type ministry', orgUser('Director', { sbOrgType: 'ministry' }), 40],
        ['no rootOrg', orgUser('Director', undefined), 30],
      ]

      cases.forEach(([label, user, expected]) => {
        it(`${label} -> ${expected}`, () => {
          expect(pick(user, 'home', 2)).toBe(expected)
        })
      })
    })
  })

  describe('lookup from the readFormDetails API', () => {
    it('uses the form ids of the lookup the API returns', async () => {
      expect(pick(buildUser(), 'global-web', 2)).toBe(28)
      expect(pick(buildUser(), 'globalenv', 1)).toBe(55)

      lookup.forms[0].id = 80
      await reloadLookup()
      expect(pick(buildUser(), 'global-web', 2)).toBe(80)
    })

    it('reads each portal\'s own lookup', async () => {
      service.loadLookup('mobile').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('mobile')).flush({ result: { ...copyOf(lookup),
        forms: [{ id: 89, name: 'mobile-page-home_Public_v2', subType: 'home', clientVersion: 2, criteria: { rootOrg: '*' } }] } })
      await settle()

      expect(service.findForm(buildUser(), 'mobile', 'home', 2)?.id).toBe(89)
      expect(service.findForm(buildUser(), 'portal', 'home', 2)?.id).toBe(30)
      expect(service.findForm(buildUser(), 'other', 'home', 2)).toBeNull()
    })

    it('has no forms before the lookup has loaded, or when the response has no forms list', async () => {
      service.clearCache()
      expect(pick(buildUser(), 'global-web', 2)).toBeNull()

      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: {} })
      await settle()
      expect(pick(buildUser(), 'global-web', 2)).toBeNull()

      // the old shape, forms grouped by role, is not a list
      service.clearCache()
      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: { ...copyOf(lookup), forms: { public: { portal: lookup.forms } } } })
      await settle()
      expect(pick(buildUser(), 'global-web', 2)).toBeNull()
    })

    it('reads the lookup once for all getForm calls', async () => {
      service.clearCache()
      const user = buildUser()
      service.getForm(user, 'portal', 'globalenv', 1).subscribe()
      service.getForm(user, 'portal', 'globalenv', 1).subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
      await settle()
      httpMock.expectOne(READ_URL(55)).flush({})
    })

    it('a failed lookup read errors getForm, and the next call reads it again', async () => {
      service.clearCache()
      const user = buildUser()
      let failed = false
      service.getForm(user, 'portal', 'globalenv', 1).subscribe({ error: () => { failed = true } })
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush(null, { status: 500, statusText: 'Server Error' })
      await settle()
      expect(failed).toBe(true)

      service.getForm(user, 'portal', 'globalenv', 1).subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
      await settle()
      httpMock.expectOne(READ_URL(55)).flush({})
    })
  })

  describe('IndexedDB cache', () => {
    // a new service instance, as after a page reload: nothing in memory, the same IndexedDB
    const reloadPage = () => {
      service = new FormConfigService(TestBed.inject(HttpClient), configSvc as any, appDb as any)
    }
    const minutesAgo = (minutes: number) => Date.now() - minutes * 60 * 1000

    it('stores the lookup per portal with the time it was read', () => {
      const stored = appDb.store('forms').get('portal')
      expect(stored.data.forms.length).toBe(API_LOOKUP.forms.length)
      expect(Date.now() - stored.cachedAt).toBeLessThan(5000)
    })

    it('serves a fresh stored lookup without calling the API', async () => {
      reloadPage()
      await service.loadLookup('portal').toPromise()
      httpMock.expectNone(LOOKUP_URL('portal'))
      expect(pick(buildUser(), 'global-web', 2)).toBe(28)
    })

    it('calls the API when the stored lookup is older than apicache.formLookupTime', async () => {
      configSvc.globalConfig = { apicache: { formLookupTime: 600 } }
      appDb.store('forms').get('portal').cachedAt = minutesAgo(9)
      reloadPage()
      await service.loadLookup('portal').toPromise()
      httpMock.expectNone(LOOKUP_URL('portal'))

      appDb.store('forms').get('portal').cachedAt = minutesAgo(11)
      reloadPage()
      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
      await settle()
      expect(Date.now() - appDb.store('forms').get('portal').cachedAt).toBeLessThan(5000)
    })

    it('uses 5 minutes when no cache time is configured', async () => {
      appDb.store('forms').get('portal').cachedAt = minutesAgo(4)
      reloadPage()
      await service.loadLookup('portal').toPromise()
      httpMock.expectNone(LOOKUP_URL('portal'))

      appDb.store('forms').get('portal').cachedAt = minutesAgo(6)
      reloadPage()
      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
    })

    it('before globalConfig loads, uses the cache time seen last', async () => {
      configSvc.globalConfig = { apicache: { formLookupTime: 3600 } }
      await service.loadLookup('portal').toPromise()
      // next page load: the first lookup runs before globalConfig is read
      configSvc.globalConfig = undefined
      appDb.store('forms').get('portal').cachedAt = minutesAgo(30)
      reloadPage()
      await service.loadLookup('portal').toPromise()
      httpMock.expectNone(LOOKUP_URL('portal'))
    })

    it('reads the API again once the lookup in memory has expired', async () => {
      const now = Date.now()
      jest.spyOn(Date, 'now').mockReturnValue(now + 6 * 60 * 1000)
      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
      await settle()
    })

    it('falls back to the expired stored lookup when the API fails', async () => {
      appDb.store('forms').get('portal').cachedAt = minutesAgo(60)
      reloadPage()
      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush(null, { status: 500, statusText: 'Server Error' })
      await settle()
      expect(pick(buildUser(), 'global-web', 2)).toBe(28)
    })

    it('does not store a response without forms', async () => {
      service.clearCache()
      service.loadLookup('portal').subscribe()
      await settle()
      httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: {} })
      await settle()
      expect(appDb.store('forms').has('portal')).toBe(false)
    })

    it('clearCache empties the stored lookups', async () => {
      service.clearCache()
      await settle()
      expect(appDb.store('forms').size).toBe(0)
    })
  })

  describe('getForm', () => {
    const tempForm: FormRule = {
      id: 98, name: 'temp_get_form', subType: 'getFormTest', clientVersion: 1, criteria: {},
    }
    const user = buildUser('Director', 'ministry')

    it('calls the read API once per form id and returns the cached response after that', async () => {
      await withTempForm(tempForm, async () => {
        const response = { result: { data: { homeSection: [] } } }
        const received: any[] = []

        service.getForm(user, 'portal', 'getFormTest', 1).subscribe(res => received.push(res))
        await settle()
        const req = httpMock.expectOne(READ_URL(98))
        expect(req.request.method).toBe('GET')
        req.flush(response)

        service.getForm(user, 'portal', 'getFormTest', 1).subscribe(res => received.push(res))
        await settle()
        httpMock.expectNone(READ_URL(98))

        expect(received).toEqual([response, response])
      })
    })

    it('calls the read API again after clearCache', async () => {
      await withTempForm(tempForm, async () => {
        service.getForm(user, 'portal', 'getFormTest', 1).subscribe()
        await settle()
        httpMock.expectOne(READ_URL(98)).flush({})

        service.clearCache()
        service.getForm(user, 'portal', 'getFormTest', 1).subscribe()
        await settle()
        httpMock.expectOne(LOOKUP_URL('portal')).flush({ result: copyOf(lookup) })
        await settle()
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
