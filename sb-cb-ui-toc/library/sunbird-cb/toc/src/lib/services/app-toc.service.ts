import { Injectable } from '@angular/core'
import { Data } from '@angular/router'
import { Subject, Observable, EMPTY, Subscription, BehaviorSubject, of, throwError } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { NsContent } from '../_services/widget-content.model'
import { NsContentConstants } from '../_constants/widget-content.constants'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsAppToc, NsCohorts } from '../models/app-toc.model'
import { TFetchStatus, ConfigurationsService } from '@sunbird-cb/utils-v2'
// tslint:disable-next-line
import _ from 'lodash'
import { ContentLanguageService } from '@sunbird-cb/consumption'
import { map, catchError } from 'rxjs/operators'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const PROXY_SLAG_V8 = '/apis/proxies/v8'

const API_END_POINTS = {
  BATCH_CREATE: `${PROXY_SLAG_V8}/learner/course/v1/batch/create`,
  CONTENT_PARENTS: `${PROTECTED_SLAG_V8}/content/parents`,
  CONTENT_NEXT: `${PROTECTED_SLAG_V8}/content/next`,
  CONTENT_HISTORYV2: `/apis/proxies/v8/read/content-progres`,
  CONTENT_PARENT: (contentId: string) => `${PROTECTED_SLAG_V8}/content/${contentId}/parent`,
  CONTENT_AUTH_PARENT: (contentId: string, rootOrg: string, org: string) =>
    `/apis/authApi/action/content/parent/hierarchy/${contentId}?rootOrg=${rootOrg}&org=${org}`,
  COHORTS: (cohortType: NsCohorts.ECohortTypes, contentId: string) =>
    `${PROTECTED_SLAG_V8}/cohorts/${cohortType}/${contentId}`,
  EXTERNAL_CONTENT: (contentId: string) =>
    `${PROTECTED_SLAG_V8}/content/external-access/${contentId}`,
  COHORTS_GROUP_USER: (groupId: number) => `${PROTECTED_SLAG_V8}/cohorts/${groupId}`,
  RELATED_RESOURCE: (contentId: string, contentType: string) =>
    `${PROTECTED_SLAG_V8}/khub/fetchRelatedResources/${contentId}/${contentType}`,
  POST_ASSESSMENT: (contentId: string) =>
    `${PROTECTED_SLAG_V8}/user/evaluate/post-assessment/${contentId}`,
  GET_CONTENT: (contentId: string) =>
    `${PROXY_SLAG_V8}/action/content/v3/read/${contentId}`,
  CERT_DOWNLOAD: (certId: any) => `${PROTECTED_SLAG_V8}/cohorts/course/batch/cert/download/${certId}`,
  SERVER_DATE: 'apis/public/v8/systemDate',
  SHARE_CONTENT: '/apis/proxies/v8/user/v1/content/recommend',
  GET_FORM_BYID: (formId: string) => `apis/proxies/v8/forms/v2/getFormById?formId=${formId}`,
  // SUBMIT_FORM: `/apis/proxies/v8/forms/v1/saveFormSubmit`,
  SUBMIT_FORM: `apis/proxies/v8/forms/v2/saveFormSubmit`,
  GET_FORM_BYID_PUBLIC: (formId: string) => `apis/public/v8/public/forms/v2/getFormById?formId=${formId}`,
  SUBMIT_FORM_PUBLIC: `apis/public/v8/public/forms/v2/saveFormSubmit`,
  // get answers for form
  GET_APPLICATIONS_BY_ID: (formId: string, contextId: string) => `/apis/proxies/v8/forms/v2/getApplicationsById?formId=${formId}&contextId=${contextId}`,
  AI_RESOURCE_VTT_FILE: `${PROXY_SLAG_V8}/chatbot/v3/transcoder/stats`,
  // GET_FORM_BYID: (formId: string) => `apis/proxies/v8/forms/getFormById?id=${formId}`,
  PRE_ENROLLMENT_STATE_READ: `/apis/proxies/v8/content/v2/state/read`,
  CREATE_RESOURCE: `apis/proxies/v8/action/content/v3/create`,
  READ_RESOURCE: `apis/proxies/v8/action/content/v3/`,
  UPLOAD_FILE: `apis/proxies/v8/upload/action/content/v3/`,
  UPDATE_RESOURCE: `apis/proxies/v8/action/content/v3/update`,
  SEARCH: `apis/proxies/v8/assignment/v1/search`,
  SUBMIT_DRAFT_ASSIGNMENT: `apis/proxies/v8/assignment/v1/submitDraft`,
  SUBMIT_ASSIGNMENT: `apis/proxies/v8/assignment/v1/submit`,
  ASSIGNMENT_STATUS: `apis/proxies/v8/forms/v2/submissions/search`,
  UPLOAD_ASSIGNMENT: `apis/proxies/v8/storage/v1/bp/assignment/answer`,
  READ_ASSIGNMENT: `apis/proxies/v8/storage/v1/bp/assignment/answer/read/file`,
  NOTIFY_ASSIGNMENT_SUBMISSION: `apis/proxies/v8/v1/notifyAssignment/submit`,
}

@Injectable({
  providedIn: 'root'
})
export class AppTocService {
  analyticsReplaySubject: Subject<any> = new Subject()
  analyticsFetchStatus: TFetchStatus = 'none'
  batchReplaySubject: Subject<any> = new Subject()
  setBatchDataSubject: Subject<any> = new Subject()
  getSelectedBatch: Subject<any> = new Subject()
  setWFDataSubject: Subject<any> = new Subject()
  resumeData: Subject<NsContent.IContinueLearningData | null> = new Subject<any>()
  private showSubtitleOnBanners = false
  private canShowDescription = false
  resumeDataSubscription: Subscription | null = null
  primaryCategory = NsContent.EPrimaryCategory
  private updateReviews = new BehaviorSubject(false)
  updateReviewsObservable = this.updateReviews.asObservable()
  public serverDate = new BehaviorSubject('')
  currentServerDate = this.serverDate.asObservable()
  public contentLoader = new BehaviorSubject(false)
  contentLoader$ = this.contentLoader.asObservable()
  public getPageScroll = new BehaviorSubject(true)
  updatePageScroll = this.getPageScroll.asObservable()
  public hashmap: any = {}
  private transriptionDataSubject = new BehaviorSubject<any>(null); // Start with null
  transcriptionData$ = this.transriptionDataSubject.asObservable();
  public transriptionActiveLanguageDataObject = new BehaviorSubject<any>(null);
  public transriptionActiveLanguageDataObject$ = this.transriptionActiveLanguageDataObject.asObservable();
  public transriptionIdentifier = new Subject(); // Start with null
  changeTranscriptionLanguageEvent = new Subject()
  playTranscriptionVideo = new Subject()
  constructor(private http: HttpClient, private contentLangSvc: ContentLanguageService, private configSvc: ConfigurationsService, private widgetSvc: WidgetContentService) {
    // this resume data subscription is for on load
    this.resumeDataSubscription = this.resumeData.subscribe(
      (_dataResult: any) => {
      })
  }

  get subtitleOnBanners(): boolean {
    return this.showSubtitleOnBanners
  }
  set subtitleOnBanners(val: boolean) {
    this.showSubtitleOnBanners = val
  }
  get showDescription(): boolean {
    return this.canShowDescription
  }
  set showDescription(val: boolean) {
    this.canShowDescription = val
  }

  updateBatchData() {
    this.batchReplaySubject.next()
  }

