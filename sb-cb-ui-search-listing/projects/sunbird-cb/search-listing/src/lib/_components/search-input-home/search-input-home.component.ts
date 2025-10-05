import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ConfigurationsService } from "@sunbird-cb/utils-v2";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  FacetType,
  ICompentencyKeys,
  SearchCategory,
  SearchCommunitiesRequest,
  SearchDesignationRequest,
  SearchEventfacet,
  SearchEventFields,
  SearchExternalRequest,
  SearchListingConfig,
  SearchNLP,
  SearchPeoplesRequest,
  SearchResourceFacets,
  SearchResourceMimeType,
  SearchTrainingPlansRequest,
  SearchUsersRequest,
  SearchV4Request
} from "../../_models/search-listing.model";
import { WidgetContentLibService } from "@sunbird-cb/consumption";
// import { MobileAppsService } from "../../../../../../../../../src/app/services/mobile-apps.service";
import { SearchListingService } from "../../_services/search-listing.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ws-app-search-input-lib-home",
  templateUrl: "./search-input-home.component.html",
  styleUrls: ["./search-input-home.component.scss"],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None
})
export class SearchInputHomeComponent implements OnInit, OnChanges {
  @Input() placeHolder = "";
  @Input() ref = "";
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  queryControl: UntypedFormControl;
  languageSearch: string[] = [];
  SAKSHAMAI_ICON_LOADER = "/assets/images/sakshamAI/saksham_ai_loader.gif";

  disableMenu = false;
  recentSearches: any = [];
  searchQuery = "";
  allSearchResults: any[] = [];
  nlpSearchValue: any;
  private hasReadRecentBeenCalled = false;
  searchCat: any;
  categories: any[] = [];

  selectedSearchCategory: string = "";
  openSearchTemplate = false;
  loaderSearching = false;
  responseNlpQuery = "";
  searchSubscription: Subscription = new Subscription();
  searchConfig: SearchListingConfig.Config | null = null;

