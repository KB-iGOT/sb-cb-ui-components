import { Component, OnInit, OnDestroy, signal, computed, input, inject } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService, EventService, WsEvents, WidgetEnrollService, DomainConfService } from '@sunbird-cb/utils-v2'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { TranslateModule } from '@ngx-translate/core'
import { InProgressCardV2Component } from './in-progress-card-v2/in-progress-card-v2.component'
import { WeeklyClapsCardV2Component } from './weekly-claps-card-v2/weekly-claps-card-v2.component'
import { buildWeeklyClapsData } from './weekly-claps-card-v2/weekly-claps-data.util'
import { ContentApiService } from '../strips-v2/services/content-api.service'
import { LearningProgressConfig } from '../strips-v2/models/content-section.model'

// -- Old direct-call payloads, kept for reference — see loadInProgressCourse() below --
// // In-progress enrollment payload — same as ContentStripWithTabsPills uses for the "In Progress" pill
// const IN_PROGRESS_PAYLOAD = {
//   request: {
//     retiredCoursesEnabled: false,
//     status: 'In-Progress',
//     limit: 1
//   },
// }
//
// // External enrollment payload for in-progress courses
// const IN_PROGRESS_EXTERNAL_PAYLOAD = {
//   request: {
//     status: 'In-Progress',
//   },
// }

@Component({
  selector: 'sb-uic-continue-learning-v2',
  templateUrl: './continue-learning-v2.component.html',
  styleUrls: ['./continue-learning-v2.component.scss'],
  standalone: true,
  imports: [TranslateModule, InProgressCardV2Component, WeeklyClapsCardV2Component],
})
export class ContinueLearningV2Component implements OnInit, OnDestroy {
  /**
   * Per-element switches from the learningProgress section of the home form config.
   * Absent config (or an absent key) means shown, so this stays backward compatible with
   * configs authored before the keys existed. Hiding the whole section is a separate
   * concern — set the section's own visibilityMode to 'hidden'.
   */
  config = input<LearningProgressConfig | null | undefined>(null)

  showViewAll = computed(() => this.config()?.viewAll?.enabled !== false)
  showInProgress = computed(() => this.config()?.inProgress?.enabled !== false)
  showWeeklyClaps = computed(() => this.config()?.weeklyClaps?.enabled !== false)

  inProgressCourse: any = null
  isInProgressLoading = signal(true)

  insightsData: any = null
  weeklyData: any = null
  isWeeklyLoading = true

  private readonly configSvc = inject(ConfigurationsService)
  private readonly enrollSvc = inject(WidgetEnrollService)
  private readonly domainConfSvc = inject(DomainConfService)
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly eventSvc = inject(EventService)
  private readonly contentApiSvc = inject(ContentApiService)
  private readonly destroy$ = new Subject<void>()

  ngOnInit() {
    // a disabled card is never rendered, so its API call is pure waste
    if (this.showInProgress()) {
      this.loadInProgressCourse()
    } else {
      this.isInProgressLoading.set(false)
    }
    if (this.showWeeklyClaps()) {
      this.loadWeeklyClaps()
    } else {
      this.isWeeklyLoading = false
    }
  }

