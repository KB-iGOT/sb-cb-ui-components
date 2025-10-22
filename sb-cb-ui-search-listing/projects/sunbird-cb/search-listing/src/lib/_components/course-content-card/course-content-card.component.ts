import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ConfigurationsService, EventService, NsContent, WsEvents } from "@sunbird-cb/utils-v2";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatSnackBar as MatSnackbarNew } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { WidgetContentLibService } from "@sunbird-cb/consumption";
import { CertificateDialogComponent } from "@sunbird-cb/consumption";
import { ICompentencyKeys, SearchListingConfig } from "../../_models/search-listing.model";
import { SearchListingService } from "../../_services/search-listing.service";
import * as _ from "lodash";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const NEW_CONTENT_THRESHOLD_DAYS = 14;
@Component({
  selector: "ws-app-course-content-card",
  templateUrl: "./course-content-card.component.html",
  styleUrls: ["./course-content-card.component.scss"]
})
export class CourseContentCardComponent implements OnInit, OnChanges {
  @Input() content: any;
  @Input() enrollment: any[] = [];
  @Input() cbpPlans: any[] = [];
  @Input() applicationName = '';
  @Output() telemetry = new EventEmitter<any>();
  contentBookmarked = false;
  defaultThumbnail = "/assets/instances/eagle/app_logos/default.png";
  defaultSLogo = "/assets/instances/eagle/app_logos/igot-katmayogi-logo.svg";
  compentencyKey!: ICompentencyKeys;

  courseEnrollment: any;
  downloadCertificateLoading = false;
  isIgot = false;
  environment!: any;
  contentStatus = ''
  mentList: {
    displayName: string,
    action: string,
  }[] = []
  currentUserRoles: string[] = [];
  constructor(
    @Inject("environment") environment: any,
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private events: EventService,
    private router: Router,
    private contSvc: WidgetContentLibService,
    private searchListingService: SearchListingService,
    private matSnackbarNew: MatSnackbarNew
  ) {
    this.environment = environment;
  }

