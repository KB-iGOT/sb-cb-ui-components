import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ConfigurationsService, EventService, NsContent, WsEvents } from "@sunbird-cb/utils-v2";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatSnackBar as MatSnackbarNew } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { WidgetContentLibService } from "@sunbird-cb/consumption";
import { CertificateDialogComponent } from "@sunbird-cb/consumption";
import { ICompentencyKeys, SearchListingConfig } from "../../_models/search-listing.model";
import { SearchListingService } from "../../_services/search-listing.service";

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
  constructor(
    @Inject("environment") environment: any,
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private events: EventService,
    private router: Router,
    private contSvc: WidgetContentLibService,
    private searchListingService: SearchListingService
    ,
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
    if (content && content?.contentType === "Resource" && content?.identifier) {
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
      if(this.applicationName === SearchListingConfig.ApplicationNames.CBPPortal) {
        const userRoles = (this.configSvc as any)?.userRoles as Set<string> | string[] | undefined;
        const userRolesArray: string[] = userRoles instanceof Set ? Array.from(userRoles) : Array.isArray(userRoles) ? (userRoles as string[]) : [];
        const loggedInUserId = this.configSvc.userProfile?.userId || "";
        // delegate to a dedicated handler that implements CBPPortal rules
        this.handleContentClick(userRolesArray, content, loggedInUserId);
      } else {
        const urlData = await this.contSvc.getResourseLink(content);
        this.router.navigate([urlData.url], {
          queryParams: urlData.queryParams
        });
      }
    }
  }

  generateCompetencySubThemeString(): string {
    if (this.content && this.content[this.compentencyKey?.vKey]) {
      return this.content[this.compentencyKey?.vKey].map((keyword: any) => keyword[this.compentencyKey?.vCompetencySubTheme]).join(" · ");
    }
    return "";
  }

  /**
   * Handle content click for CBPPortal application according to role and content status rules.
   * Contract:
   * - Inputs: userRolesArray (normalized), content object, loggedInUserId string
   * - Side effects: show snack messages or navigate using router
   */
  handleContentClick(userRolesArray: string[], content: any, loggedInUserId: string): void {
    // Helpers
    const hasRole = (r: string) => userRolesArray && userRolesArray.includes(r);
    const isCreator = !!(content && (content.creator || content.createdBy) && (content.creator === loggedInUserId || content.createdBy === loggedInUserId));
    const isReviewer = hasRole("REVIEWER");
    const isPublisher = hasRole("PUBLISHER");
    const isSpvPublisher = hasRole("SPV_PUBLISHER");
    const isCbpAdmin = hasRole("CBP_ADMIN");

    const status = (content && content.status) ? String(content.status) : "";
    const reviewStatus = (content && content.reviewStatus) ? String(content.reviewStatus).toLowerCase() : "";
    const metadata = (content && content.metadata) ? content.metadata : {};

    const showMessage = (msg: string) => {
      try {
        this.matSnackbarNew.open(msg, "X", { duration: 3000 });
      } catch (e) {
        // fallback
        console.warn(msg);
      }
    };

    const goToEditor = () => {
      // TODO: Replace with actual editor route if available in the app routing constants
      this.router.navigate([`/app/editor/${content.identifier}`]);
    };

    const goToOverviewV2 = () => {
      // TODO: Replace with actual overviewV2 route if available
      this.router.navigate([`/app/content/overviewV2/${content.identifier}`]);
    };

    // 1. Creator logic
    if (isCreator) {
      // Creator: always allowed to edit unless explicitly Live/Rejected and not in review flow
      if (status === "Live") {
        // If content is Live and creator should not edit, navigate to overview
        goToOverviewV2();
        return;
      }
      // Editor for creator
      goToEditor();
      return;
    }

    // 2. Reviewer logic
    if (isReviewer) {
      // If reviewer and content.reviewStatus is 'review' or 'accept' allow editor
      if (reviewStatus === "review" || reviewStatus === "accept") {
        goToEditor();
        return;
      }
      // otherwise show message
      showMessage("Only creators or reviewers can edit this content.");
      return;
    }

    // 3. Publisher logic
    if (isPublisher) {
      // If publisher but content.reviewStatus is 'reject' or 'rejected' and content.status not Live, show message
      if (reviewStatus === "reject" || reviewStatus === "rejected") {
        showMessage("Only creators can edit rejected content.");
        return;
      }
      // Publisher allowed to edit
      goToEditor();
      return;
    }

    // 4. SPV_PUBLISHER logic
    if (isSpvPublisher) {
      // Only allowed for reviewStatus 'accept' or 'review'
      if (reviewStatus === "accept" || reviewStatus === "review") {
        goToEditor();
        return;
      }
      // If content.status is Live and metadata.editableBySpv is truthy allow editor
      if (status === "Live" && metadata && metadata.editableBySpv) {
        goToEditor();
        return;
      }
      showMessage("You don't have permission to edit this content.");
      return;
    }

    // 5. CBP_ADMIN logic
    if (isCbpAdmin) {
      // Admin can edit unless reviewStatus is 'reject'/'rejected' and creator-only flag set
      if ((reviewStatus === "reject" || reviewStatus === "rejected") && metadata && metadata.creatorOnlyEdit) {
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
