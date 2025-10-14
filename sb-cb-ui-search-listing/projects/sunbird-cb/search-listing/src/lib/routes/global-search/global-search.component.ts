import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationsService } from "@sunbird-cb/utils-v2";

@Component({
  selector: "ws-app-global-search",
  templateUrl: "./global-search.component.html",
  styleUrls: ["./global-search.component.scss"]
})
export class GlobalSearchComponent implements OnInit {
  searchParam = { query: "", nlp: "", searchCategory: "" };
  userValue = "";
  searchparamFilters: any;
  filtersPanel!: string | null;
  selectedTab = 1;
  tabs = ["All", "Learn", "Network", "Discuss", "Careers"];
  compentencyKey!: any;
  searchCategory: string = "";
  environment!: any;
  userId!: string;
  constructor(
    @Inject("environment") environment: any,
    private activated: ActivatedRoute,
    private translate: TranslateService,
    private configService: ConfigurationsService,
    private router: Router
  ) {
    this.environment = environment;
    if (localStorage.getItem("websiteLanguage")) {
      this.translate.setDefaultLang("en");
      const lang = localStorage.getItem("websiteLanguage")!;
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    this.compentencyKey = this.configService.compentency ? this.configService.compentency[this.environment.compentencyVersionKey] : undefined;
    this.activated.queryParamMap.subscribe(queryParams => {
      this.userId = queryParams.get("user") || "";
      this.userValue = "";
      if (queryParams.has("tab")) {
        const tabn = queryParams.get("tab");
        this.tabs.forEach((t: any, index: number) => {
          if (t === tabn) {
            this.selectedTab = index;
          }
        });
      }
      if (queryParams.has("q")) {
        this.searchParam = {
          query: queryParams.get("q") || "",
          nlp: queryParams.get("search") || "",
          searchCategory: queryParams.get("category") || ""
        };
      }
      if (queryParams.has("t")) {
        this.searchParam = {
          query: "moderatedCourses",
          nlp: queryParams.get("search") || "",
          searchCategory: queryParams.get("category") || ""
        };
        this.userValue = "moderatedCourses";
      }
      if (queryParams.has("f")) {
        const sfilters = JSON.parse(queryParams.get("f") || "{}");
        const paramfilter = [
          {
            mainType: "course",
            subType: sfilters?.primaryCategory
          }
        ];
        this.searchparamFilters = paramfilter;
      }

      if (queryParams.has("filtersPanel")) {
        this.filtersPanel = queryParams.get("filtersPanel");
      }
    });
  }

  translateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = "globalsearch." + menuName.replace(/\s/g, "");
    return this.translate.instant(translationKey);
  }

  filterSelectcategory(queryParams: any) {
    this.userId = "";
    this.router.navigate([], {
      relativeTo: this.activated.parent,
      queryParams,
      queryParamsHandling: "merge"
    });
  }

  updateUserDetails(event: string) {
    this.userId = event;
    const queryParams = { ...this.activated.snapshot.queryParams, user: event };
    this.router.navigate([], {
      relativeTo: this.activated.parent,
      queryParams,
      queryParamsHandling: "merge"
    });
  }
  
  updateUserStatus(event: any) {
    if (event) {
      this.userId = "";
      const queryParams = { ...this.activated.snapshot.queryParams, user: null };
      this.router.navigate([], {
        relativeTo: this.activated.parent,
        queryParams,
        queryParamsHandling: "merge"
      });
    }
  }
}