  ngOnInit(): void {
    this.compentencyKey = this.configSvc.compentency ?this.configSvc.compentency[this.environment.compentencyVersionKey] : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["enrollment"] && changes["enrollment"].currentValue) {
      if (this.enrollment?.length && this.content) {
        this.courseEnrollment = this.enrollment.find((ele: any) => ele.courseId === this.content.identifier) || null;
      }
    }
    if (changes["cbpPlans"] && changes["cbpPlans"].currentValue) {
      if (this.cbpPlans?.length && this.content) {
        this.isIgot = this.cbpPlans.some((ele: any) => ele.identifier === this.content.identifier);
      } else {
        this.isIgot = false;
      }
    }
    if (this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal && changes['content'] && changes['content'].currentValue) {
      this.contentStatus = this.content.status || ''
      const userRoles = (this.configSvc as any)?.userRoles as Set<string> | string[] | undefined;
      this.currentUserRoles = userRoles instanceof Set ? Array.from(userRoles).map(role => role.toLowerCase()) : Array.isArray(userRoles) ? (userRoles as string[]).map(role => role.toLowerCase()) : [];
      if(this.content.status) {
        switch (this.content.status.toLowerCase()) {
          case 'draft':
            this.contentStatus = 'Draft'
            this.mentList = [
              
            ]
            break;
          case 'live':
            this.contentStatus = 'Live'
            this.mentList = [
              {
                displayName: 'Edit',
                action: 'edit'
              }
            ]
            break;
          case 'review':
            this.contentStatus = 'For Publish'
            this.mentList = [
              {
                displayName: 'Submit for Review',
                action: 'publish'
              }
            ]
            break;
          case 'Reviewed':
            this.contentStatus = 'For Publish'
            this.mentList = [
              {
                displayName: 'Publish',
                action: 'publish'
              }
            ]
            break;
        }
      }
    }
  }

  checkForCiosDuration(item: any) {
    if (item && item.contentId && item.contentId.includes("ext_")) {
      return item.duration * 60;
    }
    return item.duration;
  }

  downloadCertificate(certificateData: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: "view-certificate",
        subType: WsEvents.EnumInteractSubTypes.CERTIFICATE
      },
      {
        id: certificateData.issuedCertificates && certificateData.issuedCertificates.length && certificateData.issuedCertificates[0].identifier, // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE
      }
    );
    if (certificateData.issuedCertificates.length > 0) {
      this.downloadCertificateLoading = true;
      const certificate: any = certificateData.issuedCertificates.sort(
        (a: any, b: any) => new Date(a.lastIssuedOn).getTime() - new Date(b.lastIssuedOn).getTime()
      );
      let certData: any = certificate && certificate.length && certificate[0];
      this.searchListingService.downloadCertificate_v2(certData.identifier).subscribe((res: any) => {
        this.downloadCertificateLoading = false;
        const cet = res.result.printUri;
        this.dialog.open(CertificateDialogComponent, {
          width: "1300px",
          data: { cet, certId: certData.identifier }
        });
      });
    } else {
      this.downloadCertificateLoading = false;
    }
  }

  checkIfContentIsNew(createdOn: string): boolean {
    if (!createdOn) return false;
    const createdDate = new Date(createdOn);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / MILLISECONDS_IN_A_DAY;

    return diffInDays <= NEW_CONTENT_THRESHOLD_DAYS;
  }

  async getRedirectUrlData(content: any) {
    if(this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
      const loggedInUserId = _.get(this.configSvc, 'userProfile.userId', '')
      this.telemetry.emit(content);
      // delegate to a dedicated handler that implements CBPPortal rules
      this.handleContentClick(content, loggedInUserId);
    } else if (content && content?.contentType === "Resource" && content?.identifier) {
      let resourceType;
      if (!content?.resourceType) {
        resourceType = "youtube";
      } else {
        resourceType = content?.resourceType === "MP4" ? "video" : content?.resourceType.toLowerCase();
      }
      this.telemetry.emit(content);
      this.router.navigate([`app/amrit-gyaan-kosh/player/${resourceType.toLowerCase()}/${content?.identifier}`], {
        queryParams: { primaryCategory: content?.primaryCategory }
      });
    } else {
      this.telemetry.emit(content);
      const urlData = await this.contSvc.getResourseLink(content);
      this.router.navigate([urlData.url], {
        queryParams: urlData.queryParams
      });
    }
  }

  generateCompetencySubThemeString(): string {
    if (this.content && this.content[this.compentencyKey?.vKey]) {
      return this.content[this.compentencyKey?.vKey].map((keyword: any) => keyword[this.compentencyKey?.vCompetencySubTheme]).join(" · ");
    }
    return "";
  }

  // onContentAction(action: string, content: any) {
  //   switch (action) {
  //     case 'edit':
  //       this.router.navigateByUrl(`/author/editor/${content.identifier}`);
  //       break;
  //     case 'publish':
  //       this.router.navigate(['/author/editor/multilingual', 'edit', this.getBaseLanguageId(content)], {
  //           queryParams: {
  //             langEditId: content.identifier
  //           }
  //         })
  //       break;
  //   }
  // }

  getBaseLanguageId(content: any) {
    if (content && content.languageMapV1) {
      const baseLanguage: any = Object.values(content.languageMapV1).find((lang: any) => lang.isBaseLang)
      return baseLanguage ? baseLanguage.id : null
    }
    return null
  }

  /**
   * Handle content click for CBPPortal application according to role and content status rules.
   * Contract:
   * - Inputs: userRolesArray (normalized), content object, loggedInUserId string
   * - Side effects: show snack messages or navigate using router
   */
  handleContentClick(content: any, loggedInUserId: string): void {
    // Helpers
    const hasRole = (r: string) => this.currentUserRoles && this.currentUserRoles.includes(r.toLowerCase());
    const isCreator = !!(content && (content.creator || content.createdBy) && (content.creator === loggedInUserId || content.createdBy === loggedInUserId));
    const isReviewer = hasRole("reviewer");
    const isPublisher = hasRole("publisher");
    const isSpvPublisher = hasRole("spv_publisher");
    const isCbpAdmin = hasRole("cbp_admin");

    const status = (content && content.status) ? String(content.status) : "";

    const showMessage = (msg: string) => {
      try {
        this.matSnackbarNew.open(msg, "X", { duration: 3000 });
      } catch (e) {
        // fallback
        console.warn(msg);
      }
    };

    const goToEditor = () => {
      this.router.navigateByUrl(`/author/editor/${content.identifier}`);
    };

    const goToReview = () => {
      this.router.navigate(['/author/editor/multilingual', 'edit', this.getBaseLanguageId(content)], {
            queryParams: {
              langEditId: content.identifier
            }
          });
    };

    const goToOverviewV2 = () => {
      if (content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE &&
          content.resourceCategory !== 'Learning Resource') {
          localStorage.setItem('isStandaloneResource', 'true')
        } else {
          localStorage.setItem('isStandaloneResource', 'false')
        }
        {
          let url: any = `author/content-detail/${content.identifier}/overview-v2`
          this.router.navigateByUrl(url)
        }
    };

    // 1. Creator logic
    if (isCreator) {
      // Creator: always allowed to edit unless explicitly Live/Rejected and not in review flow
      if (status.toLocaleLowerCase() === "live") {
        goToEditor();
        return;
      }
      goToOverviewV2();
      return;
    }

    // 2. Reviewer logic
    if (isReviewer) {
      // If reviewer and content.status is 'review' or 'accept' allow editor
      if (status.toLocaleLowerCase() === "review" || status.toLocaleLowerCase() === "reviewed") {
        goToReview()
        return;
      }
      showMessage("Only creators or reviewers can edit this content.");
      return;
    }

    // 3. Publisher logic
    if (isPublisher) {
      // If publisher but content.status is 'reject' or 'rejected' and content.status not Live, show message
      if (status.toLocaleLowerCase() === "reject" || status.toLocaleLowerCase() === "rejected") {
        showMessage("Only creators can edit rejected content.");
        return;
      }
      // Publisher allowed to edit
      goToEditor();
      return;
    }

    // 4. SPV_PUBLISHER logic
    if (isSpvPublisher) {
      // Only allowed for status 'accept' or 'review'
      if (status.toLocaleLowerCase() === "accept" || status.toLocaleLowerCase() === "review") {
        goToEditor();
        return;
      }
      // If content.status is Live and metadata.editableBySpv is truthy allow editor
      if (status.toLocaleLowerCase() === "live") {
        goToEditor();
        return;
      }
      showMessage("You don't have permission to edit this content.");
      return;
    }

    // 5. CBP_ADMIN logic
    if (isCbpAdmin) {
      // Admin can edit unless status is 'reject'/'rejected' and creator-only flag set
      if ((status.toLocaleLowerCase() === "reject" || status.toLocaleLowerCase() === "rejected")) {
        showMessage("Only creators can edit rejected content.");
        return;
      }
      goToEditor();
      return;
    }

    // Default: no special roles -> navigate to overview
    goToOverviewV2();
  }
}