  setBatchData(data: NsContent.IBatchListResponse) {
    this.setBatchDataSubject.next(data)
  }

  setWFData(data: any) {
    this.setWFDataSubject.next(data)
  }

  updateResumaData(data: any) {
    this.resumeData.next(data)
  }

  changeUpdateReviews(state: boolean) {
    this.updateReviews.next(state)
  }
  getSelectedBatchData(data: any) {
    this.getSelectedBatch.next(data)
  }

  changeServerDate(state: any) {
    this.serverDate.next(state)
  }

  mapSessionCompletionPercentage(batchData: any, resumeDataPass?: any) {
    if (resumeDataPass && resumeDataPass.length) {
      if (resumeDataPass && resumeDataPass.length && batchData.content && batchData.content.length) {
        this.sessionCompletionPercentage(batchData, resumeDataPass)
      }
    } else {
      this.resumeDataSubscription = this.resumeData.subscribe(
        (dataResult: any) => {
          if (dataResult && dataResult.length && batchData.content && batchData.content.length) {
            this.sessionCompletionPercentage(batchData, dataResult)
          }
        },
        () => {
          // tslint:disable-next-line: no-console
          console.log('error on resumeDataSubscription')
          this.contentLoader.next(false)
        })
    }

  }
  sessionCompletionPercentage(batchData: any, resumeDataPass: any) {
    if (resumeDataPass && resumeDataPass.length) {
      if (batchData && batchData.content[0] &&
        batchData.content[0].batchAttributes &&
        batchData.content[0].batchAttributes.sessionDetails_v2
      ) {
        batchData.content[0].batchAttributes.sessionDetails_v2.map((sd: any) => {
          const foundContent = resumeDataPass.find((el: any) => el.contentId === sd.sessionId)
          if (foundContent) {
            sd.completionPercentage = foundContent.completionPercentage
            sd.completionStatus = foundContent.status
            sd.lastCompletedTime = foundContent.lastCompletedTime
          }
        })
        this.contentLoader.next(false)
      }
    }
  }

  showStartButton(content: NsContent.IContent | null): { show: boolean; msg: string } {
    const status = {
      show: false,
      msg: '',
    }
    if (content) {
      if (
        content.artifactUrl && content.artifactUrl.match(/youtu(.)?be/gi) &&
        this.configSvc.userProfile &&
        this.configSvc.userProfile.country === 'China'
      ) {
        status.show = false
        status.msg = 'youtubeForbidden'
        return status
      }
      if (content.resourceType !== 'Certification') {
        status.show = true
        return status
      }
    }
    return status
  }

  initData(data: Data, needResumeData: boolean = false): NsAppToc.IWsTocResponse {
    let content: NsContent.IContent | null = null
    let errorCode: NsAppToc.EWsTocErrorCode | null = null
    this.contentLoader.next(true)
    if (data.content && data.content.data && data.content.data.identifier) {
      content = data.content.data
      if (needResumeData) {
        this.resumeDataSubscription = this.resumeData.subscribe(
          (dataResult: any) => {
            if (dataResult && dataResult.length) {
              this.contentLoader.next(true)
              this.mapCompletionPercentage(content, dataResult)
            }
          },
          () => {
            // tslint:disable-next-line: no-console
            console.log('error on resumeDataSubscription')
          },
        )
      } else {
        this.contentLoader.next(false)
      }
    } else {
      this.contentLoader.next(false)
      if (data.error) {
        errorCode = NsAppToc.EWsTocErrorCode.API_FAILURE
      } else {
        errorCode = NsAppToc.EWsTocErrorCode.NO_DATA
      }
    }
    // this.contentLoader.next(false)
    return {
      content,
      errorCode,
    }
  }

  mapCompletionPercentage(content: NsContent.IContent | null, dataResult: any) {
    if (content && content.children) {
      content.children.map(child => {
        const foundContent = dataResult.find((el: any) => el.contentId === child.identifier)
        if (foundContent) {
          child.completionPercentage = foundContent.completionPercentage || foundContent.progress
          child.completionStatus = foundContent.status
        } else {
          this.mapCompletionPercentage(child, dataResult)
        }
      })
      this.contentLoader.next(false)
    } else {
      this.contentLoader.next(false)
    }
  }

  mapModuleCount(content: NsContent.IContent) {
    if (content && content.children) {
      content.children.map(child => {
        if (child.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
          content['moduleCount'] = content['moduleCount'] ? content['moduleCount'] + 1 : 1
        }
        if (child.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
          this.mapModuleCount(child)
        }
      })
    }
  }

  getMimeType(content: NsContent.IContent, identifier: string): NsContent.EMimeTypes {
    if (content.identifier === identifier) {
      return content.mimeType
    }
    if (content && content.children) {
      if (content.children.length === 0) {
        // if (content.children[0].identifier === identifier) {
        //   return content.mimeType
        // }
        // big blunder in data
        // this.logger.log(content.identifier, 'Wrong mimetypes for resume')
        return content.mimeType
      }
      const flatList: any[] = []
      const getAllItemsPerChildren: any = (item: NsContent.IContent) => {
        flatList.push(item)
        if (item.children) {
          return item.children.map((i: NsContent.IContent) => getAllItemsPerChildren(i))
        }
        return
      }
      getAllItemsPerChildren(content)
      const chld = _.first(_.filter(flatList, { identifier }))
      return (chld && chld.mimeType) || ''
    }
    // return chld.mimeType
    return NsContent.EMimeTypes.UNKNOWN
  }

  getTocStructure(
    content: NsContent.IContent,
    tocStructure: NsAppToc.ITocStructure,
  ): NsAppToc.ITocStructure {
    if (
      content &&
      !(content.primaryCategory === this.primaryCategory.RESOURCE
        // || content.primaryCategory === this.primaryCategory.KNOWLEDGE_ARTIFACT)
        || content.primaryCategory === this.primaryCategory.PRACTICE_RESOURCE
        || content.primaryCategory === this.primaryCategory.FINAL_ASSESSMENT
        || content.primaryCategory === this.primaryCategory.OFFLINE_SESSION
      )) {
      if (content.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
        tocStructure.course += 1
      } else if (content.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
        tocStructure.learningModule += 1
      }
      _.each(content.children, child => {
        // tslint:disable-next-line: no-parameter-reassignment
        tocStructure = this.getTocStructure(child, tocStructure)
      })
    } else if (
      content &&
      (
        content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
        // || content.contentType === 'Knowledge Artifact'
        || content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
        || content.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT
        || content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION)
    ) {
      switch (content.mimeType) {
        // case NsContent.EMimeTypes.HANDS_ON:
        //   tocStructure.handsOn += 1
        //   break
        case NsContent.EMimeTypes.MP3:
          tocStructure.podcast += 1
          break
        case NsContent.EMimeTypes.MP4:
        case NsContent.EMimeTypes.M3U8:
        case NsContent.EMimeTypes.YOUTUBE:
          tocStructure.video += 1
          break
        // case NsContent.EMimeTypes.INTERACTION:
        //   tocStructure.interactiveVideo += 1
        //   break
        case NsContent.EMimeTypes.PDF:
          tocStructure.pdf += 1
          break
        // case NsContent.EMimeTypes.HTML:
        case NsContent.EMimeTypes.TEXT_WEB:
          tocStructure.webPage += 1
          break
        case NsContent.EMimeTypes.SURVEY:
          tocStructure.survey += 1
          break
        case NsContent.EMimeTypes.QUIZ:
        case NsContent.EMimeTypes.APPLICATION_JSON:
          // if (content.resourceType === 'Assessment') {
          tocStructure.assessment += 1
          // } else {
          //   tocStructure.quiz += 1
          // }
          break
        case NsContent.EMimeTypes.OFFLINE_SESSION:
          // if (content.resourceType === 'Assessment') {
          tocStructure.offlineSession += 1
          // } else {
          //   tocStructure.quiz += 1
          // }
          break
        case NsContent.EMimeTypes.PRACTICE_RESOURCE:
          if (content.primaryCategory === this.primaryCategory.PRACTICE_RESOURCE) {
            tocStructure.practiceTest += 1
          } else if (content.primaryCategory === this.primaryCategory.FINAL_ASSESSMENT) {
            tocStructure.finalTest += 1
          }
          break
        // case NsContent.EMimeTypes.WEB_MODULE:
        //   tocStructure.webModule += 1
        //   break
        case NsContent.EMimeTypes.ZIP2:
        case NsContent.EMimeTypes.ZIP:
          tocStructure.interactivecontent += 1
          break
        // case NsContent.EMimeTypes.YOUTUBE:
        //   tocStructure.youtube += 1
        //   break
        default:
          tocStructure.other += 1
          break
      }
      return tocStructure
    }
    return tocStructure
  }

