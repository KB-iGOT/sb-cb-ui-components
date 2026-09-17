import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, Optional, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { ConfigurationsService, EventService, MultilingualTranslationsService, WidgetContentService, WsEvents } from '@sunbird-cb/utils-v2'
import { LoaderService } from '../../services/loader.service'
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { CertificateService } from '../../services/certificate.service'
import { NsDiscussionV2 } from '@sunbird-cb/discussion-v2'
import * as _ from 'lodash'
import { NetCoreService } from '../../services/netcore.service'
import { ConsentDialogComponent } from './consent-dialog.component'

const KARMA_REDEEM_PAGE_ID = 'app/toc/ext'
const KARMA_REDEEM_ENV = 'Marketplace'
const KARMA_REDEEM_CONTINUE = 'redeem-karma-coins-continue'
const KARMA_REDEEM_CANCEL = 'redeem-karma-coins-cancel'

const KARMA_WALLET_ROUTE = '/app/person-profile/karma-wallet'
/* what both cios-enroll calls answer with when the balance is short */
const PAYMENT_REQUIRED = 'PAYMENT_REQUIRED'
const INSUFFICIENT_COINS = [
  /insufficient[^.]*karma\s*coins?/i,
  /enough\s+karma\s*coins?/i,
  /minimum\s+karma\s*coins?\s+required/i,
  /not\s+that\s+much\s+karma\s*coins?/i,
]
const ENROL_STATUS_PENDING = 3
const ENROLLED_NOTICE_WINDOW_MS = 60 * 60 * 1000

