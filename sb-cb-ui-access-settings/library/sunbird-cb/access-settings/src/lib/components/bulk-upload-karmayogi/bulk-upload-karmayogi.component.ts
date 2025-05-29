import { Component } from "@angular/core";
import { AccessControlService } from "../../_services/access-control.service";
import { NsAccessControlConfig } from "../../_models/access-control.model";
import { SnackbarComponent } from "../snackbar/snackbar.component";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";

@Component({
  selector: "sb-uic-bulk-upload-karmayogi",
  templateUrl: "./bulk-upload-karmayogi.component.html",
  styleUrls: ["./bulk-upload-karmayogi.component.scss"],
})
export class BulkUploadKarmayogiComponent {
  bulkUploadConfig: NsAccessControlConfig.IBulkUploadKarmayogi;
  file!: File | null;
  uploadedData = [
    {
      webPages: null,
      maskedPhone: "******0092",
      tcStatus: null,
      loginId: null,
      rootOrgName: "UI Development Ministry",
      subject: null,
      channel: "UI Development Ministry",
      profileUserTypes: [],
      language: null,
      updatedDate: "2023-12-24 10:26:53:771+0000",
      password: null,
      managedBy: null,
      flagsValue: 4,
      report_access_expiry: null,
      id: "c3598b84-94ab-4f59-ac38-82f267007191",
      recoveryEmail: "",
      identifier: "c3598b84-94ab-4f59-ac38-82f267007191",
      thumbnail: null,
      profileVisibility: null,
      updatedBy: null,
      accesscode: null,
      last_login: "2024-01-03T08:46:04.000Z",
      locationIds: null,
      registryId: null,
      nodebbid: 5362598,
      rootOrgId: "0139543696241049600",
      prevUsedEmail: "",
      firstName: "Abhishek KP",
      profileLocation: [],
      tncAcceptedOn: null,
      allTncAccepted: {},
      profileDetails: {
        profileGroupStatus: "NOT-VERIFIED",
        verifiedKarmayogi: false,
        profileDesignationStatus: "NOT-VERIFIED",
        employmentDetails: {
          departmentName: "UI Development Ministry",
        },
        profileStatusUpdatedOn: "26-06-2024 17.17.48",
        profileStatus: "NOT-VERIFIED",
        personalDetails: {
          firstname: "Abhishek KP",
          phoneVerified: false,
          mobile: 9742090092,
          primaryEmail: "mdo_admin_kp@yopmail.com",
        },
        mandatoryFieldsExists: false,
        additionalProperties: {
          isProfileUpdatedMsgViewed: false,
        },
      },
      phone: "******0092",
      dob: null,
      grade: null,
      currentLoginTime: null,
      userType: null,
      status: 1,
      lastName: null,
      gender: null,
      roles: [],
      prevUsedPhone: "",
      stateValidated: true,
      isDeleted: false,
      organisations: [
        {
          organisationId: "0139543696241049600",
          updatedBy: null,
          orgName: "UI Development Ministry",
          addedByName: null,
          addedBy: null,
          associationType: 1,
          roles: ["CBP_ADMIN", "MDO_ADMIN", "MDO_REPORT_ACCESSOR"],
          approvedBy: null,
          updatedDate: null,
          userId: "c3598b84-94ab-4f59-ac38-82f267007191",
          approvaldate: null,
          isDeleted: false,
          hashTagId: "0139543696241049600",
          isRejected: null,
          id: "0139543708634234882",
          position: null,
          isApproved: null,
          orgjoindate: "2023-12-24 10:26:53:583+0000",
          orgLeftDate: null,
        },
      ],
      provider: null,
      countryCode: null,
      maskedEmail: "md**********@yopmail.com",
      tempPassword: null,
      email: "md**********@yopmail.com",
      phoneVerified: true,
      profileSummary: null,
      tcUpdatedDate: null,
      recoveryPhone: "",
      avatar: null,
      userName: "abhishekkp_8ayd",
      userId: "c3598b84-94ab-4f59-ac38-82f267007191",
      userSubType: null,
      first_login: "2024-01-03T08:46:04.000Z",
      emailVerified: true,
      lastLoginTime: null,
      createdDate: "2023-12-24 10:26:39:937+0000",
      framework: {},
      createdBy: "b3d4fe5d-8704-4239-8c39-05264fca46d5",
      profileUserType: {},
      location: null,
      tncAcceptedVersion: null,
    },
  ];
  currrentFilterType = "success";
  csvContent: any;
  contacts: any = [];
  properties: any = "";
  flag = false;
  fileUploading = false;
  isSuccessUserlist: any = [];
  isErrorUserlist: any = [];
  fileName: string = "";
  currentDate = new Date();
  constructor(
    private accessControlService: AccessControlService,
    private snackBar: MatSnackBar
  ) {
    this.bulkUploadConfig =
      this.accessControlService.accessControlConfig().bulkUploadKarmayogi;
  }