  filterToc(
    content: NsContent.IContent,
    filterCategory: NsContent.EFilterCategory = NsContent.EFilterCategory.ALL,
  ): NsContent.IContent | null {
    if (content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
      //  || content.contentType === 'Knowledge Artifact'
      || content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
      || content.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT
      || content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION) {
      return this.filterUnitContent(content, filterCategory) ? content : null
    }
    const filteredChildren: NsContent.IContent[] =
      _.map(_.get(content, 'children'), childContent =>
        this.filterToc(childContent, filterCategory))
        .filter(unitContent => Boolean(unitContent)) as NsContent.IContent[]
    if (filteredChildren && filteredChildren.length) {
      return {
        ...content,
        children: filteredChildren,
      }
    }
    return null
  }

  filterUnitContent(
    content: NsContent.IContent,
    filterCategory: NsContent.EFilterCategory = NsContent.EFilterCategory.ALL,
  ): boolean {
    switch (filterCategory) {
      case NsContent.EFilterCategory.LEARN:
        return (
          !NsContentConstants.VALID_PRACTICE_RESOURCES.has(content.resourceType) &&
          !NsContentConstants.VALID_ASSESSMENT_RESOURCES.has(content.resourceType)
        )
      case NsContent.EFilterCategory.PRACTICE:
        return NsContentConstants.VALID_PRACTICE_RESOURCES.has(content.resourceType)
      case NsContent.EFilterCategory.ASSESS:
        return NsContentConstants.VALID_ASSESSMENT_RESOURCES.has(content.resourceType)
      case NsContent.EFilterCategory.ALL:
      default:
        return true
    }
  }
  fetchContentAnalyticsClientData(contentId: string) {
    if (this.analyticsFetchStatus !== 'fetching' && this.analyticsFetchStatus !== 'done') {
      this.getContentAnalyticsClient(contentId)
    }
  }
  private getContentAnalyticsClient(contentId: string) {
    this.analyticsFetchStatus = 'fetching'
    const url = `${PROXY_SLAG_V8}/LA/api/la/contentanalytics?content_id=${contentId}&type=course`
    this.http.get(url).subscribe(
      (result: any) => {
        this.analyticsFetchStatus = 'done'
        this.analyticsReplaySubject.next(result)
      },
      () => {
        this.analyticsReplaySubject.next(null)
        this.analyticsFetchStatus = 'done'
      },
    )
  }

  fetchContentAnalyticsData(contentId: string) {
    if (this.analyticsFetchStatus !== 'fetching' && this.analyticsFetchStatus !== 'done') {
      this.getContentAnalytics(contentId)
    }
  }
  private getContentAnalytics(contentId: string) {
    this.analyticsFetchStatus = 'fetching'
    // tslint:disable-next-line: max-line-length
    const url = `${PROXY_SLAG_V8}/LA/LA/api/Users?refinementfilter=${encodeURIComponent(
      '"source":["iGot","Learning Hub"]',
    )}$${encodeURIComponent(`"courseCode": ["${contentId}"]`)}`
    this.http.get(url).subscribe(
      (result: any) => {
        this.analyticsFetchStatus = 'done'
        this.analyticsReplaySubject.next(result)
      },
      () => {
        this.analyticsReplaySubject.next(null)
        this.analyticsFetchStatus = 'done'
      },
    )
  }

  clearAnalyticsData() {
    if (this.analyticsReplaySubject) {
      this.analyticsReplaySubject.unsubscribe()
    }
  }

