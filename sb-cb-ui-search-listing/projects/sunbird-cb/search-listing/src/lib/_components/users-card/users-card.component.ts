import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationsService, NsUser } from "@sunbird-cb/utils-v2";

@Component({
  selector: "sb-cb-search-users-card",
  templateUrl: "./users-card.component.html",
  styleUrls: ["./users-card.component.scss"]
})
export class UsersCardComponent {
  @Input() user!: any;
  @Input() category!: any;
  @Output() telemetry = new EventEmitter<any>();
  @Output() updateUser = new EventEmitter<string>();

  currentUser!: NsUser.IUserProfile;
  howerUser!: any;
  unmappedUser!: any;

  constructor(private configSvc: ConfigurationsService, private router: Router, private translate: TranslateService) {
    if (localStorage.getItem("websiteLanguage")) {
      this.translate.setDefaultLang("en");
      const lang = localStorage.getItem("websiteLanguage")!;
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.currentUser = this.configSvc.userProfile;
    }

    this.howerUser = this.user;
    this.unmappedUser = this.user;
  }

  getUseravatarName() {
    let name = "";
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        if (this.user.lastName && this.user.lastName !== null && this.user.lastName !== undefined) {
          name = `${this.user.firstName} ${this.user.lastName}`;
        } else {
          name = `${this.user.firstName}`;
        }
      } else if (this.user.fullName) {
        name = `${this.user.fullName}`;
      } else {
        name = `${this.user.name}`;
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename}`;
        }
      } else if (this.user.personalDetails.firstname) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstname}`;
        }
      } else if (this.user.personalDetails.firstName) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstName} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstName}`;
        }
      }
    }
    return name;
  }

  goToUserProfile(user: any) {
    user.contentType = "People";
    user.identifier = user.userId;
    this.telemetry.emit(user);
    this.updateUser.emit(user.userId || user.id || user.wid);
  }

  get usr() {
    return this.howerUser;
  }

  get userDesignation(): string {
    const professionalDetails = this.user?.profileDetails?.professionalDetails;

    if (professionalDetails?.length) {
      const designationItem = professionalDetails.find((item: any) => "designation" in item);
      const designation = designationItem?.designation ?? "";
      // const rootOrgName = this.user?.rootOrgName ?? "";
      return designation ? `${designation}` : '';
    }

    return "";
  }

  get userEmail(): string {
    return this.user?.email || "";
  }

  get userPhone(): string {
    return this.user?.maskedPhone || "";
  }

  get isUserVerified(): boolean {
    return this.user?.profileDetails?.profileStatus === "VERIFIED";
  }

  get onboardingDate(): string {
    return this.user.createdDate || ''
  }
}
