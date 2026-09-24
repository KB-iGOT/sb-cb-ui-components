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
const PAYMENT_REQUIRED = 'PAYMENT_REQUIRED'
const PAYMENT_REQUIRED_STATUS = 402
const ENROL_STATUS_PENDING = 3
const ENROLLED_NOTICE_WINDOW_MS = 60 * 60 * 1000
const ENROL_SUCCESS_MESSAGE = 'Successfully enrolled in the course.'

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
  insufficientCoinsMessage = ''
  enrolPending = false
  enrolPendingHidden = false
  private enrolSuccessMessage = ''
  enrolPendingContentId: any = ''
  enrolStatusChecking = false
  enrolSubmitting = false
  private enrolAttempt = 0
  insufficientCoins = false
  insufficientCoinsContent: any = null
  private karmaRedeemContent: any = null
  private karmaCoinsRequest: Promise<number> | null = null
  private coinShortfall = false
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

  async enRollToExtCourse(content: any) {
    // Awaits the call the page load started, so a quick click cannot enrol before the rule is in
    const coins = await this.loadRequiredKarmaCoins(content)
    if (this.coinShortfall) {
      this.insufficientCoinsContent = content
      this.insufficientCoins = true
      return
    }
    const popupConfig = _.get(this.config, 'karmaRedeemPopup', {}) || {}

    // Nothing to deduct (0 coins) - go straight to consent, no popup.
    if (coins <= 0) {
      this.openConsentDialog(content, true)
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
  private loadRequiredKarmaCoins(content: any): Promise<number> {
    const courseId = _.get(content, 'contentId', '')
    const partnerId = _.get(content, 'contentPartner.id', '')
    if (!courseId || !partnerId) {
      return Promise.resolve(0)
    }
    if (!this.karmaCoinsRequest) {
      this.karmaCoinsRequest = this.certSvc.getKarmaPointsDeductionRule(courseId, partnerId)
        .toPromise()
        .then((res: any) => Number(_.get(res, 'result.requiredKarmaPoints')) || 0)
        .catch((err: any) => {
          this.coinShortfall = this.isInsufficientCoinsError(err)
          if (this.coinShortfall) {
            this.insufficientCoinsMessage = this.readApiMessage(err)
          }
          return 0
        })
    }
    return this.karmaCoinsRequest
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

  private async openConsentDialog(content: any, freeCourse = false) {
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
        this.enrolAttempt += 1
        this.enrolPendingContentId = _.get(content, 'contentId', '')
        this.enrolStatusChecking = false
        this.enrolSubmitting = true
        this.enrolPending = true
        this.enrolPendingHidden = freeCourse
        if (freeCourse) {
          this.closeEnrolPending()
        }
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
      this.closeEnrolPendingPopup()
      this.snackBar.open(error?.error?.params?.msg || 'Unable to submit consent', 'X', {
        duration: 5000,
      })
    })
  }
  private async proceedWithEnrollment(content: any) {
    const reqbody = {
      courseId: content.contentId,
      partnerId: content.contentPartner.id,
    }
    const enrollRes = await this.contentSvc.extContentEnroll(reqbody).toPromise().catch(_error => { return _error })
    this.enrolSubmitting = false
    this.enrolSuccessMessage = `${_.get(enrollRes, 'params.msg', '') || ''}`.trim()
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      this.discussWidgetData.enrolledContent = true
      this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'
      this.telemetryToCaptureInteract(content.contentId, 'enroll', 'enrol-content')
      this.contentViewEventForNetCore('enroll')
      // Close was pressed while this was still running - now there is something to read
      if (this.enrolStatusChecking && this.enrolPending) {
        this.readEnrolStatus()
      }
    } else {
      this.closeEnrolPendingPopup()
      const message = enrollRes?.error?.params?.msg
      this.snackBar.open(message || 'Unable to enroll to the content', 'X', {
        duration: 10000,
      })
    }
  }

  private readApiMessage(err: any): string {
    const body = (err && err.error) || err || {}
    return `${_.get(body, 'params.msg', '') || ''}`.trim()
  }

  private isInsufficientCoinsError(err: any): boolean {
    if (Number(_.get(err, 'status')) === PAYMENT_REQUIRED_STATUS) {
      return true
    }
    const body = (err && err.error) || err || {}
    const codes = [body.statusCode, body.responseCode, body.errorCode]
    return codes.some(code => `${code || ''}`.trim().toUpperCase() === PAYMENT_REQUIRED)
  }

  closeInsufficientCoins() {
    this.raiseInsufficientCoinsTelemetry('cancel')
    this.insufficientCoins = false
    this.insufficientCoinsContent = null
  }

  goToKarmaWallet() {
    this.raiseInsufficientCoinsTelemetry('visit-karma-wallet')
    this.insufficientCoins = false
    this.insufficientCoinsContent = null
    /* the wallet page opens its convert dialog on this, as long as converting is available */
    this.router.navigate([KARMA_WALLET_ROUTE], { queryParams: { convert: 'true' } })
  }

  private raiseInsufficientCoinsTelemetry(id: string) {
    const contentId = _.get(this.insufficientCoinsContent, 'contentId', '') ||
      _.get(this.extContentReadData, 'contentId', '')
    this.events.raiseInteractTelemetry(
      { id, type: WsEvents.EnumInteractTypes.CLICK, subType: 'insufficient-karma-coins' },
      { id: contentId, type: 'external content' },
      { pageId: 'app/toc/ext', module: 'Learn' }
    )
  }

  closeEnrolPending() {
    if (this.enrolStatusChecking) {
      return
    }
    this.enrolStatusChecking = true
    // Still enrolling - a read now could only say 'not enrolled'. The create runs it when it lands.
    if (this.enrolSubmitting) {
      return
    }
    this.readEnrolStatus()
  }

  // The one status read of this flow: it decides what the card shows, then closes the popup
  private async readEnrolStatus() {
    const attempt = this.enrolAttempt
    const contentId = this.enrolPendingContentId || _.get(this.extContentReadData, 'contentId', '')
    if (!contentId) {
      this.closeEnrolPendingPopup()
      return
    }
    const enrollRes = await this.contentSvc.fetchExtUserContentEnroll(contentId).toPromise()
      .catch(_error => { })
    // the popup this read belonged to is gone - touch nothing
    if (attempt !== this.enrolAttempt) {
      return
    }
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      const freeEnrolment = this.enrolPendingHidden
      this.userExtCourseEnroll = enrollRes.result
      this.closeEnrolPendingPopup()
      if (freeEnrolment && !this.isEnrolPending) {
        this.snackBar.open(this.enrolSuccessMessage || ENROL_SUCCESS_MESSAGE, 'X', {
          duration: 5000,
        })
      }
      return
    }
    this.closeEnrolPendingPopup()
    this.snackBar.open('Unable to get the enrolled details', 'X', {
      duration: 5000,
    })
  }

  private closeEnrolPendingPopup() {
    this.enrolAttempt += 1
    this.enrolPending = false
    this.enrolStatusChecking = false
    this.enrolSubmitting = false
    this.enrolPendingContentId = ''
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
      !this.enrolPending &&
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