  fetchContentParents(contentId: string): Observable<NsContent.IContentMinimal[]> {
    // return this.http.get<NsContent.IContentMinimal[]>(
    //   `${API_END_POINTS.CONTENT_PARENTS}/${contentId}`,
    // )
    if (contentId) { }
    return EMPTY
  }
  fetchContentWhatsNext(
    contentId: string,
    contentType?: string,
  ): Observable<NsContent.IContentMinimal[]> {
    if (contentType) {
      return this.http.get<NsContent.IContentMinimal[]>(
        `${API_END_POINTS.CONTENT_NEXT}/${contentId}?contentType=${contentType}`,
      )
    }
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_NEXT}/${contentId}?ts=${new Date().getTime()}`,
    )
  }

  fetchMoreLikeThisPaid(contentId: string): Observable<NsContent.IContentMinimal[]> {
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_NEXT
      }/${contentId}?exclusiveContent=true&ts=${new Date().getTime()}`,
    )
  }

  fetchMoreLikeThisFree(contentId: string): Observable<NsContent.IContentMinimal[]> {
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_NEXT
      }/${contentId}?exclusiveContent=false&ts=${new Date().getTime()}`,
    )
  }

  fetchContentCohorts(
    cohortType: NsCohorts.ECohortTypes,
    contentId: string,
  ): Observable<NsCohorts.ICohortsContent[]> {
    return this.http.get<NsCohorts.ICohortsContent[]>(API_END_POINTS.COHORTS(cohortType, contentId), {
      headers: { rootOrg: this.configSvc.rootOrg || '', org: this.configSvc.org ? this.configSvc.org[0] : '' },
    })
  }
  fetchExternalContentAccess(contentId: string): Observable<{ hasAccess: boolean }> {
    return this.http.get<{ hasAccess: boolean }>(API_END_POINTS.EXTERNAL_CONTENT(contentId))
  }
  fetchCohortGroupUsers(groupId: number) {
    return this.http.get<NsCohorts.ICohortsGroupUsers[]>(API_END_POINTS.COHORTS_GROUP_USER(groupId))
  }
  fetchMoreLikeThis(contentId: string, contentType: string): Observable<any> {
    return this.http.get<NsContent.IContent[]>(
      API_END_POINTS.RELATED_RESOURCE(contentId, contentType),
    )
  }

  fetchPostAssessmentStatus(contentId: string) {
    return this.http.get<{ result: NsAppToc.IPostAssessment[] }>(
      API_END_POINTS.POST_ASSESSMENT(contentId),
    )
  }

  fetchGetContentData(contentId: string) {
    let url = ''
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      return this.http.get<{ result: any }>(
        API_END_POINTS.GET_CONTENT(contentId),
      )
    }
    if (window.location.href.includes('editMode=true') && window.location.href.includes('_rc')) {
      url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
    } else {
      url = `/api/content/v1/read/${contentId}`
    }
    return this.http.get<{ result: any }>(url)

  }

  fetchContentParent(contentId: string, data: NsAppToc.IContentParentReq, forPreview = false) {
    return this.http.post<NsAppToc.IContentParentResponse>(
      forPreview
        ? API_END_POINTS.CONTENT_AUTH_PARENT(
          contentId,
          this.configSvc.rootOrg || '',
          this.configSvc.org ? this.configSvc.org[0] : '',
        )
        : API_END_POINTS.CONTENT_PARENT(contentId),
      data,
    )
  }

  createBatch(batchData: any) {
    return this.http.post(
      API_END_POINTS.BATCH_CREATE,
      { request: batchData },
    )
  }

  async mapCompletionPercentageProgram(content: NsContent.IContent | null, enrolmentList: any, collectionId?: string) {
    this.contentLoader.next(true)
    let totalCount = 0
    let leafnodeCount = 0
    let completedLeafNodes: any = []
    let firstUncompleteCourse: any = ''
    let inprogressDataCheck: any = []
    if (content && content.children) {
      leafnodeCount = content.leafNodesCount
      this.contentLoader.next(true)
      const foundParentContent = this.findEnrolmentByCollectionId(enrolmentList, collectionId || content.identifier)
      if (foundParentContent && foundParentContent.completionPercentage === 100) {
        await this.mapCompletionChildPercentageProgram(content)
        totalCount = content.leafNodesCount
      } else {
        if (content?.primaryCategory !== NsContent.EPrimaryCategory.COURSE) {
          for (let i = 0; i < content.children.length; i += 1) {
            // content.children.forEach(async (parentChild,index) => {
            const parentChild = content.children[i]
            if (parentChild.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
              const foundContent = this.findEnrolmentByCollectionId(enrolmentList, parentChild?.identifier)
              // tslint:disable-next-line: max-line-length
              // totalCount = foundContent && foundContent.completionPercentage ? totalCount + foundContent.completionPercentage : totalCount + 0
              // content.completionPercentage = Math.round(totalCount / leafnodeCount)
              if (foundContent && foundContent.completionPercentage === 100) {
                this.contentLoader.next(true)
                totalCount = totalCount += parentChild.leafNodesCount
                completedLeafNodes = [...completedLeafNodes, ...parentChild.leafNodes]
                if (foundContent.issuedCertificates.length > 0) {
                  const certificate: any = foundContent.issuedCertificates.sort((a: any, b: any) =>
                    new Date(a.lastIssuedOn).getTime() - new Date(b.lastIssuedOn).getTime())
                  const certId: any = certificate[0].identifier
                  parentChild.issuedCertificatesId = certId
                  // const certData: any = await this.dowonloadCertificate(certId).toPromise().catch(_error => {
                  //   this.contentLoader.next(false)
                  // })
                  // if (certData && certData.result) {
                  //   parentChild.issuedCertificatesSVG = certData.result.printUri
                  // }
                  this.contentLoader.next(false)
                }
                parentChild.completionPercentage = 100
                parentChild.completionStatus = 2
                await this.mapCompletionChildPercentageProgram(parentChild)
              } else {
                if (foundContent) {
                  this.contentLoader.next(true)
                  const language = this.contentLangSvc.getContentLanguage(parentChild)
                  const req = {
                    request: {
                      batchId: foundContent.batch.batchId,
                      userId: foundContent.userId,
                      language: language,
                      courseId: foundContent.collectionId,
                      contentIds: [],
                      fields: [
                        'progressdetails',
                      ],
                    },
                  }
                  firstUncompleteCourse = (parentChild.completionPercentage === 0 || !parentChild.completionPercentage) &&
                    !firstUncompleteCourse ? parentChild : firstUncompleteCourse
                  inprogressDataCheck = inprogressDataCheck
                  await this.fetchContentHistoryV2(req).toPromise().then((progressdata: any) => {
                    const data: any = progressdata
                    if (data.result && data?.result?.contentList?.length > 0) {
                      const completedCount = data.result.contentList.filter((ele: any) => ele.progress === 100)
                      this.checkCompletedLeafnodes(completedLeafNodes, completedCount)
                      totalCount = completedLeafNodes.length
                      inprogressDataCheck = [...inprogressDataCheck, ...data.result.contentList]
                      // inprogressDataCheck = inprogressDataCheck ? inprogressDataCheck :  data.result.contentList
                      this.updateResumaData(inprogressDataCheck)
                      this.mapCompletionPercentage(parentChild, data.result.contentList)
                      this.mapModuleCount(parentChild)
                    } else {
                      this.mapModuleCount(parentChild)
                    }
                    return progressdata
                  })
                  this.contentLoader.next(false)
                }
              }
            }
            //  else {
            //   if (content.primaryCategory !== NsContent.EPrimaryCategory.BLENDED_PROGRAM) {
            //     this.contentLoader.next(true)
            //     const foundContent = enrolmentList && enrolmentList.find((el: any) => el.collectionId === content.identifier)
            //     if (foundContent) {
            //       const req = {
            //         request: {
            //           batchId: foundContent.batch.batchId,
            //           userId: foundContent.userId,
            //           courseId: foundContent.collectionId,
            //           contentIds: [],
            //           fields: [
            //             'progressdetails',
            //           ],
            //         },
            //       }
            //       await this.fetchContentHistoryV2(req).toPromise().then((progressdata: any) => {
            //         const data: any  = progressdata
            //         if (data.result && data.result.contentList.length > 0) {
            //           const completedCount = data.result.contentList.filter((ele: any) => ele.progress === 100)
            //           this.checkCompletedLeafnodes(completedLeafNodes, completedCount)
            //           totalCount = completedLeafNodes.length
            //           inprogressDataCheck = inprogressDataCheck ? inprogressDataCheck :  data.result.contentList
            //           this.updateResumaData(inprogressDataCheck)
            //           this.mapCompletionPercentage(content, data.result.contentList)
            //         }
            //         this.contentLoader.next(false)
            //         return progressdata
            //       })
            //     }
            //     this.contentLoader.next(false)
            //   }
            // }
            this.contentLoader.next(false)
          }
        }
        if (content.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM
          || content.primaryCategory === NsContent.EPrimaryCategory.COURSE
          || content.primaryCategory === NsContent.EPrimaryCategory.STANDALONE_ASSESSMENT
          || content.primaryCategory === NsContent.EPrimaryCategory.CURATED_PROGRAM) {
          // this.mapCompletionPercentage(content, this.resumeData)
          const foundParentContent = this.findEnrolmentByCollectionId(enrolmentList, collectionId || content?.identifier)
          const language = this.contentLangSvc.getContentLanguage(content)
          const req = {
            request: {
              batchId: foundParentContent?.batch?.batchId,
              userId: foundParentContent?.userId,
              courseId: foundParentContent?.collectionId,
              language: language,
              contentIds: [],
              fields: [
                'progressdetails',
              ],
            },
          }
          await this.fetchContentHistoryV2(req).toPromise().then((progressdata: any) => {
            const data: any = progressdata
            if (data && data.result && data.result.contentList.length > 0) {
              const completedCount = data.result.contentList.filter((ele: any) => ele.progress === 100)
              this.checkCompletedLeafnodes(completedLeafNodes, completedCount)
              totalCount = completedLeafNodes.length
              inprogressDataCheck = [...inprogressDataCheck, ...data.result.contentList]
              // inprogressDataCheck = inprogressDataCheck ? inprogressDataCheck :  data.result.contentList
              this.updateResumaData(inprogressDataCheck)
              this.mapCompletionPercentage(content, data.result.contentList)
            }
            this.contentLoader.next(false)
            return progressdata
          })
        }

        if (inprogressDataCheck && inprogressDataCheck.length === 0 && firstUncompleteCourse) {
          const firstChildData = this.widgetSvc.getFirstChildInHierarchy(firstUncompleteCourse)
          const childEnrollmentData = enrolmentList.find((el: any) =>
            el.collectionId === firstUncompleteCourse.identifier)
          const resumeData = [{
            contentId: firstChildData.identifier,
            batchId: childEnrollmentData && childEnrollmentData.batchId,
            completedCount: 1,
            completionPercentage: 0.0,
            progress: 0,
            viewCount: 1,
            courseId: childEnrollmentData && childEnrollmentData.courseId,
            collectionId: childEnrollmentData && childEnrollmentData.courseId,
            status: 1,
          }]
          inprogressDataCheck = resumeData
          this.updateResumaData(inprogressDataCheck)
        }
      }
      // const parentContent = enrolmentList.find((el: any) => el.collectionId === content.identifier)
      // if (!parentContent.completionPercentage) {
      content.completionPercentage = Math.floor((totalCount / leafnodeCount) * 100)
      content.completionStatus = content.completionPercentage <= 100 ? 1 : 2
      if (content.completionPercentage === 100 && inprogressDataCheck && inprogressDataCheck.length === 0 && !firstUncompleteCourse) {
        const firstChildData = this.widgetSvc.getFirstChildInHierarchy(content)
        const childEnrollmentData = enrolmentList.find((el: any) =>
          el.collectionId === content.children[0].identifier)
        const resumeData = [{
          contentId: firstChildData.identifier,
          batchId: childEnrollmentData && childEnrollmentData.batchId,
          completedCount: 1,
          completionPercentage: 100,
          progress: 2,
          viewCount: 1,
          courseId: childEnrollmentData && childEnrollmentData.courseId,
          collectionId: childEnrollmentData && childEnrollmentData.courseId,
          status: 2,
        }]
        inprogressDataCheck = resumeData
        this.updateResumaData(inprogressDataCheck)
      }
      // // } else {
      //   content.completionPercentage = parentContent.completionPercentage
      // // }
      // })
      // this.mapModuleDurationAndProgress(content, content)
      this.callHirarchyProgressHashmap(content)
      this.checkModuleWiseData(content)
      // Compute milestone locking AFTER progress data is populated
      if (content.courseCategory === 'Learning Pathway') {
        this.computeMilestoneLockingStatus()
        // Ensure hashmap updates are published for change detection
        this.hashmap = { ...this.hashmap }
        console.log('Milestone locking computed, hashmap updated:', this.hashmap)
      }
      this.contentLoader.next(false)
    }
  }
  checkCompletedLeafnodes(leafNodes: any, completedCount: any) {
    if (completedCount.length > 0) {
      completedCount.forEach((ele: any) => {
        if (!leafNodes.includes(ele.contentId)) {
          leafNodes.push(ele.contentId)
        }
      })
    }
  }

  // async getProgressForChildCourse(request: any, content: any) {
  //  const data: any =   await this.fetchContentHistoryV2(request).toPromise().catch(_error => {})
  //   if (data.result && data.result.contentList.length > 0) {
  //     this.mapCompletionPercentage(content, data.result.contentList)
  // }
  // }

  findEnrolmentByCollectionId(enrolmentList: any, identifier: string) {
    return enrolmentList && enrolmentList?.length && enrolmentList.find((el: any) => el?.collectionId === identifier)
  }

  async mapCompletionChildPercentageProgram(course: any) {
    if (course && course.children) {
      await course.children.map(async (courseChild: any) => {
        if ((courseChild && courseChild.children) || courseChild.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
          this.mapCompletionChildPercentageProgram(courseChild)
          course['moduleCount'] = course['moduleCount'] ? course['moduleCount'] + 1 : 1
        } else {
          courseChild['completionPercentage'] = 100
          courseChild['completionStatus'] = 2
        }
      })
    }
  }

  public mapModuleDurationAndProgress(content: NsContent.IContent | null, parent: NsContent.IContent | null) {
    if (content && content.children) {
      if (content.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
        // content.children.map((item: NsContent.IContent)=> {
        /* tslint:disable-next-line */
        content = this.getCalculationsFromChildren(content)
        // })
      }

      content.children.map((item: NsContent.IContent) => {
        // if (item.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
        //   this.mapModuleDurationAndProgress(item, parent)
        // } else {
        //   this.mapModuleDurationAndProgress(item, parent)
        // }
        if (item && item.children) {
          this.mapModuleDurationAndProgress(item, parent)
        }
      })
    }
  }

  public createHirarchyProgressHashmap(hierarchyData: NsContent.IContent, rootCourseCategory?: string) {
    if (hierarchyData && hierarchyData.children) {
      hierarchyData.children.forEach((child: NsContent.IContent) => {
        if (child && child.children) {
          this.createHirarchyProgressHashmap(child, rootCourseCategory)
        }
        const primaryCat = child.primaryCategory as string
        const courseCat = (child.courseCategory || child.primaryCategory || '') as string
        const isMilestone = primaryCat === 'Milestone' || courseCat === 'Milestone'
        const isCollection = child.mimeType === NsContent.EMimeTypes.COLLECTION
        const isModule = child.primaryCategory === NsContent.EPrimaryCategory.MODULE
        const isResource = child.primaryCategory === NsContent.EPrimaryCategory.RESOURCE ||
          child.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE ||
          child.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT ||
          child.primaryCategory === NsContent.EPrimaryCategory.COMP_ASSESSMENT
        const isLearningPathway = rootCourseCategory === 'Learning Pathway'

        // Check if content is mandatory (isMandatory flag or mandatory property)
        const isMandatory = child.isMandatory === true || (child as any).mandatory === true

        let localMap: any = {
          parent: child?.parent,
          identifier: child.identifier,
          leafNodesCount: child.leafNodesCount || null,
          leafNodes: child.leafNodes || [],
          completionPercentage: child.completionPercentage || child.progress || 0,
          completionStatus: child.completionStatus || child.status || 0,
          status: child.status || child.completionStatus || 0,
          progress: child.progress,
          primaryCategory: child.primaryCategory,
          courseCategory: courseCat,
          duration: child.duration || 0,
          expectedDuration: child.expectedDuration || 0,
          // Additional metadata for performance optimization
          mimeType: child.mimeType,
          isLocked: child.isLocked || false,
          artifactUrl: child.artifactUrl || null,
          name: child.name || '',
          contentType: child.contentType || '',
          // Pre-computed flags for Learning Pathway
          isMilestone: isMilestone,
          isCollection: isCollection,
          isModule: isModule,
          isResource: isResource,
          isLearningPathway: isLearningPathway,
          isMandatory: isMandatory,
          // Milestone specific data
          milestoneIndex: (child as any).milestoneIndex,
          completedLeafNodesCount: (child as any).completedLeafNodesCount || 0,
          // Pre-assessment flag (for milestone gating)
          isPreAssessment: (child as any).isPreAssessment || false,
        }

        // Debug logging for milestones
        if (isMilestone) {
          console.log(`[Hashmap Build] Milestone ${child.identifier} (${child.name}): completionPercentage=${child.completionPercentage}, completionStatus=${child.completionStatus}, status=${child.status}, leafNodesCount=${child.leafNodesCount}, completedLeafNodesCount=${(child as any).completedLeafNodesCount}`)
        }

        this.hashmap[child.identifier] = localMap
      })
    }
  }

  public createPreAssessmentHirarchyProgressHashmap(hierarchyData: NsContent.IContent) {
    console.log('hierarchyData--', hierarchyData)
    if (hierarchyData && hierarchyData.preEnrolmentResources) {
      hierarchyData.preEnrolmentResources.forEach((child: NsContent.IContent) => {
        if (child && child.preEnrolmentResources) {
          this.createPreAssessmentHirarchyProgressHashmap(child)
        }
        let localMap = {}
        localMap = {
          parent: child?.parent,
          identifier: child.identifier,
          leafNodesCount: child.leafNodesCount || null,
          leafNodes: child.leafNodes || [],
          completionPercentage: child.completionPercentage || child.progress,
          completionStatus: child.completionStatus,
          progress: child.progress,
          primaryCategory: child.primaryCategory,
          courseCategory: child.courseCategory || child.primaryCategory || '',
          duration: child.duration || 0,
          expectedDuration: child.expectedDuration || 0,
        }
        this.hashmap[child.identifier] = localMap
      })
    }
  }

  public callHirarchyProgressHashmap(hierarchyData: NsContent.IContent | null) {
    if (hierarchyData) {
      const rootCourseCategory = hierarchyData.courseCategory || hierarchyData.primaryCategory || ''
      const isLearningPathway = rootCourseCategory === 'Learning Pathway'

      this.hashmap[hierarchyData.identifier] = {
        parent: hierarchyData.parent,
        identifier: hierarchyData.identifier,
        leafNodesCount: hierarchyData.leafNodesCount || null,
        leafNodes: hierarchyData.leafNodes || [],
        completionPercentage: hierarchyData.completionPercentage || hierarchyData.progress || 0,
        completionStatus: hierarchyData.completionStatus || 0,
        progress: hierarchyData.progress,
        primaryCategory: hierarchyData.primaryCategory,
        courseCategory: rootCourseCategory,
        expectedDuration: hierarchyData.expectedDuration || 0,
        // Additional metadata
        mimeType: hierarchyData.mimeType,
        isLocked: hierarchyData.isLocked || false,
        artifactUrl: hierarchyData.artifactUrl || null,
        name: hierarchyData.name || '',
        contentType: hierarchyData.contentType || '',
        isMilestone: false,
        isCollection: hierarchyData.mimeType === NsContent.EMimeTypes.COLLECTION,
        isModule: hierarchyData.primaryCategory === NsContent.EPrimaryCategory.MODULE,
        isResource: false,
        isLearningPathway: isLearningPathway,
      }
      if (hierarchyData.primaryCategory === NsContent.EPrimaryCategory.CURATED_PROGRAM &&
        hierarchyData.compatibilityLevel >= 5 && hierarchyData.contextLockingType &&
        hierarchyData.contextLockingType === NsContent.EContextLockingType.COURSE_ASSESSMENT_ONLY) {
        this.hashmap[hierarchyData.identifier] = {
          ...this.hashmap[hierarchyData.identifier],
          contextLockingType: hierarchyData.contextLockingType,
          compatibilityLevel: hierarchyData.compatibilityLevel,
        }
      }
      this.createHirarchyProgressHashmap(hierarchyData, rootCourseCategory)
      // NOTE: computeMilestoneLockingStatus is called AFTER progress data is populated
      // in mapCompletionPercentageProgram, not here where completion data is still 0
      this.hashmap = { ...this.hashmap }
      console.log('this.hashmap--', this.hashmap)
    }
  }

  /**
   * Pre-compute milestone locking status for all milestones in Learning Pathway
   * This avoids expensive calculations in component getters
   * 
   * Locking Rules:
   * 1. All milestones are locked by default
   * 2. Milestone 1 (M1) unlocks when pre-assessment is completed
   * 3. Milestone N (N > 1) unlocks when:
   *    - All mandatory learning items in Milestone N-1 are completed
   *    - The assessment of Milestone N-1 is completed
   */
  public computeMilestoneLockingStatus() {
    console.log('=== COMPUTING MILESTONE LOCKING STATUS ===')
    console.log('Full hashmap:', this.hashmap)

    // Get all milestone entries from hashmap sorted by their index or number
    const milestoneEntries = Object.keys(this.hashmap)
      .filter(key => {
        const item = this.hashmap[key]
        return item.isMilestone || item.primaryCategory === 'Milestone' || item.courseCategory === 'Milestone'
      })
      .sort((a, b) => {
        // Sort by milestoneIndex if available, otherwise by number in ID
        const itemA = this.hashmap[a]
        const itemB = this.hashmap[b]
        if (itemA.milestoneIndex !== undefined && itemB.milestoneIndex !== undefined) {
          return itemA.milestoneIndex - itemB.milestoneIndex
        }
        const numA = parseInt(a.replace(/\D/g, '')) || 0
        const numB = parseInt(b.replace(/\D/g, '')) || 0
        return numA - numB
      })

    console.log('Milestone entries found:', milestoneEntries)

    // Check if pre-assessment is completed (required to unlock M1)
    const isPreAssessmentCompleted = this.checkPreAssessmentCompletion()

    milestoneEntries.forEach((milestoneId, index) => {
      const milestone = this.hashmap[milestoneId]
      if (!milestone) return

      // First milestone (M1) - unlocks when pre-assessment is completed
      if (index === 0) {
        this.hashmap[milestoneId].computedIsLocked = !isPreAssessmentCompleted
        console.log(`Milestone ${milestoneId} (M1): Pre-assessment completed: ${isPreAssessmentCompleted}, Locked: ${!isPreAssessmentCompleted}`)
        return
      }

      // For subsequent milestones (M2, M3, etc.), check if previous milestone is fully completed
      const previousMilestoneId = milestoneEntries[index - 1]
      const previousMilestone = this.hashmap[previousMilestoneId]

      if (previousMilestone) {
        // SIMPLIFIED APPROACH: Check if previous milestone is 100% complete
        // This uses the aggregated completion percentage which is already calculated
        // Use Number() to ensure proper numeric comparison
        const prevCompletionPct = Number(previousMilestone.completionPercentage) || 0
        const prevCompletionStatus = Number(previousMilestone.completionStatus) || 0
        const prevStatus = Number(previousMilestone.status) || 0
        const prevCompletedLeafNodes = Number(previousMilestone.completedLeafNodesCount) || 0
        const prevLeafNodesCount = Number(previousMilestone.leafNodesCount) || 0

        const previousMilestoneComplete =
          prevCompletionPct >= 100 ||
          prevCompletionStatus === 2 ||
          prevStatus === 2 ||
          (prevLeafNodesCount > 0 && prevCompletedLeafNodes >= prevLeafNodesCount)

        console.log(`Milestone ${milestoneId} (M${index + 1}): Previous milestone (${previousMilestoneId}) - completionPercentage: ${prevCompletionPct}, completionStatus: ${prevCompletionStatus}, status: ${prevStatus}, completedLeafNodes: ${prevCompletedLeafNodes}/${prevLeafNodesCount}, isComplete: ${previousMilestoneComplete}`)

        // If simple check doesn't show complete, fall back to detailed check
        let canUnlock = previousMilestoneComplete

        if (!canUnlock) {
          // Fallback: Check individual items
          const isPreviousMilestoneAssessmentComplete = this.checkMilestoneAssessmentComplete(previousMilestoneId)
          const isPreviousMilestoneMandatoryComplete = this.checkMilestoneMandatoryContentComplete(previousMilestoneId)
          canUnlock = isPreviousMilestoneAssessmentComplete && isPreviousMilestoneMandatoryComplete
          console.log(`Milestone ${milestoneId} (M${index + 1}) - Fallback check: assessment: ${isPreviousMilestoneAssessmentComplete}, mandatory: ${isPreviousMilestoneMandatoryComplete}, canUnlock: ${canUnlock}`)
        }

        this.hashmap[milestoneId].computedIsLocked = !canUnlock
        console.log(`Milestone ${milestoneId} (M${index + 1}): FINAL - canUnlock: ${canUnlock}, Locked: ${!canUnlock}`)
      } else {
        this.hashmap[milestoneId].computedIsLocked = true
      }
    })

    // Now compute parent milestone lock status for all children
    Object.keys(this.hashmap).forEach(key => {
      const item = this.hashmap[key]
      if (item.isMilestone) return // Skip milestones themselves

      // Traverse up to find if any ancestor milestone is locked
      let currentParentId = item.parent
      let depth = 0
      const maxDepth = 5

      while (currentParentId && depth < maxDepth) {
        const parentData = this.hashmap[currentParentId]
        if (parentData) {
          if (parentData.isMilestone && parentData.computedIsLocked) {
            this.hashmap[key].isParentMilestoneLocked = true
            break
          }
          currentParentId = parentData.parent
        } else {
          break
        }
        depth++
      }
      if (!this.hashmap[key].isParentMilestoneLocked) {
        this.hashmap[key].isParentMilestoneLocked = false
      }
    })

    // Create new hashmap reference to trigger Angular change detection
    this.hashmap = { ...this.hashmap }
    console.log('=== MILESTONE LOCKING STATUS COMPUTED ===', this.hashmap)
  }

  /**
   * Check if pre-assessment (preliminary assessment) is completed
   * Pre-assessment is typically a Course Assessment at the root level of Learning Pathway (before milestones)
   */
  private checkPreAssessmentCompletion(): boolean {
    console.log('Checking pre-assessment completion...')

    // Find the Learning Pathway root
    let learningPathwayId: string | null = null
    for (const key of Object.keys(this.hashmap)) {
      const item = this.hashmap[key]
      if (item.isLearningPathway && item.courseCategory === 'Learning Pathway') {
        learningPathwayId = key
        break
      }
    }

    console.log('Learning Pathway root ID:', learningPathwayId)

    // PRIORITY 1: Look for items explicitly marked as pre-assessment
    for (const key of Object.keys(this.hashmap)) {
      const item = this.hashmap[key]
      if (item.isPreAssessment === true) {
        const isCompleted = item.completionStatus === 2 || item.status === 2 || item.completionPercentage >= 100 || item.progress >= 100
        console.log(`Pre-assessment (via flag) found: ${key} (${item.name}), Status: ${item.completionStatus}, status: ${item.status}, Percentage: ${item.completionPercentage}, Completed: ${isCompleted}`)
        return isCompleted
      }
    }

    // PRIORITY 2: Find pre-assessment in hashmap - direct child of Learning Pathway that is NOT a milestone
    // Check for first non-milestone child of Learning Pathway
    for (const key of Object.keys(this.hashmap)) {
      const item = this.hashmap[key]

      // Check if this is a direct child of the Learning Pathway
      if (item.parent !== learningPathwayId) continue

      // Skip milestones
      if (item.isMilestone) continue

      // This is a non-milestone direct child - it's the pre-assessment
      const isCompleted = item.completionStatus === 2 || item.status === 2 || item.completionPercentage >= 100 || item.progress >= 100
      console.log(`Pre-assessment (first non-milestone child) found: ${key} (${item.name}), Status: ${item.completionStatus}, status: ${item.status}, Percentage: ${item.completionPercentage}, Completed: ${isCompleted}`)
      return isCompleted
    }

    // If no pre-assessment found, consider M1 can be unlocked (no pre-assessment requirement)
    console.log('No pre-assessment found, defaulting to unlocked M1')
    return true
  }

  /**
   * Check if a milestone's assessment is completed
   * Searches for any assessment type (Course Assessment, Final Assessment, etc.) that belongs to this milestone
   */
  private checkMilestoneAssessmentComplete(milestoneId: string): boolean {
    const milestone = this.hashmap[milestoneId]
    console.log(`Checking assessment for milestone ${milestoneId}:`, milestone)

    // Check all items in hashmap that are assessments and belong to this milestone
    for (const key of Object.keys(this.hashmap)) {
      const item = this.hashmap[key]

      // Check if this is an assessment type
      const isAssessmentType =
        item.primaryCategory === 'Course Assessment' ||
        item.primaryCategory === 'Final Assessment' ||
        item.primaryCategory === 'Practice Question Set' ||
        item.courseCategory === 'Course Assessment' ||
        item.courseCategory === 'Final Assessment' ||
        (item.name && item.name.toLowerCase().includes('assessment'))

      if (!isAssessmentType) continue

      // Check if this assessment belongs to this milestone
      if (this.isChildOfMilestone(key, milestoneId)) {
        const isCompleted = item.completionStatus === 2 || item.status === 2 || item.completionPercentage >= 100 || item.progress >= 100
        console.log(`Milestone ${milestoneId} Assessment found: ${key} (${item.name}), primaryCategory: ${item.primaryCategory}, Status: ${item.completionStatus}, status: ${item.status}, Percentage: ${item.completionPercentage}, Progress: ${item.progress}, Completed: ${isCompleted}`)
        if (isCompleted) {
          return true
        }
      }
    }

    // If no assessment found, consider it as completed (no assessment requirement)
    console.log(`Milestone ${milestoneId}: No assessment found, defaulting to completed`)
    return true
  }

  /**
   * Check if a milestone's mandatory content is completed
   * Only checks courses/content that are marked as isMandatory
   */
  private checkMilestoneMandatoryContentComplete(milestoneId: string): boolean {
    const milestone = this.hashmap[milestoneId]
    console.log(`Checking mandatory content for milestone ${milestoneId}:`, milestone)

    let mandatoryCount = 0
    let completedMandatoryCount = 0

    // Check all items in hashmap that are direct children of this milestone (courses)
    for (const key of Object.keys(this.hashmap)) {
      const item = this.hashmap[key]

      // Check if this item is a direct child of the milestone (course level)
      if (item.parent !== milestoneId) continue

      // Skip if not a course or collection
      if (item.primaryCategory !== 'Course' && !item.isCollection) continue

      // Skip assessments - they're checked separately
      const isAssessment =
        item.primaryCategory === 'Course Assessment' ||
        item.primaryCategory === 'Final Assessment' ||
        item.courseCategory === 'Course Assessment' ||
        (item.name && item.name.toLowerCase().includes('assessment'))
      if (isAssessment) continue

      // Check if this content is mandatory
      if (item.isMandatory) {
        mandatoryCount++
        const isCompleted = item.completionStatus === 2 || item.status === 2 || item.completionPercentage >= 100 || item.progress >= 100
        console.log(`Mandatory course ${key} (${item.name}): Status ${item.completionStatus}, status: ${item.status}, Percentage ${item.completionPercentage}, Progress: ${item.progress}, Completed: ${isCompleted}`)
        if (isCompleted) {
          completedMandatoryCount++
        }
      }
    }

    const allComplete = mandatoryCount === 0 || completedMandatoryCount >= mandatoryCount
    console.log(`Milestone ${milestoneId} Mandatory: ${completedMandatoryCount}/${mandatoryCount} completed, All complete: ${allComplete}`)
    return allComplete
  }

  /**
   * Check if a content item is a child (direct or nested) of a milestone
   */
  private isChildOfMilestone(contentId: string, milestoneId: string): boolean {
    let currentId = contentId
    let depth = 0
    const maxDepth = 10

    while (currentId && depth < maxDepth) {
      const item = this.hashmap[currentId]
      if (!item) return false
      if (item.parent === milestoneId) return true
      currentId = item.parent
      depth++
    }
    return false
  }

  getCalculationsFromChildren(item: NsContent.IContent) {
    item['duration'] = item.children.reduce((sum, child) => {
      return sum + Number(child.duration || 0)
    }, 0)
    const completedItems = _.filter(item.children, r => r.completionStatus === 2 || r.completionPercentage === 100)
    const totalCount = _.toInteger(_.get(item, 'leafNodesCount')) || 1
    item['completionPercentage'] = Number(((completedItems.length / totalCount) * 100).toFixed())
    item['completionStatus'] = (item.completionPercentage >= 100) ? 2 : 1
    return item
  }

  fetchContentHistoryV2(req: NsContent.IContinueLearningDataReq): Observable<NsContent.IContinueLearningData> {
    req.request.fields = ['progressdetails']

    if (req.request.courseId) {
      const reslut: any = this.http.post<NsContent.IContinueLearningData>(
        `${API_END_POINTS.CONTENT_HISTORYV2}/${req.request.courseId}`, req
      )
      // data.subscribe((subscribeData: any) => {
      //       this.programChildCourseResumeData.next({ resumeData: subscribeData.result.contentList, courseId: req.request.courseId })
      //     })
      return reslut
    }
    return of()

  }

  dowonloadCertificate(certId: any): Observable<any> {
    return this.http.get<{ result: any }>(
      API_END_POINTS.CERT_DOWNLOAD(certId),
    )
  }
  getServerDate() {
    return this.http.get<{ result: NsAppToc.IPostAssessment[] }>(
      API_END_POINTS.SERVER_DATE)
  }

  getFormById(formId: string) {
    return this.http.get(API_END_POINTS.GET_FORM_BYID(formId))
  }

  submitForm(formData: any) {
    return this.http.post<any>(API_END_POINTS.SUBMIT_FORM, formData)
  }

  getFormByIdPublic(formId: string) {
    return this.http.get(API_END_POINTS.GET_FORM_BYID_PUBLIC(formId))
  }

  submitFormPublic(formData: any) {
    return this.http.post<any>(API_END_POINTS.SUBMIT_FORM_PUBLIC, formData)
  }

  getApllicationsById(formId: string, contextId: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_APPLICATIONS_BY_ID(formId, contextId))
  }

  shareContent(reqBody: any) {
    return this.http.post<any>(`${API_END_POINTS.SHARE_CONTENT}`, reqBody)
  }
  checkModuleWiseData(content: any) {
    if (content && content.children) {
      content.children.forEach((ele: any) => {
        if (ele.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
          let moduleResourseCount = 0
          let offlineResourseCount = 0
          ele.children.forEach((childEle: any) => {
            if (childEle.primaryCategory !== NsContent.EPrimaryCategory.OFFLINE_SESSION) {
              moduleResourseCount = moduleResourseCount + 1
            } else {
              offlineResourseCount = offlineResourseCount + 1
            }
          })
          ele['moduleResourseCount'] = moduleResourseCount
          ele['offlineResourseCount'] = offlineResourseCount
        } else {
          if (ele.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
            this.checkModuleWiseData(ele)
          }
        }
      })
    }
  }
  async fetchCourseHeirarchy(contentData: any) {
    if (contentData && contentData.children) {
      for (const ele of contentData.children) {
        if (ele.primaryCategory === NsContent.ECourseCategory.COURSE) {
          await this.widgetSvc.fetchContent(ele.identifier).toPromise().then(async (subEle: any) => {
            if (subEle.result && subEle.result.content
              && subEle.result.content.children && subEle.result.content.children.length) {
              ele['children'] = subEle.result.content.children
            }
          })
        }
      }
    }
  }

  setTranscriptionData(data: any) {
    //  console.log('data--', data)
    this.transriptionDataSubject.next(data);
  }

  setActiveSubtitleLanguage(activeLang: any) {
    console.log('activeLang--', activeLang)
    this.transriptionActiveLanguageDataObject.next(activeLang)
  }



  aiGetResourceVttFile(resourceID: any) {
    return this.http.get<any>(`${API_END_POINTS.AI_RESOURCE_VTT_FILE}?resource_id=${resourceID}`)
  }

  readPreEnrollmentResourcesState(req: any) {
    return this.http
      .post(`${API_END_POINTS.PRE_ENROLLMENT_STATE_READ}`, req)
  }

  createContentV2(requestBody: any) {
    return this.http
      .post(
        `${API_END_POINTS.CREATE_RESOURCE}`,
        requestBody,
      )
      .pipe(
        map((data: any) => {
          return data.result.identifier
        }),
      )
  }


  uploadAssignmentAnswer(contentId: string, batchId: string, assignmentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name)
    return this.http.post(`${API_END_POINTS.UPLOAD_ASSIGNMENT}/${contentId}/${batchId}/${assignmentId}`, formData);
  }


  readContentV2(id: string): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.READ_RESOURCE}read/${id}?mode=edit`,
    ).pipe(
      map((data: any) => {
        return data.result.content
      })
    )
  }

  upload(
    data: FormData,
    contentData: any,
    options?: any,
  ): Observable<any> {

    const file = data.get('content') as File
    let fileName = file.name
    if (['channel.json'].indexOf(fileName) < 0) {
      fileName = this.appendToFilename(fileName)
    }
    const newFormData = new FormData()
    newFormData.append('data', file, fileName)
    return this.http.post<any>(
      `${API_END_POINTS.UPLOAD_FILE}upload/${contentData.contentId}`,
      newFormData,
      options
    )
  }

  appendToFilename(filename: string) {
    const timeStamp = new Date().getTime()
    const dotIndex = filename.lastIndexOf('.')
    if (dotIndex === -1) {
      return filename + timeStamp
    }
    return filename.substring(0, dotIndex) + timeStamp + filename.substring(dotIndex)
  }

  updateContentWithFewFields(requestBody: any, identifier: string): Observable<any> {
    return this.http.patch<any>(
      `${API_END_POINTS.UPDATE_RESOURCE}/${identifier}`,
      requestBody,
    )
  }

  searchAssignments(request: any): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH, request)
  }

  submitDraftAssignment(request: any): Observable<any> {
    return this.http.put(API_END_POINTS.SUBMIT_DRAFT_ASSIGNMENT, request)
  }

  submitAssignment(request: any): Observable<any> {
    return this.http.post(API_END_POINTS.SUBMIT_ASSIGNMENT, request)
  }

  notifyAssignmentSubmission(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.NOTIFY_ASSIGNMENT_SUBMISSION, payload)
  }

  getAssignmentStatus(request: any): Observable<any> {
    return this.http.post(`${API_END_POINTS.ASSIGNMENT_STATUS}`, request)
  }

  readAssignmentFile(contentId: string, batchId: string, assignmentId: string, fileName: string): Observable<any> {
    // Properly encode the parameters to avoid malformed request errors
    const encodedParams = new URLSearchParams({
      contentId: contentId || '',
      batchId: batchId || '',
      formId: assignmentId || '',
      fileName: fileName || ''
    });

    return this.http.get(`${API_END_POINTS.READ_ASSIGNMENT}?${encodedParams.toString()}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    }).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );
  }

}