  environment!: any;
  competencyAreaNameKey!: string;
  competencyThemeKey!: string;
  competencySubThemeKey!: string;
  compentencyKey!: ICompentencyKeys;

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;
  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.openSearchTemplate = false;
      this.hasReadRecentBeenCalled = false;
    }
  }
  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private configSvc: ConfigurationsService,
    private eRef: ElementRef,
    private searchListingService: SearchListingService,
    private contSvc: WidgetContentLibService, // private mobileAppsService: MobileAppsService
    @Inject("environment") environment: any
  ) {
    this.environment = environment;
    this.compentencyKey = this.configSvc.compentency[this.environment.compentencyVersionKey];
    this.competencyAreaNameKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyArea}`;
    this.competencyThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyTheme}`;
    this.competencySubThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencySubTheme}`;

    this.queryControl = new UntypedFormControl(this.activated.snapshot.queryParams["q"] || "");

    this.queryControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(async value => {
      if (value && value.length > 100) {
        await this.searchFromQuery(value);
        this.loaderSearching = false;
      } else {
        this.loaderSearching = false;
      }
    });
  }

  clearSearchTextElement() {
    this.queryControl.setValue("");
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
  }

  ngOnInit() {
    this.searchConfig = this.activated.snapshot.data["searchPageData"];
    if (this.searchConfig) {
      this.initialize();
    } else {
      this.searchListingService.getSearchConfig().then((data: any) => {
        this.searchConfig = data;
        this.initialize();
      });
    }
  }

  ngOnChanges() {
    for (const change in SimpleChange) {
      if (change === "placeHolder") {
        this.placeHolder = this.placeHolder;
      }
    }
  }

  initialize() {
    let isNotMyUser = false;
    let isIgotOrg = false;
    if (
      this.configSvc &&
      this.configSvc.unMappedUser &&
      this.configSvc.unMappedUser.profileDetails &&
      this.configSvc.unMappedUser.profileDetails.profileStatus
    ) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === "not-my-user" ? true : false;
    }
    if (
      this.configSvc &&
      this.configSvc.unMappedUser &&
      this.configSvc.unMappedUser.profileDetails &&
      this.configSvc.unMappedUser.profileDetails.employmentDetails &&
      this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName
    ) {
      isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === "igot" ? true : false;
    }
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.disableMenu = true;
    } else {
      this.disableMenu = false;
    }

    //Only allow communities for mdo_leader and mdo moderator in MDO
    if (this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal) {
      const userRoles = this.configSvc?.userRoles as Set<string>;
      if (!userRoles.has("mdo_leader") && !userRoles.has("mdo_moderator")) {
        if (this.searchConfig.searchCategories) {
          this.searchConfig.searchCategories = this.searchConfig?.searchCategories.filter(category => category?.value !== SearchCategory.Communities);
        }
      }
    }

    this.searchSubscription.add(
      this.activated.queryParamMap.subscribe(queryParam => {
        if (queryParam.has("q")) {
          this.queryControl.setValue(queryParam.get("q") || "");
        }
        if (queryParam.has("category")) {
          this.selectedSearchCategory = queryParam.get("category") || "";
        } else {
          this.selectedSearchCategory = this.searchConfig?.searchInputConfig?.defaultSearchCategory || "";
        }
      })
    );
    this.categories = this.searchConfig?.searchCategories || [];

    this.searchSubscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const path = event.url.split("?")[0];
          if (!path.split("/").includes("globalsearch")) {
            this.queryControl.reset();
          }
        }
      })
    );
  }

  async updateQuery(query: string) {
    if (query && query.length) {
      await this.searchInNLP(query)
        .then(() => {
          this.processSearchText(query);
        })
        .catch(() => {
          this.processSearchText(query);
        });
    } else {
      this.processSearchText(query);
    }
  }

  async updateRecentSearchQuery(query: any) {
    if (query) {
      const reqBody = {
        nlpSearchQuery: query.nlp_search_query,
        searchQuery: query.search_query,
        searchCategory: query.search_category[0]
      };
      await this.searchListingService
        .recentCreate(reqBody)
        .then(() => {
          this.processRecentSearchText(query);
        })
        .catch(() => {
          this.processRecentSearchText(query);
        });
    } else {
      this.processRecentSearchText(query);
    }
  }

  async createRecent(data: any) {
    const reqBody = {
      nlpSearchQuery: data,
      searchQuery: this.queryControl.value,
      searchCategory: this.selectedSearchCategory ? this.selectedSearchCategory : "all"
    };

    await this.searchListingService.recentCreate(reqBody).catch();
  }

  readRecent() {
    return this.searchListingService.recentRead().subscribe((res: any) => {
      if (res) {
        // this.recentSearches = res.result.searchQueries.nlp_search_query   this.nlpSearchValue = res
        if (res.result.searchQueries && res.result.searchQueries) {
          this.recentSearches = res?.result?.searchQueries;
        } else {
          this.recentSearches = "";
        }
      }
    });
  }

  goToSearchItem(query: any) {
    const category = this.selectedSearchCategory;
    const nlpSearchQuery = query?.nlp_search_query;
    if (category && category === SearchCategory.Courses && nlpSearchQuery) {
      const req = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
      req.request.query = nlpSearchQuery;
      req.request.filters.contentType = ["Course"];
      this.searchListingService.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.Events && nlpSearchQuery) {
      const req = new SearchV4Request([]);
      req.request.filters.contentType = "Event";
      req.request.filters.status = ["Live"];
      req.request.fields = SearchEventFields;
      req.request.facets = [...SearchEventfacet, this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey];
      req.request.query = nlpSearchQuery;

      delete req.request.filters?.courseCategory;
      delete req.request.sort_by?.createdOn;

      this.searchListingService.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.People && nlpSearchQuery) {
      const req = new SearchPeoplesRequest();
      req.query = nlpSearchQuery;

      this.searchListingService
        .searchConnections(req)
        .then(() => {
          this.updateRecentSearchQuery(query);
        })
        .catch(error => {
          // tslint:disable-next-line: align
          console.error("something went wrong", error);
        });
    } else if (category && category === SearchCategory.Resources && nlpSearchQuery) {
      const req = new SearchV4Request([]);
      req.request.filters.contentType = "Resource";
      req.request.facets = SearchResourceFacets;
      req.request.filters["mimeType"] = SearchResourceMimeType;
      req.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory];
      req.request.fields = [];
      req.request.query = nlpSearchQuery;

      this.searchListingService.fetchSearchDataByCategory(req).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.Communities && nlpSearchQuery) {
      const req = new SearchCommunitiesRequest([]);
      req.searchString = nlpSearchQuery;

      this.searchListingService
        .searchCommunity(req)
        .then((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })
        .catch();
    } else if (category && category === "all" && nlpSearchQuery) {
      const catReq = new SearchV4Request([this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey]);
      catReq.request.query = nlpSearchQuery;
      catReq.request.filters.contentType = ["Course"];
      this.searchListingService.fetchSearchDataByCategory(catReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });

      const eventReq = new SearchV4Request([]);
      eventReq.request.filters.contentType = "Event";
      eventReq.request.filters.status = ["Live"];
      eventReq.request.fields = SearchEventFields;
      eventReq.request.facets = [...SearchEventfacet, this.competencyAreaNameKey, this.competencyThemeKey, this.competencySubThemeKey];
      eventReq.request.query = nlpSearchQuery;

      delete eventReq.request.filters?.courseCategory;
      delete eventReq.request.sort_by?.createdOn;
      this.searchListingService.fetchSearchDataByCategory(eventReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });

      const peopleReq = new SearchPeoplesRequest();
      peopleReq.query = nlpSearchQuery;
      this.searchListingService.searchConnections(peopleReq).catch();

      const resourceReq = new SearchV4Request([]);
      resourceReq.request.filters.contentType = "Resource";
      resourceReq.request.facets = SearchResourceFacets;
      resourceReq.request.filters["mimeType"] = SearchResourceMimeType;
      resourceReq.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory];
      resourceReq.request.fields = [];
      resourceReq.request.query = nlpSearchQuery;
      this.searchListingService.fetchSearchDataByCategory(resourceReq).subscribe((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });

      const communitiesreq = new SearchCommunitiesRequest([]);
      communitiesreq.searchString = nlpSearchQuery;

      this.searchListingService
        .searchCommunity(communitiesreq)
        .then((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })
        .catch();
    } else if (category && category === SearchCategory.Users && nlpSearchQuery) {
      const req = new SearchUsersRequest();
      req.request.filters!.rootOrgId = this.configSvc.userProfile?.rootOrgId || "";
      req.request.query = nlpSearchQuery;
      this.searchListingService.searchUsersMDO(req).then((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.TrainingPlans && nlpSearchQuery) {
      const req = new SearchTrainingPlansRequest();
      req.pageSize = 3;
      req.searchString = nlpSearchQuery;

      this.searchListingService.searchTrainingPlans(req).then((res: any) => {
        if (res) {
          this.updateRecentSearchQuery(query);
        }
      });
    } else if (category && category === SearchCategory.Designation && nlpSearchQuery) {
      const req = new SearchDesignationRequest();
      req.request.query = nlpSearchQuery;
      req.request.filters["categories"] = [`${this.configSvc.userProfile?.rootOrgId}_odcs_designation`];

      this.searchListingService
        .searchDesignationV4(req)
        .then((res: any) => {
          if (res) {
            this.updateRecentSearchQuery(query);
          }
        })
        .catch(() => {});
    }
  }

  recentDeleteByUserId() {
    return this.searchListingService.recentDeleteByUser().subscribe((result: any) => {
      if (result && result.responseCode === "OK") {
        this.readRecent();
      }
    });
  }

  recentDeleteByTimeStamp(id: any) {
    return this.searchListingService.recentDeleteByTime(id).subscribe((result: any) => {
      if (result) {
        this.readRecent();
      }
    });
  }

  processRecentSearchText(query: any) {
    document.getElementById("global-search-input")?.blur();
    const queryParams = {
      q: query?.nlp_search_query ? query?.nlp_search_query?.trim() : "",
      // search: query && this.responseNlpQuery ? this.responseNlpQuery : null,
      category: query?.search_category[0] || null,
      p: null,
      f: null,
      tab: null,
      filtersPanel: "show"
    };
    const navigationExtras = {
      queryParams,
      queryParamsHandling: "merge" as "merge"
    };
    const mergeQueryParams = window.location.pathname === "/app/globalsearch";
    if (this.ref === "home") {
      this.closed.emit(false);
      this.router.navigate(["/app/globalsearch"], mergeQueryParams ? navigationExtras : { queryParams });
    } else {
      this.router.navigate([], { ...navigationExtras, relativeTo: this.activated.parent });
    }
    localStorage.removeItem("activeRoute");
    this.openSearchTemplate = false;
  }

  processSearchText(query: any) {
    document.getElementById("global-search-input")?.blur();
    const queryParams = {
      q: query ? query?.trim() : "",
      search: query && this.responseNlpQuery ? this.responseNlpQuery : null,
      category: this.selectedSearchCategory || null,
      p: null,
      f: null,
      tab: null,
      filtersPanel: "show"
    };
    const navigationExtras = {
      queryParams,
      queryParamsHandling: "merge" as "merge"
    };
    const mergeQueryParams = window.location.pathname === "/app/globalsearch";
    if (this.ref === "home") {
      this.closed.emit(false);
      this.router.navigate(["/app/globalsearch"], mergeQueryParams ? navigationExtras : { queryParams });
    } else {
      this.router.navigate([], { ...navigationExtras, relativeTo: this.activated.parent });
    }
    localStorage.removeItem("activeRoute");
    this.openSearchTemplate = false;
  }

  clearSearchText() {
    setTimeout(() => {
      this.openSearchTemplate = true;
    }, 0);
    this.queryControl.reset();

    const params = { ...this.activated.snapshot.queryParams };
    params["q"] = "";
    params["search"] = "";

    this.router.navigate([], {
      relativeTo: this.activated.parent,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  async selectSearchCategory(category: string) {
    if (this.queryControl.value) {
      this.selectedSearchCategory = category;
      // this.searchFromQuery(this.queryControl.value);
      this.updateQuery(this.queryControl.value);
    }
  }

  async searchFromQuery(query: string) {
    let courseSearchResult: any;
    const searchRequest = new SearchV4Request([]);
    searchRequest.request.query = query;
    switch (this.selectedSearchCategory) {
      case SearchCategory.Courses:
        searchRequest.request.filters.courseCategory = "course";
        break;
      case SearchCategory.All:
        searchRequest.request.filters.courseCategory = [];
        searchRequest.request.filters.contentType = ["Course", "Event"];
        break;

      case SearchCategory.Programs:
        searchRequest.request.filters.courseCategory = "blended program";
        break;

      case SearchCategory.Events:
        searchRequest.request.filters.contentType = "Event";
        searchRequest.request.fields = SearchEventFields;
        searchRequest.request.facets = SearchEventfacet;

        delete searchRequest.request.filters?.courseCategory;
        delete searchRequest.request.sort_by?.createdOn;
        break;

      case SearchCategory.CaseStudy:
        searchRequest.request.filters.courseCategory = "case study";
        break;

      case SearchCategory.Resources:
        searchRequest.request.filters.contentType = "Resource";
        searchRequest.request.facets = SearchResourceFacets;
        searchRequest.request.filters["mimeType"] = SearchResourceMimeType;
        (searchRequest.request.exists = [FacetType.sectorNames_v1, FacetType.resourceCategory]),
          (searchRequest.request.fields = []),
          delete searchRequest.request.filters?.courseCategory;
        delete searchRequest.request.sort_by?.createdOn;
        break;
    }

    courseSearchResult = await this.searchListingService.searchCoursesv4(searchRequest).catch();

    if (this.selectedSearchCategory === SearchCategory.People) {
      const searchRequest = new SearchPeoplesRequest();
      searchRequest.query = query;
      const result = await this.searchListingService.searchConnections(searchRequest).catch(() => (this.allSearchResults = []));

      if (result.result && result.result?.response?.content.length) {
        this.allSearchResults = result.result?.response?.content || [];
      } else {
        this.allSearchResults = [];
      }

      return;
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      const searchRequestCommunities = new SearchCommunitiesRequest([]);
      searchRequestCommunities.searchString = query;
      const result = await this.searchListingService.searchCommunity(searchRequestCommunities).catch(() => (this.allSearchResults = []));
      if (result.result && Object.keys(result.result).length > 0 && result.result?.search_results?.data && result.result?.search_results?.data.length) {
        this.allSearchResults = result.result?.search_results?.data;
      } else {
        this.allSearchResults = [];
      }

      return;
    } else if (this.selectedSearchCategory === SearchCategory.ExternalContents) {
      const searchRequestExternal = new SearchExternalRequest([]);
      searchRequestExternal.searchString = query || "";
      const result = await this.searchListingService.searchExternalContent(searchRequestExternal).catch(() => (this.allSearchResults = []));
      if (result?.data && result?.data.length) {
        this.allSearchResults = result?.data;
      } else {
        this.allSearchResults = [];
      }

      return;
    }

    const validKeys = Object.keys(courseSearchResult?.result || {}).filter(
      key => (key === "Event" || key === "content") && Array.isArray(courseSearchResult.result[key]) && courseSearchResult.result[key].length > 0
    );

    this.allSearchResults = validKeys.length ? courseSearchResult.result[validKeys[0]] : [];
  }

  getResultName(result: any): string {
    if (!result) {
      return "";
    }

    if (this.selectedSearchCategory === SearchCategory.People) {
      return result.personalDetails?.firstname ?? result.firstName ?? "";
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      return result.communityName ?? "";
    } else {
      return result.name ?? "";
    }
  }

  redirectToContent(result: any) {
    this.openSearchTemplate = false;
    if (this.selectedSearchCategory === SearchCategory.People) {
      this.goToUserProfile(result);
    } else if (this.selectedSearchCategory === SearchCategory.Communities) {
      // TODO: Route community
    } else {
      this.getRedirectUrlData(result);
    }
  }

  goToUserProfile(user: any) {
    this.router.navigate(["/app/person-profile", user.userId || user.id || user.wid], { fragment: "profileInfo" });
  }

  async getRedirectUrlData(content: any) {
    if (content && content.objectType === "Event" && content.identifier) {
      this.router.navigate([`app/event-hub/home/${content.identifier}`]);
    } else {
      const urlData = await this.contSvc.getResourseLink(content);
      this.router.navigate([urlData.url], {
        queryParams: urlData.queryParams
      });
    }
  }

  async searchInNLP(query: string) {
    const searchRequest = new SearchNLP();
    searchRequest.query = query;
    await this.searchListingService
      .nlpSearch(searchRequest)
      .then(async response => {
        if (response?.data && response?.data?.keywords) {
          if (response?.data?.keywords.length > 0) {
            this.responseNlpQuery = response?.data?.keywords[0]?.keyword;
            this.createRecent(this.responseNlpQuery);
          }
        } else {
          this.responseNlpQuery = "";
        }
      })
      .catch();
  }

  openSearchTemplateF(): void {
    this.openSearchTemplate = true;
    if (!this.hasReadRecentBeenCalled) {
      this.readRecent();
      this.hasReadRecentBeenCalled = true;
    }

    if (this.openSearchTemplate) {
      // this.readRecent();
    }
    if (!this.selectedSearchCategory) {
      // this.searchFromQuery(this.responseNlpQuery);
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