  // Routed through ContentApiService/API_REGISTRY — same call pattern as
  // ContentStripsComponent.fetchContent(). apiDetailsKey is hardcoded for now;
  // passing it in via config will follow later.
  loadInProgressCourse() {
    const userId = this.configSvc.userProfile?.userId
    if (!userId) {
      this.isInProgressLoading.set(false)
      return
    }

    const apiDetailsKey = 'continueLearningApi'
    this.isInProgressLoading.set(true)
    this.contentApiSvc.loadContent(apiDetailsKey).then(obs$ => {
      obs$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          const courses = res?.result?.courses ?? []
          this.inProgressCourse = this.formatAndPickFirst(courses)
          this.isInProgressLoading.set(false)
        },
        error: () => {
          this.isInProgressLoading.set(false)
        }
      })
    })
  }

  // -- Old direct-call implementation, kept for reference --
  // // Calls enrollment APIs directly — same as ContentStripWithTabsPillsComponent.fetchFromInternalEnrollmentList
  // loadInProgressCourseOld() {
  //   const userId = this.configSvc.userProfile?.userId
  //   if (!userId) {
  //     this.isInProgressLoading.set(false)
  //     return
  //   }
  //
  //   this.enrollSvc.fetchInternalEnrollmentData(userId, IN_PROGRESS_PAYLOAD)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((res: any) => {
  //       let courses: any[] = []
  //       if (res?.result?.courses?.length) {
  //         courses = [...courses, ...res.result.courses]
  //       }
  //       this.enrollSvc.fetchExternalEnrollmentData(IN_PROGRESS_EXTERNAL_PAYLOAD)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe((extRes: any) => {
  //           if (extRes?.result?.courses?.length) {
  //             courses = [...courses, ...extRes.result.courses]
  //           }
  //           this.inProgressCourse = this.formatAndPickFirst(courses)
  //           this.isInProgressLoading.set(false)
  //         }, () => {
  //           this.inProgressCourse = this.formatAndPickFirst(courses)
  //           this.isInProgressLoading.set(false)
  //         })
  //     }, () => {
  //       this.enrollSvc.fetchExternalEnrollmentData(IN_PROGRESS_EXTERNAL_PAYLOAD)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe((extRes: any) => {
  //           const courses = extRes?.result?.courses ?? []
  //           this.inProgressCourse = this.formatAndPickFirst(courses)
  //           this.isInProgressLoading.set(false)
  //         }, () => { this.isInProgressLoading.set(false) })
  //     })
  // }

  private formatAndPickFirst(courses: any[]): any {
    if (!courses?.length) { return null }
    const content = courses.map((c: any) => {
      const contentTemp: any = c.content || c.event || {}
      contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
      contentTemp.completionStatus = c.completionStatus || c.status || 0
      contentTemp.enrolledDate = c.enrolledDate || ''
      contentTemp.lastContentAccessTime = c.lastContentAccessTime || ''
      contentTemp.lastReadContentStatus = c.lastReadContentStatus || ''
      contentTemp.lastReadContentId = c.lastReadContentId || ''
      contentTemp.lrcProgressDetails = c.lrcProgressDetails || ''
      contentTemp.issuedCertificates = c.issuedCertificates || c.issued_certificates || []
      contentTemp.batchId = c.batchId || ''
      // contentTemp is c.content itself, so courseId - which lives on the enrolment wrapper, not on
      // the content - has to be carried across or the card has no id to fall back on
      contentTemp.courseId = c.courseId || c.contentId || ''
      contentTemp.content = c.content || c.event || {}
      contentTemp.content.primaryCategory = (c.content?.primaryCategory) || (c.event?.resourceType) || ''
      contentTemp.cType = c.event ? 'event' : ''
      return contentTemp
    })
    const sorted = content.sort((a: any, b: any) => {
      const dateA: any = new Date(a.lastContentAccessTime || 0)
      const dateB: any = new Date(b.lastContentAccessTime || 0)
      return dateB - dateA
    })
    return sorted[0] ?? null
  }

  // Reproduces HomePageService.getInsightsData() locally so this component has
  // no dependency on the portal app — both DomainConfService and HttpClient
  // already ship from @sunbird-cb/utils-v2 / Angular respectively.
  private getInsightsData(payload: any): Observable<any> {
    const url = this.domainConfSvc.getApiUrl('user', 'insights', '/apis/proxies/v8/read/user/insights')
    if (!url) {
      console.warn('Insights API is disabled')
      return new Observable()
    }
    return this.http.post(url, payload)
  }

  loadWeeklyClaps() {
    const rootOrgId = this.configSvc.userProfile?.rootOrgId ?? ''
    const request = {
      request: {
        filters: {
          primaryCategory: 'programs',
          organisations: ['across', rootOrgId],
        },
      },
    }
    this.getInsightsData(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res?.result?.response) {
          this.insightsData = res.result.response
          if (this.insightsData['weekly-claps']) {
            this.insightsData['weeklyClaps'] = this.insightsData['weekly-claps']
          }
          this.weeklyData = buildWeeklyClapsData(this.insightsData['weeklyClaps'])
        }
        this.isWeeklyLoading = false
      }, () => { this.isWeeklyLoading = false })
  }

  viewAll() {
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: 'view-all-btn',
        id: 'continue-learning-view-all',
      },
      {},
      { module: WsEvents.EnumTelemetrymodules.HOME }
    )
    this.router.navigate(['/app/seeAll/new'], {
      queryParams: {
        key: 'continueLearning',
        tabSelected: 'Contents',
        pillSelected: 'inprogress'
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