@Component({
    selector: 'ws-app-app-toc-cios-home',
    templateUrl: './app-toc-cios-home.component.html',
    styleUrls: ['./app-toc-cios-home.component.scss'],
    standalone: false
})
export class AppTocCiosHomeComponent implements OnInit, AfterViewInit {
  commentId?: string = ''
  skeletonLoader = true
  extContentReadData: any = {}
  sourceEllipsis = false
  content: any = null
  userExtCourseEnroll: any = {}
  downloadCertificateLoading = false
  forPreview: any = window.location.href.includes('/public/') || window.location.href.includes('?editMode=true')
  extContentAvailable = true
  canEnroll = false
  enrollValidationLoading = true
  rcElem = {
    offSetTop: 0,
    BottomPos: 0,
  }
  contentLink: any = ''
  @ViewChild('rightContainer') rcElement!: ElementRef
  scrollLimit: any
  scrolled: boolean | undefined
  isMobile = false
  config: any
  widgetData: any
  enableShare = false
  rootOrgId: any
  currentLang: any = 'en'
  discussWidgetData!: NsDiscussionV2.ICommentWidgetData
  showProviderTips = false
  fromMDO = false
  karmaRedeemData: any = null
  enrollRestrictionMessage = ''
  requiredKarmaCoins = 0
  enrolPending = false
  insufficientCoins = false
  private karmaRedeemContent: any = null
  @HostListener('window:scroll', ['$event'])
  handleScroll() {

    if (this.scrollLimit) {
      if ((window.scrollY + this.rcElem.BottomPos) >= this.scrollLimit) {
        this.rcElement.nativeElement.style.position = 'sticky'
      } else {
        this.rcElement.nativeElement.style.position = 'fixed'
      }
    }

    // 236... (OffsetTop of right container + 104)
    if (window.scrollY > (this.rcElem.offSetTop + 104)) {
      this.scrolled = true
    } else {
      this.scrolled = false
    }
  }
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonSvc: CommonMethodsService,
    private translate: TranslateService,
    private configSvc: ConfigurationsService,
    private events: EventService,
    private langtranslations: MultilingualTranslationsService,
    private contentSvc: WidgetContentService,
    private certSvc: CertificateService,
    public loader: LoaderService,
    private matDialog: MatDialog,
    public snackBar: MatSnackBar,
    public netCoreService: NetCoreService,
    @Inject('environment') @Optional() private environment: any
  ) {
    this.route.data.subscribe((data: any) => {
      this.enrollValidationLoading = false
      if (data && data.extContent && data.extContent.data && data.extContent.data.content) {
        this.extContentReadData = data.extContent.data.content
        this.extContentReadData['certificateObj'] = {
          data: {},
        }
        this.skeletonLoader = false

      } else {
        this.extContentAvailable = false
        this.skeletonLoader = false
      }

      if (data && data.userEnrollContent && data.userEnrollContent.data && data.userEnrollContent.data.result &&
        Object.keys(data.userEnrollContent.data.result).length > 0
      ) {
        this.userExtCourseEnroll = data.userEnrollContent.data.result
        if (this.userExtCourseEnroll.completionpercentage === 100) {
          this.extContentReadData['completionStatus'] = 2

          this.downloadCert()
          this.contentViewEventForNetCore('completion')
        }
      } else {
        this.validateEnrollmentEligibility()
      }
      this.requiredKarmaCoins = this.readRequiredKarmaCoins(this.extContentReadData)

    })

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      this.currentLang = localStorage.getItem('websiteLanguage')!
      this.translate.use(this.currentLang)
    }
    this.configSvc.languageTranslationFlag.subscribe((data: any) => {
      if (data) {
        if (localStorage.getItem('websiteLanguage')) {
          this.currentLang = localStorage.getItem('websiteLanguage')!
          this.translate.use(this.currentLang)
        }
      }
    })

    if (this.configSvc.userProfile) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.contentLink = `${window.location.pathname.substring(1)}${window.location.search}`

    this.commentId = this.route.snapshot.queryParams.commentId ? this.route.snapshot.queryParams.commentId : ''
    if (this.commentId) {
      //this.selectedTabIndex = 2
    }
  }

  ngOnInit() {
    if (this.route.snapshot.data.pageData && this.route.snapshot.data.pageData.data) {
      this.config = this.route.snapshot.data.pageData.data
      this.initializeDiscussData()
    }
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.contentViewEventForNetCore('view')
  }

  initializeDiscussData() {
    if (!_.get(this.extContentReadData, 'contentPartner.isActive', false)) {
      this.snackBar.open('Courses from this learning partner are temporarily not available on iGOT Karmayogi. Our team is updating partner content. In the meantime, you can continue your journey with courses from other partners.', 'X', {
        duration: 10000,
      })
    } else if (!_.get(this.extContentReadData, 'isActive', false)) {
      this.snackBar.open('This course is no longer being offered in its current form. We are updating our catalog to bring you improved learning options. Please choose another course with similar topics or browse recommended courses.', 'X', {
        duration: 10000,
      })
    }
    if (this.config && this.config.discussWidgetData) {
      this.discussWidgetData = this.config.discussWidgetData
      if (this.extContentReadData && this.extContentReadData.contentId) {
        this.discussWidgetData.newCommentSection.commentTreeData.entityId = this.extContentReadData.contentId
        if (this.discussWidgetData.commentsList.repliesSection && this.discussWidgetData.commentsList.repliesSection.newCommentReply) {
          this.discussWidgetData.commentsList.repliesSection.newCommentReply.commentTreeData.entityId = this.extContentReadData.contentId
        }
      }
      this.widgetData = {
        ...this.config,
        type: 'tips',
        cardClass: 'slider-container',
        height: 'auto',
        sliderData: _.get(this.extContentReadData, 'contentPartner.providerTips', [])
      }
      this.showProviderTips = (this.widgetData && this.widgetData.sliderData?.length) &&
        (Object.keys(this.userExtCourseEnroll).length === 0 ||
        (this.userExtCourseEnroll?.issued_certificates?.length === 0 &&
        this.userExtCourseEnroll?.progress <= 100))

      if (Object.keys(this.userExtCourseEnroll).length) {
        this.discussWidgetData.enrolledContent = true
        this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'
      } else {
        this.discussWidgetData.enrolledContent = false
        this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Enrol to add your comments'
      }
      this.discussWidgetData = { ...this.discussWidgetData }
    }
  }

  handleCapitalize(str: string, type?: string): string {
    return this.commonSvc.handleCapitalize(str, type)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  ngAfterViewInit() {
    if (this.rcElement) {
      this.rcElem.BottomPos = this.rcElement.nativeElement.offsetTop + this.rcElement.nativeElement.offsetHeight
      this.rcElem.offSetTop = this.rcElement.nativeElement.offsetTop
    }
  }
  redirectToContent(contentData: any) {
    const userData: any = this.configSvc.userProfileV2
    const extUrl: string = contentData.redirectUrl.replace('<username>', userData.email)
    return extUrl
  }
  replaceText(str: any, replaceTxt: any) {
    return str.replaceAll(replaceTxt, '')
  }

  formatcourseProviders(providers: any[]): string {
    if (!providers || !Array.isArray(providers)) {
      return ''
    }
    return providers.map((provider: any) => provider.name).join(', ')
  }

  enRollToExtCourse(content: any) {
    const coins = this.readRequiredKarmaCoins(content)
    const popupConfig = _.get(this.config, 'karmaRedeemPopup', {}) || {}

    // Nothing to deduct (0 coins) - go straight to consent, no popup.
    if (coins <= 0) {
      this.openConsentDialog(content)
      return
    }

    this.karmaRedeemContent = content
    this.karmaRedeemData = {
      requiredKarmaCoins: coins,
      header: _.get(popupConfig, 'popupHeader', ''),
      message: this.buildKarmaRedeemMessage(popupConfig, coins),
      acceptButton: _.get(popupConfig, 'acceptButton', ''),
      cancelButton: _.get(popupConfig, 'cancelButton', ''),
    }
  }

  private readRequiredKarmaCoins(content: any): number {
    return Number(_.get(content, 'requiredKarmaCoins', 0)) || 0
  }

  private buildKarmaRedeemMessage(popupConfig: any, coins: number): string {
    const template = _.get(popupConfig, 'message', '')
    if (template) {
      return `${template}`.replace(/\{coins\}/g, `${coins}`).replace(/\{points\}/g, `${coins}`)
    }

    const before = _.get(popupConfig, 'pointsBeforeText', '')
    const after = _.get(popupConfig, 'pointsAfterText', '')
    if (!before && !after) {
      return ''
    }

    return [before, `${coins}`, after].filter((part: string) => part).join(' ')
  }

  get showKarmaRedeemDialog(): boolean {
    return Number(_.get(this.karmaRedeemData, 'requiredKarmaCoins', 0)) > 0
  }

  onKarmaRedeemClosed(confirmed: boolean) {
    const content = this.karmaRedeemContent
    this.raiseKarmaRedeemTelemetry(confirmed, content)
    this.karmaRedeemData = null
    this.karmaRedeemContent = null
    if (confirmed && content) {
      this.openConsentDialog(content)
    }
  }

  private raiseKarmaRedeemTelemetry(confirmed: boolean, content: any) {
    const pageContext: WsEvents.ITelemetryPageContext = {
      pageId: KARMA_REDEEM_PAGE_ID,
      module: KARMA_REDEEM_ENV,  // the listener sends this out as the event's `env`
    }
    this.events.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
      pageContext,
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: '',
      to: 'Telemetry',
      data: {
        pageContext,
        eventSubType: WsEvents.EnumTelemetrySubType.Interact,
        edata: {
          type: 'click',
          subType: confirmed ? KARMA_REDEEM_CONTINUE : KARMA_REDEEM_CANCEL,
          id: _.get(content, 'contentId', ''),
          pageid: KARMA_REDEEM_PAGE_ID,
        },
        object: {},
      },
    })
  }

  private async openConsentDialog(content: any) {
    const consentUrl: string = `${this.environment?.missionKarmayogiPath}${this.config?.contentConsent?.consentDocUrl}` || ''
    const assetsDocUrl: string = `${this.config?.contentConsent?.assetsDocUrl}` || ''
    const dialogRef = this.matDialog.open(ConsentDialogComponent, {
      width: '900px',
      height: '70vh',
      maxHeight: '90vh',
      minHeight: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'consent-dialog-panel',
      data: {
        consentUrl: consentUrl,
        assetsDocUrl: assetsDocUrl
      }
    })

    // Handle dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User agreed - proceed with enrollment
        // need to call consent api
        this.callConsentApi(content)
      } else {
        // User disagreed
        this.snackBar.open('You must agree to the terms to enroll in this course.', 'X', {
          duration: 5000,
        })
      }
    })
  }

  callConsentApi(content: any) {
    console.log(content)
    const request = {
      "request": {
        "contentId": content?.contentId,
        "consentId": this.config?.contentConsent?.consentId || '',
        "additionalAttributes": {
          "userRoles": ["public"],
          "versionKey": new Date().getTime(),
          "description": "I have read and agree with the above declaration."
        }
      }
    }

    this.certSvc.consentSubmit(request).subscribe((_res: any) => {
      this.proceedWithEnrollment(content)
    }, (error: any) => {
      this.snackBar.open(error?.error?.params?.msg || 'Unable to submit consent', 'X', {
        duration: 5000,
      })
    })
  }
  private async proceedWithEnrollment(content: any) {
    this.loader.changeLoad.next(true)
    const reqbody = {
      courseId: content.contentId,
      partnerId: content.contentPartner.id,
    }
    const enrollRes = await this.contentSvc.extContentEnroll(reqbody).toPromise().catch(_error => { return _error })
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      this.discussWidgetData.enrolledContent = true
      this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'
      this.getUserContentEnroll(content.contentId)
      this.contentViewEventForNetCore('enroll')
    } else {
      this.loader.changeLoad.next(false)
      const message = enrollRes?.error?.params?.msg
      if (this.isInsufficientCoinsError(enrollRes)) {
        this.insufficientCoins = true
        return
      }
      this.snackBar.open(message || 'Unable to enroll to the content', 'X', {
        duration: 10000,
      })
    }
  }

  /* responseCode first - the wording is only a fallback for a body that carries no code */
  private isInsufficientCoinsError(err: any): boolean {
    const body = (err && err.error) || err || {}
    const code = `${body.responseCode || ''}`.trim().toUpperCase()
    if (code === PAYMENT_REQUIRED) {
      return true
    }
    return this.isInsufficientCoins(body?.params?.msg)
  }

  private isInsufficientCoins(message: any): boolean {
    const text = `${message || ''}`
    return INSUFFICIENT_COINS.some(pattern => pattern.test(text))
  }

  closeInsufficientCoins() {
    this.insufficientCoins = false
  }

  goToKarmaWallet() {
    this.insufficientCoins = false
    /* the wallet page opens its convert dialog on this, as long as converting is available */
    this.router.navigate([KARMA_WALLET_ROUTE], { queryParams: { convert: 'true' } })
  }

  async getUserContentEnroll(contentId: any) {
    const enrollRes = await this.contentSvc.fetchExtUserContentEnroll(contentId).toPromise().catch(_error => { })
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      this.userExtCourseEnroll = enrollRes.result
      this.loader.changeLoad.next(false)
      this.telemetryToCaptureInteract(contentId, 'enroll', 'enrol-content')
      /* Still being confirmed - say so in the popup instead of claiming it is done */
      if (Number(enrollRes.result.status) === ENROL_STATUS_PENDING) {
        this.enrolPending = true
        return
      }
      this.snackBar.open('Successfully enrolled in the course.')
    } else {
      this.loader.changeLoad.next(false)
      this.snackBar.open('Unable to get the enrolled details')
    }
  }

  closeEnrolPending() {
    this.enrolPending = false
  }

  captureRedirectTelemetry(content: any) {
    this.rememberPartnerSession(content)
    this.raiseTelemtryStartEvent()
    this.telemetryToCaptureInteract(content.contentId, 'redirect', 'redirect-content')
    this.raiseTelemtryEndEvent()
  }

  /**
   * Records which content partners the user has actually opened.
   *
   * This is the only place a partner session gets created - the link this fires on is the
   * one that carries the user out to the partner's SSO. Logout reads the list back so it
   * can hit a partner's logout endpoint only when there is a session to end, instead of
   * calling every partner on every logout.
   *
   * Kept in localStorage rather than sessionStorage because the partner session lives in
   * browser cookies and outlives the tab that opened it. Logout clears it along with the
   * rest of storage.
   */
  private rememberPartnerSession(content: any): void {
    const partner = _.get(content, 'contentPartner.contentPartnerName', '')
    if (!partner) {
      return
    }
    try {
      const raw = localStorage.getItem('extPartnerSessions')
      const partners: string[] = raw ? JSON.parse(raw) : []
      if (!partners.includes(partner)) {
        partners.push(partner)
        localStorage.setItem('extPartnerSessions', JSON.stringify(partners))
      }
    } catch {
      /* storage unavailable - the partner logout call is simply skipped, never breaks logout */
    }
  }

  raiseTelemtryStartEvent() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'test',
      to: '',
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        type: 'session',
        mode: 'view',
      },
    }
    this.events.dispatchEvent(event)

  }

  telemetryToCaptureInteract(contentId: any, subType: any, id: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType,
        id: id,
      },
      {
        id: contentId,
        type: 'External content',
      },
      {
        module: 'Home',
      }
    )
  }

  raiseTelemtryEndEvent() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'test',
      to: '',
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        type: 'session',
        mode: 'view',
      },
    }
    this.events.dispatchEvent(event)
  }

  async downloadCert() {
    this.downloadCertificateLoading = true
    const certRes: any = await
      this.certSvc.downloadCertificate_v2(this.userExtCourseEnroll.issued_certificates[0].identifier).toPromise().catch(_error => { })
    if (certRes && Object.keys(certRes.result).length > 0) {
      this.downloadCertificateLoading = false
      if (this.userExtCourseEnroll.issued_certificates && this.userExtCourseEnroll.issued_certificates.length
        && this.userExtCourseEnroll.issued_certificates[0]) {
        this.extContentReadData['certificateObj'] = {
          data: this.userExtCourseEnroll.issued_certificates[0],
          certData: certRes.result.printUri,
          certId: this.userExtCourseEnroll.issued_certificates[0].identifier,
        }
      }
    } else {
      this.downloadCertificateLoading = false
    }
  }
  onClickOfShare() {
    this.enableShare = true
    //this.raiseTelemetryForShare('shareContent')
  }

  /* tslint:disable */
  // raiseTelemetryForShare(subType: any) {
  //   //console.log(this.extContentReadData, this.events, subType)
  //   // this.events.raiseInteractTelemetry(
  //   // {
  //   //   type: 'click',
  //   //   subType,
  //   //   id: this.content ? this.content.identifier : '',
  //   // },
  //   // {
  //   //   id: this.content ? this.content.identifier : '',
  //   //   type: this.content ? this.content.primaryCategory : '',
  //   // },
  //   // {
  //   //   pageIdExt: `btn-${subType}`,
  //   //   module: WsEvents.EnumTelemetrymodules.CONTENT,
  //   // }
  //   // )
  // }

  resetEnableShare(_eventData: any) {

    this.enableShare = false
  }

  contentViewEventForNetCore(eventType: any) {
    if (this.configSvc.netcoreConfig && this.configSvc.netcoreConfig.netcoreWebConfig  // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.isActive // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.events // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.events.content_view // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.events.content_view.isActive // NOSONAR
    ) {
      let payload: any = {}
      // if (this.configSvc && this.configSvc.unMappedUser && this.configSvc.unMappedUser.identifier) { // NOSONAR
      //   payload['pk^userid'] = this.configSvc.unMappedUser.identifier.trim().toLowerCase()
      // }
      // console.log('payload', payload)
      if (this.extContentReadData && this.extContentReadData.name) {
        payload['content_name'] = this.extContentReadData.name
      }
      // if(this.extContentReadData && this.extContentReadData.courseCategory) {
      payload['content_category'] = 'External Course'
      // }
      if (this.extContentReadData && this.extContentReadData.externalId) {
        payload['content_id'] = this.extContentReadData.externalId
      }
      // if(this.extContentReadData && this.extContentReadData.name) {
      payload['content_url'] = window.location.href
      // }
      if (this.extContentReadData && this.extContentReadData.appIcon) {
        payload['content_image'] = this.extContentReadData.appIcon
      }
      if (this.extContentReadData && this.extContentReadData.duration) {
        payload['content_duration'] = this.extContentReadData.duration && Number(this.extContentReadData.duration) > 0 ? Number(this.extContentReadData.duration) : 0
      } else {
        payload['content_duration'] = 0
      }
      if (this.extContentReadData && this.extContentReadData.avgRating
      ) {
        payload['content_rating'] = this.extContentReadData.avgRating
        payload['content rating'] = this.extContentReadData.avgRating
      }
      if (this.extContentReadData && this.extContentReadData.totalNoOfRating) {
        payload['no_users_rated'] = this.extContentReadData.totalNoOfRating
      }
      // if(Object.keys(this.userExtCourseEnroll).length) {
      payload['learning_path_content'] = Object.keys(this.userExtCourseEnroll).length ? true : false
      payload['learning path content'] = Object.keys(this.userExtCourseEnroll).length ? true : false
      // }
      if (this.extContentReadData && this.extContentReadData.source) {
        payload['content_provider_name'] = this.extContentReadData.source
      } else if (this.extContentReadData && this.extContentReadData.contentPartner &&
        this.extContentReadData.contentPartner.contentPartnerName
      ) {
        payload['content_provider_name'] = this.extContentReadData.contentPartner.contentPartnerName
      } else {
        payload['content_provider_name'] = 'Karmayogi Bharat'
      }
      if (eventType === 'view') {
        this.netCoreService.trackEventForContentAndEvent('content_view', this.configSvc.unMappedUser.identifier.trim().toLowerCase(), payload)
      } else if (eventType === 'enroll') {
        this.netCoreService.trackEventForContentAndEvent('content_enrolment', this.configSvc.unMappedUser.identifier.trim().toLowerCase(), payload)
      } else if (eventType === 'completion') {
        this.netCoreService.trackEventForContentAndEvent('content_completion', this.configSvc.unMappedUser.identifier.trim().toLowerCase(), payload)
      }

    }
  }

  secondsToTime(d: any) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
    return hDisplay + mDisplay + sDisplay
  }

  clearCommentIdFromUrl(): void {
    const currentQueryParams = { ...this.route.snapshot.queryParams }
    delete currentQueryParams.commentId
    this.commentId = ''
  }

  private validateEnrollmentEligibility(): void {
    // Only validate if user is not already enrolled and content is available
    if (Object.keys(this.userExtCourseEnroll).length === 0 && this.extContentReadData && this.extContentReadData.contentId && this.extContentReadData.contentPartner && this.extContentReadData.contentPartner.id) {
      this.enrollValidationLoading = true
      this.certSvc.validateEnrollmentEligibility(this.extContentReadData.contentId, this.extContentReadData.contentPartner.id).subscribe(
        (_response: any) => {
          this.enrollValidationLoading = false
          this.canEnroll = true
          this.enrollRestrictionMessage = ''
        },
        (error: any) => {
          const message = error?.error?.params?.msg || 'Unable to validate enrollment eligibility'
          this.enrollValidationLoading = false
          // Kept on the component so the "Restricted" badge can surface it on hover.
          this.enrollRestrictionMessage = message
          this.canEnroll = false
          /* A coin shortfall is spelled out in the popup, which carries the wallet link;
             the rest keep the snackbar. */
          if (this.isInsufficientCoinsError(error)) {
            this.insufficientCoins = true
            return
          }
          this.snackBar.open(message, 'X', {
            duration: 10000,
          })
        }
      )
    }
  }
  showBadgeIcon(): boolean {
    const badgeDetails = this.extContentReadData?.badgeDetails_v1
    if (!badgeDetails || !badgeDetails.length) {
      return false
    }
    const badge = badgeDetails[0]
    // If badgeEarningDateEnabled is false, don't show badge
    if (!badge.badgeEarningDateEnabled) {
      return true
    }
    // If badgeEarningDateEnabled is true, show badge only if badgeEarningDateTime has passed
    if (badge?.badgeEarningDateEnabled && badge?.badgeEarningDateTime) {
      console.log(badge.badgeEarningDateTime, Date.now())
      return badge.badgeEarningDateTime > Date.now()
    }
    return false
  }
  get showKarmaCost(): boolean {
    return this.requiredKarmaCoins > 0 && !this.showRedirect
  }

  private get enrolStatus(): number | null {
    const status = _.get(this.userExtCourseEnroll, 'status')
    return status === undefined || status === null ? null : Number(status)
  }

  /* The provider has taken the request but not confirmed it yet */
  get isEnrolPending(): boolean {
    return this.enrolStatus === ENROL_STATUS_PENDING
  }

  private get hasEnrolmentRecord(): boolean {
    return Object.keys(this.userExtCourseEnroll).length > 0
  }

  /* Only for the first hour after enrolling; after that the card is just the Redirect button */
  /* Paid by either signal: the content's own flag, or a price in coins */
  get isPaidCourse(): boolean {
    return _.get(this.extContentReadData, 'courseType') === 'paid' || this.requiredKarmaCoins > 0
  }

  get showEnrolledNotice(): boolean {
    if (!this.isPaidCourse || !this.hasEnrolmentRecord || this.isEnrolPending) {
      return false
    }
    const enrolledAt = this.enrolledAtMs()
    return enrolledAt > 0 && (Date.now() - enrolledAt) <= ENROLLED_NOTICE_WINDOW_MS
  }

  private enrolledAtMs(): number {
    const raw = _.get(this.userExtCourseEnroll, 'enrolled_date')
    if (!raw) {
      return 0
    }
    if (typeof raw === 'number') {
      return raw
    }
    const text = `${raw}`.trim()
    if (/^\d+$/.test(text)) {
      return Number(text)
    }
    const direct = Date.parse(text)
    if (!isNaN(direct)) {
      return direct
    }
    /* 'YYYY-MM-DD HH:mm:ss:SSS+0000' - millis behind a colon is not something Date.parse reads */
    const normalised = text
      .replace(' ', 'T')
      .replace(/:(\d{3})(?=[+\-Z]|$)/, '.$1')
      .replace(/([+\-]\d{2})(\d{2})$/, '$1:$2')
    const parsed = Date.parse(normalised)
    return isNaN(parsed) ? 0 : parsed
  }

  get showEnroll(): boolean {
    return !this.hasEnrolmentRecord &&
      !this.isEnrolPending &&
      !this.enrollValidationLoading &&
      this.canEnroll &&
      _.get(this.extContentReadData, 'contentPartner.isActive', false)
  }

  /* An in-progress course is already enrolled whatever its status reads, so Redirect keys off
     the record itself - as it did before - and only a pending enrolment holds it back. */
  get showRedirect(): boolean {
    return this.hasEnrolmentRecord &&
      !this.isEnrolPending &&
      _.get(this.extContentReadData, 'redirectUrl') &&
      _.get(this.extContentReadData, 'contentPartner.isActive', false)
  }

  get showPaidBadge(): boolean {
    return _.get(this.extContentReadData, 'courseType') === 'paid' &&
      (this.showEnroll || Boolean(this.showRedirect))
  }
  get showRestrictedBadge(): boolean {
    return _.get(this.extContentReadData, 'courseType') === 'paid' &&
      !this.enrollValidationLoading &&
      !this.showPaidBadge
  }

}
