import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NSProfileDataV3 } from '../models/profile-v3.models'
import { BehaviorSubject, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs'
import { catchError, map, shareReplay, tap } from 'rxjs/operators'
// import { environment } from '../../../../../../src/environments/environment'
import { NsPage } from '../resolvers/page.model'
import { NsAppsConfig, NsInstanceConfig, NsUser } from './configurations.model'
import { IPortalUrls, IUserPreference } from './user-preference.model'
import * as _ from 'lodash'

// const instanceConfigPath: string | null = window.location.host
// const locationHost: string | null = window.location.host

// if (!environment.production && Boolean(environment.sitePath)) {
//   locationHost = environment.sitePath
//   instanceConfigPath = environment.sitePath
// }
@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService {
  // update as the single source of truth
  constructor(private http: HttpClient) {
    // @Inject('env') env: any
    // if (!env.production && Boolean(env.sitePath)) {
    //   locationHost = env.sitePath
    //   instanceConfigPath = env.sitePath
    // }
  }
  appSetup = true
  // The url the user tried to access while landing in the app before accepting tnc
  userUrl = ''
  baseUrl = `assets/configurations`
  sitePath = `assets/configurations`
  hostPath = (window.location.host).replace(':', '_')

  userRoles: Set<string> | null = null
  userAllRoles: Set<string> | null = null
  userGroups: Set<string> | null = null
  restrictedFeatures: Set<string> | null = null
  restrictedWidgets: Set<string> | null = null
  instanceConfig: NsInstanceConfig.IConfig | null = null
  appsConfig: NsAppsConfig.IAppsConfig | null = null
  rootOrg: string | null = null
  courseContentPath?: string
  org: string[] | null = null
  activeOrg: string | null = ''
  isProduction = false
  hasAcceptedTnc = false
  profileDetailsStatus = false
  isActive = true
  userPreference: IUserPreference | null = null
  userProfile: NsUser.IUserProfile | null = null
  userProfileV2: NsUser.IUserProfile | null = null
  nodebbUserProfile: NsUser.INodebbUserProfile | null = null
  // created to store complete user details sent by pid
  unMappedUser: any
  isAuthenticated = false
  isNewUser = false
  portalUrls: IPortalUrls | undefined
  positions: any
  overrideThemeChanges: any
  profileTimelyNudges: any

  // pinnedApps
  pinnedApps = new BehaviorSubject<Set<string>>(new Set())

  // Notifier
  prefChangeNotifier = new ReplaySubject<Partial<IUserPreference>>(1)
  tourGuideNotifier = new ReplaySubject<boolean>()
  authChangeNotifier = new ReplaySubject<boolean>(1)

  private updateProfile = new BehaviorSubject(false)
  updateProfileObservable = this.updateProfile.asObservable()

  updateTourGuide = new BehaviorSubject(true)
  updateTourGuideObservable = this.updateTourGuide.asObservable()

  // platform rating
  updatePlatformRating = new BehaviorSubject({ bottom: '120px' })
  updatePlatformRatingObservable$ = this.updatePlatformRating.asObservable()

  languageTranslationFlag = new Subject()

  // Preference Related Values
  activeThemeObject: NsInstanceConfig.ITheme | null = null
  activeFontObject: NsInstanceConfig.IFontSize | null = null
  isDarkMode = false
  isIntranetAllowed = false
  isRTL = false
  activeLocale: NsInstanceConfig.ILocalsConfig | null = null
  activeLocaleGroup = ''
  completedActivity: string[] | null = null
  completedTour = false
  profileSettings = ['profilePicture', 'learningTime', 'learningPoints']

  primaryNavBar: Partial<NsPage.INavBackground> = {
    color: 'primary',
  }
  pageNavBar: Partial<NsPage.INavBackground> = {
    color: 'primary',
  }
  primaryNavBarConfig: NsInstanceConfig.IPrimaryNavbarConfig | null = null
  /* for temp Fix */
  // setBaseUrl = (sitePath: string) => `assets/configurations/${(sitePath).replace(':', '_')}`
  // setSitePath = (sitePath: string) => `assets/configurations/${(sitePath).replace(
  //   ':',
  //   '_',
  // )}`
  // setHostPath = (sitePath: string) => (sitePath).replace(':', '_')
  welcomeTabs: NSProfileDataV3.IProfileTab | null = null
  compentency: any = null
  competency: any
  iGOTAIConfig: any
  // variable setting for csJwtToken
  cstoken = ''
  netcoreConfig: any = {}
  completionSurvey: any = {}
  globalConfig: any = {}
  globalConfigLoadFailed = false

  changeNavBarFullView = new Subject()
  openExploreMenuForMWeb = new Subject()
  headerFooterConfigData: any = null
  orgReadData: any
  spvOrgReadData: any
  menus: any
  // Stores form read API response for reuse across calls
  formReadData: any = null
  // Holds the in-flight Observable so concurrent callers share one HTTP request
  private formDataRequest$: Observable<any> | null = null

  public readonly noSpecialChar = new RegExp(/^[\p{L}\p{M}\p{N}\p{Cf}._\-$/:।()\[\]'! ]+$/u)
  public readonly assessmentNoSpecialChar = new RegExp(/^[\p{L}\p{M}\p{N}\p{Cf}._\-\s$":/?,।()\[\]'! ]+$/u)
  public readonly htmlTasRemovalRegex = /<\/?[^>]+>|&nbsp;|<br\s*\/?>|<\/br>|&#39;|&quot;/gi
  public readonly noSpecialCharHowToSection = new RegExp(/^[\p{L}\p{M}\p{N}\p{Cf}._\-$/:,।()\[\]'! ]+$/u)
  updateGlobalProfile(state: boolean) {
    this.updateProfile.next(state)
  }

  updateTourGuideMethod(state: boolean) {
    this.updateTourGuide.next(state)
  }

  updatePlatformRatingMethod(state: any) {
    this.updatePlatformRating.next(state)
  }

  private updateOrgReadData: BehaviorSubject<string> = new BehaviorSubject('')
  updateOrgReadDataObservable = this.updateOrgReadData.asObservable()
  updateOrgData(id: string) {
    this.updateOrgReadData.next(id)
  }

  /**
   * Parent method — returns filtered form data as an Observable.
   * Uses cached data if available; otherwise fetches from the form read API.
   * @param formSubType  Key-value pairs used to filter the form fields
   */
  getFormData(formSubType: string): Observable<any> {
    if (this.formReadData) {
      return of(this.filterFormData(this.formReadData, formSubType))
    }
    if (!this.formDataRequest$) {
      this.formDataRequest$ = this.fetchAndStoreFormData().pipe(shareReplay(1))
    }
    return this.formDataRequest$.pipe(
      map(() => this.filterFormData(this.formReadData, formSubType))
    )
  }

  /**
   * Fetches form data from the form read API and stores it in formReadData.
   */
  private fetchAndStoreFormData(): Observable<any> {
    const url = '/apis/v1/form/read'
    const requestData: any = {
      'request': {
        'type': 'page',
        'subType': 'portal-global-config',
        'action': 'page-configuration',
        'component': 'portal',
        'rootOrgId': '*',
      },
    }
    return this.http.post<any>(url, requestData).pipe(
      tap((data: any) => {
        this.formReadData = _.get(data, 'result.form.data', null)
      }),
      catchError((err: any) => {
        this.formDataRequest$ = null
        return throwError(err)
      })
    )
  }

  /**
   * Filters form data based on the provided params.
   * If data is an array, returns items where every param key-value matches.
   * If data is an object, returns it as-is (extend as needed).
   */
  private filterFormData(data: any, formSubType: string): any {
    if (data && typeof data === 'object' && formSubType) {
      return _.get(data, formSubType, null)
    }
    return null
  }

}