  downloadSample() {
    const sampleFilePath = this.bulkUploadConfig.downloadSampleFile;
    if (sampleFilePath) {
      const link = document.createElement("a");
      link.href = sampleFilePath.path;
      link.download = sampleFilePath.fileName || "sample.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onDrop(input: HTMLInputElement) {
    this.fileUploading = true;
    const files: any = [input];
    const fileTypes = ["csv"]; // acceptable file types
    if (files && files.length) {
      const extension = files[0].name.split(".").pop().toLowerCase(); // file extension from input file
      const isSuccess = fileTypes.indexOf(extension) > -1; // is extension in acceptable types
      // console.log(isSuccess)
      console.log("Filename: " + files[0].name);
      this.fileName = files[0].name;
      // console.log('Type: ' + files[0].type)
      // console.log('Size: ' + files[0].size + ' bytes')
      if (isSuccess) {
        const fileToRead = files[0];
        const fileReader = new FileReader();
        fileReader.onload = (event: any) => {
          this.onFileLoad(event);
        };
        fileReader.readAsText(fileToRead, "UTF-8");
      } else {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Unsupported File Format. Please upload a CSV file.",
            type: "error",
          },
          duration: 3000,
          panelClass: "course-error-snackbar",
        });
      }
    } else {
      this.fileUploading = false;
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          message: "Unsupported File Format. Please upload a CSV file.",
          type: "error",
        },
        duration: 3000,
        panelClass: "course-error-snackbar",
      });
    }
  }

  async onFileLoad(fileLoadedEvent: any) {
    this.isSuccessUserlist = [];
    this.isErrorUserlist = [];
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;

    // Flag is for extracting first line
    let flag = false;
    // Main Data
    const objarray: any = [];
    // Properties
    const prop: any = [];
    // Total Length
    let size: any = 0;

    for (const line of this.csvContent.split(/[\r\n]+/)) {
      if (flag) {
        const obj: any = {};
        for (let k = 0; k < size; k += 1) {
          // Dynamic Object Properties
          obj[prop[k]] = line.split(",")[k];
        }
        objarray.push(obj);
      } else {
        // First Line of CSV will be having Properties
        for (let k = 0; k < line.split(",").length; k += 1) {
          size = line.split(",").length;
          // Removing all the spaces to make them usefull, also removing any " characters
          prop.push(line.split(",")[k].replace(/ /g, "").replace(/"/g, ""));
        }
        flag = true;
      }
    }
    this.contacts = objarray;
    if (this.contacts && this.contacts.length > 0) {
      const headerValues = Object.keys(this.contacts[0]);
      if (headerValues.length < 0 || headerValues.length > 2) {
        // NOSONAR
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message:
              "Field Mismatch. Please ensure your uploaded file matches the sample template provided.",
            type: "error",
          },
          duration: 3000,
          panelClass: "course-error-snackbar",
        });
        return;
      }
      if (
        !headerValues.includes("Emailid") ||
        !headerValues.includes("Mobilenumber")
      ) {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message:
              "Field Mismatch. Please ensure your uploaded file matches the sample template provided.",
            type: "error",
          },
          duration: 3000,
          panelClass: "course-error-snackbar",
        });
        return;
      }
    }
    this.properties = [];

    this.properties = prop;
    // console.log(this.properties)
    const emailIds: any = [];
    const mobileNumbers: any = [];
    const bothEmailAndMobile: any = {};
    this.contacts = this.contacts.filter(
      (ele: any) => ele.Emailid || ele.Mobilenumber
    );
    if (this.contacts.length > 30) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: { message: "More than 30 users are not allowed", type: "error" },
        duration: 3000,
        panelClass: "course-error-snackbar",
      });
      this.fileUploading = false;
    } else {
      await this.contacts.forEach((element: any) => {
        const emailPattern = new RegExp(
          `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
        );
        const mobilePattern = new RegExp(/^(6|7|8|9)\d{9}$/);
        const emailTest = element.Emailid
          ? emailPattern.test(element.Emailid)
          : true;
        const mobileTest = element.Mobilenumber
          ? mobilePattern.test(element.Mobilenumber)
          : true;
        element["email"] = element.Emailid;
        element["mobile"] = element.Mobilenumber;
        if (mobileTest && element.Mobilenumber) {
          mobileNumbers.push(element.Mobilenumber);
        }
        if (emailTest && element.Emailid) {
          emailIds.push(element.Emailid.toLowerCase());
        }
        if (emailTest && mobileTest) {
          element["status"] = "Success";
          element["userStatus"] = true;
          bothEmailAndMobile[element.Emailid.toLowerCase()] = element;
        } else {
          if (emailTest || mobileTest) {
            element["status"] = "Success";
            element["userStatus"] = true;
            if (
              (!emailTest && element.Mobilenumber !== "") ||
              (!emailTest && element.Mobilenumber === "")
            ) {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = emailPattern.test(element.Emailid)
                ? ""
                : "Invalid Email id";
            }
            if (
              (!mobileTest && element.Emailid !== "") ||
              (!mobileTest && element.Emailid === "")
            ) {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = mobilePattern.test(element.Mobilenumber)
                ? ""
                : "Invalid Mobile number";
            }
          } else {
            if (!emailTest && !mobileTest) {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = "Invalid Email id and Mobile number";
            } else {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = emailPattern.test(element.Emailid)
                ? ""
                : "Invalid Email id";
              element["message"] = mobilePattern.test(element.Mobilenumber)
                ? ""
                : "Invalid Mobile number";
            }
          }
        }
      });
      this.flag = true;
      const emailResponseData = await this.callUserCheckApi(
        emailIds,
        "primaryEmail"
      );
      const mobileResponseData = await this.callUserCheckApi(
        mobileNumbers,
        "mobile"
      );
      if (emailResponseData && mobileResponseData) {
        this.manageData(emailResponseData, mobileResponseData);
      } else {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Something went wrong! Please try again",
            type: "error",
          },
          duration: 3000,
          panelClass: "course-error-snackbar",
        });
      }
    }
  }
  async callUserCheckApi(userData: any, key: any) {
    const request: any = {
      request: {
        filters: {},
        fields: [
          "userId",
          "email",
          "firstName",
          "lastName",
          "phone",
          "rootOrgId",
          "channel",
          "roles",
          "profileDetails",
          "createdDate",
          "rootOrgName",
          "organisations",
          "username",
        ],
      },
    };
    if (key === "primaryEmail") {
      request.request.filters = {
        ...request.request.filters,
        email: userData,
      };
    } else {
      request.request.filters = {
        ...request.request.filters,
        phone: userData,
      };
    }
    return this.accessControlService
      .validateUser(request)
      .toPromise()
      .then(async (res: any) => {
        if (res.result.response) {
          return await res.result.response;
        }
      })
      .catch((_err: any) => {})
      .finally(() => Promise.resolve());
  }

  manageData(userEmailData: any, userMobileData: any) {
    this.isSuccessUserlist = [];
    this.isErrorUserlist = [];
    const userEmailMap: any = {};
    const userEmailMapUserId: any = {};
    const userMobileMap: any = {};
    if (userEmailData.count) {
      userEmailData.content.forEach(async (e: any) => {
        if (e.profileDetails) {
          userEmailMap[
            e.profileDetails.personalDetails.primaryEmail.toLowerCase()
          ] = e;
          userEmailMapUserId[e.userId] = e;
        }
      });
    }
    if (userMobileData.count) {
      userMobileData.content.forEach(async (e: any) => {
        if (e.profileDetails) {
          userMobileMap[e.profileDetails.personalDetails.mobile] = e;
        }
      });
    }
    this.contacts.forEach(async (e: any) => {
      if (e.userStatus) {
        if (e.email && e.mobile) {
          const userData = userEmailMap[e.email.toLowerCase()];
          if (
            userData &&
            userData.profileDetails.personalDetails &&
            userData.profileDetails.personalDetails.mobile
          ) {
            if (
              String(userData.profileDetails.personalDetails.mobile) ===
              String(e.mobile)
            ) {
              e["userId"] = userData.userId;
              e["ministry"] = userData.rootOrgName;
              e["fullName"] = userData.firstName || userData.firstname;
            } else {
              e["status"] = "Error";
              e["userStatus"] = false;
              e["message"] = "Given credentials are not matching";
            }
          } else {
            e["status"] = "Error";
            e["userStatus"] = false;
            e["message"] = "Given credentials are not matching";
          }
        } else if (e.email && userEmailMap[e.email.toLowerCase()]) {
          const userData = userEmailMap[e.email.toLowerCase()];
          e["mobile"] = userData.profileDetails.personalDetails.mobile;

          e["userId"] = userData.userId;
          e["ministry"] = userData.rootOrgName;
          e["fullName"] = userData.firstName || userData.firstname;
        } else if (e.mobile && userMobileMap[e.mobile]) {
          const userData = userMobileMap[e.mobile];
          e["email"] = userData.profileDetails.personalDetails.primaryEmail;
          e["userId"] = userData.userId;
          e["ministry"] = userData.rootOrgName;
          e["fullName"] = userData.firstName || userData.firstname;
        } else {
          e["status"] = "Error";
          e["userStatus"] = false;
          e["message"] = "Given credentials are not matching";
        }
      }
    });
    this.fileUploading = false;
    this.isSuccessUserlist = this.contacts.filter((ele: any) => ele.userStatus);
    this.isErrorUserlist = this.contacts.filter((ele: any) => !ele.userStatus);

    debugger;
    // this.successUserData.emit(this.isSuccessUserlist);
    this.currrentFilterType = this.isSuccessUserlist.length
      ? "success"
      : "error";
    if (this.currrentFilterType === "success") {
      // this.displayedColumns = [
      //   "fullName",
      //   "email",
      //   "ministry",
      //   "status",
      //   "mobile",
      // ];
      // this.dataSource = new MatTableDataSource<IUserElement>(
      //   this.isSuccessUserlist
      // );
    } else if (this.currrentFilterType === "error") {
      // this.displayedColumns = ["email", "status", "mobile", "message"];
      // this.dataSource = new MatTableDataSource<IUserElement>(
      //   this.isErrorUserlist
      // );
    }
  }

  onFilterChange(type: string) {
    this.currrentFilterType = type;
  }

  downloadErrorFile() {
    this.accessControlService.downloadFile(
      this.isErrorUserlist,
      "userErrordata"
    );
  }
}
